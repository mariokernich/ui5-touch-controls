import Keyboard from "ui5/touch/controls/Keyboard";
import NumberPad from "ui5/touch/controls/NumberPad";
import {
	buildKeyboardSets,
	buildNumberPadSets,
	caseLocaleForMode,
	KeyboardOptions,
	NumberPadOptions,
} from "ui5/touch/controls/keyboardLayouts";
import { KeyboardMode, LetterCase, NumberKeys, NumberPadMode } from "ui5/touch/controls/library";

/** the options of a plain English keyboard, to be changed one at a time */
function keyboard(options: Partial<KeyboardOptions> = {}): KeyboardOptions {
	return {
		mode: KeyboardMode.English,
		numbers: NumberKeys.Always,
		specialCharacters: false,
		emojis: false,
		capsLock: false,
		letterCase: LetterCase.Mixed,
		escape: false,
		extraKeys: [],
		...options,
	};
}

/** the options of a plain number pad, to be changed one at a time */
function pad(options: Partial<NumberPadOptions> = {}): NumberPadOptions {
	return {
		mode: NumberPadMode.Simple,
		specialCharacters: false,
		sign: false,
		decimalSeparator: "",
		escape: false,
		...options,
	};
}

/** the rows of the set of that name */
function rowsOf(sets: { name: string; rows: string[] }[], name: string): string[] | undefined {
	return sets.find((set) => set.name === name)?.rows;
}

QUnit.module("keyboardLayouts: buildKeyboardSets");

QUnit.test("an English keyboard with its digits in a row", (assert) => {
	const sets = buildKeyboardSets(keyboard());

	assert.deepEqual(
		sets.map((set) => set.name),
		["default"],
		"one set, nothing to switch to",
	);
	assert.deepEqual(sets[0].rows, [
		"1 2 3 4 5 6 7 8 9 0",
		"q w e r t y u i o p",
		"a s d f g h j k l",
		"{shift} z x c v b n m {bksp}",
		"{space} {enter}",
	]);
});

QUnit.test("digits behind a key of their own, the way a phone has them", (assert) => {
	const sets = buildKeyboardSets(keyboard({ numbers: NumberKeys.Toggle }));

	assert.deepEqual(rowsOf(sets, "default"), [
		"q w e r t y u i o p",
		"a s d f g h j k l",
		"{shift} z x c v b n m {bksp}",
		"{numbers} {space} {enter}",
	]);
	assert.deepEqual(rowsOf(sets, "numbers"), [
		"1 2 3 4 5 6 7 8 9 0",
		"- / : ; ( ) & @ \"",
		". , ? ! ' {bksp}",
		"{abc} {space} {enter}",
	]);
});

QUnit.test("no digits at all", (assert) => {
	const sets = buildKeyboardSets(keyboard({ numbers: NumberKeys.Never }));

	assert.strictEqual(sets.length, 1);
	assert.notOk(sets[0].rows.join(" ").includes("1"), "no digit anywhere");
	assert.notOk(sets[0].rows.join(" ").includes("{numbers}"), "and no way to them");
});

QUnit.test("the special characters sit behind the digits on a phone", (assert) => {
	const sets = buildKeyboardSets(
		keyboard({ numbers: NumberKeys.Toggle, specialCharacters: true }),
	);

	assert.deepEqual(rowsOf(sets, "numbers")?.[2], "{symbols} . , ? ! ' {bksp}");
	assert.deepEqual(rowsOf(sets, "symbols"), [
		"[ ] { } # % ^ * + =",
		"@ _ \\ | ~ < > € £ ¥",
		"{numbers} . , ? ! ' {bksp}",
		"{abc} {space} {enter}",
	]);
	assert.notOk(
		rowsOf(sets, "default")?.join(" ").includes("{symbols}"),
		"the letters lead to the digits, not past them",
	);
});

QUnit.test("the special characters have a key of their own beside a row of digits", (assert) => {
	const sets = buildKeyboardSets(keyboard({ specialCharacters: true }));

	assert.strictEqual(rowsOf(sets, "default")?.[4], "{symbols} {space} {enter}");
	assert.strictEqual(rowsOf(sets, "symbols")?.[2], ". , ? ! ' {bksp}");
});

