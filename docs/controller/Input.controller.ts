import type { Input$LiveChangeEvent } from "ui5/touch/controls/Input";
import { KeyboardMode, SizeMode } from "ui5/touch/controls/library";
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
		this.setControlIntro("Input");

		this.model = new JSONModel(
			{
				value: "Hello World",
				placeholder: "Enter text...",
				size: SizeMode.L,
				enabled: true,
				editable: true,
				valueState: "None",
				showVirtualKeyboard: false,
				keyboardMode: KeyboardMode.QWERTY,
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

	<!-- with an on-screen keyboard for terminals without a hardware one:
	     it opens below the field as long as the field has the focus -->
	<tc:Input
		value="{/quantity}"
		size="XL"
		showVirtualKeyboard="true">
		<tc:virtualKeyboard>
			<tc:VirtualKeyboard size="XL" mode="QWERTY" />
		</tc:virtualKeyboard>
	</tc:Input>
</mvc:View>
`);
	}

	public onLiveChange(event: Input$LiveChangeEvent): void {
		this.model.setProperty("/value", event.getParameter("value"));
	}
}
