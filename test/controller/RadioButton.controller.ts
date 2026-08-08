import JSONModel from "sap/ui/model/json/JSONModel";
import { SizeMode } from "ui5/touch/controls/library";
import type { RadioButtonGroup$SelectEvent } from "ui5/touch/controls/RadioButtonGroup";
import BaseController from "./BaseController";

/**
 * Controller of the RadioButton page.
 *
 * @namespace ui5.touch.controls.demo.controller
 */
export default class RadioButton extends BaseController {
	private model!: JSONModel;

	public onInit(): void {
		this.model = new JSONModel(
			{
				selectedIndex: 1,
				columns: 1,
				size: SizeMode.L,
				enabled: true,
				editable: true,
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
	<tc:RadioButtonGroup
		selectedIndex="{/shift}"
		columns="1"
		size="XL"
		select=".onShiftSelect">
		<tc:RadioButton text="Early shift" />
		<tc:RadioButton text="Late shift" />
		<tc:RadioButton text="Night shift" />
	</tc:RadioButtonGroup>
</mvc:View>
`);
	}

	public onSelect(event: RadioButtonGroup$SelectEvent): void {
		this.model.setProperty(
			"/lastEvent",
			`select: selectedIndex=${event.getParameter("selectedIndex")}`,
		);
	}
}
