import HBox from "sap/m/HBox";
import FlexItemData from "sap/m/FlexItemData";
import { ButtonType, FlexAlignItems, FlexWrap } from "sap/m/library";
import MessageStrip from "sap/m/MessageStrip";
import MessageToast from "sap/m/MessageToast";
import VBox from "sap/m/VBox";
import { MessageType } from "sap/ui/core/library";
import Button from "ui5/touch/controls/Button";
import { SizeMode } from "ui5/touch/controls/library";
import initTestPage, {
	createExampleCard,
	createInfoCard,
	createLogo,
	createPageTitle,
	createText,
	navigateTo,
} from "./Menu";

const page = new VBox();

// ---------------------------------------------------------------------------
// hero — logo and page headline
// ---------------------------------------------------------------------------

page.addItem(
	new VBox({
		alignItems: FlexAlignItems.Center,
		items: [
			createLogo("8rem").addStyleClass("sapUiSmallMarginBottom"),
			createPageTitle(
				"Getting Started",
				"Standard OpenUI5 controls, rebuilt for touch — plus the ones sap.m is missing",
			),
		],
	}).addStyleClass("sapUiMediumMarginBottom"),
);

// ---------------------------------------------------------------------------
// what the library is about
// ---------------------------------------------------------------------------

page.addItem(
	createInfoCard(
		"What it is",
		"Why sap.m alone is not enough on a touch device",
		createText(`
<code>sap.m</code> controls are made for mouse and keyboard. On a tablet, a shop
floor terminal or a device operated with gloves they are simply too small — and
the cozy content density only gets you one step further.
`),
		createText(`
The library does two things about that:
<ul>
	<li><strong>It rebuilds the most important <code>sap.m</code> controls</strong> on
	their original structure and opens them up for sizing through one central
	<code>size</code> property (<code>S</code>–<code>6XL</code>) that works the
	same way on every control. You do not have to rebuild your app: the controls
	keep the familiar properties, aggregations and events of their originals, so
	you can use them as a drop-in replacement.</li>
	<li><strong>It adds controls that <code>sap.m</code> does not have at all</strong>,
	for situations that only come up on touch devices — the prime example being
	the <code>VirtualKeyboard</code>.</li>
</ul>
`),
	),
);

// ---------------------------------------------------------------------------
// live example — try the sizes
// ---------------------------------------------------------------------------

const sizes: SizeMode[] = [
	SizeMode.S,
	SizeMode.M,
	SizeMode.L,
	SizeMode.XL,
	SizeMode["2XL"],
	SizeMode["3XL"],
];

const liveSample = new HBox({
	wrap: FlexWrap.Wrap,
	alignItems: FlexAlignItems.Center,
	items: sizes.map((size) =>
		new Button({
			text: size,
			icon: "sap-icon://accept",
			type: ButtonType.Emphasized,
			size: size,
			press: () => {
				MessageToast.show(`Size ${size} pressed`);
			},
		}).addStyleClass("sapUiTinyMarginEnd"),
	),
}).addStyleClass("touchControlsCardRow");

page.addItem(
	createInfoCard(
		"One property, nine sizes",
		"S · M (default) · L · XL · 2XL · 3XL · 4XL · 5XL · 6XL",
		createText(`
The size scales font size, icon size, padding and height together, so the
controls stay proportional at every step. Bind <code>size</code> to a model to
switch the size of the whole app at runtime.
`),
		liveSample,
	),
);

// ---------------------------------------------------------------------------
// before / after
// ---------------------------------------------------------------------------

const before = createExampleCard(
	`
<mvc:View
	xmlns:mvc="sap.ui.core.mvc"
	xmlns="sap.m">
	<Page title="Order">
		<footer>
			<OverflowToolbar>
				<Button text="Save" type="Emphasized" press=".onSave" />
				<Button text="Cancel" press=".onCancel" />
				<ToolbarSpacer />
				<Button text="Approve" type="Accept" press=".onApprove" />
			</OverflowToolbar>
		</footer>
	</Page>
</mvc:View>
`,
	"xml",
	"Before — plain sap.m",
);
before.setLayoutData(new FlexItemData({ growFactor: 1, baseSize: "0" }));

const after = createExampleCard(
	`
<mvc:View
	xmlns:mvc="sap.ui.core.mvc"
	xmlns="sap.m"
	xmlns:tc="ui5.touch.controls">
	<Page title="Order">
		<footer>
			<tc:OverflowToolbar size="XL">
				<tc:Button text="Save" type="Emphasized" size="XL" press=".onSave" />
				<tc:Button text="Cancel" size="XL" press=".onCancel" />
				<ToolbarSpacer />
				<tc:Button text="Approve" type="Accept" size="XL" press=".onApprove" />
			</tc:OverflowToolbar>
		</footer>
	</Page>
</mvc:View>
`,
	"xml",
	"After — ui5.touch.controls",
);
after.setLayoutData(new FlexItemData({ growFactor: 1, baseSize: "0" }));

page.addItem(
	createInfoCard(
		"Drop-in replacement",
		"Add the namespace, put tc: in front of the control, set a size",
		createText(`
Same aggregations, same properties, same event handlers —
<code>press=".onSave"</code> still calls the same method in your controller.
<code>sap.m</code> controls such as <code>ToolbarSpacer</code> can stay exactly
where they are.
`),
		new HBox({
			width: "100%",
			wrap: FlexWrap.Wrap,
			items: [before, after],
		}).addStyleClass("touchControlsCardRow"),
	),
);

// ---------------------------------------------------------------------------
// requirements + next steps
// ---------------------------------------------------------------------------

page.addItem(
	createInfoCard(
		"Requirements",
		"",
		new MessageStrip({
			text: "UI5 version 1.118 or higher (OpenUI5 or SAPUI5) is required.",
			type: MessageType.Information,
			showIcon: true,
		}),
		createText(`
The library is published on npm as <code>ui5.touch.controls</code> and can be
consumed in any UI5 application that is built with the UI5 Tooling (v3 or
higher). It ships its own <code>ui5.yaml</code>, so the tooling resolves it as a
library dependency automatically.
`),
	),
);

page.addItem(
	createInfoCard(
		"Next steps",
		"Where to go from here",
		createText(`
<ul>
	<li><strong>Setup</strong> — install the package, declare the library and wire
	up TypeScript.</li>
	<li><strong>Documentation</strong> — the full control reference, the size
	scale, the <code>ISized</code> interface and the known pitfalls.</li>
	<li><strong>Controls</strong> — one interactive page per control, side by side
	with the <code>sap.m</code> original.</li>
</ul>
`),
		new HBox({
			wrap: FlexWrap.Wrap,
			alignItems: FlexAlignItems.Center,
			items: [
				new Button({
					text: "Setup",
					icon: "sap-icon://wrench",
					type: ButtonType.Emphasized,
					size: SizeMode.L,
					press: () => {
						navigateTo("Setup");
					},
				}),
				new Button({
					text: "Documentation",
					icon: "sap-icon://documents",
					size: SizeMode.L,
					press: () => {
						navigateTo("Documentation");
					},
				}),
				new Button({
					text: "Explore the Button",
					icon: "sap-icon://navigation-right-arrow",
					size: SizeMode.L,
					press: () => {
						navigateTo("Button");
					},
				}),
			],
		})
			.addStyleClass("sapUiSmallMarginTop")
			.addStyleClass("touchControlsCardRow"),
	),
);

page.addStyleClass("sapUiSmallMargin");

initTestPage("GettingStarted", page);
