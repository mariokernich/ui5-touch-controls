/**
 * The pages of the demo application.
 *
 * The list drives the side navigation and the previous/next buttons. It has to
 * stay in sync with the routes in manifest.json - the key of a page is both the
 * name of its view and the last segment of its route pattern.
 */
export interface PageInfo {
	/** view name without the namespace, also the route name */
	key: string;
	/** label shown in the side navigation */
	text: string;
	/**
	 * i18n key of the label, for the pages whose name is translated. The
	 * control pages carry the name of their control, which is the same in
	 * every language.
	 */
	textKey?: string;
	icon: string;
}

/**
 * Introductory pages. They explain what the library is, how to install it and
 * how to use it.
 *
 * Unlike the two lists below, these are not bound in the side navigation -
 * App.view.xml lists them statically, because they sit above the two groups.
 * They are only used for the previous/next buttons and the page title.
 */
export const introPages: PageInfo[] = [
	{
		key: "GettingStarted",
		text: "Getting Started",
		textKey: "navGettingStarted",
		icon: "sap-icon://home",
	},
	{
		key: "Setup",
		text: "Setup",
		textKey: "navSetup",
		icon: "sap-icon://wrench",
	},
	{
		key: "Documentation",
		text: "Documentation",
		textKey: "navDocumentation",
		icon: "sap-icon://documents",
	},
	// the page itself is English only, and so is its name
	{
		key: "Changelog",
		text: "Changelog",
		icon: "sap-icon://history",
	},
];

/** rebuilds of sap.m controls */
export const portedPages: PageInfo[] = [
	{ key: "Button", text: "Button", icon: "sap-icon://demo/button" },
	{
		key: "SegmentedButton",
		text: "SegmentedButton",
		icon: "sap-icon://demo/segmented-button",
	},
	{ key: "CheckBox", text: "CheckBox", icon: "sap-icon://demo/check-box" },
	{ key: "RadioButton", text: "RadioButton", icon: "sap-icon://demo/radio-button" },
	{ key: "Switch", text: "Switch", icon: "sap-icon://demo/switch" },
	{ key: "Select", text: "Select", icon: "sap-icon://demo/select" },
	{ key: "ComboBox", text: "ComboBox", icon: "sap-icon://demo/combo-box" },
	{ key: "DatePicker", text: "DatePicker", icon: "sap-icon://demo/date-picker" },
	{
		key: "TimePicker",
		text: "TimePicker",
		icon: "sap-icon://demo/time-picker",
	},
	{ key: "Input", text: "Input", icon: "sap-icon://demo/input" },
	{ key: "TextArea", text: "TextArea", icon: "sap-icon://demo/text-area" },
	{ key: "StepInput", text: "StepInput", icon: "sap-icon://demo/step-input" },
	{ key: "Text", text: "Text", icon: "sap-icon://demo/text" },
	{ key: "Link", text: "Link", icon: "sap-icon://demo/link" },
	{ key: "Toolbar", text: "Toolbar", icon: "sap-icon://demo/toolbar" },
	{
		key: "OverflowToolbar",
		text: "OverflowToolbar",
		icon: "sap-icon://demo/overflow-toolbar",
	},
];

/** the controls that have no sap.m equivalent */
export const additionalPages: PageInfo[] = [
	{ key: "Keyboard", text: "Keyboard", icon: "sap-icon://demo/keyboard" },
	{ key: "NumberPad", text: "NumberPad", icon: "sap-icon://demo/number-pad" },
	{
		key: "CustomKeyboard",
		text: "CustomKeyboard",
		icon: "sap-icon://demo/custom-keyboard",
	},
	// the base class of the three keyboards above. Not a control that is put
	// into a view, but it has a page because the three link to it
	{
		key: "KeyboardBase",
		text: "KeyboardBase",
		icon: "sap-icon://demo/keyboard-base",
	},
	{ key: "BarcodeInput", text: "BarcodeInput", icon: "sap-icon://demo/barcode-input" },
	{ key: "SignaturePad", text: "SignaturePad", icon: "sap-icon://demo/signature-pad" },
];

/**
 * What the library adds next to the controls: classes that are used from a
 * controller instead of being placed in a view.
 */
export const classPages: PageInfo[] = [
	{ key: "QuickDialog", text: "QuickDialog", icon: "sap-icon://demo/quick-dialog" },
];

/** the order used by the previous/next buttons in the header */
export const allPages: PageInfo[] = [
	...introPages,
	...portedPages,
	...additionalPages,
	...classPages,
];
