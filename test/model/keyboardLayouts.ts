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
