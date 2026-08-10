/**
 * wdi5 (WebdriverIO + the UI5 service) configuration for the UI tests.
 *
 * The tests run against the plain test page in test/, which shows every
 * control of the library and nothing else. Which UI5 release they run against
 * is decided by the UI5_VERSION environment variable, so the same suite can be
 * pointed at every supported release:
 *
 *     npm run test:ui                       # the version pinned in ui5-test.yaml
 *     UI5_VERSION=1.116.0 npm run test:ui   # the oldest supported release
 *
 * The dev server is started here rather than in the workflow, so a local run
 * and a CI run go through the same steps.
 */

const { spawn } = require("node:child_process");

const port = Number(process.env.UI5_PORT ?? 8080);
const version = process.env.UI5_VERSION ?? "";
const baseUrl = `http://localhost:${port}`;
const testPage = "test-resources/ui5/touch/controls/test.html";

/** the running dev server, so onComplete can stop the one onPrepare started */
let server;

/** Waits until the test page answers, or gives up after the timeout. */
async function waitForServer(url, timeoutMs) {
	const deadline = Date.now() + timeoutMs;

	for (;;) {
		try {
			const response = await fetch(url);
			if (response.ok) {
				return;
			}
		} catch {
			// not listening yet
		}

		if (Date.now() > deadline) {
			throw new Error(`the dev server did not come up at ${url}`);
		}

		await new Promise((resolve) => setTimeout(resolve, 1000));
	}
}

exports.config = {
	runner: "local",
	specs: ["./e2e/**/*.test.js"],
	maxInstances: 1,

	capabilities: [
		{
			browserName: "chrome",
			"goog:chromeOptions": {
				args: [
					"--headless=new",
					"--disable-gpu",
					// the sandbox is not available in the usual CI container
					"--no-sandbox",
					"--disable-dev-shm-usage",
					"--window-size=1400,1000",
				],
				// only set where the browser is not on the default path
				...(process.env.CHROME_BINARY
					? { binary: process.env.CHROME_BINARY }
					: {}),
			},
		},
	],

	logLevel: "error",
	baseUrl,
	waitforTimeout: 30000,
	connectionRetryTimeout: 120000,
	connectionRetryCount: 3,

	framework: "mocha",
	reporters: ["spec"],
	mochaOpts: {
		ui: "bdd",
		// the first page load has to compile the theme, which takes a while on
		// the older releases
		timeout: 180000,
	},

	services: ["ui5"],
	wdi5: {
		url: testPage,
		logLevel: "error",
		waitForUI5Timeout: 60000,
	},

	/**
	 * Starts the dev server on the requested UI5 version. A server that is
	 * already running can be used instead by setting UI5_BASE_URL.
	 */
	async onPrepare() {
		if (process.env.UI5_BASE_URL) {
			return;
		}

		const args = [
			"ui5",
			"serve",
			"--config",
			"ui5-test.yaml",
			"--port",
			String(port),
		];
		if (version) {
			args.push("--framework-version", version);
		}

		console.log(`starting ${args.join(" ")}`);
		// the output is kept rather than inherited: a child that writes to the
		// same stdout holds the stream open, and it is only of interest when
		// the server does not come up at all
		server = spawn("npx", args, { stdio: ["ignore", "pipe", "pipe"] });

		const log = [];
		const collect = (chunk) => log.push(String(chunk));
		server.stdout.on("data", collect);
		server.stderr.on("data", collect);

		try {
			// downloading a framework version that is not in the cache yet is
			// part of this wait
			await waitForServer(`${baseUrl}/${testPage}`, 600000);
		} catch (error) {
			server.kill();
			console.error(log.join(""));
			throw error;
		}
	},

	onComplete() {
		server?.kill();
	},
};
