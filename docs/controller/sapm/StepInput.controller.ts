import MessageToast from "sap/m/MessageToast";
import JSONModel from "sap/ui/model/json/JSONModel";
import { SizeMode } from "ui5/touch/controls/library";
import type { StepInput$ChangeEvent } from "ui5/touch/controls/StepInput";
import BaseController from "../BaseController";

/**
 * Controller of the StepInput page.
 *
 * @namespace ui5.touch.controls.demo.controller.sapm
 */
export default class StepInput extends BaseController {
	private model!: JSONModel;

	public onInit(): void {
		this.setControlIntro("StepInput");

		this.model = new JSONModel(
			{
				value: 1,
				min: 0,
				max: 10,
				size: SizeMode.L,
				buttonType: "Default",
				enabled: true,
				editable: true,
			},
			true,
		);
		this.getView()?.setModel(this.model, "json");

		this.setExample(`
<mvc:View
	xmlns:mvc="sap.ui.core.mvc"
	xmlns:tc="ui5.touch.controls">
	<tc:StepInput
		value="{/quantity}"
		min="0"
		max="10"
		size="XL"
		buttonType="Emphasized"
		change=".onQuantityChange" />
</mvc:View>
`);
	}

	public onChange(event: StepInput$ChangeEvent): void {
		const value = event.getParameter("value");
		this.model.setProperty("/value", value);
		MessageToast.show(`Value changed: ${value}`);
	}
}
