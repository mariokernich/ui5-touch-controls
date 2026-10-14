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

/**
 * The sap.m control each control of the library replaces, read from the
 * documentation of the demo: the controls the test page has to show the
 * original of. A control that is new, or that replaces something else than
 * sap.m, has no entry.
 */
const replaced = Object.fromEntries(
	[
		...readFileSync(
			join(__dirname, "..", "docs", "model", "documentation.ts"),
			"utf8",
		).matchAll(/name: "(\w+)",\s*replaces: "(sap\.m\.\w+)/g),
	].map((match) => [match[1], match[2]]),
);


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
 * The first control of a kind that can be worked with. The page also shows
 * the controls disabled - on their own and in disabled containers - and a
 * click on one of those must not do anything, which is what the tests of the
 * disabled containers further down check.
 */
async function firstEnabledOfType(name) {
	for (const control of await controlsOfType(name)) {
		if (await control.getEnabled()) {
			return control;
		}
	}

	throw new Error(`no enabled ${name} on the page`);
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
		const checkBox = await firstEnabledOfType("CheckBox");
		const before = await checkBox.getSelected();

		await (await checkBox.getWebElement()).click();

		expect(await checkBox.getSelected()).toBe(!before);
		await expectNoPageErrors();
	});

	it("a Switch changes its state when it is clicked", async () => {
		const swtch = await firstEnabledOfType("Switch");
		const before = await swtch.getState();

		await (await swtch.getWebElement()).click();

		expect(await swtch.getState()).toBe(!before);
		await expectNoPageErrors();
	});

	it("an Input takes what is typed into it", async () => {
		const input = await firstEnabledOfType("Input");
		const field = await (await input.getWebElement()).$("input");

		await field.click();
		await browser.keys(["1", "2", "3"]);

		expect(await input.getValue()).toContain("123");
		await expectNoPageErrors();
	});

	it("a Select opens its picker when it is clicked", async () => {
		const select = await firstEnabledOfType("Select");

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

describe("the sap.m originals", () => {
	it("are on the page for every control that replaces one of sap.m", async () => {
		const fromPage = await browser.execute(() => window.touchTestOriginals);
		const expected = Object.keys(replaced).filter((name) =>
			catalogue.includes(name),
		);

		expect([...fromPage].sort()).toEqual(expected.sort());
	});

	for (const [name, original] of Object.entries(replaced)) {
		if (!catalogue.includes(name)) {
			continue;
		}

		it(`shows ${original} in the card of ${name}`, async () => {
			const found = await browser.execute(
				(control, originalName) => {
					const title = [...document.querySelectorAll("h2.sapMTitle")].find(
						(element) => element.textContent === control,
					);
					const rows = [
						...(title?.closest(".touchTestCard")?.querySelectorAll(
							".touchTestOriginal",
						) ?? []),
					];
					const byId = (id) => {
						const Element = sap.ui.require("sap/ui/core/Element");
						return Element?.getElementById
							? Element.getElementById(id)
							: sap.ui.getCore().byId(id);
					};
					// the controls of a row are the items of its box - each of
					// them sits in a wrapper of the box in the DOM
					const controls = rows
						.map((row) => byId(row.querySelector(".touchTestControls").id))
						.flatMap((box) => box.getItems());

					// sap.m.MessageBox is no control - its dialogs are opened
					// by the buttons of the row
					const Control = sap.ui.require("sap/ui/core/Control");
					const exported = sap.ui.require(originalName.replace(/\./g, "/"));
					const type =
						exported && exported.prototype instanceof Control
							? originalName
							: "sap.m.Button";

					return {
						rows: rows.length,
						matching: controls.filter((item) => item.isA(type)).length,
						library: controls.filter((item) =>
							item.getMetadata().getName().startsWith("ui5.touch.controls."),
						).length,
					};
				},
				name,
				original,
			);

			expect(found.rows).toBeGreaterThan(0);
			expect(found.matching).toBeGreaterThan(0);
			expect(found.library).toBe(0);
			await expectNoPageErrors();
		});
	}
});

describe("a disabled container", () => {
	// the test page reports every reaction of what is in these containers as
	// an error of the page - see mustNotReact in test/cases.ts

	it("lets no click and no key through to what is in a Toolbar", async () => {
		const toolbar = await $(".touchTestDisabled.sizedToolbar:not(.sizedOverflowToolbar)");

		// the keys are to go nowhere, not into a field an earlier test left
		// the focus in
		await browser.execute(() => {
			document.activeElement?.blur();
		});

		// the Input is clicked as a whole: where its disabled native field is,
		// the browser hands a click to the control around it - which is also
		// where the finger of a user lands
		for (const part of [".sizedButton", ".sizedCheckBox", ".sizedSwitch", ".sizedInput"]) {
			await (await toolbar.$(part)).click();
		}
		await browser.keys(["1", "2", "3"]);

		expect(await (await toolbar.$(".sizedCheckBox")).getAttribute("aria-checked")).toBe("false");
		expect(await (await toolbar.$("input")).getValue()).toBe("");
		await expectNoPageErrors();
	});

	it("keeps the overflow area of an OverflowToolbar closed", async () => {
		const toolbar = await $(".touchTestDisabled.sizedOverflowToolbar");

		// what is left in the bar, and the button with the three dots
		for (const button of await toolbar.$$(".sizedButton")) {
			if (await button.isDisplayed()) {
				await button.click();
			}
		}
		// the time a popover takes to open, had it been told to
		await browser.pause(500);

		expect(await (await $(".sizedOverflowToolbarPopover")).isDisplayed()).toBe(false);
		await expectNoPageErrors();
	});
});

describe("the sizes come through", () => {
	// what the test page shows of the ladder, from small to large
	const sizes = ["M", "XL", "3XL"];

	it("a Button grows with its size property", async () => {
		const measured = [];

		// One lookup per size, not one getter call per button: every call
		// waits for UI5 to settle first, the page has a couple of hundred
		// buttons, and on UI5 1.108 that wait alone is over a second - its
		// RecordReplay counts the promise it waits with as pending work.
		for (const size of sizes) {
			const [button] = await browser.allControls({
				selector: {
					controlType: "ui5.touch.controls.Button",
					properties: { size },
				},
			});

			measured.push(
				button ? (await (await button.getWebElement()).getSize()).height : 0,
			);
		}

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
