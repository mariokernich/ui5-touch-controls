import type { TextArea$LiveChangeEvent } from "ui5/touch/controls/TextArea";
import { KeyboardMode, SizeMode } from "ui5/touch/controls/library";
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
		this.setControlIntro("TextArea");

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
				showVirtualKeyboard: false,
				keyboardMode: KeyboardMode.QWERTY,
				keyboardDocked: false,
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

	<!-- with an on-screen keyboard for terminals without a hardware one: it
	     opens below the field as long as the field has the focus, and its
	     Enter key adds a line break -->
	<tc:TextArea
		value="{/remark}"
		rows="4"
		size="XL"
		showVirtualKeyboard="true">
		<tc:virtualKeyboard>
			<tc:VirtualKeyboard size="XL" mode="QWERTY" />
		</tc:virtualKeyboard>
	</tc:TextArea>

	<!-- docked: the keyboard sits at the bottom edge of the screen instead
	     of at the field, and takes the full width of a phone or a tablet -->
	<tc:TextArea
		value="{/note}"
		rows="4"
		size="XL"
		showVirtualKeyboard="true">
		<tc:virtualKeyboard>
			<tc:VirtualKeyboard size="XL" mode="QWERTZ" docked="true" />
		</tc:virtualKeyboard>
	</tc:TextArea>
</mvc:View>
`);
	}

	public onLiveChange(event: TextArea$LiveChangeEvent): void {
		this.model.setProperty("/value", event.getParameter("value"));
	}
}
