import { ButtonType } from "sap/m/library";
import type Control from "sap/ui/core/Control";
import Element from "sap/ui/core/Element";
import Button from "ui5/touch/controls/Button";
import { SizeMode } from "ui5/touch/controls/library";
import { cleanUp, EventLog, place, pointer, render } from "./helpers";

/** the icon controls there are, wherever they came from */
function countIconControls(): number {
	return Element.registry.filter((element) =>
		["sap.ui.core.Icon", "sap.m.Image"].includes(element.getMetadata().getName()),
	).length;
}

QUnit.module("Button", {
	afterEach: cleanUp,
});

QUnit.test("renders a native button with the classes of its type and size", (assert) => {
	const button = place(
		new Button({ text: "Save", type: ButtonType.Emphasized, size: SizeMode.XL }),
	);
	const dom = button.getDomRef() as HTMLButtonElement;

	assert.strictEqual(dom.tagName, "BUTTON");
	assert.strictEqual(dom.getAttribute("type"), "button", "no submit button inside a form");
	assert.ok(dom.classList.contains("sizedButtonEmphasized"));
	assert.ok(dom.classList.contains("sizedSizeXL"));
	assert.strictEqual(button.getDomRef("content")?.textContent, "Save");
	assert.notOk(dom.disabled);
});

QUnit.test("a disabled button is a disabled native button", (assert) => {
	const dom = place(new Button({ text: "Save", enabled: false })).getDomRef() as HTMLButtonElement;

	assert.ok(dom.disabled);
	assert.ok(dom.classList.contains("sapMBtnDisabled"));
});

QUnit.test("the icon stands before or after the text", (assert) => {
	const button = place(new Button({ text: "Next", icon: "sap-icon://navigation-right-arrow" }));
	const children = () =>
		[...(button.getDomRef("inner")?.children ?? [])].map((child) => child.id);

	assert.deepEqual(children(), [`${button.getId()}-img`, `${button.getId()}-content`]);
	assert.ok(button.getDomRef("img")?.classList.contains("sizedButtonIconLeft"));

	button.setIconFirst(false);
	render();

	assert.deepEqual(children(), [`${button.getId()}-content`, `${button.getId()}-img`]);
	assert.ok(button.getDomRef("img")?.classList.contains("sizedButtonIconRight"));
});

QUnit.test("the icon control is made once, not on every rendering", (assert) => {
	const before = countIconControls();
	const button = place(new Button({ text: "Add", icon: "sap-icon://add" }));

	for (let i = 0; i < 5; i++) {
		button.setText(`Add ${i}`);
		render();
	}

	assert.strictEqual(countIconControls() - before, 1, "one icon control for six renderings");
	assert.ok(
		button.getDomRef("img")?.querySelector(`#${button.getId()}-icon`),
		"and it is the one on the screen",
	);
});

QUnit.test("a new icon replaces the icon control, no icon removes it", (assert) => {
	const before = countIconControls();
	const button = place(new Button({ icon: "sap-icon://add" }));
	const first = button.getAggregation("_icon") as Control | null;

	button.setIcon("sap-icon://less");
	render();

	assert.notStrictEqual(button.getAggregation("_icon"), first, "a control for the new icon");
	assert.ok(first?.isDestroyed(), "the old one is gone");
	assert.strictEqual(countIconControls() - before, 1);

	button.setIcon("");
	render();

	assert.strictEqual(button.getAggregation("_icon"), null);
	assert.strictEqual(button.getDomRef("img"), null);
	assert.strictEqual(countIconControls() - before, 0);
});

QUnit.test("the icon control goes with the button", (assert) => {
	const before = countIconControls();
	const button = place(new Button({ icon: "sap-icon://add" }));

	button.destroy();

	assert.strictEqual(countIconControls(), before);
});

QUnit.test("a pointer that goes down and up presses the button once", (assert) => {
	const button = place(new Button({ text: "Go" }));
	const log = new EventLog().listen(button, "press");
	const dom = button.getDomRef() as HTMLElement;

	pointer(dom, "pointerdown");
	assert.ok(dom.classList.contains("sizedButtonActive"), "shown as pressed while down");
	pointer(dom, "pointerup");

	assert.strictEqual(log.count("press"), 1);
	assert.notOk(dom.classList.contains("sizedButtonActive"), "and released afterwards");
});

