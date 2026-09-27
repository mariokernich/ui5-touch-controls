import Localization from "sap/base/i18n/Localization";
import { SwitchType } from "sap/m/library";
import { ValueState } from "sap/ui/core/library";
import type Button from "ui5/touch/controls/Button";
import CheckBox from "ui5/touch/controls/CheckBox";
import RadioButton from "ui5/touch/controls/RadioButton";
import RadioButtonGroup from "ui5/touch/controls/RadioButtonGroup";
import SegmentedButton from "ui5/touch/controls/SegmentedButton";
import SegmentedButtonItem from "ui5/touch/controls/SegmentedButtonItem";
import Switch from "ui5/touch/controls/Switch";
import { SizeMode } from "ui5/touch/controls/library";
import { cleanUp, EventLog, keydown, keyup, place, render, tap } from "./helpers";

function dom(control: { getDomRef(): Element | null }): HTMLElement {
	return control.getDomRef() as HTMLElement;
}

QUnit.module("CheckBox", {
	afterEach: cleanUp,
});

QUnit.test("a tap toggles it and reports the new state", (assert) => {
	const checkBox = place(new CheckBox({ text: "Agree" }));
	const log = new EventLog().listen(checkBox, "select");

	tap(dom(checkBox));
	render();

	assert.ok(checkBox.getSelected());
	assert.strictEqual(dom(checkBox).getAttribute("aria-checked"), "true");
	assert.deepEqual(log.last("select"), { selected: true });

	tap(dom(checkBox));

	assert.notOk(checkBox.getSelected());
	assert.strictEqual(log.count("select"), 2);
});

QUnit.test("Space toggles it when the key comes up", (assert) => {
	const checkBox = place(new CheckBox());
	const down = keydown(dom(checkBox), " ");

	assert.ok(down.defaultPrevented, "the page does not scroll");
	assert.notOk(checkBox.getSelected(), "not yet");

	keyup(dom(checkBox), " ");
	assert.ok(checkBox.getSelected());
});

QUnit.test("the partially selected state gives way to a full selection", (assert) => {
	const checkBox = place(new CheckBox({ selected: true, partiallySelected: true }));

	assert.strictEqual(dom(checkBox).getAttribute("aria-checked"), "mixed");

	tap(dom(checkBox));

	assert.ok(checkBox.getSelected());
	assert.notOk(checkBox.getPartiallySelected());
});

QUnit.test("a disabled or read-only check box does not change", (assert) => {
	const disabled = place(new CheckBox({ enabled: false }));
	const readOnly = place(new CheckBox({ editable: false }));

	for (const checkBox of [disabled, readOnly]) {
		tap(dom(checkBox));
		keyup(dom(checkBox), " ");
		assert.notOk(checkBox.getSelected());
		assert.strictEqual(dom(checkBox).getAttribute("tabindex"), "-1");
	}
	assert.strictEqual(dom(disabled).getAttribute("aria-disabled"), "true");
	assert.strictEqual(dom(readOnly).getAttribute("aria-readonly"), "true");
});

QUnit.test("the value state shows only while the user can act on it", (assert) => {
	const checkBox = place(new CheckBox({ valueState: ValueState.Error }));

	assert.ok(dom(checkBox).classList.contains("sizedCheckBoxError"));

	checkBox.setEnabled(false);
	render();

	assert.notOk(dom(checkBox).classList.contains("sizedCheckBoxError"));
});

QUnit.module("Switch", {
	afterEach: cleanUp,
});

QUnit.test("a tap flips it without rendering it again, so the handle can travel", (assert) => {
	const control = place(new Switch());
	const element = dom(control);
	const log = new EventLog().listen(control, "change");

	tap(element);

	assert.ok(control.getState());
	assert.strictEqual(dom(control), element, "the same element");
	assert.ok(element.classList.contains("sizedSwitchOn"));
	assert.strictEqual(element.getAttribute("aria-checked"), "true");
	assert.deepEqual(log.last("change"), { state: true });
});