QUnit.test("a caps lock beside the shift key", (assert) => {
	const rows = buildKeyboardSets(keyboard({ capsLock: true }))[0].rows;

	assert.strictEqual(rows[2], "{lock} a s d f g h j k l");
});

QUnit.test("a keyboard pinned to capitals has neither shift nor caps lock", (assert) => {
	const rows = buildKeyboardSets(
		keyboard({ letterCase: LetterCase.Upper, capsLock: true }),
	)[0].rows;

	assert.deepEqual(rows.slice(1, 4), [
		"Q W E R T Y U I O P",
		"A S D F G H J K L",
		"Z X C V B N M {bksp}",
	]);
});

QUnit.test("a keyboard pinned to lower case", (assert) => {
	const rows = buildKeyboardSets(
		keyboard({ mode: KeyboardMode.German, letterCase: LetterCase.Lower }),
	)[0].rows;

	assert.strictEqual(rows[1], "q w e r t z u i o p ü");
	assert.strictEqual(rows[3], "y x c v b n m {bksp}");
});

QUnit.test("Turkish capitals keep the dot of their i", (assert) => {
	const rows = buildKeyboardSets(
		keyboard({ mode: KeyboardMode.Turkish, letterCase: LetterCase.Upper }),
	)[0].rows;

	assert.strictEqual(rows[1], "Q W E R T Y U I O P Ğ Ü", "ı becomes I");
	assert.strictEqual(rows[2], "A S D F G H J K L Ş İ", "i becomes İ");
	assert.strictEqual(caseLocaleForMode(KeyboardMode.Turkish), "tr");
	assert.strictEqual(caseLocaleForMode(KeyboardMode.German), undefined);
});

QUnit.test("Devanagari has a second set of letters instead of capitals", (assert) => {
	const sets = buildKeyboardSets(
		keyboard({ mode: KeyboardMode.Hindi, letterCase: LetterCase.Upper, capsLock: true }),
	);

	assert.deepEqual(
		sets.map((set) => set.name),
		["default", "shift"],
	);
	assert.ok(rowsOf(sets, "default")?.[3].startsWith("{shift} "), "shift leads to the second set");
	assert.notOk(sets[0].rows.join(" ").includes("{lock}"), "no caps lock for a script without case");
	assert.strictEqual(rowsOf(sets, "default")?.[1], "ौ ै ा ी ू ब ह ग द ज ड", "letter case does not apply");
});

QUnit.test("the accented letters of Portuguese sit on a set of their own", (assert) => {
	const sets = buildKeyboardSets(keyboard({ mode: KeyboardMode.Portuguese }));

	assert.strictEqual(rowsOf(sets, "default")?.[4], "{accents} {space} {enter}");
	assert.deepEqual(rowsOf(sets, "accents"), [
		"á é í ó ú",
		"â ê ô ã õ",
		"{shift} à ò ü {bksp}",
		"{abc} {space} {enter}",
	]);
});

QUnit.test("the accented letters follow the case of the keyboard", (assert) => {
	const sets = buildKeyboardSets(
		keyboard({ mode: KeyboardMode.Italian, letterCase: LetterCase.Upper }),
	);

	assert.deepEqual(rowsOf(sets, "accents")?.slice(0, 2), ["Á É Í Ó Ú", "Â Ê Î Ô Û {bksp}"]);
});

QUnit.test("the faces sit on a set of their own", (assert) => {
	const sets = buildKeyboardSets(keyboard({ emojis: true }));
	const emojis = rowsOf(sets, "emojis") ?? [];

	assert.strictEqual(rowsOf(sets, "default")?.[4], "{emojis} {space} {enter}");
	assert.strictEqual(emojis.length, 5);
	assert.ok(emojis[3].endsWith(" {bksp}"));
	assert.strictEqual(emojis[4], "{abc} {space} {enter}");

	const faces = emojis
		.slice(0, 4)
		.join(" ")
		.split(" ")
		.filter((key) => !key.startsWith("{"));
	assert.ok(
		faces.every((face) => [...face].length === 1),
		"every face is a single character, which the backspace takes away as one",
	);
});

