import type Popover from "sap/m/Popover";
import { InputType } from "sap/m/library";
import type Button from "ui5/touch/controls/Button";
import Input, { type $InputSettings } from "ui5/touch/controls/Input";
import type KeyboardBase from "ui5/touch/controls/KeyboardBase";
import NumberPad from "ui5/touch/controls/NumberPad";
import { cleanUp, commit, EventLog, keydown, place, render, type, waitFor } from "./helpers";

function inner(input: Input): HTMLInputElement {
	return input.getDomRef("inner") as HTMLInputElement;
}

function popoverOf(input: Input): Popover | null {
	return input.getAggregation("_popover") as Popover | null;
}

/** the key of a keyboard that says the given text */
function key(keyboard: KeyboardBase, text: string): Button {
	const found = (keyboard.getAggregation("_buttons") as Button[]).find(
		(button) => button.getText() === text,
	);

	if (!found) {
		throw new Error(`no key ${text}`);
	}

	return found;
}

/** the Enter key of a keyboard, which shows an icon rather than a text */
function enterKey(keyboard: KeyboardBase): Button {
	return (keyboard.getAggregation("_buttons") as Button[]).find(
		(button) => button.getIcon() === "sap-icon://touch/enter",
	) as Button;
}

/** a field with a number pad that opens while it has the focus */
function withNumberPad(settings: $InputSettings = {}): Input {
	return place(
		new Input({
			showKeyboard: true,
			keyboard: new NumberPad(),
			...settings,
		}),
	);
}

QUnit.module("Input", {
	afterEach: cleanUp,
});

QUnit.test("renders a native input with what it was given", (assert) => {
	const input = place(
		new Input({
			value: "42",
			placeholder: "Quantity",
			maxLength: 5,
			type: InputType.Number,
		}),
	);
	const field = inner(input);

	assert.strictEqual(field.value, "42");
	assert.strictEqual(field.placeholder, "Quantity");
	assert.strictEqual(field.maxLength, 5);
	assert.strictEqual(field.type, "number");
	assert.strictEqual(input.getFocusDomRef(), field, "the native input gets the focus");
	assert.strictEqual(input.getIdForLabel(), field.id, "and a label points at it");
});

QUnit.test("a disabled or read-only field says so", (assert) => {
	assert.ok(inner(place(new Input({ enabled: false }))).disabled);
	assert.ok(inner(place(new Input({ editable: false }))).readOnly);
});

QUnit.test("typing fires liveChange and keeps the value in step", (assert) => {
	const input = place(new Input());
	const log = new EventLog().listen(input, "liveChange", "change");

	type(inner(input), "abc");

	assert.strictEqual(input.getValue(), "abc");
	assert.deepEqual(log.names(), ["liveChange"]);
	assert.deepEqual(log.last("liveChange"), { value: "abc" });
});

QUnit.test("a value set after the user typed is what the field shows", (assert) => {
	const input = place(new Input());

	type(inner(input), "abc");
	input.setValue("");
	render();

	assert.strictEqual(inner(input).value, "", "the field was cleared");

	type(inner(input), "def");
	input.setValue("xyz");
	render();

	assert.strictEqual(inner(input).value, "xyz");
});

QUnit.test("setValue does not render the field again", (assert) => {
	const input = place(new Input());
	const field = inner(input);

	field.focus();
	input.setValue("new");

	assert.strictEqual(inner(input), field, "the very same element");
	assert.strictEqual(field.value, "new");
});

QUnit.test("the browser's change is reported once", (assert) => {
	const input = place(new Input());
	const log = new EventLog().listen(input, "change");

	type(inner(input), "abc");
	commit(inner(input));
	commit(inner(input));

	assert.strictEqual(log.count("change"), 1);
	assert.deepEqual(log.last("change"), { value: "abc" });
});

