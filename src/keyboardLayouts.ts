import type { LayoutSet } from "./KeyboardBase";
import { KeyboardMode, LetterCase, NumberKeys, NumberPadMode } from "./library";

/**
 * The letters of a keyboard, in the arrangement of one country.
 *
 * Three rows, the way they sit on a keyboard of keys. A script without case -
 * Devanagari - has nothing to shift to and brings a second set of letters
 * instead, which is what <code>shiftRows</code> is: not capitals, but the
 * characters that sit on the shifted positions.
 */
interface Letters {
	rows: [string, string, string];
	shiftRows?: [string, string, string];
}

const LETTERS: Record<KeyboardMode, Letters> = {
	[KeyboardMode.English]: {
		rows: ["q w e r t y u i o p", "a s d f g h j k l", "z x c v b n m"],
	},
	[KeyboardMode.German]: {
		rows: ["q w e r t z u i o p ü", "a s d f g h j k l ö ä", "y x c v b n m"],
	},
	[KeyboardMode.French]: {
		rows: ["a z e r t y u i o p", "q s d f g h j k l m", "w x c v b n"],
	},
	[KeyboardMode.Spanish]: {
		rows: ["q w e r t y u i o p", "a s d f g h j k l ñ", "z x c v b n m"],
	},
	[KeyboardMode.Ukrainian]: {
		rows: [
			"й ц у к е н г ш щ з х ї",
			"ф і в а п р о л д ж є",
			"я ч с м и т ь б ю",
		],
	},
	[KeyboardMode.Russian]: {
		rows: [
			"й ц у к е н г ш щ з х ъ",
			"ф ы в а п р о л д ж э",
			"я ч с м и т ь б ю",
		],
	},
	// Devanagari in the InScript arrangement, the Indian standard. The script
	// has more consonants than a keyboard has keys, so the rest sit on the
	// shifted positions - a set of its own here, since there is no case.
	[KeyboardMode.Hindi]: {
		rows: [
			"ौ ै ा ी ू ब ह ग द ज ड",
			"ो े ् ि ु प र क त च ट",
			"ॉ ं म न व ल स य",
		],
		shiftRows: [
			"औ ऐ आ ई ऊ भ ङ घ ध झ ढ",
			"ओ ए अ इ उ फ ऱ ख थ छ ठ",
			"ऑ ँ ण ऩ ळ श ष य़",
		],
	},
};

/** the digits over the letters, and the first row of the numbers set */
const DIGITS = "1 2 3 4 5 6 7 8 9 0";

/** what a keyboard of a phone puts on its second set, besides the digits */
const NUMBER_ROWS = ["- / : ; ( ) & @ \"", ". , ? ! '"];

/** and on the one behind that. The at sign is here because a keyboard that
    shows its digits in a row of their own has no other set to put it on */
const SYMBOL_ROWS = ["[ ] { } # % ^ * + =", "@ _ \\ | ~ < > € £ ¥", ". , ? ! '"];

/**
 * The faces a keyboard shows behind its emoji key.
 *
 * Every one of them is a single character - a face put together from several,
 * a family or a flag, would be taken apart again by the backspace.
 */
const EMOJI_ROWS = [
	"😀 😃 😄 😁 😆 😅 😂 🙂 😉 😊",
	"😍 😘 😛 🤔 😐 😴 😢 😭 😡 🤯",
	"👍 👎 👌 👋 🙏 💪 👏 🤝 🤞 🎉",
	"💖 🔥 ⭐ ✅ ❌ 🚨 💡 📌 🕐",
];

/** the rows of the digit block of a number pad, by the mode that picks it */
const PAD_ROWS: Record<NumberPadMode, string[]> = {
	[NumberPadMode.Simple]: ["7 8 9", "4 5 6", "1 2 3"],
	[NumberPadMode.Phone]: ["1 2 3", "4 5 6", "7 8 9", "* 0 #"],
	[NumberPadMode.Calculator]: ["7 8 9 ÷", "4 5 6 ×", "1 2 3 −", "0 . = +"],
};

/** the signs of a number pad, in the three columns of the pad */
const PAD_SYMBOL_ROWS = ["! / #", "$ % ^", "& * @"];

/**
 * Joins what is there and leaves out what is not, so a row can be written as
 * the keys it may have.
 */
function row(...keys: (string | false | undefined)[]): string {
	return keys.filter(Boolean).join(" ");
}

/** the letters of a set in the case the keyboard writes them in */
function inCase(rows: string[], letterCase: LetterCase): string[] {
	if (letterCase === LetterCase.Upper) {
		return rows.map((entry) => entry.toUpperCase());
	}
	if (letterCase === LetterCase.Lower) {
		return rows.map((entry) => entry.toLowerCase());
	}

	return rows;
}

/** what a {@link buildKeyboardSets} call has to be told */
export interface KeyboardOptions {
	mode: KeyboardMode;
	/** already resolved: <code>ToggleOnMobile</code> has been decided */
	numbers: NumberKeys.Never | NumberKeys.Always | NumberKeys.Toggle;
	specialCharacters: boolean;
	emojis: boolean;
	capsLock: boolean;
	letterCase: LetterCase;
	escape: boolean;
	/** keys that ride along beside the space bar, in every set */
	extraKeys: string[];
}

