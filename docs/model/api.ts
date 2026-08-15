/**
 * The API of the controls this library brings along that have no sap.m
 * original to look the API up in - what they are set with, what they fire and
 * what goes inside them.
 *
 * Like the control table of the documentation page, an entry holds the facts
 * about a member - its name, its type, what it starts on - while the sentence
 * about it lives in the resource bundle. What is kept here is the key of that
 * sentence, so the tables read in the language the demo is set to.
 *
 * A control that is built on a class of this library lists what it adds and
 * names the class the rest comes from; the page of that class has the tables
 * for it. Repeating them on every subclass would mean keeping the same eight
 * properties in four places.
 */

/** one property, event or aggregation of a control */
export interface ApiMember {
	/** name of the member, the way it is written in a view */
	name: string;
	/** type of a property or an aggregation, e.g. <code>boolean</code> */
	type?: string;
	/** what a property starts on, written the way a view would say it */
	default?: string;
	/** the parameters of an event, separated by commas */
	parameters?: string;
	/** how many controls an aggregation takes, e.g. <code>0..n</code> */
	cardinality?: string;
	/** i18n key of the sentence that says what the member does */
	textKey: string;
}

/** the API of one control, in the order the tables show it */
export interface ApiDoc {
	properties?: ApiMember[];
	events?: ApiMember[];
	aggregations?: ApiMember[];
	/**
	 * The class of this library the control is built on, if the rest of its
	 * API is documented there. It is named under the tables, as a way over to
	 * that page.
	 */
	inherits?: string;
}

/** what every keyboard of this library is built on */
const KEYBOARD_BASE = "ui5.touch.controls.KeyboardBase";

