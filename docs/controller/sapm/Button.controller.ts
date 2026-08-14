import type { CheckBox$SelectEvent } from "sap/m/CheckBox";
import { ButtonType } from "sap/m/library";
import JSONModel from "sap/ui/model/json/JSONModel";
import { SizeMode } from "ui5/touch/controls/library";
import BaseController from "../BaseController";

const DEFAULT_ICON = "sap-icon://accounting-document-verification";

/**
 * Controller of the Button page.
 *
 * @namespace ui5.touch.controls.demo.controller.sapm
 */
export default class Button extends BaseController {
	private model!: JSONModel;

	public onInit(): void {
		this.setControlIntro("Button");

		this.model = new JSONModel(
			{
				showIcon: true,
				icon: DEFAULT_ICON,
				showText: true,
				text: "Button",
				iconFirst: true,
				enabled: true,
				size: SizeMode.L,
				type: ButtonType.Default,
				// the choices of the type option: the enum itself rather than a
				// hand-written list, so a type that UI5 adds later shows up here
				// without the page having to be touched
				types: Object.keys(ButtonType)
					.map((type) => ({ type }))
					.filter(
						(t) =>
							t.type !== "Unstyled" && t.type !== "Back" && t.type !== "Up",
					),
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

	/**
	 * Opens the page of the OverflowToolbar, the control that lets a
	 * tc:Button live in the bar of a page or a dialog.
	 */
	public onNavToOverflowToolbar(): void {
		this.getRouter().navTo("OverflowToolbar");
	}
}
