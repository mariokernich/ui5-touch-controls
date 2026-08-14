import type { CheckBox$SelectEvent } from "ui5/touch/controls/CheckBox";
import { SizeMode } from "ui5/touch/controls/library";
import JSONModel from "sap/ui/model/json/JSONModel";
import BaseController from "../BaseController";

/**
 * Controller of the CheckBox page.
 *
 * @namespace ui5.touch.controls.demo.controller.sapm
 */
export default class CheckBox extends BaseController {
	private model!: JSONModel;

	public onInit(): void {
		this.setControlIntro("CheckBox");

		this.model = new JSONModel(
			{
				text: this.getText("smpCheckBox"),
				selected: true,
				partiallySelected: false,
				size: SizeMode.L,
				enabled: true,
				editable: true,
				wrapping: false,
				valueState: "None",
				lastEvent: "-",
			},
			true,
		);
		this.getView()?.setModel(this.model, "json");

		this.setExample(`
<mvc:View
	xmlns:mvc="sap.ui.core.mvc"
	xmlns:tc="ui5.touch.controls">
	<tc:CheckBox
		text="Send me a copy"
		selected="{/sendCopy}"
		size="XL"
		select=".onSelect" />
</mvc:View>
`);
	}

	public onSelect(event: CheckBox$SelectEvent): void {
		this.model.setProperty(
			"/lastEvent",
			`select: selected=${event.getParameter("selected")}`,
		);
	}
}
