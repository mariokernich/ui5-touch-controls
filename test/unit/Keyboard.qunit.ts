import { ButtonType } from "sap/m/library";
import type Button from "ui5/touch/controls/Button";
import CustomKeyboard from "ui5/touch/controls/CustomKeyboard";
import Keyboard from "ui5/touch/controls/Keyboard";
import type KeyboardBase from "ui5/touch/controls/KeyboardBase";
import KeyboardKey from "ui5/touch/controls/KeyboardKey";
import KeyboardLayout from "ui5/touch/controls/KeyboardLayout";
import NumberPad from "ui5/touch/controls/NumberPad";
import {
	KeyboardMode,
	LetterCase,
	NumberKeys,
	SizeMode,
} from "ui5/touch/controls/library";
import { cleanUp, EventLog, keydown, place, render, setLanguage } from "./helpers";

function keys(keyboard: KeyboardBase): Button[] {
	return keyboard.getAggregation("_buttons") as Button[];
}

/** what the keys say, row by row - an icon key says its icon */
function faces(keyboard: KeyboardBase): string[][] {
	const all = keys(keyboard);

	return [...(keyboard.getDomRef()?.querySelectorAll(".touchKeyboardRow") ?? [])].map((row) =>
		[...row.children].map((child) => {
			const button = all.find((candidate) => candidate.getId() === child.id) as Button;
			return button.getText() || button.getIcon();
		}),
	);
}

/** the key that says the given text, or shows the given icon */
function key(keyboard: KeyboardBase, face: string): Button {
	const found = keys(keyboard).find(
		(button) => button.getText() === face || button.getIcon() === face,
	);

	if (!found) {
		throw new Error(`no key ${face}`);
	}

	return found;
}

const BACKSPACE = "sap-icon://touch/backspace";
const ENTER = "sap-icon://touch/enter";

/** a keyboard with the keys it is handed, one row per entry */
function custom(layout: string[], settings: Record<string, unknown> = {}): CustomKeyboard {
	return place(new CustomKeyboard({ layout: layout, ...settings }));
}

QUnit.module("Keyboard: keys", {
	afterEach: cleanUp,
});

QUnit.test("the keys write their letters, backspace takes the last one away", (assert) => {
	const keyboard = custom(["a b", "{bksp} {space} {enter}"]);
	const log = new EventLog().listen(keyboard, "change", "keyPress");

	key(keyboard, "a").firePress();
	key(keyboard, "b").firePress();
	key(keyboard, "Space").firePress();
	key(keyboard, "a").firePress();
	key(keyboard, BACKSPACE).firePress();

	assert.strictEqual(keyboard.getValue(), "ab ");
	assert.deepEqual(
		log.entries.filter((entry) => entry.name === "keyPress").map((entry) => entry.parameters.key),
		["a", "b", "{space}", "a", "{bksp}"],
	);
	assert.deepEqual(log.last("change"), { value: "ab " });
});

QUnit.test("backspace takes a face away as one character", (assert) => {
	const keyboard = custom(["🙂 a", "{bksp}"]);

	key(keyboard, "a").firePress();
	key(keyboard, "🙂").firePress();
	key(keyboard, BACKSPACE).firePress();

	assert.strictEqual(keyboard.getValue(), "a");
});

QUnit.test("Enter and Escape are reported and leave the value alone", (assert) => {
	const keyboard = custom(["a {esc} {enter}"], { value: "x" });
	const log = new EventLog().listen(keyboard, "enter", "escape", "change");

	key(keyboard, ENTER).firePress();
	key(keyboard, "esc").firePress();

	assert.deepEqual(log.names(), ["enter", "escape"]);
	assert.deepEqual(log.last("enter"), { value: "x" });
	assert.strictEqual(keyboard.getValue(), "x");
});

QUnit.test("the value keeps to maxLength", (assert) => {
	const keyboard = custom(["a"], { maxLength: 2 });

	for (let i = 0; i < 5; i++) {
		key(keyboard, "a").firePress();
	}

	assert.strictEqual(keyboard.getValue(), "aa");
});

QUnit.test("a disabled keyboard writes nothing", (assert) => {
	const keyboard = custom(["a"], { enabled: false });

	key(keyboard, "a").firePress();

	assert.strictEqual(keyboard.getValue(), "");
	assert.ok(keyboard.getDomRef()?.classList.contains("touchKeyboardDisabled"));
	assert.notOk(key(keyboard, "a").getEnabled(), "and its keys are disabled");
});

