import type { Input$LiveChangeEvent } from "ui5/touch/controls/Input";
import { KeyboardMode, SizeMode } from "ui5/touch/controls/library";
import JSONModel from "sap/ui/model/json/JSONModel";
import BaseController from "../BaseController";

/**
 * Controller of the Input page.
 *
 * @namespace ui5.touch.controls.demo.controller.sapm
 */
export default class Input extends BaseController {
	private model!: JSONModel;

	public onInit(): void {
		this.setControlIntro("Input");

		this.model = new JSONModel(
			{
				value: this.getText("smpInputValue"),
				placeholder: this.getText("phTypeText"),
				size: SizeMode.L,
				enabled: true,
				editable: true,
				valueState: "None",
				showKeyboard: false,
				keyboardMode: KeyboardMode.English,
				keyboardDocked: false,
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
		showKeyboard="true">
		<tc:keyboard>
			<tc:Keyboard size="XL" mode="English" />
		</tc:keyboard>
	</tc:Input>

	<!-- docked: the keyboard sits at the bottom edge of the screen instead
	     of at the field, and takes the full width of a phone or a tablet -->
	<tc:Input
		value="{/code}"
		size="XL"
		showKeyboard="true">
		<tc:keyboard>
			<tc:Keyboard size="XL" mode="German" docked="true" />
		</tc:keyboard>
	</tc:Input>
</mvc:View>
`);
	}

	public onLiveChange(event: Input$LiveChangeEvent): void {
		this.model.setProperty("/value", event.getParameter("value"));
	}
}
