import JSONModel from "sap/ui/model/json/JSONModel";
import { SizeMode } from "ui5/touch/controls/library";
import type { SignaturePad$ChangeEvent } from "ui5/touch/controls/SignaturePad";
import BaseController from "./BaseController";

/**
 * Controller of the SignaturePad page.
 *
 * @namespace ui5.touch.controls.demo.controller
 */
export default class SignaturePad extends BaseController {
	private model!: JSONModel;

	public onInit(): void {
		this.model = new JSONModel(
			{
				value: "",
				preview: "",
				placeholder: "Sign here",
				height: "12rem",
				size: SizeMode.XL,
				enabled: true,
				showClearButton: true,
				valueState: "None",
				signed: false,
				length: 0,
			},
			true,
		);
		this.getView()?.setModel(this.model, "json");

		this.setExample(`
<mvc:View
	xmlns:mvc="sap.ui.core.mvc"
	xmlns:tc="ui5.touch.controls">
	<tc:SignaturePad
		value="{/signature}"
		placeholder="Sign here"
		height="12rem"
		size="XL"
		change=".onSigned" />
</mvc:View>
`);
	}

	public onChange(event: SignaturePad$ChangeEvent): void {
		const value = event.getParameter("value") ?? "";
		this.model.setProperty("/signed", event.getParameter("signed"));
		this.model.setProperty("/length", value.length);
		this.model.setProperty("/preview", value);
	}
}
