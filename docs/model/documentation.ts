/**
 * The content of the two control tables and the theme table on the
 * documentation page.
 *
 * The entries hold the facts about a control - what it is called, what it
 * steps in for, what it extends - while the sentences about it live in the
 * resource bundle. What is kept here is the key of a text, so the pages read
 * in the language the demo is set to.
 */
export interface ControlDoc {
	/** name of the control, also the key of its page */
	name: string;
	/** the sap.m control it steps in for, or {@link NEW_CONTROL} */
	replaces: string;
	/**
	 * i18n key of one or two sentences that say what the control is. This is
	 * the intro at the head of its page, so it stays shorter than
	 * {@link ControlDoc.descriptionKey} and does not repeat it word for word.
	 */
	summaryKey: string;
	/**
	 * i18n key of what this control does, shown on its page and in the control
	 * table.
	 */
	descriptionKey: string;
	/** the class the control is built on, e.g. sap.ui.core.Control */
	extendsClass: string;
	/** the release of the library the control came with */
	since: string;
	/**
	 * i18n key of what the sap.m original does. Shown next to the description
	 * on the page of the control, so the two can be read against each other.
	 */
	originalKey?: string;
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
	/**
	 * Whether this is a base class that is not used directly. It has a page of
	 * its own - the subclasses link to it - but it is left out of the tables of
	 * the documentation page, which list what can be put into a view.
	 */
	isBase?: boolean;
	/**
	 * How the class is meant to be used, the way the demo kit says it. Defaults
	 * to <code>public</code>; a base class is <code>restricted</code>.
	 */
	visibility?: string;
}

export interface ThemeDoc {
	/** display name of the theme */
	name: string;
	/** the theme id used in data-sap-ui-theme */
	id: string;
	/** whether the library ships a theme library for it */
	supported: boolean;
	/** i18n key of the short remark shown in the last column */
	noteKey: string;
}

/** marker of the controls that have no sap.m equivalent */
export const NEW_CONTROL = "nothing — new";