QUnit.test("the extra keys ride along on every set", (assert) => {
	const sets = buildKeyboardSets(
		keyboard({
			numbers: NumberKeys.Toggle,
			specialCharacters: true,
			emojis: true,
			extraKeys: ["@", "."],
		}),
	);

	for (const set of sets) {
		const last = set.rows[set.rows.length - 1];
		assert.ok(last.endsWith("@ . {space} {enter}"), `${set.name}: ${last}`);
	}
});

QUnit.test("the escape key is the first key of every set", (assert) => {
	const sets = buildKeyboardSets(
		keyboard({ numbers: NumberKeys.Toggle, specialCharacters: true, escape: true }),
	);

	for (const set of sets) {
		assert.ok(set.rows[0].startsWith("{esc} "), `${set.name}: ${set.rows[0]}`);
	}
});

QUnit.test("Keyboard.getLayoutForMode gives the first set with the digits in a row", (assert) => {
	assert.deepEqual(
		Keyboard.getLayoutForMode(KeyboardMode.English),
		buildKeyboardSets(keyboard())[0].rows,
	);
	assert.strictEqual(Keyboard.getLayoutForMode(KeyboardMode.French)[1], "a z e r t y u i o p");
});

QUnit.module("keyboardLayouts: buildNumberPadSets");

QUnit.test("the plain pad has the zero between backspace and enter", (assert) => {
	assert.deepEqual(buildNumberPadSets(pad()), [
		{ name: "numbers", rows: ["7 8 9", "4 5 6", "1 2 3", "{bksp} 0 {enter}"] },
	]);
});

QUnit.test("a decimal separator and a minus go into the row of the zero", (assert) => {
	assert.deepEqual(buildNumberPadSets(pad({ decimalSeparator: "," }))[0].rows, [
		"7 8 9",
		"4 5 6",
		"1 2 3",
		"0 ,",
		"{bksp} {enter}",
	]);
	assert.deepEqual(buildNumberPadSets(pad({ sign: true, decimalSeparator: "." }))[0].rows.slice(3), [
		"- 0 .",
		"{bksp} {enter}",
	]);
});

QUnit.test("the pad of a telephone and the one of a calculator", (assert) => {
	assert.deepEqual(buildNumberPadSets(pad({ mode: NumberPadMode.Phone }))[0].rows, [
		"1 2 3",
		"4 5 6",
		"7 8 9",
		"* 0 #",
		"{bksp} {enter}",
	]);
	assert.deepEqual(buildNumberPadSets(pad({ mode: NumberPadMode.Calculator }))[0].rows, [
		"7 8 9 ÷",
		"4 5 6 ×",
		"1 2 3 −",
		"0 . = +",
		"{bksp} {enter}",
	]);
	assert.deepEqual(
		buildNumberPadSets(pad({ mode: NumberPadMode.Phone, sign: true, decimalSeparator: "," }))[0]
			.rows,
		buildNumberPadSets(pad({ mode: NumberPadMode.Phone }))[0].rows,
		"sign and separator only apply to the plain pad",
	);
});

QUnit.test("the signs sit on a set of their own", (assert) => {
	const sets = buildNumberPadSets(pad({ specialCharacters: true }));

	assert.deepEqual(sets[0].rows[4], "{symbols}");
	assert.deepEqual(rowsOf(sets, "symbols"), [
		"! / #",
		"$ % ^",
		"& * @",
		"{numbers} ) +",
		"{bksp} {enter}",
	]);
});

QUnit.test("the escape key goes into the row of function keys", (assert) => {
	assert.deepEqual(buildNumberPadSets(pad({ escape: true }))[0].rows.slice(3), [
		"{bksp} 0 {enter}",
		"{esc}",
	]);
	assert.deepEqual(
		buildNumberPadSets(pad({ escape: true, specialCharacters: true }))[1].rows[4],
		"{esc} {bksp} {enter}",
	);
});

QUnit.test("NumberPad.getLayoutForMode gives the digit block with its defaults", (assert) => {
	assert.deepEqual(
		NumberPad.getLayoutForMode(NumberPadMode.Phone),
		buildNumberPadSets(pad({ mode: NumberPadMode.Phone }))[0].rows,
	);
});
