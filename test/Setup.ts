import HBox from "sap/m/HBox";
import MessageStrip from "sap/m/MessageStrip";
import VBox from "sap/m/VBox";
import { ButtonType, FlexAlignItems, FlexWrap } from "sap/m/library";
import { MessageType } from "sap/ui/core/library";
import Button from "ui5/touch/controls/Button";
import { SizeMode } from "ui5/touch/controls/library";
import initTestPage, {
	createExampleCard,
	createInfoCard,
	createPageTitle,
	createText,
	navigateTo,
} from "./Menu";

const page = new VBox();

page.addItem(
	createPageTitle(
		"Setup",
		"Install the library, declare it in your app and wire up TypeScript",
	),
);

// ---------------------------------------------------------------------------
// prerequisites
// ---------------------------------------------------------------------------

page.addItem(
	createInfoCard(
		"Prerequisites",
		"What your project needs before you start",
		new MessageStrip({
			text: "UI5 version 1.118 or higher (OpenUI5 or SAPUI5) and UI5 Tooling v3 or higher.",
			type: MessageType.Information,
			showIcon: true,
		}),
		createText(`
The library is published on npm as
<a href="https://www.npmjs.com/package/ui5.touch.controls" target="_blank">ui5.touch.controls</a>
and can be consumed in any UI5 application that is built with the
<a href="https://sap.github.io/ui5-tooling/" target="_blank">UI5 Tooling</a>.
`),
	),
);

// ---------------------------------------------------------------------------
// step 1 — install
// ---------------------------------------------------------------------------

page.addItem(
	createInfoCard(
		"1. Install the package",
		"As a regular dependency, not a devDependency",
		createText(`
Install the library as a <strong>regular dependency</strong> so the UI5 Tooling picks it
up as a project dependency. The package ships a <code>ui5.yaml</code>, so the
tooling resolves it as a library dependency automatically.
`),
		createExampleCard("npm install ui5.touch.controls", "sh", "Terminal"),
		createExampleCard(
			`
{
	"dependencies": {
		"ui5.touch.controls": "^1.1.0"
	}
}
`,
			"json",
			"package.json",
		),
	),
);

// ---------------------------------------------------------------------------
// alternative — middleware
// ---------------------------------------------------------------------------

page.addItem(
	createInfoCard(
		"1b. With UI5 middleware (alternative setup)",
		"Serve the library statically instead of resolving it as a project dependency",
		createText(`
Instead of consuming the library as a UI5 Tooling project dependency, you can
serve it statically with
<a href="https://www.npmjs.com/package/ui5-middleware-servestatic" target="_blank">ui5-middleware-servestatic</a>.
`),
		createExampleCard(
			"npm i ui5.touch.controls && npm i -D ui5-middleware-servestatic",
			"sh",
			"Terminal",
		),
		createExampleCard(
			`
server:
  customMiddleware:
    - name: ui5-middleware-servestatic
      afterMiddleware: compression
      mountPath: /resources/ui5/touch/controls/
      configuration:
        npmPackagePath: 'ui5.touch.controls/dist/resources/ui5/touch/controls'
`,
			"yaml",
			"ui5.yaml",
		),
	),
);

// ---------------------------------------------------------------------------
// step 2 — manifest
// ---------------------------------------------------------------------------

page.addItem(
	createInfoCard(
		"2. Declare the library in manifest.json",
		"So the app loads the library at startup",
		createExampleCard(
			`
{
	"sap.ui5": {
		"dependencies": {
			"libs": {
				"ui5.touch.controls": {}
			}
		}
	}
}
`,
			"json",
			"manifest.json",
		),
	),
);

// ---------------------------------------------------------------------------
// step 3 — namespace
// ---------------------------------------------------------------------------

page.addItem(
	createInfoCard(
		"3. Add the namespace to your views",
		"The tc prefix is only a convention — any prefix works",
		createExampleCard(
			`
<mvc:View
	xmlns:mvc="sap.ui.core.mvc"
	xmlns="sap.m"
	xmlns:tc="ui5.touch.controls">
	<tc:Button text="Hello" size="XL" />
</mvc:View>
`,
			"xml",
			"XML View",
		),
	),
);

// ---------------------------------------------------------------------------
// typescript
// ---------------------------------------------------------------------------

page.addItem(
	createInfoCard(
		"4. TypeScript support (optional)",
		"Full typing out of the box",
		new MessageStrip({
			text: 'Without the "types" entry the UI5 Tooling does not load the library automatically.',
			type: MessageType.Warning,
			showIcon: true,
		}),
		createText(`
For TypeScript projects, add the package to the <code>types</code> entry in your
<code>tsconfig.json</code>. The package includes the type definitions
(<code>dist/index.d.ts</code>).
`),
		createExampleCard(
			`
{
	"compilerOptions": {
		"types": [
			"@sapui5/types",
			"ui5.touch.controls"
		]
	}
}
`,
			"json",
			"tsconfig.json",
		),
		createExampleCard(
			`
import Button from "ui5/touch/controls/Button";
import { SizeMode } from "ui5/touch/controls/library";

const button = new Button({ text: "Confirm", size: SizeMode.XL });
`,
			"typescript",
			"Controller Code",
		),
	),
);

page.addItem(
	new HBox({
		wrap: FlexWrap.Wrap,
		alignItems: FlexAlignItems.Center,
		items: [
			new Button({
				text: "Getting Started",
				icon: "sap-icon://navigation-left-arrow",
				size: SizeMode.L,
				press: () => {
					navigateTo("GettingStarted");
				},
			}),
			new Button({
				text: "Documentation",
				icon: "sap-icon://documents",
				type: ButtonType.Emphasized,
				size: SizeMode.L,
				press: () => {
					navigateTo("Documentation");
				},
			}),
		],
	}).addStyleClass("touchControlsCardRow"),
);

page.addStyleClass("sapUiSmallMargin");

initTestPage("Setup", page);
