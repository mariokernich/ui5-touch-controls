/**
 * The content of the two control tables and the theme table on the
 * documentation page.
 */
export interface ControlDoc {
	/** name of the control, also the key of its page */
	name: string;
	/** the sap.m control it steps in for, or {@link NEW_CONTROL} */
	replaces: string;
	description: string;
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
		description:
			"Button with configurable size, icon, icon position, type (all sap.m.ButtonType values), side padding and width. Fires press.",
	},
	{
		name: "SegmentedButton",
		replaces: "sap.m.SegmentedButton",
		description:
			"A row of joined buttons of which exactly one is selected, filled through tc:SegmentedButtonItem (key, text, icon, enabled). Supports selectedKey, width for evenly spread segments and fires selectionChange.",
	},
	{
		name: "CheckBox",
		replaces: "sap.m.CheckBox",
		description:
			"Check box whose box, check mark, label and hit area scale together — at size M the geometry matches sap.m.CheckBox. Supports selected, partiallySelected, text, editable, wrapping, value states and width. Fires select.",
	},
	{
		name: "RadioButton",
		replaces: "sap.m.RadioButton / sap.m.RadioButtonGroup",
		description:
			"Circle, dot, label and hit area scale together — at size M the geometry matches sap.m.RadioButton. Buttons sharing a groupName are mutually exclusive; tc:RadioButtonGroup arranges them in columns and hands its size, enabled, editable and value state down to them. Fires select.",
	},
	{
		name: "Switch",
		replaces: "sap.m.Switch",
		description:
			"Track, handle and label scale together, where sap.m.Switch is fixed at 4rem x 2rem. Supports state, customTextOn, customTextOff and the AcceptReject type; the colors come from the @sapButton_Track_* / @sapButton_Handle_* theme parameters. Fires change.",
	},
	{
		name: "Select",
		replaces: "sap.m.Select",
		description:
			"Drop-down filled with plain sap.ui.core.Item elements. The list opens in a popover whose rows are as big as the field, so they can be hit with a finger — the native list of sap.m.Select keeps its standard row height however large the field is. Supports selectedKey, editable, forceSelection, value states and width. Fires change.",
	},
	{
		name: "ComboBox",
		replaces: "sap.m.ComboBox",
		description:
			"A Select the user can type into: free text is allowed and what is typed filters the list, whose rows are as big as the field. Works together with tc:VirtualKeyboard on a device without a keyboard. Supports value, selectedKey, placeholder, editable, value states, width and showSecondaryValues, which puts the additionalText of a sap.ui.core.ListItem at the end of a row. Fires change and selectionChange.",
	},
	{
		name: "DatePicker",
		replaces: "sap.m.DatePicker",
		description:
			"Field with a calendar that is built from the library's own buttons, so a day is a square that grows with the size property instead of the fixed grid of sap.ui.unified.Calendar. Days and months view, minDate/maxDate, valueFormat and displayFormat (style or pattern). Fires change with value, dateValue and valid.",
	},
	{
		name: "TimePicker",
		replaces: "sap.m.TimePicker",
		description:
			"Field with two columns of buttons - hours and minutes - so a time is picked with one tap on a target that grows with size, where sap.m.TimePicker uses a slider that has to be dragged. Supports minutesStep, valueFormat and displayFormat. Fires change once, when the popover closes.",
	},
	{
		name: "Input",
		replaces: "sap.m.Input",
		description:
			"Single-line input with configurable size. A tc:VirtualKeyboard can be put into its virtualKeyboard aggregation; with showVirtualKeyboard it then opens in a popover below the field while the field has the focus and types into it.",
	},
	{
		name: "TextArea",
		replaces: "sap.m.TextArea",
		description:
			"Multi-line input with configurable size, rows, max length and value states. Takes a VirtualKeyboard in its virtualKeyboard aggregation just like the Input does; there the Enter key adds a line break. Fires change / liveChange.",
	},
	{
		name: "Text",
		replaces: "sap.m.Text",
		description: "Text with configurable size and color. Fires press.",
	},
	{
		name: "Link",
		replaces: "sap.m.Link",
		description:
			'Anchor with configurable size, so the area that can be hit with a finger grows with the label. Supports href, target, wrapping, subtle, emphasized and width; a target="_blank" link automatically gets rel="noopener noreferrer". Fires press.',
	},
	{
		name: "Toolbar",
		replaces: "sap.m.Toolbar",
		description:
			"Toolbar container with a content aggregation. Usable in standard aggregations such as the footer of a Page or Dialog.",
	},
	{
		name: "OverflowToolbar",
		replaces: "sap.m.OverflowToolbar",
		description:
			"Like tc:Toolbar, but content that does not fit into the available width is moved behind a button with three dots which opens a popover with the remaining content. Understands the priorities of sap.m.OverflowToolbarLayoutData.",
	},
	{
		name: "StepInput",
		replaces: "sap.m.StepInput",
		description:
			"Minus button, input and plus button, sized together. Supports min, max, step. Fires change.",
	},
	{
		name: "BarcodeInput",
		replaces: NEW_CONTROL,
		description:
			"Input field that tells a barcode scanner from a person typing: a run of at least minLength characters whose gaps stay below scanTimeout and that is closed by Enter fires scan, everything else fires change. prefix and suffix are cut off the code, clearOnScan empties the field for the next one.",
	},
	{
		name: "VirtualKeyboard",
		replaces: NEW_CONTROL,
		description:
			"On-screen keyboard built from the library's own buttons, with configurable layout (incl. {shift}, {space}, {bksp}, {enter}), optional hardware key input, value binding and change / keyPress / enter events.",
	},
	{
		name: "SignaturePad",
		replaces: NEW_CONTROL,
		description:
			"A field to sign in with a finger or a stylus. Draws on a canvas and hands the signature over as a PNG data URL in value, so it can be bound to a model. Stroke width, placeholder and clear button follow the size property; the strokes survive a resize. Fires change.",
	},
	{
		name: "QuickDialog",
		replaces: "sap.m.MessageBox",
		description:
			"Helper class for touch-ready dialogs, used from the controller instead of a view: show, confirm, information, error, input, select, details. Every method returns a Promise.",
	},
];

/** rebuilds of sap.m controls */
export const portedControls: ControlDoc[] = controls.filter(
	(control) => control.replaces !== NEW_CONTROL,
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
		note: "Previous default theme of SAPUI5 / OpenUI5",
	},
	{
		name: "Fiori 3 Dark (Quartz Dark)",
		id: "sap_fiori_3_dark",
		supported: true,
		note: "Dark variant of Fiori 3",
	},
];
