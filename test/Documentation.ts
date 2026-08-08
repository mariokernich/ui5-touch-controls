import Column from "sap/m/Column";
import ColumnListItem from "sap/m/ColumnListItem";
import HBox from "sap/m/HBox";
import Label from "sap/m/Label";
import Link from "sap/m/Link";
import MessageStrip from "sap/m/MessageStrip";
import ObjectStatus from "sap/m/ObjectStatus";
import Table from "sap/m/Table";
import Text from "sap/m/Text";
import VBox from "sap/m/VBox";
import { ButtonType, FlexAlignItems, FlexWrap } from "sap/m/library";
import { MessageType, ValueState } from "sap/ui/core/library";
import initTestPage, {
	createExampleCard,
	createInfoCard,
	createPageTitle,
	createText,
	navigateTo,
} from "./Menu";
import StandardButton from "sap/m/Button";

interface ControlDoc {
	/** name of the control, also the key of its test page */
	name: string;
	/** the sap.m control it steps in for, or "new" */
	replaces: string;
	description: string;
	/** whether a test page exists for the control */
	hasPage: boolean;
}

interface ThemeDoc {
	/** display name of the theme */
	name: string;
	/** the theme id used in data-sap-ui-theme */
	id: string;
	/** whether the library ships a theme library for it */
	supported: boolean;
	/** short remark shown in the last column */
	note: string;
}

const controls: ControlDoc[] = [
	{
		name: "Button",
		replaces: "sap.m.Button",
		description:
			"Button with configurable size, icon, icon position, type (all sap.m.ButtonType values), side padding and width. Fires press.",
		hasPage: true,
	},
	{
		name: "SegmentedButton",
		replaces: "sap.m.SegmentedButton",
		description:
			"A row of joined buttons of which exactly one is selected, filled through tc:SegmentedButtonItem (key, text, icon, enabled). Supports selectedKey, width for evenly spread segments and fires selectionChange.",
		hasPage: true,
	},
	{
		name: "CheckBox",
		replaces: "sap.m.CheckBox",
		description:
			"Check box whose box, check mark, label and hit area scale together — at size M the geometry matches sap.m.CheckBox. Supports selected, partiallySelected, text, editable, wrapping, value states and width. Fires select.",
		hasPage: true,
	},
	{
		name: "Input",
		replaces: "sap.m.Input",
		description: "Single-line input with configurable size.",
		hasPage: true,
	},
	{
		name: "TextArea",
		replaces: "sap.m.TextArea",
		description:
			"Multi-line input with configurable size, rows, max length and value states. Fires change / liveChange.",
		hasPage: true,
	},
	{
		name: "Text",
		replaces: "sap.m.Text",
		description: "Text with configurable size and color. Fires press.",
		hasPage: true,
	},
	{
		name: "Link",
		replaces: "sap.m.Link",
		description:
			'Anchor with configurable size, so the area that can be hit with a finger grows with the label. Supports href, target, wrapping, subtle, emphasized and width; a target="_blank" link automatically gets rel="noopener noreferrer". Fires press.',
		hasPage: true,
	},
	{
		name: "Toolbar",
		replaces: "sap.m.Toolbar",
		description:
			"Toolbar container with a content aggregation. Usable in standard aggregations such as the footer of a Page or Dialog.",
		hasPage: true,
	},
	{
		name: "OverflowToolbar",
		replaces: "sap.m.OverflowToolbar",
		description:
			"Like tc:Toolbar, but content that does not fit into the available width is moved behind a button with three dots which opens a popover with the remaining content. Understands the priorities of sap.m.OverflowToolbarLayoutData.",
		hasPage: true,
	},
	{
		name: "StepInput",
		replaces: "sap.m.StepInput",
		description:
			"Minus button, input and plus button, sized together. Supports min, max, step. Fires change.",
		hasPage: true,
	},
	{
		name: "VirtualKeyboard",
		replaces: "nothing — new",
		description:
			"On-screen keyboard built from the library's own buttons, with configurable layout (incl. {shift}, {space}, {bksp}, {enter}), optional hardware key input, value binding and change / keyPress / enter events.",
		hasPage: true,
	},
	{
		name: "QuickDialog",
		replaces: "sap.m.MessageBox",
		description:
			"Helper class for touch-ready dialogs, used from the controller instead of a view: show, confirm, information, error, input, select, details. Every method returns a Promise.",
		hasPage: true,
	},
];

