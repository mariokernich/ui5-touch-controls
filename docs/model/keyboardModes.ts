import VirtualKeyboard from "ui5/touch/controls/VirtualKeyboard";
import { KeyboardMode } from "ui5/touch/controls/library";

/** one entry of the mode table on the VirtualKeyboard page */
export interface KeyboardModeDoc {
	/** the value of the mode property, e.g. "QWERTY" */
	mode: string;
	/** the rows of that mode, as they would be written into layout */
	sample: string;
	/** how many keys the layout has */
	keys: number;
}

/** the ready-made modes, in the order the select shows them */
const readyMade = [
	KeyboardMode.QWERTY,
	KeyboardMode.QWERTZ,
	KeyboardMode.QWERTYMobile,
	KeyboardMode.QWERTZMobile,
	KeyboardMode.Numeric,
	KeyboardMode.Phone,
	KeyboardMode.Calculator,
];

/**
 * What the ready-made modes are made of, for the table on the VirtualKeyboard
 * page. The rows come from the control itself, so the table cannot drift away
 * from what the keyboard actually renders.
 */
export const keyboardModeDocs: KeyboardModeDoc[] = readyMade.map((mode) => {
	const rows = VirtualKeyboard.getLayoutForMode(mode);

	return {
		mode: mode,
		sample: rows.join(", "),
		keys: rows.reduce(
			(count, row) => count + row.split(" ").filter(Boolean).length,
			0,
		),
	};
});
