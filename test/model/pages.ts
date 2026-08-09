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
];

/** rebuilds of sap.m controls */
export const portedPages: PageInfo[] = [
	{ key: "Button", text: "Button", icon: "sap-icon://cursor-arrow" },
	{
		key: "SegmentedButton",
		text: "SegmentedButton",
		icon: "sap-icon://switch-views",
	},
	{ key: "CheckBox", text: "CheckBox", icon: "sap-icon://complete" },
	{ key: "RadioButton", text: "RadioButton", icon: "sap-icon://record" },
	{ key: "Switch", text: "Switch", icon: "sap-icon://sys-enter-2" },
	{ key: "Select", text: "Select", icon: "sap-icon://slim-arrow-down" },
	{ key: "ComboBox", text: "ComboBox", icon: "sap-icon://value-help" },
	{ key: "DatePicker", text: "DatePicker", icon: "sap-icon://appointment-2" },
	{
		key: "TimePicker",
		text: "TimePicker",
		icon: "sap-icon://time-entry-request",
	},
	{ key: "Input", text: "Input", icon: "sap-icon://edit" },
	{ key: "TextArea", text: "TextArea", icon: "sap-icon://document-text" },
	{ key: "StepInput", text: "StepInput", icon: "sap-icon://number-sign" },
	{ key: "Text", text: "Text", icon: "sap-icon://text" },
	{ key: "Link", text: "Link", icon: "sap-icon://chain-link" },
	{ key: "Toolbar", text: "Toolbar", icon: "sap-icon://menu2" },
	{
		key: "OverflowToolbar",
		text: "OverflowToolbar",
		icon: "sap-icon://overflow",
	},
	{ key: "MessageBox", text: "MessageBox", icon: "sap-icon://message-popup" },
];

/** the controls that have no sap.m equivalent */
export const additionalPages: PageInfo[] = [
	{
		key: "VirtualKeyboard",
		text: "VirtualKeyboard",
		icon: "sap-icon://keyboard-and-mouse",
	},
	{ key: "BarcodeInput", text: "BarcodeInput", icon: "sap-icon://bar-code" },
	{ key: "SignaturePad", text: "SignaturePad", icon: "sap-icon://signature" },
];

/** the order used by the previous/next buttons in the header */
export const allPages: PageInfo[] = [
	...introPages,
	...portedPages,
	...additionalPages,
];
