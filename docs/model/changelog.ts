/**
 * The release history of the library.
 *
 * The texts are English only and on purpose not translated: a changelog is a
 * record of what was released, and translating it would mean maintaining the
 * same history three times over.
 *
 * An entry is one or two sentences - what changed, not how it works. Two
 * markers are read by the page and turned into markup:
 *
 * - `[Keyboard]` becomes a link to the page of that control
 * - `` `displayNumbers` `` becomes code
 *
 * Anything longer than the entry belongs on the page of the control, which is
 * a link away.
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
		summary:
			"One keyboard that did everything becomes three that each do one thing.",
		groups: [
			{
				kind: "Added",
				items: [
					"[Keyboard] - an on-screen keyboard of letters. The `mode` is the arrangement of a country: English, German, French, Spanish, Ukrainian, Russian or Hindi.",
					"`displayNumbers` decides where the digits go: in a row above the letters, behind a key of their own, or not at all. By default it is the first on a computer and the second on a phone.",
					"`showSpecialCharacters` adds a set of brackets, signs and currencies, and `showEmojis` a set of faces behind a key of its own.",
					"`letterCase` pins the keyboard to upper or lower case - for a field with a case of its own, like a material number or a licence plate.",
					"`showCapsLock`, `showEscape` and `enterText` add the keys a real keyboard has and say what the Enter key reads.",
					"`extraKeys` put keys of your own beside the space bar, on every set: an at sign for an address field, a unit for a quantity.",
					"[NumberPad] - a pad of digits in three columns. The `mode` picks the block: `Simple` like a computer, `Phone` with star and hash, `Calculator` with the four operations.",
					"`showDecimalSeparator` and `decimalSeparator` on the [NumberPad], which follows the current language unless told otherwise.",
					"[CustomKeyboard] - the keyboard whose keys are handed to it row by row. It carries what was the `layout` property and covers everything the other two do not.",
					"[KeyboardBase] - the machine behind all three, and the type the `keyboard` aggregation of a field is typed to, so any of the three fits in there.",
					"The texts the controls put on the screen themselves are translated into fourteen languages: English, German, Spanish, French, Hindi, Italian, Japanese, Dutch, Polish, Portuguese, Russian, Turkish, Ukrainian and Chinese. That is the actions of a [QuickDialog], its `Show details`, the line a [ComboBox] shows when nothing matches, the hint on an empty [SignaturePad] and the on/off of a [Switch].",
				],
			},
			{
				kind: "Changed",
				items: [
					"`VirtualKeyboard` is gone. Its `mode` mixed languages, device shapes, purposes and pads in one list of fifteen values - use [Keyboard] for letters, [NumberPad] for digits and [CustomKeyboard] for keys of your own.",
					"The aggregation of [Input] and [TextArea] is now called `keyboard` instead of `virtualKeyboard`, and `showVirtualKeyboard` is `showKeyboard`.",
					"`KeyboardMode` carries the arrangements of the countries and nothing else. `NumberKeys`, `LetterCase` and `NumberPadMode` are the new types beside it.",
					"The CSS classes are `touchKeyboard`, `touchKeyboardRow`, `touchKeyboardDocked` and `touchKeyboardDisabled` - they were named after the control that is gone.",
					"The `placeholder` of a [SignaturePad] defaults to an empty string instead of `Sign here`; a pad is built with the hint of the library in the language of the application. An empty placeholder still leaves the baseline bare.",
				],
			},
			{
				kind: "Fixed",
				items: [
					"A `Ghost` [Button] looks like its sap.m original in the two Horizon themes, which style the type differently from every other theme.",
				],
			},
			{
				kind: "Demo",
				items: [
					"The code examples carry a copy button, and the code blocks follow the dark theme.",
					"The demo speaks the same fourteen languages as the library, chosen in the header - the footer, the control reference and the playgrounds included.",
					"A search sits in the middle of the header. It finds a page by its name, by the sap.m control it steps in for - `sap.m.Select` leads to the touch Select - and by what the page is about, so `barcode` and `signature` arrive without knowing what the control is called.",
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
					"[CheckBox], with the tristate selection of the original, plus [RadioButton] and [RadioButtonGroup].",
					"[Switch], with the accept/reject and on/off text variants of sap.m.Switch.",
					"[Select], whose picker is a list of touch buttons instead of a dropdown, and [ComboBox], with the same filtering as its original.",
					"[DatePicker] with a touch calendar, and [TimePicker] with a touch clock.",
					"[Link], [SegmentedButton] and [OverflowToolbar], which moves what does not fit into an overflow area.",
					"[BarcodeInput], a field that collects the keystrokes of a barcode scanner, and [SignaturePad], a canvas to sign on.",
					"[Input] and [TextArea] show a keyboard of their own: fill the `virtualKeyboard` aggregation, switch `showVirtualKeyboard` on, and it opens in a popover while the field has the focus.",
					"[ComboBox] has `showSecondaryValues`, and [QuickDialog] `select()` builds its field from the touch [ComboBox].",
					"`VirtualKeyboard` has a `mode` property with the ready-made layouts `QWERTY`, `Numeric`, `Phone` and `Calculator`.",
				],
			},
			{
				kind: "Changed",
				items: [
					"Every measurement a `size` stands for comes from one stylesheet now. Sizes look and behave as before.",
					"The oldest UI5 release the library runs on is 1.116 - what sets the limit is `sap/base/i18n/Localization`, which does not exist before it.",
				],
			},
			{
				kind: "Fixed",
				items: [
					"[Input] and [TextArea] keep the field outline of Horizon, and the [TextArea] sits at the height of its sap.m original.",
					"Content marked `NeverOverflow` moves into the overflow area as a last resort instead of widening the toolbar.",
					"The library draws on UI5 1.116 again: theme parameters only newer releases define are used with a fallback, so the icons show up on every supported version.",
				],
			},
			{
				kind: "Demo",
				items: [
					"The separate test pages give way to one application with routing, a page per control and a side navigation.",
					"Beside it, `test/` holds one plain page showing every control, which the `start:test` scripts open on the supported UI5 versions.",
					"The interface is translated into German and Hindi, it starts in the dark theme when the system is set to dark mode, and every page works down to a phone.",
				],
			},
			{
				kind: "Tests",
				items: [
					"UI tests written with wdi5 open every control in a browser and check that it is there and reacts.",
					"A CI workflow runs them on every supported UI5 release, next to the type check, the lint run and the build.",
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
					"[QuickDialog] - a dialog in the spirit of sap.m.MessageBox, with `show`, `input`, `select`, `error`, `information`, `confirm` and `details`, all returning a promise.",
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
					"[Toolbar] can be used in the aggregations that sap.m types as sap.m.Toolbar - the footer of a sap.m.Page or of a sap.m.Dialog, for instance.",
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
					"[Button], [Text], [TextArea], [Input], [StepInput] and [Toolbar], rebuilt on the structure of their sap.m originals so they can replace them one for one.",
					"One `size` property on every control, from `S` to `6XL`. It scales font size, icon size, padding and height together, so the controls stay proportional at every step.",
					"`ISized`, the interface behind that property - a control can be asked for it and then be sized without knowing what it is.",
					"`VirtualKeyboard` - a control sap.m has no equivalent for, with a QWERTY layout and, through `hardwareKeys`, the keys of a real keyboard.",
					"An icon font for its special keys, built from SVG as part of the build.",
				],
			},
		],
	},
];