QUnit.test("setState moves the handle, and reports nothing", (assert) => {
	const control = place(new Switch());
	const log = new EventLog().listen(control, "change");

	control.setState(true);

	assert.ok(dom(control).classList.contains("sizedSwitchOn"));
	assert.strictEqual(log.count("change"), 0);
});

QUnit.test("Enter and Space flip it, a disabled switch stays", (assert) => {
	const control = place(new Switch());

	keydown(dom(control), "Enter");
	assert.ok(control.getState(), "Enter");

	keydown(dom(control), " ");
	keyup(dom(control), " ");
	assert.notOk(control.getState(), "Space");

	control.setEnabled(false);
	render();
	tap(dom(control));
	assert.notOk(control.getState(), "disabled");
});

QUnit.test("it says on and off in the language of the app, unless told otherwise", (assert) => {
	const control = place(new Switch());
	const label = (state: "on" | "off") => control.getDomRef(state)?.textContent;

	assert.strictEqual(label("on"), "ON");
	assert.strictEqual(label("off"), "OFF");

	Localization.setLanguage("de");
	render();

	assert.strictEqual(label("on"), "AN", "it follows the language");

	control.setCustomTextOn("Yes");
	render();

	assert.strictEqual(label("on"), "Yes");

	control.setType(SwitchType.AcceptReject);
	render();

	assert.strictEqual(label("on"), "", "the accept and reject type shows icons instead");
});

QUnit.module("RadioButton", {
	afterEach: cleanUp,
});

QUnit.test("the buttons of a group are selected one at a time", (assert) => {
	const first = place(new RadioButton({ groupName: "shift", selected: true }));
	const second = place(new RadioButton({ groupName: "shift" }));
	const other = place(new RadioButton({ groupName: "other", selected: true }));
	const log = new EventLog().listen(second, "select");

	tap(dom(second));
	render();

	assert.ok(second.getSelected());
	assert.notOk(first.getSelected(), "the other button of the group is deselected");
	assert.ok(other.getSelected(), "a button of another group is left alone");
	assert.deepEqual(log.last("select"), { selected: true });
	assert.strictEqual(dom(second).getAttribute("aria-checked"), "true");

	tap(dom(second));
	assert.strictEqual(log.count("select"), 1, "selecting the selected one again reports nothing");
});

QUnit.test("a disabled or read-only button is not selected", (assert) => {
	const disabled = place(new RadioButton({ groupName: "g1", enabled: false }));
	const readOnly = place(new RadioButton({ groupName: "g2", editable: false }));

	tap(dom(disabled));
	keyup(dom(readOnly), " ");

	assert.notOk(disabled.getSelected());
	assert.notOk(readOnly.getSelected());
});

QUnit.module("RadioButtonGroup", {
	afterEach: cleanUp,
});

function group(settings: Record<string, unknown> = {}): RadioButtonGroup {
	return place(
		new RadioButtonGroup({
			buttons: [
				new RadioButton({ text: "Early" }),
				new RadioButton({ text: "Late" }),
				new RadioButton({ text: "Night" }),
			],
			...settings,
		}),
	);
}

QUnit.test("selectedIndex says which button is selected", (assert) => {
	const control = group({ selectedIndex: 1 });

	assert.deepEqual(
		control.getButtons().map((button) => button.getSelected()),
		[false, true, false],
	);
	assert.strictEqual(control.getSelectedButton()?.getText(), "Late");

	control.setSelectedIndex(-1);
	render();

	assert.deepEqual(
		control.getButtons().map((button) => button.getSelected()),
		[false, false, false],
	);
	assert.strictEqual(control.getSelectedButton(), null);
});

QUnit.test("a tap on a button selects it and is reported by the group", (assert) => {
	const control = group();
	const log = new EventLog().listen(control, "select");

	tap(dom(control.getButtons()[2]));

	assert.strictEqual(control.getSelectedIndex(), 2);
	assert.deepEqual(log.last("select"), { selectedIndex: 2 });
	assert.deepEqual(
		control.getButtons().map((button) => button.getSelected()),
		[false, false, true],
	);
});

