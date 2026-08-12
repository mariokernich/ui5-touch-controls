/**
 * The content of the two control tables and the theme table on the
 * documentation page.
 */
export interface ControlDoc {
	/** name of the control, also the key of its page */
	name: string;
	/** the sap.m control it steps in for, or {@link NEW_CONTROL} */
	replaces: string;
	/**
	 * One or two sentences that say what the control is. This is the intro at
	 * the head of its page, so it stays shorter than
	 * {@link ControlDoc.description} and does not repeat it word for word.
	 */
	summary: string;
	/** what this control does, shown on its page and in the control table */
	description: string;
	/** the class the control is built on, e.g. sap.ui.core.Control */
	extendsClass: string;
	/** the release of the library the control came with */
	since: string;
	/**
	 * What the sap.m original does. Shown next to the description on the page
	 * of the control, so the two can be read against each other.
	 */
	original?: string;
	/**
	 * The sap.m entity the documentation link points at. Only needed where
	 * {@link ControlDoc.replaces} names more than one.
	 */
	docEntity?: string;
	/**
	 * Whether this is a class that is used from a controller instead of a
	 * control that is put into a view. Those are listed on their own, in the
	 * navigation as well as in the tables of the documentation page.
	 */
	isClass?: boolean;
}

export interface ThemeDoc {
	/** display name of the theme */
	name: string;
	/** the theme id used in data-sap-ui-theme */
	id: string;
	/** whether the library ships a theme library for it */
	supported: boolean;
	/** short remark shown in the last column */
	note: string;
}

/** marker of the controls that have no sap.m equivalent */
export const NEW_CONTROL = "nothing — new";

