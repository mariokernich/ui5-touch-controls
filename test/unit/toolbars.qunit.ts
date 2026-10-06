import OverflowToolbarLayoutData from "sap/m/OverflowToolbarLayoutData";
import type Popover from "sap/m/Popover";
import ToolbarSpacer from "sap/m/ToolbarSpacer";
import VBox from "sap/m/VBox";
import { OverflowToolbarPriority } from "sap/m/library";
import type Control from "sap/ui/core/Control";
import Button from "ui5/touch/controls/Button";
import OverflowToolbar from "ui5/touch/controls/OverflowToolbar";
import Toolbar from "ui5/touch/controls/Toolbar";
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
