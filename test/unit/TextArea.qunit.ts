import type Popover from "sap/m/Popover";
import type Button from "ui5/touch/controls/Button";
import Input from "ui5/touch/controls/Input";
import Keyboard from "ui5/touch/controls/Keyboard";
import type KeyboardBase from "ui5/touch/controls/KeyboardBase";
import TextArea from "ui5/touch/controls/TextArea";
import { NumberKeys } from "ui5/touch/controls/library";
import { cleanUp, commit, EventLog, place, render, type, waitFor } from "./helpers";

function inner(textArea: TextArea): HTMLTextAreaElement {
	return textArea.getDomRef("inner") as HTMLTextAreaElement;
}

function popoverOf(textArea: TextArea): Popover | null {
	return textArea.getAggregation("_popover") as Popover | null;
}

function keys(keyboard: KeyboardBase): Button[] {
	return keyboard.getAggregation("_buttons") as Button[];
}

function key(keyboard: KeyboardBase, text: string): Button {
	return keys(keyboard).find((button) => button.getText() === text) as Button;
}

function enterKey(keyboard: KeyboardBase): Button {
	return keys(keyboard).find((button) => button.getIcon() === "sap-icon://touch/enter") as Button;
}

/** a text area with a keyboard of letters that opens with the focus */
async function withKeyboard(maxLength = 0): Promise<TextArea> {
	const textArea = place(
		new TextArea({
			showKeyboard: true,
			maxLength: maxLength,
			keyboard: new Keyboard({ displayNumbers: NumberKeys.Never }),
		}),
	);

	inner(textArea).focus();
	await waitFor(() => Boolean(popoverOf(textArea)?.isOpen()), "the keyboard did not open");

	return textArea;
}

QUnit.module("TextArea", {
	afterEach: cleanUp,
});

QUnit.test("renders a native textarea with what it was given", (assert) => {
	const textArea = place(
		new TextArea({ value: "line", rows: 4, maxLength: 10, placeholder: "Note" }),
	);
	const field = inner(textArea);

	assert.strictEqual(field.value, "line");
	assert.strictEqual(field.rows, 4);
	assert.strictEqual(field.maxLength, 10);
	assert.strictEqual(field.placeholder, "Note");
	assert.strictEqual(textArea.getFocusDomRef(), field);
	assert.strictEqual(textArea.getIdForLabel(), field.id);
});

QUnit.test("a value set after the user typed is what the field shows", (assert) => {
	const textArea = place(new TextArea());

	type(inner(textArea), "typed");
	textArea.setValue("from the app");
	render();

	assert.strictEqual(inner(textArea).value, "from the app");

	type(inner(textArea), "again");
	textArea.setValue("");
	render();

	assert.strictEqual(inner(textArea).value, "");
});

QUnit.test("a rendering after typing keeps what is typed", (assert) => {
	const textArea = place(new TextArea());

	type(inner(textArea), "typed");
	textArea.setRows(5);
	render();

	assert.strictEqual(inner(textArea).value, "typed");
});

QUnit.test("typing fires liveChange, the browser's change is reported once", (assert) => {
	const textArea = place(new TextArea());
	const log = new EventLog().listen(textArea, "liveChange", "change");

	type(inner(textArea), "abc");
	commit(inner(textArea));
	commit(inner(textArea));

	assert.deepEqual(log.names(), ["liveChange", "change"]);
	assert.deepEqual(log.last("change"), { value: "abc" });
});

QUnit.test("Enter of the keyboard is a line break", async (assert) => {
	const textArea = await withKeyboard();
	const keyboard = textArea.getKeyboard();
	const log = new EventLog().listen(textArea, "liveChange");

	key(keyboard, "a").firePress();
	enterKey(keyboard).firePress();
	key(keyboard, "b").firePress();

	assert.strictEqual(textArea.getValue(), "a\nb");
	assert.strictEqual(inner(textArea).value, "a\nb", "the field shows it");
	assert.strictEqual(keyboard.getValue(), "a\nb", "the keyboard goes on from there");
	assert.strictEqual(log.count("liveChange"), 3);
});

QUnit.test("the line break keeps to the limit of the field", async (assert) => {
	const textArea = await withKeyboard(2);
	const keyboard = textArea.getKeyboard();

	key(keyboard, "a").firePress();
	key(keyboard, "b").firePress();
	enterKey(keyboard).firePress();

	assert.strictEqual(textArea.getValue(), "ab");
});

QUnit.test("leaving the field commits what the keyboard typed, once, and leaves the focus where it went", async (assert) => {
	const textArea = await withKeyboard();
	const other = place(new Input());
	const log = new EventLog().listen(textArea, "change");

	key(textArea.getKeyboard(), "q").firePress();
	(other.getDomRef("inner") as HTMLInputElement).focus();
	await waitFor(() => !popoverOf(textArea)?.isOpen(), "the keyboard did not close");

	assert.strictEqual(document.activeElement, other.getDomRef("inner"));
	assert.strictEqual(log.count("change"), 1);
	assert.deepEqual(log.last("change"), { value: "q" });
});
