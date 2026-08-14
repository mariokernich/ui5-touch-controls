import BaseController from "../BaseController";

/**
 * Controller of the installation instructions.
 *
 * @namespace ui5.touch.controls.demo.controller.general
 */
export default class Setup extends BaseController {
	public onInit(): void {
		this.setSnippets({
			install: [
				{
					title: "Terminal",
					language: "sh",
					code: "npm install ui5.touch.controls",
				},
				{
					title: "package.json",
					language: "json",
					code: `
{
	"dependencies": {
		"ui5.touch.controls": "^1.3.0"
	}
}
`,
				},
			],
			middleware: [
				{
					title: "Terminal",
					language: "sh",
					code: "npm i ui5.touch.controls && npm i -D ui5-middleware-servestatic",
				},
				{
					title: "ui5.yaml",
					language: "yaml",
					code: `
server:
  customMiddleware:
    - name: ui5-middleware-servestatic
      afterMiddleware: compression
      mountPath: /resources/ui5/touch/controls/
      configuration:
        npmPackagePath: 'ui5.touch.controls/dist/resources/ui5/touch/controls'
`,
				},
			],
			manifest: [
				{
					title: "manifest.json",
					language: "json",
					code: `
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
				},
			],
			namespace: [
				{
					code: `
<mvc:View
	xmlns:mvc="sap.ui.core.mvc"
	xmlns="sap.m"
	xmlns:tc="ui5.touch.controls">
	<tc:Button text="Hello" size="XL" />
</mvc:View>
`,
				},
			],
			typescript: [
				{
					title: "tsconfig.json",
					language: "json",
					code: `
{
	"compilerOptions": {
		"types": [
			"@sapui5/types",
			"ui5.touch.controls"
		]
	}
}
`,
				},
				{
					language: "typescript",
					code: `
import Button from "ui5/touch/controls/Button";
import { SizeMode } from "ui5/touch/controls/library";

const button = new Button({ text: "Confirm", size: SizeMode.XL });
`,
				},
			],
		});
	}

	public onGettingStartedPress(): void {
		this.getRouter().navTo("GettingStarted");
	}

	public onDocumentationPress(): void {
		this.getRouter().navTo("Documentation");
	}
}
