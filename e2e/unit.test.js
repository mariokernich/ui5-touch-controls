/**
 * Runs the QUnit unit tests of the library in the browser of the UI tests.
 *
 * The unit tests live in test/unit and are started by the UI5 test starter,
 * like in the browser of a developer - see test/testsuite.qunit.html. Running
 * them from here means they run on every UI5 release the UI tests are pointed
 * at, which is what tells a control that only works on the newest release
 * from one that works on all of them.
 *
 * The page puts the outcome on the window when QUnit is done (see
 * test/unit/reporter.ts); every failed assertion is listed in the error, so
 * the log of a failed run says which test failed and why.
 *
 * This is a spec file of its own because it navigates away from the test page,
 * which takes the wdi5 bridge with it.
 */

const PAGE =
	"resources/sap/ui/test/starter/Test.qunit.html" +
	"?testsuite=test-resources/ui5/touch/controls/testsuite.qunit" +
	"&test=unit/unitTests";

/** Waits for QUnit to be done and returns what the page reported. */
async function outcome() {
	await browser.waitUntil(
		async () =>
			Boolean(await browser.execute(() => window.touchQUnitOutcome)),
		{
			timeout: 300000,
			interval: 1000,
			timeoutMsg: "the unit tests did not finish",
		},
	);

	return await browser.execute(() => window.touchQUnitOutcome);
}

/** One line per failed assertion. */
function describeFailures(failures) {
	return failures
		.map((failure) => {
			const details = [failure.message];
			if (failure.expected !== undefined || failure.actual !== undefined) {
				details.push(`expected ${failure.expected}, got ${failure.actual}`);
			}
			return `  ${failure.module} > ${failure.test}: ${details.join(" - ")}`;
		})
		.join("\n");
}

describe("the unit tests", () => {
	it("pass", async () => {
		await browser.url(PAGE);

		const result = await outcome();
		console.log(
			`QUnit: ${result.passed} of ${result.total} assertions passed in ${result.runtime} ms`,
		);

		if (result.failed > 0) {
			throw new Error(
				`${result.failed} of ${result.total} assertions failed:\n${describeFailures(result.failures)}`,
			);
		}
		if (result.total === 0) {
			throw new Error("no assertion ran at all");
		}
	});
});
