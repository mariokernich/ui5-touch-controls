import MessageToast from "sap/m/MessageToast";
import JSONModel from "sap/ui/model/json/JSONModel";
import { SizeMode } from "ui5/touch/controls/library";
import BaseController from "../BaseController";

/**
 * Controller of the Link page.
 *
 * @namespace ui5.touch.controls.demo.controller.sapm
 */
export default class Link extends BaseController {
	public onInit(): void {
		this.setControlIntro("Link");

		this.getView()?.setModel(
			new JSONModel(
				{
					size: SizeMode.L,
					text: this.getText("linkSampleText"),
					repository: "https://github.com/mariokernich/ui5-touch-controls",
					longText: this.getText("linkSampleLongText"),
					enabled: true,
					wrapping: false,
					subtle: false,
					emphasized: false,
				},
				true,
			),
			"json",
		);

		this.setExample(`
<mvc:View
	xmlns:mvc="sap.ui.core.mvc"
	xmlns:tc="ui5.touch.controls">
	<tc:Link
		text="Open the documentation"
		href="https://openui5.org"
		target="_blank"
		size="XL" />
	<tc:Link
		text="Show details"
		size="XL"
		emphasized="true"
		press=".onShowDetails" />
</mvc:View>
`);
	}

	public onSizedPress(): void {
		MessageToast.show(this.getText("msgTouchLinkPressed"));
	}

	public onStandardPress(): void {
		MessageToast.show(this.getText("msgStandardLinkPressed"));
	}
}
