import Keyboard from "ui5/touch/controls/Keyboard";
import NumberPad from "ui5/touch/controls/NumberPad";
import { KeyboardMode, NumberPadMode } from "ui5/touch/controls/library";

/** one entry of the mode table on the Keyboard or the NumberPad page */
export interface KeyboardModeDoc {
	/** the value of the mode property, e.g. "German" */
	mode: string;
	/** the rows of that mode, as they would be written into a layout */
	sample: string;
	/** how many keys the first set has */
	keys: number;
}

/** the arrangements a Keyboard brings along, in the order the select shows */
const languages = [
	KeyboardMode.English,
	KeyboardMode.German,
	KeyboardMode.French,
	KeyboardMode.Spanish,
	KeyboardMode.Ukrainian,
	KeyboardMode.Russian,
	KeyboardMode.Hindi,
];

/** the digit blocks a NumberPad brings along */
const pads = [
	NumberPadMode.Simple,
	NumberPadMode.Phone,
	NumberPadMode.Calculator,
];

function toDoc(mode: string, rows: string[]): KeyboardModeDoc {
	return {
		mode: mode,
		sample: rows.join(", "),
		keys: rows.reduce(
			(count, row) => count + row.split(" ").filter(Boolean).length,
			0,
		),
	};
}

/**
 * What the arrangements of the Keyboard are made of, for the table on its
 * page. The rows come from the control itself, so the table cannot drift away
 * from what the keyboard actually renders.
 */
export const keyboardModeDocs: KeyboardModeDoc[] = languages.map((mode) =>
	toDoc(mode, Keyboard.getLayoutForMode(mode)),
);

/** the same for the digit blocks of the NumberPad */
export const numberPadModeDocs: KeyboardModeDoc[] = pads.map((mode) =>
	toDoc(mode, NumberPad.getLayoutForMode(mode)),
);
