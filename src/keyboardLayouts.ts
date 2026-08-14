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
	/**
	 * The letters that a keyboard of keys writes with a dead key - press the
	 * accent, then the vowel. A key of this keyboard is tapped once and
	 * writes what it says, so there is nowhere for a dead key to wait: the
	 * ready-made letters sit on a set of their own instead, reached by
	 * <code>&#123;accents&#125;</code> the way the digits are reached by
	 * <code>&#123;numbers&#125;</code>.
	 *
	 * Only for the arrangements that need it. Where the letters of a language
	 * are all on keys of their own - Turkish, Swedish, Romanian - there is
	 * nothing to put here.
	 */
	accentRows?: string[];
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
	// The accented vowels sit where the Italian keyboard has them, at the end
	// of the first two rows. The ì is the one exception: a keyboard of keys
	// puts it on the number row, which is the digits here, so it joins the è
	// it belongs with - a language cannot be written without it.
	[KeyboardMode.Italian]: {
		rows: [
			"q w e r t y u i o p è ì",
			"a s d f g h j k l ò à ù",
			"z x c v b n m",
		],
		accentRows: ["á é í ó ú", "â ê î ô û"],
	},
	// Portugal and Brazil write the letters the same way; the ç is the only
	// one of them that has a key of its own. Everything the language accents
	// is written with a dead key there, and is a set of its own here.
	[KeyboardMode.Portuguese]: {
		rows: ["q w e r t y u i o p", "a s d f g h j k l ç", "z x c v b n m"],
		accentRows: ["á é í ó ú", "â ê ô ã õ", "à ò ü"],
	},
	[KeyboardMode.Swedish]: {
		rows: ["q w e r t y u i o p å", "a s d f g h j k l ö ä", "z x c v b n m"],
	},
	// The Q arrangement, the one Turkey writes on. The dotless ı is where
	// QWERTY has its i; the dotted i moved down beside the l. They are two
	// letters, not two shapes of one, which is what makes the case of this
	// keyboard a Turkish question - see LOCALES.
	[KeyboardMode.Turkish]: {
		rows: [
			"q w e r t y u ı o p ğ ü",
			"a s d f g h j k l ş i",
			"z x c v b n m ö ç",
		],
	},
	// The standard arrangement, with the comma-below ș and ț. The older
	// keyboards carry the cedilla ş and ţ in those places; the standard has
	// asked for the comma ones since 2005, and they are what a Romanian text
	// is written with.
	[KeyboardMode.Romanian]: {
		rows: [
			"q w e r t y u i o p ă î",
			"a s d f g h j k l ș ț",
			"z x c v b n m â",
		],
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

/**
 * The language whose rules decide what the upper case of a letter is, for the
 * arrangements where those rules are not the ordinary ones.
 *
 * Turkish is the one that matters here: it has two i's, a dotted and a
 * dotless one, and they keep their dot through the change of case - i becomes
 * İ and I becomes ı. The plain change of case knows nothing of that and would
 * write I for both, which turns one letter into the other.
 */
const LOCALES: Partial<Record<KeyboardMode, string>> = {
	[KeyboardMode.Turkish]: "tr",
};

/**
 * The language a mode changes the case of its letters by, or nothing where
 * the ordinary rules are the right ones.
 */
export function caseLocaleForMode(mode: KeyboardMode): string | undefined {
	return LOCALES[mode];
}

/** the letters of a set in the case the keyboard writes them in */
function inCase(
	rows: string[],
	letterCase: LetterCase,
	locale?: string,
): string[] {
	if (letterCase === LetterCase.Upper) {
		return rows.map((entry) => entry.toLocaleUpperCase(locale));
	}
	if (letterCase === LetterCase.Lower) {
		return rows.map((entry) => entry.toLocaleLowerCase(locale));
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
	const locale = caseLocaleForMode(options.mode);
	// the accented letters of the language, where they are not on keys of
	// their own; the set is only worth a key if there is a set
	const accents = letters.accentRows;

	// what stands beside the space bar, on every set: the way to the other sets
	// and the keys the application asked to have at hand
	const functionRow = row(
		toggle && "{numbers}",
		!toggle && options.specialCharacters && "{symbols}",
		accents && "{accents}",
		options.emojis && "{emojis}",
		...options.extraKeys,
		"{space}",
		"{enter}",
	);

	/**
	 * Puts the escape key where a keyboard of keys has it: first key of the top
	 * row, whichever set is on screen.
	 */
	const withEscape = (rows: string[]): string[] =>
		options.escape ? [row("{esc}", rows[0]), ...rows.slice(1)] : rows;

	const lettersSet = (name: string, rows: string[]): LayoutSet => {
		const [first, home, last] = inCase(rows, letterCase, locale);

		return {
			name: name,
			rows: withEscape([
				...(options.numbers === NumberKeys.Always ? [DIGITS] : []),
				first,
				row(modifiers && options.capsLock && "{lock}", home),
				row(
					(modifiers || hasLetterSets) && "{shift}",
					last,
					"{bksp}",
				),
				functionRow,
			]),
		};
	};

	const sets: LayoutSet[] = [lettersSet("default", letters.rows)];

	if (letters.shiftRows) {
		sets.push(lettersSet("shift", letters.shiftRows));
	}

	if (toggle) {
		sets.push({
			name: "numbers",
			rows: withEscape([
				DIGITS,
				NUMBER_ROWS[0],
				row(options.specialCharacters && "{symbols}", NUMBER_ROWS[1], "{bksp}"),
				row(
					"{abc}",
					options.emojis && "{emojis}",
					...options.extraKeys,
					"{space}",
					"{enter}",
				),
			]),
		});
	}

	if (accents) {
		// The letters of the language that a keyboard of keys writes with a
		// dead key. They follow the case of the letters, so a keyboard pinned
		// to capitals writes Ç here as well.
		const rows = inCase(accents, letterCase, locale);

		sets.push({
			name: "accents",
			rows: withEscape([
				...rows.slice(0, -1),
				row(
					(modifiers || hasLetterSets) && "{shift}",
					rows[rows.length - 1],
					"{bksp}",
				),
				row(
					"{abc}",
					toggle && "{numbers}",
					options.specialCharacters && "{symbols}",
					options.emojis && "{emojis}",
					...options.extraKeys,
					"{space}",
					"{enter}",
				),
			]),
		});
	}

	if (options.specialCharacters) {
		sets.push({
			name: "symbols",
			rows: withEscape([
				SYMBOL_ROWS[0],
				SYMBOL_ROWS[1],
				row(toggle && "{numbers}", SYMBOL_ROWS[2], "{bksp}"),
				row(
					"{abc}",
					options.emojis && "{emojis}",
					...options.extraKeys,
					"{space}",
					"{enter}",
				),
			]),
		});
	}

	if (options.emojis) {
		sets.push({
			name: "emojis",
			rows: withEscape([
				EMOJI_ROWS[0],
				EMOJI_ROWS[1],
				EMOJI_ROWS[2],
				row(EMOJI_ROWS[3], "{bksp}"),
				row("{abc}", ...options.extraKeys, "{space}", "{enter}"),
			]),
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
