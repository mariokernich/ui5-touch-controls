import JSONModel from "sap/ui/model/json/JSONModel";
import type { ComboBox$ChangeEvent } from "ui5/touch/controls/ComboBox";
import { SizeMode } from "ui5/touch/controls/library";
import BaseController from "../BaseController";

/**
 * Controller of the ComboBox page.
 *
 * @namespace ui5.touch.controls.demo.controller.sapm
 */
export default class ComboBox extends BaseController {
	private model!: JSONModel;

	public onInit(): void {
		this.setControlIntro("ComboBox");

		this.model = new JSONModel(
			{
				// the items both combo boxes are filled from; they are named
				// below, so they can be named again when the language changes
				materials: [],
				value: this.getText("smpSteel10"),
				selectedKey: "M-2001",
				size: SizeMode.L,
				enabled: true,
				editable: true,
				valueState: "None",
				showSecondaryValues: true,
				lastEvent: "-",
			},
			true,
		);
		this.getView()?.setModel(this.model, "json");

		this.fillOnLanguageChange(() => {
			this.model.setProperty("/materials", [
				{
					key: "M-1001",
					text: this.getText("smpAluminium2"),
					stock: this.getText("smpStockAluminium2"),
				},
				{
					key: "M-1002",
					text: this.getText("smpAluminium4"),
					stock: this.getText("smpStockAluminium4"),
				},
				{
					key: "M-2001",
					text: this.getText("smpSteel10"),
					stock: this.getText("smpStockSteel10"),
				},
				{
					key: "M-2002",
					text: this.getText("smpSteel20"),
					stock: this.getText("smpStockSteel20"),
				},
				{
					key: "M-3001",
					text: this.getText("smpCopper15"),
					stock: this.getText("smpStockCopper15"),
				},
				{
					key: "M-3002",
					text: this.getText("smpCopper25"),
					stock: this.getText("smpStockCopper25"),
				},
			]);
		});

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
		showSecondaryValues="true"
		change=".onMaterialChange">
		<core:ListItem key="M-1001" text="Aluminium sheet 2 mm" additionalText="1,240 pcs" />
		<core:ListItem key="M-2001" text="Steel bar 10 mm" additionalText="312 pcs" />
		<core:ListItem key="M-3001" text="Copper wire 1.5 mm²" additionalText="4,500 m" />
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
