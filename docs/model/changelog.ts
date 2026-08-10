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
		version: "1.2.0",
		date: "",
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
					"The selection of a SegmentedButton follows the theme, and the outline of the group stays connected around the selected segment.",
					"Input and TextArea keep the field outline of Horizon, and the TextArea sits at the height of its sap.m original.",
					"Content marked NeverOverflow moves into the overflow area as a last resort instead of widening the toolbar, and the overflow button stays at its right end.",
					"The placeholder of the SignaturePad no longer breaks the calc it is built from.",
					"The library builds and draws on UI5 1.116 and later again: the theme parameters that only the newer releases define are used with a fallback, so the arrows, the tick of the CheckBox and the other icons of the library show up on every supported version.",
					"A ComboBox with a selectedKey written next to its items shows the text of that item. Properties reach a control before its aggregations do, so the key used to arrive while there were no items to match it against.",
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
					"ISized, the interface behind that property. A control can be asked for it with isA(\"ui5.touch.controls.ISized\") and then be sized without knowing what it is.",
					"VirtualKeyboard — a control sap.m has no equivalent for. Its layout is a plain list of rows, it comes with a QWERTY layout, and with hardwareKeys it also takes the keys of a real keyboard.",
					"An icon font for the special keys of the VirtualKeyboard, built from SVG as part of the build.",
				],
			},
		],
	},
];