QUnit.test("Enter fires change and then submit, and the change of the browser after it is not reported again", (assert) => {
	const input = place(new Input());
	const log = new EventLog().listen(input, "change", "submit");

	type(inner(input), "abc");
	keydown(inner(input), "Enter");
	commit(inner(input));

	assert.deepEqual(log.names(), ["change", "submit"]);
});

QUnit.test("Enter on an unchanged value only submits", (assert) => {
	const input = place(new Input({ value: "abc" }));
	const log = new EventLog().listen(input, "change", "submit");

	keydown(inner(input), "Enter");

	assert.deepEqual(log.names(), ["submit"]);
});

QUnit.test("a value set from the outside is no change of the user", (assert) => {
	const input = place(new Input());
	const log = new EventLog().listen(input, "change");

	input.setValue("from the model");
	commit(inner(input));

	assert.strictEqual(log.count("change"), 0);
});

QUnit.test("without showKeyboard the focus opens no keyboard", async (assert) => {
	const input = place(new Input({ keyboard: new NumberPad() }));

	inner(input).focus();
	await waitFor(() => document.activeElement === inner(input));

	assert.notOk(popoverOf(input)?.isOpen(), "no popover is open");
});

QUnit.test("the keyboard opens with the focus and types into the field", async (assert) => {
	const input = withNumberPad({ value: "1", maxLength: 3 });
	const keyboard = input.getKeyboard();
	const log = new EventLog().listen(input, "liveChange", "change", "submit");

	inner(input).focus();
	await waitFor(() => Boolean(popoverOf(input)?.isOpen()), "the keyboard did not open");

	assert.strictEqual(keyboard.getValue(), "1", "the keyboard starts from the value of the field");
	assert.strictEqual(keyboard.getMaxLength(), 3, "and keeps to its limit");

	key(keyboard, "2").firePress();
	key(keyboard, "3").firePress();
	key(keyboard, "4").firePress();

	assert.strictEqual(input.getValue(), "123", "the limit holds");
	assert.strictEqual(inner(input).value, "123", "and the field shows it");
	assert.deepEqual(log.names(), ["liveChange", "liveChange"]);

	enterKey(keyboard).firePress();

	assert.deepEqual(log.names().slice(2), ["change", "submit"], "Enter commits and submits");
	assert.ok(popoverOf(input)?.isOpen(), "the keyboard stays open while the field has the focus");
});

QUnit.test("leaving for another field closes the keyboard, commits once and leaves the focus there", async (assert) => {
	const input = withNumberPad();
	const other = place(new Input());
	const log = new EventLog().listen(input, "change");

	inner(input).focus();
	await waitFor(() => Boolean(popoverOf(input)?.isOpen()), "the keyboard did not open");
	key(input.getKeyboard(), "7").firePress();

	inner(other).focus();
	await waitFor(() => !popoverOf(input)?.isOpen(), "the keyboard did not close");

	assert.strictEqual(document.activeElement, inner(other), "the focus was not pulled back");
	assert.strictEqual(log.count("change"), 1, "what the keyboard typed is committed");
	assert.deepEqual(log.last("change"), { value: "7" });
});

QUnit.test("a keyboard that is switched off while open closes", async (assert) => {
	const input = withNumberPad();

	inner(input).focus();
	await waitFor(() => Boolean(popoverOf(input)?.isOpen()), "the keyboard did not open");

	input.setShowKeyboard(false);
	render();

	await waitFor(() => !popoverOf(input)?.isOpen(), "the keyboard stayed open");
	assert.ok(true, "closed");
});

QUnit.test("a keyboard taken out of the field no longer types into it", async (assert) => {
	const input = withNumberPad();
	const keyboard = input.getKeyboard();

	inner(input).focus();
	await waitFor(() => Boolean(popoverOf(input)?.isOpen()), "the keyboard did not open");

	input.setKeyboard(new NumberPad());
	key(keyboard, "5").firePress();

	assert.strictEqual(input.getValue(), "");
	keyboard.destroy();
});
