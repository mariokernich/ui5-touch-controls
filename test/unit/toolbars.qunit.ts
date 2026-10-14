import OverflowToolbarLayoutData from "sap/m/OverflowToolbarLayoutData";
import Page from "sap/m/Page";
import type Popover from "sap/m/Popover";
import ToolbarSpacer from "sap/m/ToolbarSpacer";
import VBox from "sap/m/VBox";
import { OverflowToolbarPriority, ToolbarStyle } from "sap/m/library";
import type Control from "sap/ui/core/Control";
import Button from "ui5/touch/controls/Button";
import OverflowToolbar from "ui5/touch/controls/OverflowToolbar";
import Toolbar from "ui5/touch/controls/Toolbar";
import { SizeMode } from "ui5/touch/controls/library";
import { cleanUp, place, render, setLanguage, waitFor } from "./helpers";

QUnit.module("Toolbar", {
	afterEach: cleanUp,
});

QUnit.test("renders its content as the children of a bar", (assert) => {
	const button = new Button({ text: "Save" });
	const toolbar = place(new Toolbar({ content: [button, new ToolbarSpacer()] }));

	assert.ok(toolbar.getDomRef()?.classList.contains("sizedToolbar"));
	assert.ok(button.getDomRef()?.classList.contains("sapMBarChild"));
	assert.strictEqual(button.getDomRef()?.parentElement, toolbar.getDomRef());
});

QUnit.module("OverflowToolbar", {
	afterEach: cleanUp,
});

/** buttons of a width that is easy to count with */
function wide(text: string, priority?: OverflowToolbarPriority): Button {
	return new Button({
		text: text,
		width: "100px",
		layoutData: priority ? new OverflowToolbarLayoutData({ priority: priority }) : undefined,
	});
}

/** the toolbar in a box of the given width, laid out until it settles */
async function toolbarIn(width: string, content: Control[]): Promise<OverflowToolbar> {
	const toolbar = new OverflowToolbar({ content: content });
	place(new VBox({ width: width, items: [toolbar] }));

	// laying out renders the toolbar again, a few times at most
	for (let i = 0; i < 5; i++) {
		render();
		await new Promise((resolve) => setTimeout(resolve, 20));
	}

	return toolbar;
}

function shown(toolbar: OverflowToolbar): string[] {
	return toolbar
		.getContent()
		.filter((control) => control.getDomRef()?.parentElement === toolbar.getDomRef())
		.map((control) => (control as Button).getText());
}

function overflowButton(toolbar: OverflowToolbar): Button {
	return toolbar.getAggregation("_overflowButton") as Button;
}

QUnit.test("everything fits into a wide bar, and the overflow button hides", async (assert) => {
	const toolbar = await toolbarIn("800px", [wide("a"), wide("b"), wide("c")]);

	assert.deepEqual(shown(toolbar), ["a", "b", "c"]);
	assert.ok(overflowButton(toolbar).hasStyleClass("sizedOverflowToolbarButtonHidden"));
});

QUnit.test("what does not fit overflows, the lowest priority and the last first", async (assert) => {
	const toolbar = await toolbarIn("330px", [
		wide("a"),
		wide("low", OverflowToolbarPriority.Low),
		wide("b"),
		wide("c"),
	]);

	assert.deepEqual(shown(toolbar), ["a", "b"], "the low one goes first, then the last one");
	assert.notOk(overflowButton(toolbar).hasStyleClass("sizedOverflowToolbarButtonHidden"));
	assert.strictEqual(overflowButton(toolbar).getTooltip_AsString(), "Additional options");
});

QUnit.test("AlwaysOverflow never shows in the bar, NeverOverflow stays in it", async (assert) => {
	const toolbar = await toolbarIn("330px", [
		wide("always", OverflowToolbarPriority.AlwaysOverflow),
		wide("a"),
		wide("b"),
		wide("never", OverflowToolbarPriority.NeverOverflow),
	]);

	assert.deepEqual(shown(toolbar), ["a", "never"]);
});

