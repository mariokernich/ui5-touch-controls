import type { Input$LiveChangeEvent } from "ui5/touch/controls/Input";
import { SizeMode } from "ui5/touch/controls/library";
import JSONModel from "sap/ui/model/json/JSONModel";
import BaseController from "./BaseController";

/**
 * Controller of the Input page.
 *
 * @namespace ui5.touch.controls.demo.controller
 */
export default class Input extends BaseController {
	private model!: JSONModel;

	public onInit(): void {
		this.model = new JSONModel(
			{
				value: "Hello World",
				placeholder: "Enter text...",
				size: SizeMode.L,
				enabled: true,
				editable: true,
				valueState: "None",
			},
			true,
		);
		this.getView()?.setModel(this.model, "json");

		this.setExample(`
<mvc:View
	xmlns:mvc="sap.ui.core.mvc"
	xmlns:tc="ui5.touch.controls">
	<tc:Input
		value="{/value}"
		placeholder="Enter text..."
		size="XL"
		liveChange=".onLiveChange" />
</mvc:View>
`);
	}

	public onLiveChange(event: Input$LiveChangeEvent): void {
		this.model.setProperty("/value", event.getParameter("value"));
	}
}
