/** one entry of the layout table on the VirtualKeyboard page */
export interface KeyboardLayoutDoc {
	/** the key used in the layout select */
	key: string;
	/** the name shown in the select and in the table */
	text: string;
	/** the rows as they are written into the layout property */
	sample: string;
	/** how many keys the layout has */
	keys: number;
}

/**
 * The key rows of the keyboard layouts that can be picked in the playgrounds
 * of the VirtualKeyboard and the Input page.
 */
export const keyboardLayouts: Record<string, string[]> = {
	numeric: ["7 8 9", "4 5 6", "1 2 3", "{bksp} 0 {enter}"],
	phone: ["1 2 3", "4 5 6", "7 8 9", "* 0 #", "{bksp} {enter}"],
	calculator: ["7 8 9 /", "4 5 6 *", "1 2 3 -", "0 . = +", "{bksp} {enter}"],
	qwerty: [
		"1 2 3 4 5 6 7 8 9 0",
		"q w e r t y u i o p",
		"a s d f g h j k l",
		"{shift} z x c v b n m {bksp}",
		"{space} {enter}",
	],
};

/** the display names of the layouts, in the order of the select */
const layoutNames: Record<string, string> = {
	qwerty: "QWERTY",
	numeric: "Numeric",
	phone: "Phone",
	calculator: "Calculator",
};

/**
 * The layouts as a list, for the table on the VirtualKeyboard page. The
 * sample is the value of the <code>layout</code> property as it would be
 * written in an XML view: the rows separated by commas.
 */
export const keyboardLayoutDocs: KeyboardLayoutDoc[] = Object.keys(
	layoutNames,
).map((key) => {
	const rows = keyboardLayouts[key];

	return {
		key: key,
		text: layoutNames[key],
		sample: rows.join(", "),
		keys: rows.reduce(
			(count, row) => count + row.split(" ").filter(Boolean).length,
			0,
		),
	};
});