QUnit.test("the overflow area shows the same controls and gives them back in their order", async (assert) => {
	const content = [
		wide("a"),
		wide("gone", OverflowToolbarPriority.Disappear),
		wide("b"),
		wide("c"),
	];
	const toolbar = await toolbarIn("300px", content);
	const popover = toolbar.getAggregation("_popover") as Popover | null;

	overflowButton(toolbar).firePress();
	const open = toolbar.getAggregation("_popover") as Popover;
	await waitFor(() => open.isOpen(), "the overflow area did not open");

	assert.notOk(popover, "the popover is made on first use");
	assert.notOk(
		open.getContent().some((control) => (control as Button).getText() === "gone"),
		"Disappear does not show in the overflow area",
	);
	assert.ok(open.getContent().length > 0);

	open.close();
	await waitFor(() => !open.isOpen(), "the overflow area did not close");

	assert.deepEqual(
		toolbar.getContent().map((control) => (control as Button).getText()),
		["a", "gone", "b", "c"],
		"the content is back, in its order",
	);
});

QUnit.test("the tooltip of the overflow button follows the language", async (assert) => {
	const toolbar = await toolbarIn("300px", [wide("a"), wide("b"), wide("c"), wide("d")]);

	setLanguage("de");
	render();

	assert.strictEqual(overflowButton(toolbar).getTooltip_AsString(), "Zusätzliche Optionen");
});

QUnit.module("Toolbar and OverflowToolbar", {
	afterEach: cleanUp,
});

/** both toolbars, made the same way, so every test runs on each of them */
const toolbars: [string, (settings: { content?: Control[]; size?: SizeMode; style?: ToolbarStyle }) => Toolbar | OverflowToolbar][] = [
	["Toolbar", (settings) => new Toolbar(settings)],
	["OverflowToolbar", (settings) => new OverflowToolbar(settings)],
];

toolbars.forEach(([name, create]) => {
	QUnit.test(`${name}: the size is the least height of the bar`, (assert) => {
		const toolbar = place(create({ size: SizeMode["2XL"], content: [new Button({ text: "a" })] }));
		const dom = toolbar.getDomRef() as HTMLElement;

		assert.strictEqual(toolbar.getSize(), SizeMode["2XL"]);
		assert.ok(dom.classList.contains("sizedSize2XL"));
		assert.ok(
			dom.getBoundingClientRect().height >= 63.9,
			"at least as tall as a 2XL button (4rem)",
		);
	});

	QUnit.test(`${name}: the style decides on the line below the bar`, (assert) => {
		const standard = place(create({}));
		const clear = place(create({ style: ToolbarStyle.Clear }));

		assert.ok(standard.getDomRef()?.classList.contains("sapMTBStandard"), "Standard by default");
		assert.notOk(standard.getDomRef()?.classList.contains("sapMTBClear"));
		assert.ok(clear.getDomRef()?.classList.contains("sapMTBClear"));
		assert.notOk(clear.getDomRef()?.classList.contains("sapMTBStandard"));
		assert.strictEqual(
			window.getComputedStyle(clear.getDomRef() as Element).borderBottomStyle,
			"none",
			"no line below a Clear toolbar",
		);
	});

	QUnit.test(`${name}: a tall bar of a page does not cover the content`, async (assert) => {
		const tall = (): Control[] => [new Button({ text: "tall", size: SizeMode["2XL"] })];
		const page = new Page({
			customHeader: create({ content: tall() }),
			footer: create({ content: tall() }),
			content: [new Button({ text: "content" })],
		});
		place(new VBox({ height: "600px", renderType: "Bare", items: [page] }));

		await waitFor(
			() => (page.getDomRef()?.getBoundingClientRect().height ?? 0) > 0,
			"the page did not get a height",
		);

		const pageDom = page.getDomRef() as HTMLElement;
		const child = (selector: string): DOMRect =>
			(pageDom.querySelector(`:scope > ${selector}`) as HTMLElement).getBoundingClientRect();
		const header = child(".sapMPageHeader");
		const footer = child(".sapMPageFooter");
		const section = child("section");

		assert.ok(header.height > 44, "the header is taller than a sap.m bar");
		assert.ok(Math.abs(section.top - header.bottom) <= 1, "the content starts below the header");
		assert.ok(Math.abs(section.bottom - footer.top) <= 1, "the content ends above the footer");
	});
});
