import JSONModel from "sap/ui/model/json/JSONModel";
import { SizeMode } from "ui5/touch/controls/library";
import type { TimePicker$ChangeEvent } from "ui5/touch/controls/TimePicker";
import BaseController from "./BaseController";

/**
 * Controller of the TimePicker page.
 *
 * @namespace ui5.touch.controls.demo.controller
 */
export default class TimePicker extends BaseController {
	private model!: JSONModel;

	public onInit(): void {
		this.model = new JSONModel(
			{
				value: "07:30",
				displayFormat: "HH:mm",
				minutesStep: 5,
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
	<tc:TimePicker
		value="{/shiftStart}"
		valueFormat="HH:mm"
		displayFormat="HH:mm"
		minutesStep="5"
		size="XL"
		width="14rem"
		change=".onShiftStartChange" />
</mvc:View>
`);
	}

	public onChange(event: TimePicker$ChangeEvent): void {
		this.model.setProperty(
			"/lastEvent",
			`change: value="${event.getParameter("value")}", valid=${event.getParameter("valid")}`,
		);
	}
}
