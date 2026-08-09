import type { Select$ChangeEvent } from "sap/m/Select";
import type { TextArea$LiveChangeEvent } from "ui5/touch/controls/TextArea";
import { SizeMode } from "ui5/touch/controls/library";
import JSONModel from "sap/ui/model/json/JSONModel";
import { keyboardLayouts } from "../model/keyboardLayouts";
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
				layoutKey: "qwerty",
				layout: keyboardLayouts.qwerty,
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
			<tc:VirtualKeyboard size="XL" />
		</tc:virtualKeyboard>
	</tc:TextArea>
</mvc:View>
`);
	}

	/**
	 * Hands the picked layout to the keyboard in the virtualKeyboard
	 * aggregation. The layout is an array of rows, so it goes through the
	 * model instead of being written in the view.
	 */
	public onLayoutChange(event: Select$ChangeEvent): void {
		const key = event.getParameter("selectedItem")?.getKey();
		if (key) {
			this.model.setProperty("/layout", keyboardLayouts[key]);
		}
	}

	public onLiveChange(event: TextArea$LiveChangeEvent): void {
		this.model.setProperty("/value", event.getParameter("value"));
	}
}
