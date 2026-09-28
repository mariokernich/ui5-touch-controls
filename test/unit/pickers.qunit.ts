import Text from "sap/m/Text";
import type ResponsivePopover from "sap/m/ResponsivePopover";
import type VBox from "sap/m/VBox";
import Localization from "sap/base/i18n/Localization";
import type Control from "sap/ui/core/Control";
import Item from "sap/ui/core/Item";
import ListItem from "sap/ui/core/ListItem";
import Device from "sap/ui/Device";
import { ValueState } from "sap/ui/core/library";
import type Button from "ui5/touch/controls/Button";
import ComboBox from "ui5/touch/controls/ComboBox";
import type Input from "ui5/touch/controls/Input";
import Select from "ui5/touch/controls/Select";
import type Toolbar from "ui5/touch/controls/Toolbar";
import {
	cleanUp,
	commit,
	EventLog,
	keydown,
	place,
	render,
	tap,
	type,
	waitFor,
} from "./helpers";

function fruits(): Item[] {
	return [
		new Item({ key: "apple", text: "Apple" }),
		new Item({ key: "banana", text: "Banana" }),
		new Item({ key: "cherry", text: "Cherry" }),
	];
}

function popoverOf(control: Control): ResponsivePopover {
	return control.getAggregation("_popover") as ResponsivePopover;
}

/** the rows of the list of an open picker */
function rows(control: Control): Button[] {
	const list = popoverOf(control).getContent()[0] as VBox;

	return list.getItems().filter((item) => item.isA("ui5.touch.controls.Button")) as Button[];
}

function texts(control: Control): string[] {
	return rows(control).map((row) => row.getText());
}

async function opened(control: Control): Promise<void> {
	await waitFor(() => Boolean(popoverOf(control)?.isOpen()), "the picker did not open");
}

async function closed(control: Control): Promise<void> {
	await waitFor(() => !popoverOf(control)?.isOpen(), "the picker did not close");
}

/**
 * Runs the test as if on a phone: the picker takes the screen there. The
 * device is asked when the popover is made, so the control is made inside.
 */
async function onPhone(test: () => Promise<void>): Promise<void> {
	// read-only to an application, which is right; a test plays the device
	const system = Device.system as { phone: boolean };
	const phone = system.phone;
	system.phone = true;

	try {
		await test();
	} finally {
		system.phone = phone;
	}
}

QUnit.module("Select", {
	afterEach: cleanUp,
});

QUnit.test("shows the selected item, or the first one where the key matches none", (assert) => {
	const select = place(new Select({ items: fruits(), selectedKey: "banana" }));
	const label = () => select.getDomRef("label")?.textContent;

	assert.strictEqual(label(), "Banana");

	select.setSelectedKey("nothing");
	render();

	assert.strictEqual(label(), "Apple", "forceSelection steps in");
	assert.strictEqual(select.getSelectedKey(), "apple", "and the key follows");
});

QUnit.test("without forceSelection nothing is selected", (assert) => {
	const select = place(
		new Select({ items: fruits(), selectedKey: "nothing", forceSelection: false }),
	);

	assert.strictEqual(select.getSelectedItem(), null);
	assert.strictEqual(select.getDomRef("label")?.textContent, "");
});

QUnit.test("a tap opens the list, a row picks the item and closes it", async (assert) => {
	const select = place(new Select({ items: fruits() }));
	const log = new EventLog().listen(select, "change");

	tap(select.getDomRef() as HTMLElement);
	await opened(select);

	assert.deepEqual(texts(select), ["Apple", "Banana", "Cherry"]);
	assert.ok(rows(select)[0].hasStyleClass("sizedPickerItemSelected"), "the selected item is marked");

	rows(select)[2].firePress();
	await closed(select);

	assert.strictEqual(select.getSelectedKey(), "cherry");
	assert.strictEqual(log.count("change"), 1);
	assert.strictEqual(log.last("change")?.selectedKey, "cherry");
});

QUnit.test("picking the item that is selected changes nothing", async (assert) => {
	const select = place(new Select({ items: fruits(), selectedKey: "apple" }));
	const log = new EventLog().listen(select, "change");

	tap(select.getDomRef() as HTMLElement);
	await opened(select);
	rows(select)[0].firePress();
	await closed(select);

	assert.strictEqual(log.count("change"), 0);
});

QUnit.test("Enter and Space open the list too", async (assert) => {
	const select = place(new Select({ items: fruits() }));

	keydown(select.getDomRef() as HTMLElement, "Enter");
	await opened(select);
	popoverOf(select).close();
	await closed(select);

	keydown(select.getDomRef() as HTMLElement, " ");
	await opened(select);
	assert.ok(true, "opened by both keys");
});