const controls: ControlDoc[] = [
	{
		name: "Button",
		replaces: "sap.m.Button",
		extendsClass: "sap.ui.core.Control",
		since: "1.0.0",
		summaryKey: "docButtonSummary",
		originalKey: "docButtonOriginal",
		descriptionKey: "docButtonDescription",
	},
	{
		name: "SegmentedButton",
		replaces: "sap.m.SegmentedButton",
		extendsClass: "sap.ui.core.Control",
		since: "1.2.0",
		summaryKey: "docSegmentedButtonSummary",
		originalKey: "docSegmentedButtonOriginal",
		descriptionKey: "docSegmentedButtonDescription",
	},
	{
		name: "CheckBox",
		replaces: "sap.m.CheckBox",
		extendsClass: "sap.ui.core.Control",
		since: "1.2.0",
		summaryKey: "docCheckBoxSummary",
		originalKey: "docCheckBoxOriginal",
		descriptionKey: "docCheckBoxDescription",
	},
	{
		name: "RadioButton",
		replaces: "sap.m.RadioButton / sap.m.RadioButtonGroup",
		docEntity: "sap.m.RadioButtonGroup",
		extendsClass: "sap.ui.core.Control",
		since: "1.2.0",
		summaryKey: "docRadioButtonSummary",
		originalKey: "docRadioButtonOriginal",
		descriptionKey: "docRadioButtonDescription",
	},
	{
		name: "Switch",
		replaces: "sap.m.Switch",
		extendsClass: "sap.ui.core.Control",
		since: "1.2.0",
		summaryKey: "docSwitchSummary",
		originalKey: "docSwitchOriginal",
		descriptionKey: "docSwitchDescription",
	},
	{
		name: "Select",
		replaces: "sap.m.Select",
		extendsClass: "sap.ui.core.Control",
		since: "1.2.0",
		summaryKey: "docSelectSummary",
		originalKey: "docSelectOriginal",
		descriptionKey: "docSelectDescription",
	},
	{
		name: "ComboBox",
		replaces: "sap.m.ComboBox",
		extendsClass: "sap.ui.core.Control",
		since: "1.2.0",
		summaryKey: "docComboBoxSummary",
		originalKey: "docComboBoxOriginal",
		descriptionKey: "docComboBoxDescription",
	},
	{
		name: "DatePicker",
		replaces: "sap.m.DatePicker",
		extendsClass: "sap.ui.core.Control",
		since: "1.2.0",
		summaryKey: "docDatePickerSummary",
		originalKey: "docDatePickerOriginal",
		descriptionKey: "docDatePickerDescription",
	},
	{
		name: "TimePicker",
		replaces: "sap.m.TimePicker",
		extendsClass: "sap.ui.core.Control",
		since: "1.2.0",
		summaryKey: "docTimePickerSummary",
		originalKey: "docTimePickerOriginal",
		descriptionKey: "docTimePickerDescription",
	},
	{
		name: "Input",
		replaces: "sap.m.Input",
		extendsClass: "sap.ui.core.Control",
		since: "1.0.0",
		summaryKey: "docInputSummary",
		originalKey: "docInputOriginal",
		descriptionKey: "docInputDescription",
	},
	{
		name: "TextArea",
		replaces: "sap.m.TextArea",
		extendsClass: "sap.ui.core.Control",
		since: "1.0.0",
		summaryKey: "docTextAreaSummary",
		originalKey: "docTextAreaOriginal",
		descriptionKey: "docTextAreaDescription",
	},
	{
		name: "Text",
		replaces: "sap.m.Text",
		extendsClass: "sap.ui.core.Control",
		since: "1.0.0",
		summaryKey: "docTextSummary",
		originalKey: "docTextOriginal",
		descriptionKey: "docTextDescription",
	},
	{
		name: "Link",
		replaces: "sap.m.Link",
		extendsClass: "sap.ui.core.Control",
		since: "1.2.0",
		summaryKey: "docLinkSummary",
		originalKey: "docLinkOriginal",
		descriptionKey: "docLinkDescription",
	},
	{
		name: "Toolbar",
		replaces: "sap.m.Toolbar",
		extendsClass: "sap.m.Toolbar",
		since: "1.0.0",
		summaryKey: "docToolbarSummary",
		originalKey: "docToolbarOriginal",
		descriptionKey: "docToolbarDescription",
	},
	{
		name: "OverflowToolbar",
		replaces: "sap.m.OverflowToolbar",
		extendsClass: "sap.m.Toolbar",
		since: "1.2.0",
		summaryKey: "docOverflowToolbarSummary",
		originalKey: "docOverflowToolbarOriginal",
		descriptionKey: "docOverflowToolbarDescription",
	},
	{
		name: "StepInput",
		replaces: "sap.m.StepInput",
		extendsClass: "sap.ui.core.Control",
		since: "1.0.0",
		summaryKey: "docStepInputSummary",
		originalKey: "docStepInputOriginal",
		descriptionKey: "docStepInputDescription",
	},
	{
		name: "BarcodeInput",
		replaces: NEW_CONTROL,
		extendsClass: "sap.ui.core.Control",
		since: "1.2.0",
		summaryKey: "docBarcodeInputSummary",
		descriptionKey: "docBarcodeInputDescription",
	},
	{
		name: "Keyboard",
		replaces: NEW_CONTROL,
		extendsClass: "ui5.touch.controls.KeyboardBase",
		since: "2.0.0",
		summaryKey: "docKeyboardSummary",
		descriptionKey: "docKeyboardDescription",
	},
	{
		name: "NumberPad",
		replaces: NEW_CONTROL,
		extendsClass: "ui5.touch.controls.KeyboardBase",
		since: "2.0.0",
		summaryKey: "docNumberPadSummary",
		descriptionKey: "docNumberPadDescription",
	},
	{
		name: "CustomKeyboard",
		replaces: NEW_CONTROL,
		extendsClass: "ui5.touch.controls.KeyboardBase",
		since: "2.0.0",
		summaryKey: "docCustomKeyboardSummary",
		descriptionKey: "docCustomKeyboardDescription",
	},
	{
		name: "KeyboardBase",
		replaces: NEW_CONTROL,
		extendsClass: "sap.ui.core.Control",
		since: "2.0.0",
		isBase: true,
		visibility: "restricted",
		summaryKey: "docKeyboardBaseSummary",
		descriptionKey: "docKeyboardBaseDescription",
	},
	{
		name: "SignaturePad",
		replaces: NEW_CONTROL,
		extendsClass: "sap.ui.core.Control",
		since: "1.2.0",
		summaryKey: "docSignaturePadSummary",
		descriptionKey: "docSignaturePadDescription",
	},
	{
		name: "QuickDialog",
		replaces: "sap.m.MessageBox",
		isClass: true,
		extendsClass: "sap.ui.base.ManagedObject",
		since: "1.1.0",
		summaryKey: "docQuickDialogSummary",
		descriptionKey: "docQuickDialogDescription",
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
	(control) => control.replaces === NEW_CONTROL && !control.isBase,
);

export const themes: ThemeDoc[] = [
	{
		name: "Horizon",
		id: "sap_horizon",
		supported: true,
		noteKey: "docThemeHorizon",
	},
	{
		name: "Horizon Dark",
		id: "sap_horizon_dark",
		supported: true,
		noteKey: "docThemeHorizonDark",
	},
	{
		name: "Horizon High Contrast Black",
		id: "sap_horizon_hcb",
		supported: true,
		noteKey: "docThemeHorizonHcb",
	},
	{
		name: "Horizon High Contrast White",
		id: "sap_horizon_hcw",
		supported: true,
		noteKey: "docThemeHorizonHcw",
	},
	{
		name: "Fiori 3 (Quartz Light)",
		id: "sap_fiori_3",
		supported: true,
		noteKey: "docThemeFiori3",
	},
	{
		name: "Fiori 3 Dark (Quartz Dark)",
		id: "sap_fiori_3_dark",
		supported: true,
		noteKey: "docThemeFiori3Dark",
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

/** where the sources of the library are read on GitHub */
const SOURCE_BASE =
	"https://github.com/mariokernich/ui5-touch-controls/blob/main/src";

/**
 * The file a class is written in, e.g. <code>Button.ts</code>.
 *
 * Every class of the library lives in a file of its own that carries its
 * name, so the name is all it takes to find it.
 */
export function getSourceFile(name: string): string {
	return `${name}.ts`;
}

/**
 * Link to the source of a class on GitHub.
 *
 * It points at the branch rather than at a tag: the demo runs from main, and
 * a link to a fixed release would age with every version.
 */
export function getSourceUrl(name: string): string {
	return `${SOURCE_BASE}/${getSourceFile(name)}`;
}