QUnit.test("shift writes one capital, the caps lock all of them", (assert) => {
	const keyboard = custom(["a b", "{shift} {lock}"]);
	const shift = key(keyboard, "⇧");
	const lock = key(keyboard, "⇪");

	shift.firePress();
	assert.strictEqual(key(keyboard, "A").getText(), "A", "the keys show capitals");
	assert.strictEqual(shift.getType(), ButtonType.Emphasized, "shift shows that it is on");
	key(keyboard, "A").firePress();
	key(keyboard, "a").firePress();

	lock.firePress();
	key(keyboard, "A").firePress();
	key(keyboard, "B").firePress();

	shift.firePress();
	key(keyboard, "a").firePress();

	assert.strictEqual(keyboard.getValue(), "AaABa", "shift while the lock is on writes lower case");
	assert.strictEqual(lock.getType(), ButtonType.Emphasized, "the lock stays on");
});

QUnit.test("the other spellings of a key mean the same key", (assert) => {
	const keyboard = custom(["a {backspace} {ent} {capslock}"]);
	const log = new EventLog().listen(keyboard, "enter");

	key(keyboard, "a").firePress();
	key(keyboard, "a").firePress();
	key(keyboard, BACKSPACE).firePress();
	key(keyboard, ENTER).firePress();
	key(keyboard, "⇪").firePress();
	key(keyboard, "A").firePress();

	assert.strictEqual(keyboard.getValue(), "aA");
	assert.strictEqual(log.count("enter"), 1);
});

QUnit.test("the display aggregation puts a text of its own on a key", (assert) => {
	const keyboard = place(
		new CustomKeyboard({
			layout: ["a {enter}"],
			display: [
				new KeyboardKey({ key: "a", text: "Alpha" }),
				new KeyboardKey({ key: "ent", text: "Go" }),
			],
		}),
	);

	assert.deepEqual(faces(keyboard), [["Alpha", "Go"]]);

	key(keyboard, "Alpha").firePress();
	assert.strictEqual(keyboard.getValue(), "a", "the key still writes what it is");

	(keyboard.getDisplay()[1]).setText("Send");
	render();
	assert.deepEqual(faces(keyboard), [["Alpha", "Send"]], "a changed text is shown");
});

QUnit.test("emphasizedKeys marks the keys it names, also when it changes later", (assert) => {
	const keyboard = custom(["a {bksp} {enter}"], { emphasizedKeys: ["enter"] });

	assert.strictEqual(key(keyboard, ENTER).getType(), ButtonType.Emphasized);
	assert.strictEqual(key(keyboard, BACKSPACE).getType(), ButtonType.Default);

	keyboard.setEmphasizedKeys(["{bksp}"]);
	render();

	assert.strictEqual(key(keyboard, ENTER).getType(), ButtonType.Default);
	assert.strictEqual(key(keyboard, BACKSPACE).getType(), ButtonType.Emphasized);
});

QUnit.test("the size and the width reach the keys", (assert) => {
	const keyboard = custom(["a"], { size: SizeMode.XL, width: "20rem", docked: true });

	assert.strictEqual(key(keyboard, "a").getSize(), SizeMode.XL);
	assert.strictEqual((keyboard.getDomRef() as HTMLElement).style.width, "20rem");
	assert.ok(keyboard.getDomRef()?.classList.contains("touchKeyboardDocked"));
});

QUnit.test("the space bar says what the library calls it in the language of the app", (assert) => {
	const keyboard = custom(["{space}"]);

	assert.strictEqual(keys(keyboard)[0].getText(), "Space");

	setLanguage("de");
	render();

	assert.strictEqual(keys(keyboard)[0].getText(), "Leerzeichen");
});

QUnit.module("Keyboard: sets", {
	afterEach: cleanUp,
});

QUnit.test("a key named after a set switches to it, {abc} leads back", (assert) => {
	const keyboard = place(
		new CustomKeyboard({
			layouts: [
				new KeyboardLayout({ name: "default", rows: ["a b {numbers}"] }),
				new KeyboardLayout({ name: "numbers", rows: ["1 2 {abc}"] }),
			],
		}),
	);

	assert.deepEqual(faces(keyboard), [["a", "b", "123"]], "the names of the sets are keys");

	key(keyboard, "a").firePress();
	key(keyboard, "123").firePress();
	render();

	assert.deepEqual(faces(keyboard), [["1", "2", "ABC"]]);

	key(keyboard, "1").firePress();
	key(keyboard, "ABC").firePress();
	render();

	assert.deepEqual(faces(keyboard), [["a", "b", "123"]]);
	assert.strictEqual(keyboard.getValue(), "a1", "the value carries on across a switch");
});

QUnit.test("a key that names the set it is on leads back out of it", (assert) => {
	const keyboard = place(
		new CustomKeyboard({
			layouts: [
				new KeyboardLayout({ name: "default", rows: ["a {shift}"] }),
				new KeyboardLayout({ name: "shift", rows: ["A {shift}"] }),
			],
		}),
	);

	key(keyboard, "⇧").firePress();
	render();
	assert.deepEqual(faces(keyboard), [["A", "⇧"]]);

	key(keyboard, "⇧").firePress();
	render();
	assert.deepEqual(faces(keyboard), [["a", "⇧"]]);
});

