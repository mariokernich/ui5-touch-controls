import type { Link$PressEvent } from "sap/m/Link";
import MessageToast from "sap/m/MessageToast";
import JSONModel from "sap/ui/model/json/JSONModel";
import type SizedVirtualKeyboard from "ui5/touch/controls/VirtualKeyboard";
import type {
	VirtualKeyboard$ChangeEvent,
	VirtualKeyboard$EnterEvent,
} from "ui5/touch/controls/VirtualKeyboard";
import type { KeyboardLayoutDoc } from "../model/keyboardLayouts";
import {
	keyboardLayoutDocs,
	keyboardLayouts,
} from "../model/keyboardLayouts";
import BaseController from "./BaseController";

/**
 * Controller of the VirtualKeyboard page.
 *
 * @namespace ui5.touch.controls.demo.controller
 */
export default class VirtualKeyboard extends BaseController {
	private model!: JSONModel;

	public onInit(): void {
		this.model = new JSONModel(
			{
				value: "",
				layout: "numeric",
				size: "L",
				enabled: true,
				hardwareKeys: true,
				width: "",
				layouts: keyboardLayoutDocs,
			},
			true,
		);
		this.getView()?.setModel(this.model, "json");

		// the layout is an array of rows, so it is set from the controller
		// instead of through a binding
		this.model.attachPropertyChange(() => {
			this.applyLayout();
		});
		this.applyLayout();

		this.setExample(`
<mvc:View
	xmlns:mvc="sap.ui.core.mvc"
	xmlns:tc="ui5.touch.controls">
	<tc:VirtualKeyboard
		value="{/value}"
		size="XL"
		width="700px"
		hardwareKeys="true"
		layout="7 8 9, 4 5 6, 1 2 3, {bksp} 0 {enter}"
		change=".onChange"
		enter=".onEnter" />
</mvc:View>
`);
	}

	private applyLayout(): void {
		const keyboard = this.byId("keyboard") as SizedVirtualKeyboard;
		keyboard.setLayout(
			keyboardLayouts[this.model.getProperty("/layout") as string],
		);
	}

	/**
	 * Switches the playground to the layout that was clicked in the table.
	 */
	public onLayoutPress(event: Link$PressEvent): void {
		const layout = event.getSource().getBindingContext("json")
			?.getObject() as KeyboardLayoutDoc;
		this.model.setProperty("/layout", layout.key);
		// setProperty does not fire propertyChange - that only happens for
		// changes coming from a two-way binding, e.g. from the select above
		this.applyLayout();
	}

	public onChange(event: VirtualKeyboard$ChangeEvent): void {
		this.model.setProperty("/value", event.getParameter("value"));
	}

	public onEnter(event: VirtualKeyboard$EnterEvent): void {
		MessageToast.show(`Enter pressed: ${event.getParameter("value")}`);
	}
}
