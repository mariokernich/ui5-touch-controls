/**
 * The content of the two control tables and the theme table on the
 * documentation page.
 */
export interface ControlDoc {
	/** name of the control, also the key of its page */
	name: string;
	/** the sap.m control it steps in for, or {@link NEW_CONTROL} */
	replaces: string;
	/** what this control does, shown on its page and in the control table */
	description: string;
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
		original:
			"The standard button of sap.m: text, icon, icon position, a button type and a press event. Its height is the one the theme prescribes and does not change.",
		description:
			"Button with configurable size, icon, icon position, type (all sap.m.ButtonType values), side padding and width. Fires press.",
	},
	{
		name: "SegmentedButton",
		replaces: "sap.m.SegmentedButton",
		original:
			"A row of joined buttons of which exactly one is selected, filled through sap.m.SegmentedButtonItem. Fires selectionChange.",
		description:
			"A row of joined buttons of which exactly one is selected, filled through tc:SegmentedButtonItem (key, text, icon, enabled). Supports selectedKey, width for evenly spread segments and fires selectionChange.",
	},
	{
		name: "CheckBox",
		replaces: "sap.m.CheckBox",
		original:
			"The standard check box of sap.m, with a label, a tristate selection and value states. Box and hit area have the size the theme gives them.",
		description:
			"Check box whose box, check mark, label and hit area scale together — at size M the geometry matches sap.m.CheckBox. Supports selected, partiallySelected, text, editable, wrapping, value states and width. Fires select.",
	},
	{
		name: "RadioButton",
		replaces: "sap.m.RadioButton / sap.m.RadioButtonGroup",
		docEntity: "sap.m.RadioButtonGroup",
		original:
			"A radio button that is mutually exclusive with the others of its groupName, plus a group control that arranges a set of them in columns.",
		description:
			"Circle, dot, label and hit area scale together — at size M the geometry matches sap.m.RadioButton. Buttons sharing a groupName are mutually exclusive; tc:RadioButtonGroup arranges them in columns and hands its size, enabled, editable and value state down to them. Fires select.",
	},
	{
		name: "Switch",
		replaces: "sap.m.Switch",
		original:
			"An on/off switch of a fixed size, with an accept/reject variant and custom texts for the two states.",
		description:
			"Track, handle and label scale together, where sap.m.Switch is fixed at 4rem x 2rem. Supports state, customTextOn, customTextOff and the AcceptReject type; the colors come from the @sapButton_Track_* / @sapButton_Handle_* theme parameters. Fires change.",
	},
	{
		name: "Select",
		replaces: "sap.m.Select",
		original:
			"A drop-down filled with sap.ui.core.Item elements. The list it opens keeps the standard row height, however large the field is.",
		description:
			"Drop-down filled with plain sap.ui.core.Item elements. The list opens in a popover whose rows are as big as the field, so they can be hit with a finger — the native list of sap.m.Select keeps its standard row height however large the field is. Supports selectedKey, editable, forceSelection, value states and width. Fires change.",
	},
	{
		name: "ComboBox",
		replaces: "sap.m.ComboBox",
		original:
			"A drop-down the user can also type into: what is typed filters the list, and a value that is not in the list is allowed.",
		description:
			"A Select the user can type into: free text is allowed and what is typed filters the list, whose rows are as big as the field. Works together with tc:VirtualKeyboard on a device without a keyboard. Supports value, selectedKey, placeholder, editable, value states, width and showSecondaryValues, which puts the additionalText of a sap.ui.core.ListItem at the end of a row. Fires change and selectionChange.",
	},
	{
		name: "DatePicker",
		replaces: "sap.m.DatePicker",
		original:
			"A field with a calendar popup built on sap.ui.unified.Calendar, with minDate/maxDate and configurable value and display formats.",
		description:
			"Field with a calendar that is built from the library's own buttons, so a day is a square that grows with the size property instead of the fixed grid of sap.ui.unified.Calendar. Days and months view, minDate/maxDate, valueFormat and displayFormat (style or pattern). Fires change with value, dateValue and valid.",
	},
	{
		name: "TimePicker",
		replaces: "sap.m.TimePicker",
		original:
			"A field with a popup in which hours and minutes are set on sliders that have to be dragged.",
		description:
			"Field with two columns of buttons - hours and minutes - so a time is picked with one tap on a target that grows with size, where sap.m.TimePicker uses a slider that has to be dragged. Supports minutesStep, valueFormat and displayFormat. Fires change once, when the popover closes.",
	},
	{
		name: "Input",
		replaces: "sap.m.Input",
		original:
			"The standard single-line input of sap.m, with placeholder, maximum length, value states and suggestions.",
		description:
			"Single-line input with configurable size. A tc:VirtualKeyboard can be put into its virtualKeyboard aggregation; with showVirtualKeyboard it then opens in a popover below the field while the field has the focus and types into it.",
	},
	{
		name: "TextArea",
		replaces: "sap.m.TextArea",
		original:
			"The standard multi-line input of sap.m, with rows, a maximum length and value states.",
		description:
			"Multi-line input with configurable size, rows, max length and value states. Takes a VirtualKeyboard in its virtualKeyboard aggregation just like the Input does; there the Enter key adds a line break. Fires change / liveChange.",
	},
	{
		name: "Text",
		replaces: "sap.m.Text",
		original:
			"A text control with wrapping and a maximum number of lines.",
		description: "Text with configurable size and color. Fires press.",
	},
	{
		name: "Link",
		replaces: "sap.m.Link",
		original:
			"An anchor with href and target, and the subtle and emphasized variants.",
		description:
			'Anchor with configurable size, so the area that can be hit with a finger grows with the label. Supports href, target, wrapping, subtle, emphasized and width; a target="_blank" link automatically gets rel="noopener noreferrer". Fires press.',
	},
	{
		name: "Toolbar",
		replaces: "sap.m.Toolbar",
		original:
			"A bar that lays its content out in a row. Many header and footer aggregations in sap.m are typed to it.",
		description:
			"Toolbar container with a content aggregation. Usable in standard aggregations such as the footer of a Page or Dialog.",
	},
	{
		name: "OverflowToolbar",
		replaces: "sap.m.OverflowToolbar",
		original:
			"A Toolbar that moves what does not fit into a popover behind a button with three dots, steered by the priorities of sap.m.OverflowToolbarLayoutData.",
		description:
			"Like tc:Toolbar, but content that does not fit into the available width is moved behind a button with three dots which opens a popover with the remaining content. Understands the priorities of sap.m.OverflowToolbarLayoutData.",
	},
	{
		name: "StepInput",
		replaces: "sap.m.StepInput",
		original:
			"A numeric field with a minus and a plus button, with min, max and step.",
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

/** the entry of one control, by its page key */
export function getControlDoc(name: string): ControlDoc | undefined {
	return controls.find((control) => control.name === name);
}

/**
 * Link to the page of a sap.m entity in the OpenUI5 demo kit.
 *
 * The hash form is the one the demo kit itself uses; the path without it is
 * routed on the client only and answers a plain request with a 404.
 */
export function getApiUrl(entity: string): string {
	return `https://sdk.openui5.org/#/api/${entity}`;
}