const themes: ThemeDoc[] = [
	{
		name: "Horizon",
		id: "sap_horizon",
		supported: true,
		note: "Default theme of the test pages",
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

const page = new VBox();

page.addItem(
	createPageTitle(
		"Documentation",
		"Control reference, the size scale, the ISized interface and known pitfalls",
	),
);

// ---------------------------------------------------------------------------
// control reference
// ---------------------------------------------------------------------------

const controlTable = new Table({
	columns: [
		new Column({ header: new Label({ text: "Control" }), width: "12rem" }),
		new Column({ header: new Label({ text: "Replaces" }), width: "14rem" }),
		new Column({ header: new Label({ text: "Description" }) }),
	],
	items: controls.map(
		(control) =>
			new ColumnListItem({
				cells: [
					control.hasPage
						? new Link({
								text: `tc:${control.name}`,
								tooltip: `Open the ${control.name} page`,
								press: () => {
									navigateTo(control.name);
								},
							})
						: new Text({ text: `tc:${control.name}` }),
					new Text({ text: control.replaces }),
					new Text({ text: control.description }),
				],
			}),
	),
});

page.addItem(
	createInfoCard(
		"Controls",
		"The Replaces column names the sap.m control each one steps in for",
		createText(`
Where it says <strong>new</strong>, there is no <code>sap.m</code> equivalent — the
control exists only in this library. Click a control to open its interactive
page.
`),
		controlTable,
	),
);

// ---------------------------------------------------------------------------
// theme compatibility
// ---------------------------------------------------------------------------

const themeTable = new Table({
	columns: [
		new Column({ header: new Label({ text: "Theme" }), width: "18rem" }),
		new Column({ header: new Label({ text: "Theme ID" }), width: "14rem" }),
		new Column({ header: new Label({ text: "Supported" }), width: "10rem" }),
		new Column({ header: new Label({ text: "Remark" }) }),
	],
	items: themes.map(
		(theme) =>
			new ColumnListItem({
				cells: [
					new Text({ text: theme.name }),
					new Text({ text: theme.id }),
					new ObjectStatus({
						text: theme.supported ? "Yes" : "No",
						state: theme.supported ? ValueState.Success : ValueState.Error,
						icon: theme.supported ? "sap-icon://accept" : "sap-icon://decline",
					}),
					new Text({ text: theme.note }),
				],
			}),
	),
});

page.addItem(
	createInfoCard(
		"Theme compatibility",
		"All controls ship their own theme library for these themes",
		createText(`
The controls take their colours, borders and shadows from the theme parameters
of the active theme, so they blend in with the surrounding
<code>sap.m</code> controls. Set the theme as usual through
<code>data-sap-ui-theme</code> in the bootstrap or at runtime through
<code>Theming.setTheme()</code>.
`),
		themeTable,
		createText(`
Themes that are not listed here are not shipped with the library. UI5 then falls
back to the base theme for <code>ui5.touch.controls</code>, so the controls stay
usable, but they will not match the colours of the rest of the application.
`),
	),
);

// ---------------------------------------------------------------------------
// sizes
// ---------------------------------------------------------------------------

page.addItem(
	createInfoCard(
		"Sizes",
		"Every control has the same size property",
		createText(`
Available values:
<code>S</code> · <code>M</code> (default) · <code>L</code> · <code>XL</code> ·
<code>2XL</code> · <code>3XL</code> · <code>4XL</code> · <code>5XL</code> ·
<code>6XL</code>
`),
		createText(`
The size scales font size, icon size, padding and height together, so the
controls stay proportional at every step. Bind <code>size</code> to a model to
switch the size of the whole app at runtime.
`),
		createExampleCard(
			'<tc:Button text="Save" size="{settings>/touchSize}" press=".onSave" />',
			"xml",
			"Binding the size",
		),
	),
);

// ---------------------------------------------------------------------------
// ISized
// ---------------------------------------------------------------------------

page.addItem(
	createInfoCard(
		"ISized",
		"ui5.touch.controls.ISized",
		createText(`
All controls with a <code>size</code> property implement the marker interface
<code>ui5.touch.controls.ISized</code>. This allows generic size handling, e.g.
to apply a user setting to a whole view.
`),
		createExampleCard(
			`
import { ISized, SizeMode } from "ui5/touch/controls/library";

if (control.isA<ISized>("ui5.touch.controls.ISized")) {
	control.setSize(SizeMode.XL);
}
`,
			"typescript",
			"Controller Code",
		),
	),
);

// ---------------------------------------------------------------------------
// VirtualKeyboard
// ---------------------------------------------------------------------------

page.addItem(
	createInfoCard(
		"New controls for touch — VirtualKeyboard",
		"There is no sap.m equivalent",
		createText(`
On a shop floor terminal, a kiosk or a device operated with gloves there is
often no hardware keyboard, and the on-screen keyboard of the operating system
is either unavailable or covers half the screen. OpenUI5 has no control for
this. <code>tc:VirtualKeyboard</code> is an on-screen keyboard rendered from the
library's own buttons — no third-party dependency, and sized through the same
<code>size</code> property as everything else.
`),
		createText(`
The layout is simply a list of rows, so a numeric pad, a full QWERTY keyboard or
a domain-specific key set are all a matter of one property.
<code>{shift}</code>, <code>{space}</code>, <code>{bksp}</code> and
<code>{enter}</code> are the special keys; every other key inserts its own label
into the value. With <code>hardwareKeys="true"</code> the control additionally
accepts input from a real keyboard.
`),
		createExampleCard(
			`
<tc:VirtualKeyboard
	value="{/quantity}"
	size="XL"
	width="700px"
	layout="7 8 9, 4 5 6, 1 2 3, {bksp} 0 {enter}"
	change=".onChange"
	enter=".onEnter" />
`,
			"xml",
			"XML View",
		),
	),
);

// ---------------------------------------------------------------------------
// pitfall — sap.m.Button-only aggregations
// ---------------------------------------------------------------------------

page.addItem(
	createInfoCard(
		"Pitfall: aggregations that only accept sap.m.Button",
		"buttons, beginButton and endButton of sap.m.Dialog",
		new MessageStrip({
			text: 'Some standard aggregations are typed to sap.m.Button and reject a tc:Button at runtime: "Element ui5.touch.controls.Button#__button0" is not valid for aggregation "buttons".',
			type: MessageType.Warning,
			showIcon: true,
		}),
		createText(`
And these button slots are not meant to be resized either — they are laid out
for the standard button height.
`),
		createExampleCard(
			`
<!-- does NOT work — these aggregations only accept sap.m.Button -->
<Dialog title="Delete order">
	<buttons>
		<tc:Button text="Delete" type="Reject" size="XL" press=".onDelete" />
		<tc:Button text="Cancel" size="XL" press=".onCancel" />
	</buttons>
</Dialog>
`,
			"xml",
			"Does not work",
		),
		createText(`
<strong>The way around it is the <code>footer</code> aggregation.</strong> It is typed to
<code>sap.m.Toolbar</code> (available since UI5 1.110), and because
<code>tc:Toolbar</code> and <code>tc:OverflowToolbar</code> extend
<code>sap.m.Toolbar</code>, they fit straight in. The dialog then sizes its
footer to the toolbar, so touch-sized buttons are rendered properly. Prefer
<code>tc:OverflowToolbar</code> whenever the dialog can get narrow.
`),
		createExampleCard(
			`
<!-- works — the footer takes any sap.m.Toolbar, so also the touch ones -->
<Dialog title="Delete order">
	<footer>
		<tc:OverflowToolbar size="XL">
			<tc:Button text="Delete" type="Reject" size="XL" press=".onDelete" />
			<ToolbarSpacer />
			<tc:Button text="Cancel" size="XL" press=".onCancel" />
		</tc:OverflowToolbar>
	</footer>
</Dialog>
`,
			"xml",
			"Works",
		),
		createText(`
For plain message-box style dialogs you do not have to build this yourself —
<code>QuickDialog</code> already creates its footer this way, sized through its
<code>size</code> option.
`),
	),
);

page.addItem(
	new HBox({
		wrap: FlexWrap.Wrap,
		alignItems: FlexAlignItems.Center,
		items: [
			new StandardButton({
				text: "Setup",
				icon: "sap-icon://navigation-left-arrow",
				press: () => {
					navigateTo("Setup");
				},
			}),
			new StandardButton({
				text: "Explore the Button",
				icon: "sap-icon://navigation-right-arrow",
				type: ButtonType.Emphasized,
				iconFirst: false,
				press: () => {
					navigateTo("Button");
				},
			}),
		],
	}).addStyleClass("touchControlsCardRow sapUiSmallMarginBottom"),
);

page.addStyleClass("sapUiSmallMargin");

initTestPage("Documentation", page);
