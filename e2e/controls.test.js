/**
 * The UI tests of the library, run with wdi5 against the plain test page in
 * test/. They are pointed at one UI5 release at a time - see wdio.conf.js - so
 * the same suite says whether the controls still work on the oldest supported
 * release as well as on the newest.
 *
 * The controls are addressed through wdi5 selectors, which look them up in the
 * UI5 control tree, and read back through their own getters. What is measured
 * in the browser instead is the part a UI5 release can break silently: the
 * sizes, which come out of the stylesheet.
 *
 * Nothing here navigates. wdi5 puts its bridge into the page once, when the
 * session starts, and a page load would take it with it - the one test that
 * has to navigate is therefore a spec file of its own.
 */

const { readFileSync } = require("node:fs");
const { join } = require("node:path");

/**
 * The controls the test page knows about, read from its source so that every
 * one of them gets a test case of its own. The list is checked against the
 * page itself further down, so it cannot quietly fall behind.
 */
const catalogue = [
	...readFileSync(join(__dirname, "..", "test", "cases.ts"), "utf8").matchAll(
		/^\t(\w+): \(\) => \[/gm,
	),
].map((match) => match[1]);

/** Fails with what the page collected, if anything went wrong on it. */
async function expectNoPageErrors() {
	const errors = await browser.execute(() => window.touchTestErrors ?? []);

	if (errors.length > 0) {
		throw new Error(`the page reported errors: ${errors.join(" | ")}`);
	}
}

/** All instances of one control of the library that are on the page. */
async function controlsOfType(name) {
	return await browser.allControls({
		selector: { controlType: `ui5.touch.controls.${name}` },
	});
}

/**
 * The first control of a kind, to work on.
 *
 * asControl is not used for this: its selector has to match exactly one
 * control, and the test page shows every control in several sizes.
 */
async function firstOfType(name) {
	const controls = await controlsOfType(name);

	if (controls.length === 0) {
		throw new Error(`no ${name} on the page`);
	}

	return controls[0];
}

/**
 * Whether what the library exports under this name is a control. Not
 * everything it ships is one - QuickDialog is a class that puts dialogs
 * together, and there is nothing of it on the page until one is opened.
 */
async function isControl(name) {
	return await browser.execute((module) => {
		const Control = sap.ui.require("sap/ui/core/Control");
		const exported = sap.ui.require(`ui5/touch/controls/${module}`);

		return Boolean(Control && exported && exported.prototype instanceof Control);
	}, name);
}

describe("the test page", () => {
	it("was read correctly: the catalogue matches the page", async () => {
		const fromPage = await browser.execute(() => window.touchTestCases);

		expect(catalogue).toEqual(fromPage);
	});

	it("loads without an error", async () => {
		await expectNoPageErrors();
	});
});

describe("every control", () => {
	for (const name of catalogue) {
		it(`renders ${name}`, async () => {
			if (await isControl(name)) {
				await firstOfType(name);
				return;
			}

			// not a control: all that can be asked of the page is that the
			// section is there, with whatever opens it
			const sections = await browser.execute(() =>
				[...document.querySelectorAll("h2.sapMTitle")].map(
					(title) => title.textContent,
				),
			);

			expect(sections).toContain(name);
		});
	}
});

describe("the controls react", () => {
	it("a CheckBox changes its selection when it is clicked", async () => {
		const checkBox = await firstOfType("CheckBox");
		const before = await checkBox.getSelected();

		await (await checkBox.getWebElement()).click();

		expect(await checkBox.getSelected()).toBe(!before);
		await expectNoPageErrors();
	});

	it("a Switch changes its state when it is clicked", async () => {
		const swtch = await firstOfType("Switch");
		const before = await swtch.getState();

		await (await swtch.getWebElement()).click();

		expect(await swtch.getState()).toBe(!before);
		await expectNoPageErrors();
	});

	it("an Input takes what is typed into it", async () => {
		const input = await firstOfType("Input");
		const field = await (await input.getWebElement()).$("input");

		await field.click();
		await browser.keys(["1", "2", "3"]);

		expect(await input.getValue()).toContain("123");
		await expectNoPageErrors();
	});

	it("a Select opens its picker when it is clicked", async () => {
		const select = await firstOfType("Select");

		await (await select.getWebElement()).click();
		await (await $(".sizedSelectPopover")).waitForDisplayed({
			timeout: 15000,
			timeoutMsg: "the picker of the Select stayed closed",
		});

		// leave the page as it was found, so the tests after this one do not
		// have to work around an open popover
		await browser.keys(["Escape"]);
		await expectNoPageErrors();
	});
});

describe("the sizes come through", () => {
	// what the test page shows of the ladder, from small to large
	const sizes = ["M", "XL", "3XL"];

	it("a Button grows with its size property", async () => {
		const heights = {};

		for (const button of await controlsOfType("Button")) {
			const size = await button.getSize();

			if (sizes.includes(size) && !(size in heights)) {
				heights[size] = (await (await button.getWebElement()).getSize()).height;
			}
		}

		const measured = sizes.map((size) => heights[size]);
		if (measured.some((height) => !height)) {
			throw new Error(`not every size was on the page: ${measured.join(", ")}`);
		}

		for (let index = 1; index < measured.length; index += 1) {
			if (measured[index] <= measured[index - 1]) {
				throw new Error(
					`the sizes ${sizes.join(", ")} came out as ${measured.join(", ")}`,
				);
			}
		}
	});

	it("the size classes carry the measurements of their size", async () => {
		const fontSizes = await browser.execute(
			(classes) =>
				classes.map((name) => {
					const element = document.querySelector(`.${name}`);
					return element
						? getComputedStyle(element)
								.getPropertyValue("--sized-font-size")
								.trim()
						: "";
				}),
			sizes.map((size) => `sizedSize${size}`),
		);

		for (const [index, fontSize] of fontSizes.entries()) {
			if (!fontSize) {
				throw new Error(
					`size ${sizes[index]} carries no font size - the stylesheet did not make it onto the page`,
				);
			}
		}
	});
});
