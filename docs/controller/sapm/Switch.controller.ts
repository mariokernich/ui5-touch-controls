import JSONModel from "sap/ui/model/json/JSONModel";
import { SizeMode } from "ui5/touch/controls/library";
import type { Switch$ChangeEvent } from "ui5/touch/controls/Switch";
import BaseController from "../BaseController";

/**
 * Controller of the Switch page.
 *
 * @namespace ui5.touch.controls.demo.controller.sapm
 */
export default class Switch extends BaseController {
	private model!: JSONModel;

	public onInit(): void {
		this.setControlIntro("Switch");

		this.model = new JSONModel(
			{
				state: true,
				customTextOn: "",
				customTextOff: "",
				type: "Default",
				size: SizeMode.L,
				enabled: true,
				lastEvent: "-",
			},
			true,
		);
		this.getView()?.setModel(this.model, "json");

		this.setExample(`
<mvc:View
	xmlns:mvc="sap.ui.core.mvc"
	xmlns:tc="ui5.touch.controls">
	<tc:Switch
		state="{/maintenanceMode}"
		size="XL"
		change=".onMaintenanceModeChange" />
</mvc:View>
`);
	}

	public onChange(event: Switch$ChangeEvent): void {
		this.model.setProperty(
			"/lastEvent",
			`change: state=${event.getParameter("state")}`,
		);
	}
}