const controls: ControlDoc[] = [
	{
		name: "Button",
		replaces: "sap.m.Button",
		extendsClass: "sap.ui.core.Control",
		since: "1.0.0",
		summary:
			"A button whose whole geometry follows one size property, so the area a finger has to hit grows with it. Everything else — text, icon, type and press — reads like sap.m.Button.",
		original:
			"The standard button of sap.m: text, icon, icon position, a button type and a press event. Its height is the one the theme prescribes and does not change.",
		description:
			"Button with configurable size, icon, icon position, type (all sap.m.ButtonType values), side padding and width. Fires press.",
	},
	{
		name: "SegmentedButton",
		replaces: "sap.m.SegmentedButton",
		extendsClass: "sap.ui.core.Control",
		since: "1.2.0",
		summary:
			"A row of joined buttons of which exactly one is selected, sized so every segment can be hit with a finger.",
		original:
			"A row of joined buttons of which exactly one is selected, filled through sap.m.SegmentedButtonItem. Fires selectionChange.",
		description:
			"A row of joined buttons of which exactly one is selected, filled through tc:SegmentedButtonItem (key, text, icon, enabled). Supports selectedKey, width for evenly spread segments and fires selectionChange.",
	},
	{
		name: "CheckBox",
		replaces: "sap.m.CheckBox",
		extendsClass: "sap.ui.core.Control",
		since: "1.2.0",
		summary:
			"A check box whose box, check mark, label and hit area scale together instead of staying at the size the theme gives them.",
		original:
			"The standard check box of sap.m, with a label, a tristate selection and value states. Box and hit area have the size the theme gives them.",
		description:
			"Check box whose box, check mark, label and hit area scale together — at size M the geometry matches sap.m.CheckBox. Supports selected, partiallySelected, text, editable, wrapping, value states and width. Fires select.",
	},
	{
		name: "RadioButton",
		replaces: "sap.m.RadioButton / sap.m.RadioButtonGroup",
		docEntity: "sap.m.RadioButtonGroup",
		extendsClass: "sap.ui.core.Control",
		since: "1.2.0",
		summary:
			"A radio button that scales with its size property, and a group control that arranges a set of them in columns and hands its settings down to them.",
		original:
			"A radio button that is mutually exclusive with the others of its groupName, plus a group control that arranges a set of them in columns.",
		description:
			"Circle, dot, label and hit area scale together — at size M the geometry matches sap.m.RadioButton. Buttons sharing a groupName are mutually exclusive; tc:RadioButtonGroup arranges them in columns and hands its size, enabled, editable and value state down to them. Fires select.",
	},
	{
		name: "Switch",
		replaces: "sap.m.Switch",
		extendsClass: "sap.ui.core.Control",
		since: "1.2.0",
		summary:
			"An on/off switch that grows with its size property, where sap.m.Switch is fixed at 4rem by 2rem.",
		original:
			"An on/off switch of a fixed size, with an accept/reject variant and custom texts for the two states.",
		description:
			"Track, handle and label scale together, where sap.m.Switch is fixed at 4rem x 2rem. Supports state, customTextOn, customTextOff and the AcceptReject type; the colors come from the @sapButton_Track_* / @sapButton_Handle_* theme parameters. Fires change.",
	},
	{
		name: "Select",
		replaces: "sap.m.Select",
		extendsClass: "sap.ui.core.Control",
		since: "1.2.0",
		summary:
			"A drop-down whose list opens in rows as big as the field itself, so an entry can be picked with a finger.",
		original:
			"A drop-down filled with sap.ui.core.Item elements. The list it opens keeps the standard row height, however large the field is.",
		description:
			"Drop-down filled with plain sap.ui.core.Item elements. The list opens in a popover whose rows are as big as the field, so they can be hit with a finger — the native list of sap.m.Select keeps its standard row height however large the field is. Supports selectedKey, editable, forceSelection, value states and width. On a phone the list takes the whole screen, as it does in sap.m. Fires change.",
	},
	{
		name: "ComboBox",
		replaces: "sap.m.ComboBox",
		extendsClass: "sap.ui.core.Control",
		since: "1.2.0",
		summary:
			"A Select the user can type into: free text is allowed, what is typed filters the list, and the rows are as big as the field.",
		original:
			"A drop-down the user can also type into: what is typed filters the list, and a value that is not in the list is allowed.",
		description:
			"A Select the user can type into: free text is allowed and what is typed filters the list, whose rows are as big as the field. Works together with the keyboards of this library on a device without one. Supports value, selectedKey, placeholder, editable, value states, width and showSecondaryValues, which puts the additionalText of a sap.ui.core.ListItem at the end of a row. On a phone the list takes the whole screen and brings a field of its own to go on typing in, as it does in sap.m. Fires change and selectionChange.",
	},
	{
		name: "DatePicker",
		replaces: "sap.m.DatePicker",
		extendsClass: "sap.ui.core.Control",
		since: "1.2.0",
		summary:
			"A date field whose calendar is built from the buttons of this library, so a day is a square that grows with the size property.",
		original:
			"A field with a calendar popup built on sap.ui.unified.Calendar, with minDate/maxDate and configurable value and display formats.",
		description:
			"Field with a calendar that is built from the library's own buttons, so a day is a square that grows with the size property instead of the fixed grid of sap.ui.unified.Calendar. Days and months view, minDate/maxDate, valueFormat and displayFormat (style or pattern). Fires change with value, dateValue and valid.",
	},
	{
		name: "TimePicker",
		replaces: "sap.m.TimePicker",
		extendsClass: "sap.ui.core.Control",
		since: "1.2.0",
		summary:
			"A time field that is filled with one tap on an hour and one on a minute, instead of a slider that has to be dragged.",
		original:
			"A field with a popup in which hours and minutes are set on sliders that have to be dragged.",
		description:
			"Field with two columns of buttons - hours and minutes - so a time is picked with one tap on a target that grows with size, where sap.m.TimePicker uses a slider that has to be dragged. Supports minutesStep, valueFormat and displayFormat. Fires change once, when the popover closes.",
	},
	{
		name: "Input",
		replaces: "sap.m.Input",
		extendsClass: "sap.ui.core.Control",
		since: "1.0.0",
		summary:
			"A single-line input that scales with its size property and can bring a keyboard of this library along, for a device that has none of its own.",
		original:
			"The standard single-line input of sap.m, with placeholder, maximum length, value states and suggestions.",
		description:
			"Single-line input with configurable size. A keyboard of this library - tc:Keyboard, tc:NumberPad or tc:CustomKeyboard - can be put into its keyboard aggregation; with showKeyboard it then opens in a popover below the field while the field has the focus and types into it.",
	},
	{
		name: "TextArea",
		replaces: "sap.m.TextArea",
		extendsClass: "sap.ui.core.Control",
		since: "1.0.0",
		summary:
			"A multi-line input that scales with its size property and takes a keyboard of this library, whose Enter key adds a line break here.",
		original:
			"The standard multi-line input of sap.m, with rows, a maximum length and value states.",
		description:
			"Multi-line input with configurable size, rows, max length and value states. Takes a keyboard in its keyboard aggregation just like the Input does; there the Enter key adds a line break. Fires change / liveChange.",
	},
	{
		name: "Text",
		replaces: "sap.m.Text",
		extendsClass: "sap.ui.core.Control",
		since: "1.0.0",
		summary:
			"A text whose font size follows the same size property as every other control of the library, so a label sits at the scale of the field beside it.",
		original: "A text control with wrapping and a maximum number of lines.",
		description: "Text with configurable size and color. Fires press.",
	},
	{
		name: "Link",
		replaces: "sap.m.Link",
		extendsClass: "sap.ui.core.Control",
		since: "1.2.0",
		summary:
			"An anchor whose label — and with it the area that can be hit with a finger — grows with the size property.",
		original:
			"An anchor with href and target, and the subtle and emphasized variants.",
		description:
			'Anchor with configurable size, so the area that can be hit with a finger grows with the label. Supports href, target, wrapping, subtle, emphasized and width; a target="_blank" link automatically gets rel="noopener noreferrer". Fires press.',
	},
	{
		name: "Toolbar",
		replaces: "sap.m.Toolbar",
		extendsClass: "sap.m.Toolbar",
		since: "1.0.0",
		summary:
			"A bar for the controls of this library that still fits wherever sap.m expects a toolbar of its own — the footer of a Page or a Dialog, for instance.",
		original:
			"A bar that lays its content out in a row. Many header and footer aggregations in sap.m are typed to it.",
		description:
			"Toolbar container with a content aggregation. Usable in standard aggregations such as the footer of a Page or Dialog.",
	},
	{
		name: "OverflowToolbar",
		replaces: "sap.m.OverflowToolbar",
		extendsClass: "sap.m.Toolbar",
		since: "1.2.0",
		summary:
			"A Toolbar that moves what does not fit into a popover behind a button with three dots, steered by the priorities of sap.m.OverflowToolbarLayoutData.",
		original:
			"A Toolbar that moves what does not fit into a popover behind a button with three dots, steered by the priorities of sap.m.OverflowToolbarLayoutData.",
		description:
			"Like tc:Toolbar, but content that does not fit into the available width is moved behind a button with three dots which opens a popover with the remaining content. Understands the priorities of sap.m.OverflowToolbarLayoutData.",
	},
	{
		name: "StepInput",
		replaces: "sap.m.StepInput",
		extendsClass: "sap.ui.core.Control",
		since: "1.0.0",
		summary:
			"A numeric field with a minus and a plus button that are sized together with it, so a value can be stepped with a thumb.",
		original:
			"A numeric field with a minus and a plus button, with min, max and step.",
		description:
			"Minus button, input and plus button, sized together. Supports min, max, step. Fires change.",
	},
	{
		name: "BarcodeInput",
		replaces: NEW_CONTROL,
		extendsClass: "sap.ui.core.Control",
		since: "1.2.0",
		summary:
			"An input field that tells a barcode scanner from a person typing and reports the two as different events.",
		description:
			"Input field that tells a barcode scanner from a person typing: a run of at least minLength characters whose gaps stay below scanTimeout and that is closed by Enter fires scan, everything else fires change. prefix and suffix are cut off the code, clearOnScan empties the field for the next one.",
	},
	{
		name: "Keyboard",
		replaces: NEW_CONTROL,
		extendsClass: "ui5.touch.controls.KeyboardBase",
		since: "2.0.0",
		summary:
			"An on-screen keyboard of letters for a device that has none of its own. The mode picks the arrangement of a country; a handful of switches say what else is on it.",
		description:
			"On-screen keyboard of letters, built from the library's own buttons. The mode property picks the arrangement of a country - English, German, French, Spanish, Ukrainian, Russian, Hindi - and a handful of switches say what else is on it: displayNumbers puts the digits over the letters or behind a key, showSpecialCharacters adds a set of signs, letterCase pins the keyboard to capitals or lower case, showCapsLock and showEscape add a key each. Optional hardware key input, value binding and change / keyPress / enter / escape events.",
	},
	{
		name: "NumberPad",
		replaces: NEW_CONTROL,
		extendsClass: "ui5.touch.controls.KeyboardBase",
		since: "2.0.0",
		summary:
			"An on-screen pad of digits in three columns, for everything that is typed as a number. The mode picks the block: a computer pad, a telephone pad or a calculator.",
		description:
			"On-screen pad of digits in three columns. The mode property picks the block - Simple (the pad of a computer), Phone (the pad of a telephone) or Calculator (with the four basic operations) - and showDecimalSeparator, decimalSeparator, showSign and showSpecialCharacters add what a field needs beyond the digits. Shares its value handling, sizing and docking with the other keyboards.",
	},
	{
		name: "CustomKeyboard",
		replaces: NEW_CONTROL,
		extendsClass: "ui5.touch.controls.KeyboardBase",
		since: "2.0.0",
		summary:
			"The keyboard whose keys are handed to it, row by row. It is the answer to everything the ready-made keyboards do not cover.",
		description:
			"On-screen keyboard whose keys are handed to it: the layout property is the rows of one set, the layouts aggregation carries as many sets as are needed, and a key written as the name of a set switches to it. The display aggregation says what a single key reads. This is the keyboard for everything the ready-made ones do not cover.",
	},
	{
		name: "SignaturePad",
		replaces: NEW_CONTROL,
		extendsClass: "sap.ui.core.Control",
		since: "1.2.0",
		summary:
			"A field to sign in with a finger or a stylus. The signature comes out as a PNG data URL, so it can be bound to a model like any other value.",
		description:
			"A field to sign in with a finger or a stylus. Draws on a canvas and hands the signature over as a PNG data URL in value, so it can be bound to a model. Stroke width, placeholder and clear button follow the size property; the strokes survive a resize. Fires change.",
	},
	{
		name: "QuickDialog",
		replaces: "sap.m.MessageBox",
		isClass: true,
		extendsClass: "sap.ui.base.ManagedObject",
		since: "1.1.0",
		summary:
			"Ready-made dialogs built from the touch controls, called from the controller instead of written into a view. Every method returns a Promise.",
		description:
			"Helper class for touch-ready dialogs, used from the controller instead of a view: show, confirm, information, error, input, select, details. Every method returns a Promise.",
	},
];