QUnit.test("a disabled or read-only select stays closed", async (assert) => {
	const disabled = place(new Select({ items: fruits(), enabled: false }));
	const readOnly = place(new Select({ items: fruits(), editable: false }));

	tap(disabled.getDomRef() as HTMLElement);
	tap(readOnly.getDomRef() as HTMLElement);
	await new Promise((resolve) => setTimeout(resolve, 300));

	assert.notOk(popoverOf(disabled)?.isOpen());
	assert.notOk(popoverOf(readOnly)?.isOpen());
	assert.strictEqual(readOnly.getDomRef("arrow"), null, "a read-only select has no arrow");
});

QUnit.test("the field says whether the list is open, also after a rendering", async (assert) => {
	const select = place(new Select({ items: fruits() }));
	const expanded = () => select.getDomRef()?.getAttribute("aria-expanded");

	assert.strictEqual(expanded(), "false");

	tap(select.getDomRef() as HTMLElement);
	await opened(select);
	assert.strictEqual(expanded(), "true");

	select.setWidth("20rem");
	render();
	assert.strictEqual(expanded(), "true", "a rendering while it is open keeps it");
	assert.ok(select.getDomRef()?.classList.contains("sizedSelectExpanded"));

	popoverOf(select).close();
	await closed(select);
	assert.strictEqual(expanded(), "false");
});

QUnit.test("an item that is not enabled cannot be picked", async (assert) => {
	const items = fruits();
	items[1].setEnabled(false);
	const select = place(new Select({ items: items }));

	tap(select.getDomRef() as HTMLElement);
	await opened(select);

	assert.deepEqual(
		rows(select).map((row) => row.getEnabled()),
		[true, false, true],
	);
});

QUnit.test("on a phone the list brings a bar with a title and a way back, made anew for every opening", async (assert) => {
	await onPhone(async () => {
		const select = place(new Select({ items: fruits() }));

		tap(select.getDomRef() as HTMLElement);
		await opened(select);

		const header = popoverOf(select).getCustomHeader() as Toolbar;
		const [title, , cancel] = header.getContent() as [Text, Control, Button];
		assert.strictEqual(title.getText(), "Select", "the title falls back to the library's");
		assert.strictEqual(cancel.getText(), "Cancel");

		cancel.firePress();
		await closed(select);

		Localization.setLanguage("de");
		select.setPickerTitle("");
		tap(select.getDomRef() as HTMLElement);
		await opened(select);

		assert.ok(header.isDestroyed(), "the bar of the last opening is gone");
		const [newTitle, , newCancel] = (popoverOf(select).getCustomHeader() as Toolbar).getContent() as [
			Text,
			Control,
			Button,
		];
		assert.strictEqual(newTitle.getText(), "Auswählen", "in the language of the app");
		assert.strictEqual(newCancel.getText(), "Abbrechen");
		popoverOf(select).close();
		await closed(select);
	});
});

QUnit.module("ComboBox", {
	afterEach: cleanUp,
});

function field(comboBox: ComboBox): HTMLInputElement {
	return comboBox.getDomRef("inner") as HTMLInputElement;
}

QUnit.test("a key puts the text of its item into the field", (assert) => {
	const comboBox = place(new ComboBox({ items: fruits(), selectedKey: "cherry" }));

	assert.strictEqual(comboBox.getValue(), "Cherry", "also when the key came before the items");
	assert.strictEqual(field(comboBox).value, "Cherry");

	comboBox.setSelectedKey("banana");

	assert.strictEqual(field(comboBox).value, "Banana", "without a rendering");
	assert.strictEqual(comboBox.getFocusDomRef(), field(comboBox));
	assert.strictEqual(comboBox.getIdForLabel(), field(comboBox).id);
});

QUnit.test("the item of a value is found whatever its case", (assert) => {
	const comboBox = place(new ComboBox({ items: fruits(), value: "bANANA" }));

	assert.strictEqual(comboBox.getSelectedItem()?.getKey(), "banana");

	comboBox.setValue("Banan");
	assert.strictEqual(comboBox.getSelectedItem(), null, "free text has no item");
});

QUnit.test("typing opens the list with the matching items", async (assert) => {
	const comboBox = place(new ComboBox({ items: fruits() }));

	type(field(comboBox), "an");
	await opened(comboBox);

	assert.deepEqual(texts(comboBox), ["Banana"], "matched anywhere, whatever the case");

	type(field(comboBox), "xyz");
	const list = popoverOf(comboBox).getContent()[0] as VBox;
	assert.strictEqual(
		(list.getItems()[0] as Text).getText(),
		"No matching entry",
		"and says so when nothing matches",
	);

	type(field(comboBox), "cherry");
	assert.deepEqual(texts(comboBox), ["Apple", "Banana", "Cherry"], "an exact match shows them all");
	assert.strictEqual(comboBox.getSelectedKey(), "cherry", "and selects its item");
});

