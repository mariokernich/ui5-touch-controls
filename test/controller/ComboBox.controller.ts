import JSONModel from "sap/ui/model/json/JSONModel";
import type { ComboBox$ChangeEvent } from "ui5/touch/controls/ComboBox";
import { SizeMode } from "ui5/touch/controls/library";
import BaseController from "./BaseController";

/**
 * Controller of the ComboBox page.
 *
 * @namespace ui5.touch.controls.demo.controller
 */
export default class ComboBox extends BaseController {
	private model!: JSONModel;

	public onInit(): void {
		this.model = new JSONModel(
			{
				// the items both combo boxes are filled from
				materials: [
					{ key: "M-1001", text: "Aluminium sheet 2 mm" },
					{ key: "M-1002", text: "Aluminium sheet 4 mm" },
					{ key: "M-2001", text: "Steel bar 10 mm" },
					{ key: "M-2002", text: "Steel bar 20 mm" },
					{ key: "M-3001", text: "Copper wire 1.5 mm²" },
					{ key: "M-3002", text: "Copper wire 2.5 mm²" },
				],
				value: "Steel bar 10 mm",
				selectedKey: "M-2001",
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
	xmlns:core="sap.ui.core"
	xmlns:tc="ui5.touch.controls">
	<tc:ComboBox
		value="{/material}"
		selectedKey="{/materialKey}"
		placeholder="Search material..."
		size="XL"
		width="22rem"
		change=".onMaterialChange">
		<core:Item key="M-1001" text="Aluminium sheet 2 mm" />
		<core:Item key="M-2001" text="Steel bar 10 mm" />
		<core:Item key="M-3001" text="Copper wire 1.5 mm²" />
	</tc:ComboBox>
</mvc:View>
`);
	}

	public onChange(event: ComboBox$ChangeEvent): void {
		const key = event.getParameter("selectedKey");
		this.model.setProperty(
			"/lastEvent",
			`change: value="${event.getParameter("value")}", selectedKey=${key || "(none)"}`,
		);
	}
}
