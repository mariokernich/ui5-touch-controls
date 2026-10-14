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

/**
 * What the control menu below the header shows, once the page has drawn its
 * sections: "All controls", or the group and the name of the one control.
 */
async function chosenControl() {
	await browser.waitUntil(
		async () =>
			Boolean(
				await browser.execute(
					() => document.querySelector("h2.sapMTitle")?.textContent,
				),
			),
		{ timeout: 30000, timeoutMsg: "the test page did not finish rendering" },
	);

	return await browser.execute(
		() =>
			document.querySelector(".sapMPageSubHeader .sapMSltLabel")?.textContent,
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

		expect(await chosenControl()).toBe("All controls");
		// the page shows them group after group, cases.ts lists them on its own
		// order - every one of them is there, once
		expect([...(await sections())].sort()).toEqual([...catalogue].sort());
	});

	it("shows the control named in the hash", async () => {
		const name = catalogue[0];
		await browser.url(`${PAGE}#${name}`);

		expect(await chosenControl()).toMatch(new RegExp(`: ${name}$`));
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

		expect(await chosenControl()).toMatch(new RegExp(`: ${second}$`));
		expect(await sections()).toEqual([second]);
		expect(
			await browser.execute(() => window.touchTestReloadMarker === true),
		).toBe(true);
	});

	it("shows the control named in the query string", async () => {
		const name = catalogue[1];
		await browser.url(`${PAGE}?control=${name}`);

		expect(await chosenControl()).toMatch(new RegExp(`: ${name}$`));
		expect(await sections()).toEqual([name]);
	});
});
