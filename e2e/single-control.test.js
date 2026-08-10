/**
 * Checks that the test page can be narrowed to one control.
 *
 * This is a spec file of its own because it navigates, and a page load takes
 * the wdi5 bridge with it - wdi5 puts the bridge in when the session starts.
 * Everything here is therefore read from the page itself rather than through
 * the control tree; what is under test is the page, not the controls.
 */

const { readFileSync } = require("node:fs");
const { join } = require("node:path");

const PAGE = "test-resources/ui5/touch/controls/test.html";

const catalogue = [
	...readFileSync(join(__dirname, "..", "test", "cases.ts"), "utf8").matchAll(
		/^\t(\w+): \(\) => \[/gm,
	),
].map((match) => match[1]);

/** What the page has in its header, once it has drawn something. */
async function headerTitle() {
	await browser.waitUntil(
		async () =>
			Boolean(
				await browser.execute(
					() => document.querySelector(".sapMTitle")?.textContent,
				),
			),
		{ timeout: 30000, timeoutMsg: "the test page did not finish rendering" },
	);

	return await browser.execute(
		() => document.querySelector(".sapMTitle")?.textContent,
	);
}

/** The headings of the sections that are on the page. */
async function sections() {
	return await browser.execute(() =>
		[...document.querySelectorAll("h2.sapMTitle")].map(
			(title) => title.textContent,
		),
	);
}

describe("one control at a time", () => {
	it("shows every control when nothing is asked for", async () => {
		await browser.url(PAGE);

		expect(await headerTitle()).toBe("ui5.touch.controls - all controls");
		expect(await sections()).toEqual(catalogue);
	});

	it("shows the control named in the hash", async () => {
		const name = catalogue[0];
		await browser.url(`${PAGE}#${name}`);

		expect(await headerTitle()).toBe(`ui5.touch.controls - ${name}`);
		expect(await sections()).toEqual([name]);
	});

	it("switches control without reloading the page", async () => {
		const [first, second] = catalogue;

		await browser.url(`${PAGE}#${first}`);
		await browser.execute(() => {
			window.touchTestReloadMarker = true;
		});

		await browser.execute((name) => {
			window.location.hash = name;
		}, second);

		expect(await headerTitle()).toBe(`ui5.touch.controls - ${second}`);
		expect(await sections()).toEqual([second]);
		expect(
			await browser.execute(() => window.touchTestReloadMarker === true),
		).toBe(true);
	});

	it("shows the control named in the query string", async () => {
		const name = catalogue[1];
		await browser.url(`${PAGE}?control=${name}`);

		expect(await headerTitle()).toBe(`ui5.touch.controls - ${name}`);
		expect(await sections()).toEqual([name]);
	});
});