QUnit.test("sets take precedence over the layout property", (assert) => {
	const keyboard = place(
		new CustomKeyboard({
			layout: ["x"],
			layouts: [new KeyboardLayout({ name: "first", rows: ["y"] })],
		}),
	);

	assert.deepEqual(faces(keyboard), [["y"]], "without a default the first set is shown");
});

QUnit.module("Keyboard: hardware keys", {
	afterEach: cleanUp,
});

QUnit.test("a real keyboard types the keys of the layout, and nothing else", (assert) => {
	const keyboard = custom(["a b", "{bksp} {space} {enter}"], { hardwareKeys: true });
	const log = new EventLog().listen(keyboard, "enter");
	const dom = keyboard.getDomRef() as HTMLElement;

	assert.strictEqual(dom.getAttribute("tabindex"), "0", "it can take the focus");

	keydown(dom, "a");
	keydown(dom, "z");
	keydown(dom, " ");
	keydown(dom, "b");
	keydown(dom, "Backspace");
	keydown(dom, "Enter");

	assert.strictEqual(keyboard.getValue(), "a ");
	assert.strictEqual(log.count("enter"), 1);
});

QUnit.test("Escape of a real keyboard is reported", (assert) => {
	const keyboard = custom(["a"], { hardwareKeys: true });
	const log = new EventLog().listen(keyboard, "escape");

	keydown(keyboard.getDomRef() as HTMLElement, "Escape");

	assert.strictEqual(log.count("escape"), 1);
});

QUnit.test("without hardwareKeys a real keyboard is not listened to", (assert) => {
	const keyboard = custom(["a"]);

	keydown(keyboard.getDomRef() as HTMLElement, "a");

	assert.strictEqual(keyboard.getValue(), "");
	assert.strictEqual(keyboard.getDomRef()?.getAttribute("tabindex"), null);
});

QUnit.test("shortcuts are left to the browser", (assert) => {
	const keyboard = custom(["a"], { hardwareKeys: true });

	keydown(keyboard.getDomRef() as HTMLElement, "a", { ctrlKey: true });

	assert.strictEqual(keyboard.getValue(), "");
});

QUnit.test("the case of a real keyboard decides, unless the keyboard writes one case only", (assert) => {
	const mixed = place(new Keyboard({ hardwareKeys: true, displayNumbers: NumberKeys.Never }));
	const upper = place(
		new Keyboard({
			hardwareKeys: true,
			displayNumbers: NumberKeys.Never,
			letterCase: LetterCase.Upper,
		}),
	);

	for (const keyboard of [mixed, upper]) {
		keydown(keyboard.getDomRef() as HTMLElement, "a");
		keydown(keyboard.getDomRef() as HTMLElement, "B");
	}

	assert.strictEqual(mixed.getValue(), "aB");
	assert.strictEqual(upper.getValue(), "AB");
});

QUnit.module("Keyboard: Keyboard and NumberPad", {
	afterEach: cleanUp,
});

QUnit.test("a Keyboard shows the arrangement of its language", (assert) => {
	const keyboard = place(
		new Keyboard({ mode: KeyboardMode.German, displayNumbers: NumberKeys.Always }),
	);

	assert.deepEqual(faces(keyboard)[1], "q w e r t z u i o p ü".split(" "));

	keyboard.setMode(KeyboardMode.French);
	render();

	assert.deepEqual(faces(keyboard)[1], "a z e r t y u i o p".split(" "), "and follows a new one");
});

QUnit.test("a Turkish keyboard writes the Turkish capitals", (assert) => {
	const keyboard = place(
		new Keyboard({ mode: KeyboardMode.Turkish, displayNumbers: NumberKeys.Never }),
	);

	key(keyboard, "⇧").firePress();
	key(keyboard, "İ").firePress();
	key(keyboard, "⇧").firePress();
	key(keyboard, "I").firePress();

	assert.strictEqual(keyboard.getValue(), "İI");
});

QUnit.test("enterText names the Enter key", (assert) => {
	const keyboard = place(new NumberPad({ enterText: "Go" }));

	assert.ok(keys(keyboard).some((button) => button.getText() === "Go"));

	keyboard.setEnterText("");
	render();

	assert.ok(keys(keyboard).some((button) => button.getIcon() === ENTER), "empty is the arrow again");
});

QUnit.test("the decimal key of a NumberPad follows the language", (assert) => {
	const keyboard = place(new NumberPad({ showDecimalSeparator: true }));

	assert.ok(keys(keyboard).some((button) => button.getText() === "."), "a point in English");

	keyboard.setDecimalSeparator(",");
	render();

	assert.ok(keys(keyboard).some((button) => button.getText() === ","), "the one that was asked for");
});