QUnit.test("the group hands its settings down and keeps to itself", (assert) => {
	const first = group({ size: SizeMode.XL, enabled: false, valueState: ValueState.Warning, columns: 3 });
	const second = group();

	const button = first.getButtons()[0];
	assert.strictEqual(button.getSize(), SizeMode.XL);
	assert.notOk(button.getEnabled());
	assert.strictEqual(button.getValueState(), ValueState.Warning);
	assert.strictEqual(dom(first).style.gridTemplateColumns, "repeat(3, auto)");
	assert.strictEqual(dom(first).getAttribute("role"), "radiogroup");

	tap(dom(second.getButtons()[1]));
	assert.ok(first.getButtons()[0].getSelected(), "another group is left alone");
});

QUnit.module("SegmentedButton", {
	afterEach: cleanUp,
});

function segments(settings: Record<string, unknown> = {}): SegmentedButton {
	return place(
		new SegmentedButton({
			items: [
				new SegmentedButtonItem({ key: "day", text: "Day" }),
				new SegmentedButtonItem({ key: "week", text: "Week" }),
				new SegmentedButtonItem({ key: "month", text: "Month" }),
			],
			...settings,
		}),
	);
}

function buttons(control: SegmentedButton): Button[] {
	return control.getAggregation("_buttons") as Button[];
}

QUnit.test("one button per item, the first one selected where no key matches", (assert) => {
	const control = segments();

	assert.deepEqual(
		buttons(control).map((button) => button.getText()),
		["Day", "Week", "Month"],
	);
	assert.strictEqual(control.getSelectedKey(), "day");
	assert.ok(buttons(control)[0].hasStyleClass("sizedSegmentedButtonSelected"));
});

QUnit.test("pressing another segment selects it; pressing the selected one is only a press", (assert) => {
	const control = segments({ selectedKey: "day" });
	const week = control.getItems()[1];
	const log = new EventLog().listen(control, "selectionChange");
	const presses = new EventLog().listen(week, "press");

	buttons(control)[1].firePress();
	render();

	assert.strictEqual(control.getSelectedKey(), "week");
	assert.strictEqual(log.count("selectionChange"), 1);
	assert.strictEqual(log.last("selectionChange")?.key, "week");
	assert.ok(buttons(control)[1].hasStyleClass("sizedSegmentedButtonSelected"));

	buttons(control)[1].firePress();

	assert.strictEqual(log.count("selectionChange"), 1, "no second selection change");
	assert.strictEqual(presses.count("press"), 2, "the item hears of both presses");
});

QUnit.test("a disabled item or control cannot be selected", (assert) => {
	const control = segments();
	control.getItems()[2].setEnabled(false);
	render();

	buttons(control)[2].firePress();
	assert.strictEqual(control.getSelectedKey(), "day");
	assert.notOk(buttons(control)[2].getEnabled());

	control.setEnabled(false);
	render();
	buttons(control)[1].firePress();
	assert.strictEqual(control.getSelectedKey(), "day");
});

QUnit.test("the buttons follow the items that are shown", (assert) => {
	const control = segments();

	control.getItems()[1].setVisible(false);
	render();
	assert.deepEqual(
		buttons(control).map((button) => button.getText()),
		["Day", "Month"],
	);

	control.addItem(new SegmentedButtonItem({ key: "year", text: "Year", icon: "sap-icon://calendar" }));
	render();
	assert.deepEqual(
		buttons(control).map((button) => button.getText()),
		["Day", "Month", "Year"],
	);
	assert.strictEqual(buttons(control)[2].getIcon(), "sap-icon://calendar");
});

QUnit.test("a width spreads the segments evenly, the size reaches every one", (assert) => {
	const control = segments({ width: "30rem", size: SizeMode.L });

	assert.ok(dom(control).classList.contains("sizedSegmentedButtonEqual"));
	assert.ok(buttons(control).every((button) => button.getSize() === SizeMode.L));
});