QUnit.test("picking a row takes its item over and reports it", async (assert) => {
	const comboBox = place(new ComboBox({ items: fruits() }));
	const log = new EventLog().listen(comboBox, "selectionChange", "change");

	tap(comboBox.getDomRef("arrow") as HTMLElement);
	await opened(comboBox);
	rows(comboBox)[1].firePress();
	await closed(comboBox);

	assert.strictEqual(comboBox.getValue(), "Banana");
	assert.strictEqual(comboBox.getSelectedKey(), "banana");
	assert.deepEqual(log.names(), ["selectionChange", "change"]);
	assert.strictEqual(log.last("change")?.selectedKey, "banana");

	tap(comboBox.getDomRef("arrow") as HTMLElement);
	await opened(comboBox);
	rows(comboBox)[1].firePress();
	await closed(comboBox);

	assert.deepEqual(
		log.names(),
		["selectionChange", "change", "selectionChange"],
		"picking it again is a selection, but no change",
	);
});

QUnit.test("Enter commits what was typed once, the change of the browser after it is not reported again", async (assert) => {
	const comboBox = place(new ComboBox({ items: fruits() }));
	const log = new EventLog().listen(comboBox, "change");

	type(field(comboBox), "Kiwi");
	await opened(comboBox);
	keydown(field(comboBox), "Enter");
	commit(field(comboBox));
	await closed(comboBox);

	assert.strictEqual(log.count("change"), 1);
	assert.deepEqual(log.last("change"), {
		value: "Kiwi",
		selectedKey: "",
		selectedItem: undefined,
	});
});

QUnit.test("the change of the browser names the item of the value", (assert) => {
	const comboBox = place(new ComboBox({ items: fruits() }));
	const log = new EventLog().listen(comboBox, "change");

	type(field(comboBox), "apple");
	commit(field(comboBox));

	assert.strictEqual(log.last("change")?.selectedKey, "apple");
	assert.strictEqual(comboBox.getSelectedKey(), "apple");
});

QUnit.test("the arrow opens and closes the whole list", async (assert) => {
	const comboBox = place(new ComboBox({ items: fruits(), value: "Apple" }));
	const arrow = comboBox.getDomRef("arrow") as HTMLElement;

	tap(arrow);
	await opened(comboBox);
	assert.deepEqual(texts(comboBox), ["Apple", "Banana", "Cherry"]);
	assert.strictEqual(comboBox.getDomRef()?.getAttribute("aria-expanded"), "true");

	comboBox.setValueState(ValueState.Error);
	render();
	assert.strictEqual(
		comboBox.getDomRef()?.getAttribute("aria-expanded"),
		"true",
		"a rendering while it is open keeps the state",
	);

	tap(arrow);
	await closed(comboBox);
	assert.strictEqual(comboBox.getDomRef()?.getAttribute("aria-expanded"), "false");
});

QUnit.test("a tap into the text leaves the list closed", async (assert) => {
	const comboBox = place(new ComboBox({ items: fruits() }));

	tap(field(comboBox));
	await new Promise((resolve) => setTimeout(resolve, 300));

	assert.notOk(popoverOf(comboBox)?.isOpen());
});

QUnit.test("the second value of an item stands at the end of its row", async (assert) => {
	const comboBox = place(
		new ComboBox({
			showSecondaryValues: true,
			items: [
				new ListItem({ key: "de", text: "Germany", additionalText: "DE" }),
				new Item({ key: "fr", text: "France" }),
			],
		}),
	);

	tap(comboBox.getDomRef("arrow") as HTMLElement);
	await opened(comboBox);
	const [germany, france] = rows(comboBox);

	assert.ok(germany.hasStyleClass("sizedPickerItemSecondary"));
	assert.strictEqual(
		(germany.getDomRef() as HTMLElement).style.getPropertyValue("--sized-picker-secondary-text"),
		'"DE"',
	);
	assert.notOk(france.hasStyleClass("sizedPickerItemSecondary"), "a plain item has none");
});

QUnit.test("on a phone the list brings a field to type in, and reports the change when it closes", async (assert) => {
	await onPhone(async () => {
		const comboBox = place(new ComboBox({ items: fruits() }));
		const log = new EventLog().listen(comboBox, "change");

		tap(comboBox.getDomRef("arrow") as HTMLElement);
		await opened(comboBox);

		const popover = popoverOf(comboBox);
		const header = popover.getCustomHeader() as Toolbar;
		const filter = popover.getSubHeader() as Toolbar;
		const input = filter.getContent()[0] as Input;
		const ok = header.getContent()[2] as Button;

		assert.strictEqual(ok.getText(), "OK");

		input.fireLiveChange({ value: "ch" });
		assert.deepEqual(texts(comboBox), ["Cherry"], "what is typed there filters the list");
		assert.strictEqual(log.count("change"), 0, "and is no change yet");

		ok.firePress();
		await closed(comboBox);

		assert.strictEqual(log.count("change"), 1, "closing reports it");
		assert.strictEqual(comboBox.getValue(), "ch");

		tap(comboBox.getDomRef("arrow") as HTMLElement);
		await opened(comboBox);

		assert.ok(header.isDestroyed() && filter.isDestroyed(), "the bars of the last opening are gone");
		popover.close();
		await closed(comboBox);
		assert.strictEqual(log.count("change"), 1, "an unchanged value is not reported again");
	});
});
