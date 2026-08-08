import type { CheckBox$SelectEvent } from "sap/m/CheckBox";
import JSONModel from "sap/ui/model/json/JSONModel";
import { SizeMode } from "ui5/touch/controls/library";
import BaseController from "./BaseController";

const DEFAULT_ICON = "sap-icon://accounting-document-verification";

/**
 * Controller of the Button page.
 *
 * @namespace ui5.touch.controls.demo.controller
 */
export default class Button extends BaseController {
	private model!: JSONModel;

	public onInit(): void {
		this.model = new JSONModel(
			{
				showIcon: true,
				icon: DEFAULT_ICON,
				showText: true,
				text: "Button",
				iconFirst: true,
				enabled: true,
				size: SizeMode.L,
				// one button per sap.m.ButtonType, so the types can be compared
				// side by side
				types: [
					{ type: "Ghost" },
					{ type: "Accept" },
					{ type: "Attention" },
					{ type: "Reject" },
					{ type: "Critical" },
					{ type: "Emphasized" },
					{ type: "Success" },
					{ type: "Negative" },
				],
			},
			true,
		);
		this.getView()?.setModel(this.model, "json");

		this.setExample(`
<mvc:View
	xmlns:mvc="sap.ui.core.mvc"
	xmlns:tc="ui5.touch.controls">
	<tc:Button
		text="Add to Cart"
		icon="sap-icon://cart"
		type="Emphasized"
		size="XL"
		press=".onAddToCart" />
</mvc:View>
`);
	}

	public onShowIconSelect(event: CheckBox$SelectEvent): void {
		this.model.setProperty(
			"/icon",
			event.getParameter("selected") ? DEFAULT_ICON : "",
		);
	}

	public onShowTextSelect(event: CheckBox$SelectEvent): void {
		this.model.setProperty(
			"/text",
			event.getParameter("selected") ? "Button" : "",
		);
	}
}
