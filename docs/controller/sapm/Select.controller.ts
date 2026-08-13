import JSONModel from "sap/ui/model/json/JSONModel";
import { SizeMode } from "ui5/touch/controls/library";
import type { Select$ChangeEvent } from "ui5/touch/controls/Select";
import BaseController from "../BaseController";

/**
 * Controller of the Select page.
 *
 * @namespace ui5.touch.controls.demo.controller.sapm
 */
export default class Select extends BaseController {
	private model!: JSONModel;

	public onInit(): void {
		this.setControlIntro("Select");

		this.model = new JSONModel(
			{
				// the items both selects are filled from
				workstations: [
					{ key: "A1", text: "Assembly line 1" },
					{ key: "A2", text: "Assembly line 2" },
					{ key: "P1", text: "Packaging" },
					{ key: "Q1", text: "Quality gate" },
					{ key: "S1", text: "Shipping" },
				],
				selectedKey: "P1",
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
	<tc:Select
		selectedKey="{/workstation}"
		size="XL"
		width="20rem"
		change=".onWorkstationChange">
		<core:Item key="A1" text="Assembly line 1" />
		<core:Item key="P1" text="Packaging" />
		<core:Item key="S1" text="Shipping" />
	</tc:Select>
</mvc:View>
`);
	}

	public onChange(event: Select$ChangeEvent): void {
		this.model.setProperty(
			"/lastEvent",
			`change: selectedKey=${event.getParameter("selectedKey")}`,
		);
	}
}