/**
 * The sets of a {@link ui5.touch.controls.Keyboard}.
 *
 * One set of letters, and behind it the digits and the special characters
 * where they were asked for. The letters carry the modifiers - <code>
 * {shift}</code> and, if it was asked for, <code>{lock}</code> - unless the
 * keyboard writes one case only, in which case there is nothing to switch and
 * the keys are left off.
 */
export function buildKeyboardSets(options: KeyboardOptions): LayoutSet[] {
	const letters = LETTERS[options.mode];
	// a script without case has a second set of letters rather than capitals,
	// so the case of this keyboard is not a question that arises there
	const hasLetterSets = Boolean(letters.shiftRows);
	const letterCase = hasLetterSets ? LetterCase.Mixed : options.letterCase;
	// a keyboard that writes one case only has nothing to switch, and one whose
	// script has no case switches sets rather than the case of a letter - the
	// shift key is there for that, a caps lock would do nothing
	const modifiers = !hasLetterSets && letterCase === LetterCase.Mixed;
	const toggle = options.numbers === NumberKeys.Toggle;

	// what stands beside the space bar, on every set: the way to the other sets
	// and the keys the application asked to have at hand
	const functionRow = row(
		toggle && "{numbers}",
		!toggle && options.specialCharacters && "{symbols}",
		options.emojis && "{emojis}",
		options.escape && "{esc}",
		...options.extraKeys,
		"{space}",
		"{enter}",
	);

	const lettersSet = (name: string, rows: string[]): LayoutSet => {
		const [first, home, last] = inCase(rows, letterCase);

		return {
			name: name,
			rows: [
				...(options.numbers === NumberKeys.Always ? [DIGITS] : []),
				first,
				row(modifiers && options.capsLock && "{lock}", home),
				row(
					(modifiers || hasLetterSets) && "{shift}",
					last,
					"{bksp}",
				),
				functionRow,
			],
		};
	};

	const sets: LayoutSet[] = [lettersSet("default", letters.rows)];

	if (letters.shiftRows) {
		sets.push(lettersSet("shift", letters.shiftRows));
	}

	if (toggle) {
		sets.push({
			name: "numbers",
			rows: [
				DIGITS,
				NUMBER_ROWS[0],
				row(options.specialCharacters && "{symbols}", NUMBER_ROWS[1], "{bksp}"),
				row(
					"{abc}",
					options.emojis && "{emojis}",
					options.escape && "{esc}",
					...options.extraKeys,
					"{space}",
					"{enter}",
				),
			],
		});
	}

	if (options.specialCharacters) {
		sets.push({
			name: "symbols",
			rows: [
				SYMBOL_ROWS[0],
				SYMBOL_ROWS[1],
				row(toggle && "{numbers}", SYMBOL_ROWS[2], "{bksp}"),
				row(
					"{abc}",
					options.emojis && "{emojis}",
					options.escape && "{esc}",
					...options.extraKeys,
					"{space}",
					"{enter}",
				),
			],
		});
	}

	if (options.emojis) {
		sets.push({
			name: "emojis",
			rows: [
				EMOJI_ROWS[0],
				EMOJI_ROWS[1],
				EMOJI_ROWS[2],
				row(EMOJI_ROWS[3], "{bksp}"),
				row(
					"{abc}",
					options.escape && "{esc}",
					...options.extraKeys,
					"{space}",
					"{enter}",
				),
			],
		});
	}

	return sets;
}

/** what a {@link buildNumberPadSets} call has to be told */
export interface NumberPadOptions {
	mode: NumberPadMode;
	specialCharacters: boolean;
	sign: boolean;
	/** the sign that separates the decimals, or an empty text for none */
	decimalSeparator: string;
	escape: boolean;
}

/**
 * The sets of a {@link ui5.touch.controls.NumberPad}.
 *
 * The digit block comes from the mode and is not touched by anything else;
 * what was additionally asked for goes into the row under it or into the row
 * of function keys, so that the block keeps its shape whatever is switched on.
 *
 * The <code>Simple</code> block has a row of its own for the zero, and there
 * the minus and the decimal separator sit beside it. Where neither was asked
 * for, the backspace and the enter come into that row instead - a zero on a
 * line of its own would be a key three columns wide, and the pad would be a
 * row taller than it has anything to show.
 */
export function buildNumberPadSets(options: NumberPadOptions): LayoutSet[] {
	// the two blocks that fill their fourth row themselves have no row for the
	// zero, so their function keys stay where they are
	const zero =
		options.mode === NumberPadMode.Simple
			? row(options.sign && "-", "0", options.decimalSeparator)
			: "";
	const zeroIsAlone = zero === "0";

	const functionRow = row(
		options.specialCharacters && "{symbols}",
		options.escape && "{esc}",
		!zeroIsAlone && "{bksp}",
		!zeroIsAlone && "{enter}",
	);

	const sets: LayoutSet[] = [
		{
			name: "numbers",
			rows: [
				...PAD_ROWS[options.mode],
				zeroIsAlone ? "{bksp} 0 {enter}" : zero,
				functionRow,
				// a pad without a row for the zero has none to write, and one
				// that took the function keys into that row may have none left
			].filter(Boolean),
		},
	];

	if (options.specialCharacters) {
		sets.push({
			name: "symbols",
			rows: [
				...PAD_SYMBOL_ROWS,
				"{numbers} ) +",
				row(options.escape && "{esc}", "{bksp}", "{enter}"),
			],
		});
	}

	return sets;
}
