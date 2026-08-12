/**
 * The release history of the library.
 *
 * The texts are English only and on purpose not translated: a changelog is a
 * record of what was released, and translating it would mean maintaining the
 * same history three times over.
 */

/** a group of entries of one kind within a release */
export interface ChangeGroup {
	/** heading of the group, e.g. "Added" or "Fixed" */
	kind: string;
	items: string[];
}

/** one released - or upcoming - version */
export interface Release {
	version: string;
	/** the day the version was tagged, empty while it is still in the making */
	date: string;
	/** one line on what the release is about */
	summary: string;
	groups: ChangeGroup[];
}

/** newest first, the order the page shows them in */
export const releases: Release[] = [
	{
		version: "2.0.0",
		date: "",
		summary:
			"One keyboard that did everything becomes three that each do one thing.",
		groups: [
			{
				kind: "Added",
				items: [
					"Keyboard - an on-screen keyboard of letters, said in one line. The mode is the arrangement of a country, by the language it is used for: English, German, French, Spanish, Ukrainian, Russian and Hindi. There is no layout to write out.",
					"displayNumbers decides what becomes of the digits. Always puts a row of them over the letters, the way a keyboard of keys has it. Toggle leaves the letters to themselves and puts the digits behind a key, the way a phone does it. ToggleOnMobile, the default, is the first on a computer and a tablet and the second on a phone - which of the two it is is decided once, by the device the page was opened on. Never leaves them off.",
					"showSpecialCharacters adds a set of brackets, signs and currencies. Where the digits are behind a key of their own the set sits behind them, the way a phone goes from its letters to its digits to its symbols and back; otherwise a key of its own leads there.",
					"letterCase pins the keyboard to one case. Upper and Lower leave the shift key and the caps lock off - there is nothing to switch, which is what a field with a case of its own wants: a material number, a licence plate, a batch.",
					"showCapsLock adds a {lock} next to the shift key, showEscape an {esc} key, and enterText says what the Enter key reads - Search, Next, whatever it does.",
					"NumberPad - a pad of digits in three columns. The mode picks the block: Simple is the pad of a computer with 7 8 9 on top, Phone the pad of a telephone with a star and a hash, Calculator adds the four basic operations. The block keeps its shape whatever else is switched on: a minus and a decimal separator go into the row of the zero, everything else into the row of function keys under it - and where neither of the two was asked for, the backspace and the enter come into the row of the zero instead, so a plain pad is the four rows it has always been.",
					"showDecimalSeparator and decimalSeparator on the NumberPad. The separator is the one of the current language unless another one is named - a comma in German, a point in English.",
					"showSpecialCharacters on the NumberPad too: a set of signs in the three columns of the pad, for a code that is more than digits.",
					"CustomKeyboard - the keyboard whose keys are handed to it, row by row. It carries what was the layout property, the layouts aggregation and the display aggregation, and is the answer to everything the other two do not cover.",
					"KeyboardBase - the machine behind all three: the value and how keys change it, the sets and the switching between them, shift and the caps lock, the keys of a real keyboard, the size, the width and the docking. It is the type the keyboard aggregation of a field is typed to, so any of the three fits in there.",
				],
			},
			{
				kind: "Changed",
				items: [
					"VirtualKeyboard is gone, and with it a mode property that mixed languages (QWERTZ), device shapes (QWERTZMobile), purposes (Email) and pads (Numeric, Decimal, Phone, Calculator) in one list of fifteen values. Use Keyboard for letters, NumberPad for digits and CustomKeyboard for keys of your own; the modes map as follows: QWERTY, QWERTZ and AZERTY are the arrangements English, German and French, QWERTYMobile and QWERTZMobile are those two with displayNumbers=Toggle, Numeric and Decimal are the NumberPad, Phone and Calculator are its modes of the same name, and Custom is the CustomKeyboard.",
					"The keyboard aggregation of Input and TextArea was called virtualKeyboard and is now called keyboard; showVirtualKeyboard is showKeyboard. Its type is KeyboardBase, so a Keyboard, a NumberPad and a CustomKeyboard all fit.",
					"KeyboardMode carries the arrangements of the countries and nothing else. NumberKeys, LetterCase and NumberPadMode are the new types beside it.",
					"The CSS classes of a keyboard are touchKeyboard, touchKeyboardRow, touchKeyboardDocked and touchKeyboardDisabled - they were named after the control that is gone.",
				],
			},
		],
	},
	{
		version: "1.2.0",
		date: "2026-08-10",
		summary:
			"Twelve more sap.m controls, a virtual keyboard inside the Input, and a demo application in place of the old test pages.",
		groups: [
			{
				kind: "Added",
				items: [
					"CheckBox — the touch version of sap.m.CheckBox, with the tristate selection of the original.",
					"RadioButton and RadioButtonGroup, including the column layout of the group.",
					"Switch, with the accept/reject and on/off text variants of sap.m.Switch.",
					"Select, whose picker is a list of touch buttons instead of a dropdown.",
					"ComboBox, with the same filtering as sap.m.ComboBox and a picker built for fingers.",
					"DatePicker with a touch calendar, and TimePicker with a touch clock.",
					"Link, sized like every other control of the library.",
					"SegmentedButton and SegmentedButtonItem.",
					"OverflowToolbar, which moves what does not fit into an overflow area.",
					"BarcodeInput, a field that collects the keystrokes of a barcode scanner.",
					"SignaturePad, a canvas to sign on with a finger or a pen.",
					"Input and TextArea show a keyboard of their own: put a VirtualKeyboard into the new virtualKeyboard aggregation and switch showVirtualKeyboard on, and the keyboard opens in a popover while the field has the focus. In the TextArea its Enter key adds a line break.",
					"ComboBox has showSecondaryValues, which puts the additionalText of a sap.ui.core.ListItem at the end of every entry, as sap.m.ComboBox does.",
					"QuickDialog.select() builds its field from the touch ComboBox and takes a selectSize for it.",
					"VirtualKeyboard has a mode property with the ready-made layouts QWERTY, Numeric, Phone and Calculator. Only mode Custom reads the rows from the layout property, which is where every keyboard used to start.",
					"OverflowToolbar takes a ToolbarSpacer.",
				],
			},
			{
				kind: "Changed",
				items: [
					"Every measurement a size stands for now comes from one stylesheet, Sizing.less, which writes the ladder of a size into custom properties on a single class per control. Sizes look and behave as before.",
					"The oldest UI5 release the library runs on is 1.116, and the test page is checked against it. What sets the limit is sap/base/i18n/Localization, which the DatePicker reads the language from and which does not exist before 1.116.",
				],
			},
			{
				kind: "Fixed",
				items: [
					"Input and TextArea keep the field outline of Horizon, and the TextArea sits at the height of its sap.m original.",
					"Content marked NeverOverflow moves into the overflow area as a last resort instead of widening the toolbar, and the overflow button stays at its right end.",
					"The library builds and draws on UI5 1.116 and later again: the theme parameters that only the newer releases define are used with a fallback, so the arrows, the tick of the CheckBox and the other icons of the library show up on every supported version.",
				],
			},
			{
				kind: "Demo",
				items: [
					"The separate test pages are gone. In their place is one application with routing, a page per control and a side navigation to walk through them. It runs on the latest UI5.",
					"Next to it, test/ holds one plain page that shows every control - no descriptions, no navigation, nothing but the controls. The start:test scripts open it on the supported UI5 versions, and ?control=Button narrows it to one of them.",
					"The interface is translated into German and Hindi, and the language can be switched in the header.",
					"The application starts in the dark theme when the system is set to dark mode.",
					"Every page works down to a phone: the cards stack, the tables fall back to pop-in and the widest keyboard layout scrolls inside its card.",
				],
			},
			{
				kind: "Tests",
				items: [
					"The library has UI tests, written with wdi5. They run against the plain test page, so every control of the library is opened in a browser, and they check that the controls are there, that a CheckBox, a Switch, an Input and a Select react, and that a Button grows with its size.",
					"A CI workflow runs those tests on every supported UI5 release, next to the type check, the lint run and the build. The list of releases is the one behind the start:test scripts, so the two cannot drift apart.",
				],
			},
		],
	},
	{
		version: "1.1.0",
		date: "2026-08-07",
		summary: "A ready-made dialog, built from the touch controls.",
		groups: [
			{
				kind: "Added",
				items: [
					"QuickDialog — a dialog in the spirit of sap.m.MessageBox, with show, input, select, error, information, confirm and details, all returning a promise.",
				],
			},
			{
				kind: "Fixed",
				items: ["The dialog uses dimensions that fit its content."],
			},
			{
				kind: "Changed",
				items: [
					"Source maps are part of the build, so the library can be debugged from its TypeScript sources.",
					"Dependencies updated.",
				],
			},
		],
	},
	{
		version: "1.0.3",
		date: "2026-08-06",
		summary: "The Toolbar fits where sap.m expects one of its own.",
		groups: [
			{
				kind: "Changed",
				items: [
					"Toolbar can be used in the aggregations that sap.m types as sap.m.Toolbar - the footer of a sap.m.Page or of a sap.m.Dialog, for instance.",
				],
			},
			{
				kind: "Docs",
				items: [
					"The README describes the setup with the UI5 middleware as an alternative to the npm dependency.",
				],
			},
		],
	},
	{
		version: "1.0.2",
		date: "2026-08-02",
		summary: "One press, one event.",
		groups: [
			{
				kind: "Fixed",
				items: ["A press fired twice on a touch device."],
			},
		],
	},
	{
		version: "1.0.1",
		date: "2026-07-31",
		summary: "Installation instructions.",
		groups: [
			{
				kind: "Docs",
				items: ["The README explains how to install and use the library."],
			},
		],
	},
	{
		version: "1.0.0",
		date: "2026-07-31",
		summary: "The first release: seven controls and one size property.",
		groups: [
			{
				kind: "Added",
				items: [
					"Button, Text, TextArea, Input, StepInput and Toolbar, rebuilt on the structure of their sap.m originals so they can replace them one for one.",
					"One size property on every control, from S to 6XL. It scales font size, icon size, padding and height together, so the controls stay proportional at every step.",
					'ISized, the interface behind that property. A control can be asked for it with isA("ui5.touch.controls.ISized") and then be sized without knowing what it is.',
					"VirtualKeyboard — a control sap.m has no equivalent for. Its layout is a plain list of rows, it comes with a QWERTY layout, and with hardwareKeys it also takes the keys of a real keyboard.",
					"An icon font for the special keys of the VirtualKeyboard, built from SVG as part of the build.",
				],
			},
		],
	},
];
