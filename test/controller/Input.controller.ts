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
				showVirtualKeyboard: false,
				layout: [
					"1 2 3 4 5 6 7 8 9 0",
					"q w e r t y u i o p",
					"a s d f g h j k l",
					"{shift} z x c v b n m {bksp}",
					"{space} {enter}",
				],
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
			<tc:VirtualKeyboard size="XL" />
		</tc:virtualKeyboard>
	</tc:Input>
</mvc:View>
`);
	}

	public onLiveChange(event: Input$LiveChangeEvent): void {
		this.model.setProperty("/value", event.getParameter("value"));
	}
}
