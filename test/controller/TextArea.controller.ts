import type { TextArea$LiveChangeEvent } from "ui5/touch/controls/TextArea";
import { SizeMode } from "ui5/touch/controls/library";
import JSONModel from "sap/ui/model/json/JSONModel";
import BaseController from "./BaseController";

/**
 * Controller of the TextArea page.
 *
 * @namespace ui5.touch.controls.demo.controller
 */
export default class TextArea extends BaseController {
	private model!: JSONModel;

	public onInit(): void {
		this.model = new JSONModel(
			{
				value: "Hello World\nThis is a multi-line text.",
				placeholder: "Enter text...",
				rows: 4,
				maxLength: 0,
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
	<tc:TextArea
		value="{/value}"
		placeholder="Enter text..."
		rows="4"
		maxLength="200"
		size="XL"
		liveChange=".onLiveChange" />
</mvc:View>
`);
	}

	public onLiveChange(event: TextArea$LiveChangeEvent): void {
		this.model.setProperty("/value", event.getParameter("value"));
	}
}