/** rebuilds of sap.m controls */
export const portedControls: ControlDoc[] = controls.filter(
	(control) => control.replaces !== NEW_CONTROL && !control.isClass,
);

/** what is called from a controller rather than put into a view */
export const classControls: ControlDoc[] = controls.filter(
	(control) => control.isClass,
);

/** the controls that exist only in this library */
export const newControls: ControlDoc[] = controls.filter(
	(control) => control.replaces === NEW_CONTROL,
);

export const themes: ThemeDoc[] = [
	{
		name: "Horizon",
		id: "sap_horizon",
		supported: true,
		note: "Default theme of the demo",
	},
	{
		name: "Horizon Dark",
		id: "sap_horizon_dark",
		supported: true,
		note: "Dark variant of Horizon",
	},
	{
		name: "Horizon High Contrast Black",
		id: "sap_horizon_hcb",
		supported: true,
		note: "High contrast, dark background",
	},
	{
		name: "Horizon High Contrast White",
		id: "sap_horizon_hcw",
		supported: true,
		note: "High contrast, light background",
	},
	{
		name: "Fiori 3 (Quartz Light)",
		id: "sap_fiori_3",
		supported: true,
		note: "Previous default theme of UI5",
	},
	{
		name: "Fiori 3 Dark (Quartz Dark)",
		id: "sap_fiori_3_dark",
		supported: true,
		note: "Dark variant of Fiori 3",
	},
];

/** the entry of one control, by its page key */
export function getControlDoc(name: string): ControlDoc | undefined {
	return controls.find((control) => control.name === name);
}

/**
 * Link to the page of a UI5 entity in the demo kit.
 *
 * The hash form is the one the demo kit itself uses; the path without it is
 * routed on the client only and answers a plain request with a 404.
 *
 * Entities of this library are not in the demo kit, so they get no link.
 */
export function getApiUrl(entity: string): string {
	return entity.startsWith("sap.")
		? `https://sdk.openui5.org/#/api/${entity}`
		: "";
}
