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
		version: "1.3.0",
		date: "",
		summary: "The keyboard docks to the bottom edge, and knows QWERTZ.",
		groups: [
			{
				kind: "Added",
				items: [
					"VirtualKeyboard has a docked property. A docked keyboard leaves the flow of the page and sits at the bottom edge of the screen, over the content, the way the on-screen keyboard of a phone does. On a phone or a tablet it takes the full width of the screen and the width property is not looked at.",
					"docked works on a field as well: with a keyboard in the virtualKeyboard aggregation of an Input or a TextArea, the popover that carries it is docked instead of being placed at the field. That keyboard is in the static area, so it covers a modal dialog too - which is what makes a field inside a dialog typeable.",
					"KeyboardMode QWERTZ, the German arrangement of the letters: Z and Y are swapped against QWERTY.",
					"A keyboard can carry more than one set of keys. The sets are KeyboardLayout elements in the new layouts aggregation, and a key named after a set switches to it - {numbers} to the digits, {default} back to the letters - so the switching is part of the layout and needs no code around it. A set says what its key reads through its text property, and the value carries on across a switch.",
					"The QWERTY and the QWERTZ layout have a tab key and a caps lock, where a keyboard of keys has them. {lock} stays on until it is pressed again, {shift} falls away after one letter, and shift while the lock is on writes lower case. Both are special keys like the others, so a layout of your own can use {tab} and {lock} as well.",
				],
			},
			{
				kind: "Fixed",
				items: [
					"A Toolbar or an OverflowToolbar in the footer of a sap.m.Dialog is no longer cut off at the lower edge. A dialog keeps its footer out of the flow and reserves 2.75rem for it - the height of a toolbar of sap.m - and clips what reaches past that. The toolbars now hand the dialog the height they have, so the room grows with the size and the content above the footer keeps the height it was given.",
				],
			},
			{
				kind: "Demo",
				items: [
					"The VirtualKeyboard page has a Docked switch and QWERTZ in its mode list.",
					"The Input and the TextArea page have a Docked switch for the keyboard of the field, and QWERTZ in their mode list.",
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