const api: Record<string, ApiDoc> = {
	Keyboard: {
		inherits: KEYBOARD_BASE,
		properties: [
			{
				name: "mode",
				type: "ui5.touch.controls.KeyboardMode",
				default: "English",
				textKey: "apiKbMode",
			},
			{
				name: "displayNumbers",
				type: "ui5.touch.controls.NumberKeys",
				default: "ToggleOnMobile",
				textKey: "apiKbDisplayNumbers",
			},
			{
				name: "showSpecialCharacters",
				type: "boolean",
				default: "false",
				textKey: "apiKbShowSpecialCharacters",
			},
			{
				name: "showCapsLock",
				type: "boolean",
				default: "false",
				textKey: "apiKbShowCapsLock",
			},
			{
				name: "letterCase",
				type: "ui5.touch.controls.LetterCase",
				default: "Mixed",
				textKey: "apiKbLetterCase",
			},
			{
				name: "showEmojis",
				type: "boolean",
				default: "false",
				textKey: "apiKbShowEmojis",
			},
			{
				name: "extraKeys",
				type: "string[]",
				default: "[]",
				textKey: "apiKbExtraKeys",
			},
			{
				name: "showEscape",
				type: "boolean",
				default: "false",
				textKey: "apiKbShowEscape",
			},
			{
				name: "enterText",
				type: "string",
				default: '""',
				textKey: "apiKbEnterText",
			},
		],
	},
	NumberPad: {
		inherits: KEYBOARD_BASE,
		properties: [
			{
				name: "mode",
				type: "ui5.touch.controls.NumberPadMode",
				default: "Simple",
				textKey: "apiPadMode",
			},
			{
				name: "showSpecialCharacters",
				type: "boolean",
				default: "false",
				textKey: "apiPadShowSpecialCharacters",
			},
			{
				name: "showDecimalSeparator",
				type: "boolean",
				default: "false",
				textKey: "apiPadShowDecimalSeparator",
			},
			{
				name: "decimalSeparator",
				type: "string",
				default: '""',
				textKey: "apiPadDecimalSeparator",
			},
			{
				name: "showSign",
				type: "boolean",
				default: "false",
				textKey: "apiPadShowSign",
			},
			{
				name: "showEscape",
				type: "boolean",
				default: "false",
				textKey: "apiPadShowEscape",
			},
			{
				name: "enterText",
				type: "string",
				default: '""',
				textKey: "apiPadEnterText",
			},
		],
	},
	CustomKeyboard: {
		inherits: KEYBOARD_BASE,
		properties: [
			{
				name: "layout",
				type: "string[]",
				default: '["7 8 9", "4 5 6", "1 2 3", "{bksp} 0 {enter}"]',
				textKey: "apiCustomLayout",
			},
		],
		aggregations: [
			{
				name: "layouts",
				type: "ui5.touch.controls.KeyboardLayout",
				cardinality: "0..n",
				textKey: "apiCustomLayouts",
			},
			{
				name: "display",
				type: "ui5.touch.controls.KeyboardKey",
				cardinality: "0..n",
				textKey: "apiCustomDisplay",
			},
		],
	},
	BarcodeInput: {
		properties: [
			{ name: "value", type: "string", default: '""', textKey: "apiBcValue" },
			{
				name: "placeholder",
				type: "string",
				default: '""',
				textKey: "apiBcPlaceholder",
			},
			{
				name: "scanTimeout",
				type: "int",
				default: "40",
				textKey: "apiBcScanTimeout",
			},
			{ name: "minLength", type: "int", default: "3", textKey: "apiBcMinLength" },
			{ name: "prefix", type: "string", default: '""', textKey: "apiBcPrefix" },
			{ name: "suffix", type: "string", default: '""', textKey: "apiBcSuffix" },
			{
				name: "clearOnScan",
				type: "boolean",
				default: "true",
				textKey: "apiBcClearOnScan",
			},
			{
				name: "enabled",
				type: "boolean",
				default: "true",
				textKey: "apiBcEnabled",
			},
			{
				name: "editable",
				type: "boolean",
				default: "true",
				textKey: "apiBcEditable",
			},
			{
				name: "valueState",
				type: "sap.ui.core.ValueState",
				default: "None",
				textKey: "apiBcValueState",
			},
			{
				name: "width",
				type: "sap.ui.core.CSSSize",
				default: "-",
				textKey: "apiBcWidth",
			},
			{
				name: "size",
				type: "ui5.touch.controls.SizeMode",
				default: "M",
				textKey: "apiBcSize",
			},
		],
		events: [
			{ name: "scan", parameters: "value, rawValue", textKey: "apiBcScan" },
			{ name: "change", parameters: "value", textKey: "apiBcChange" },
			{ name: "liveChange", parameters: "value", textKey: "apiBcLiveChange" },
		],
	},
	SignaturePad: {
		properties: [
			{ name: "value", type: "string", default: '""', textKey: "apiSpValue" },
			{
				name: "placeholder",
				type: "string",
				default: '""',
				textKey: "apiSpPlaceholder",
			},
			{
				name: "height",
				type: "sap.ui.core.CSSSize",
				default: "10rem",
				textKey: "apiSpHeight",
			},
			{
				name: "width",
				type: "sap.ui.core.CSSSize",
				default: "100%",
				textKey: "apiSpWidth",
			},
			{
				name: "showClearButton",
				type: "boolean",
				default: "true",
				textKey: "apiSpShowClearButton",
			},
			{
				name: "enabled",
				type: "boolean",
				default: "true",
				textKey: "apiSpEnabled",
			},
			{
				name: "valueState",
				type: "sap.ui.core.ValueState",
				default: "None",
				textKey: "apiSpValueState",
			},
			{
				name: "size",
				type: "ui5.touch.controls.SizeMode",
				default: "M",
				textKey: "apiSpSize",
			},
		],
		events: [
			{ name: "change", parameters: "value, signed", textKey: "apiSpChange" },
		],
	},
};

/**
 * Returns the API of the control with that name, or nothing where the page
 * carries no API card.
 *
 * @param name the key of the page, which is also the name of the control
 */
export function getApi(name: string): ApiDoc | undefined {
	return api[name];
}