QUnit.test("two fingers press it twice, however they overlap", (assert) => {
	const button = place(new Button({ text: "a" }));
	const log = new EventLog().listen(button, "press");
	const dom = button.getDomRef() as HTMLElement;
	const touch = (pointerId: number): PointerEventInit => ({ pointerId, pointerType: "touch" });

	pointer(dom, "pointerdown", touch(1));
	pointer(dom, "pointerdown", touch(2));
	pointer(dom, "pointerup", touch(1));
	assert.ok(dom.classList.contains("sizedButtonActive"), "still pressed by the second finger");
	pointer(dom, "pointerup", touch(2));

	assert.strictEqual(log.count("press"), 2);
	assert.notOk(dom.classList.contains("sizedButtonActive"));
});

QUnit.test("a release without a press on the button does not press it", (assert) => {
	const button = place(new Button({ text: "Go" }));
	const log = new EventLog().listen(button, "press");

	pointer(button.getDomRef() as HTMLElement, "pointerup");

	assert.strictEqual(log.count("press"), 0);
});

QUnit.test("a pointer that leaves the button cancels the press", (assert) => {
	const button = place(new Button({ text: "Go" }));
	const log = new EventLog().listen(button, "press");
	const dom = button.getDomRef() as HTMLElement;

	pointer(dom, "pointerdown");
	pointer(dom, "pointerleave");
	pointer(dom, "pointerup");

	assert.strictEqual(log.count("press"), 0);
	assert.notOk(dom.classList.contains("sizedButtonActive"));
});

QUnit.test("the secondary mouse button does not press it", (assert) => {
	const button = place(new Button({ text: "Go" }));
	const log = new EventLog().listen(button, "press");
	const dom = button.getDomRef() as HTMLElement;

	pointer(dom, "pointerdown", { button: 2 });
	pointer(dom, "pointerup", { button: 2 });

	assert.strictEqual(log.count("press"), 0);
});

QUnit.test("a disabled button is not pressed, whatever the browser sends", (assert) => {
	const button = place(new Button({ text: "Go", enabled: false }));
	const log = new EventLog().listen(button, "press");
	const dom = button.getDomRef() as HTMLElement;

	pointer(dom, "pointerdown");
	pointer(dom, "pointerup");
	button.onclick(new MouseEvent("click", { detail: 0 }));

	assert.strictEqual(log.count("press"), 0);
});

QUnit.test("Enter and Space press it, through the click of the native button", (assert) => {
	const button = place(new Button({ text: "Go" }));
	const log = new EventLog().listen(button, "press");
	const dom = button.getDomRef() as HTMLButtonElement;

	// what a native button makes of Enter and Space: a click without a
	// pointer behind it
	dom.click();

	assert.strictEqual(log.count("press"), 1);
});

QUnit.test("the click that follows a pointer does not press it a second time", (assert) => {
	const button = place(new Button({ text: "Go" }));
	const log = new EventLog().listen(button, "press");
	const dom = button.getDomRef() as HTMLElement;

	pointer(dom, "pointerdown");
	pointer(dom, "pointerup");
	dom.dispatchEvent(new MouseEvent("click", { bubbles: true, detail: 1 }));

	assert.strictEqual(log.count("press"), 1);
});

QUnit.test("the listeners survive a re-rendering and are not doubled by it", (assert) => {
	const button = place(new Button({ text: "Go" }));
	const log = new EventLog().listen(button, "press");

	button.setText("Went");
	render();
	button.setType(ButtonType.Accept);
	render();

	const dom = button.getDomRef() as HTMLElement;
	pointer(dom, "pointerdown");
	pointer(dom, "pointerup");

	assert.strictEqual(log.count("press"), 1);
});

QUnit.test("a tooltip names a button that shows nothing but an icon", (assert) => {
	const iconOnly = place(new Button({ icon: "sap-icon://add", tooltip: "Add" }));
	const withText = place(new Button({ text: "Add", tooltip: "Adds a row" }));

	assert.strictEqual(iconOnly.getDomRef()?.getAttribute("title"), "Add");
	assert.strictEqual(iconOnly.getDomRef()?.getAttribute("aria-label"), "Add");
	assert.strictEqual(withText.getDomRef()?.getAttribute("title"), "Adds a row");
	assert.strictEqual(
		withText.getDomRef()?.getAttribute("aria-label"),
		null,
		"a button with a text is named by its text",
	);
});
