import type { CheckBox$SelectEvent } from "sap/m/CheckBox";
import MessageToast from "sap/m/MessageToast";
import JSONModel from "sap/ui/model/json/JSONModel";
import { SizeMode } from "ui5/touch/controls/library";
import type { SegmentedButton$SelectionChangeEvent } from "ui5/touch/controls/SegmentedButton";
import BaseController from "../BaseController";

/**
 * Controller of the SegmentedButton page.
 *
 * @namespace ui5.touch.controls.demo.controller.sapm
 */
export default class SegmentedButton extends BaseController {
	private model!: JSONModel;

	public onInit(): void {
		this.setControlIntro("SegmentedButton");

		this.model = new JSONModel(
			{
				size: SizeMode.L,
				enabled: true,
				width: "",
				view: "list",
				chart: "bar",
				density: "grid",
				mode: "day",
			},
			true,
		);
		this.getView()?.setModel(this.model, "json");

		this.setExample(`
<mvc:View
	xmlns:mvc="sap.ui.core.mvc"
	xmlns:tc="ui5.touch.controls">
	<tc:SegmentedButton
		size="XL"
		selectedKey="{/view}"
		selectionChange=".onViewChange">
		<tc:SegmentedButtonItem
			key="list"
			text="List"
			icon="sap-icon://list" />
		<tc:SegmentedButtonItem
			key="grid"
			text="Grid"
			icon="sap-icon://grid" />
		<tc:SegmentedButtonItem
			key="table"
			text="Table"
			icon="sap-icon://table-view" />
	</tc:SegmentedButton>
</mvc:View>
`);
	}

	public onFullWidthSelect(event: CheckBox$SelectEvent): void {
		this.model.setProperty(
			"/width",
			event.getParameter("selected") ? "100%" : "",
		);
	}

	public onSizedSelectionChange(
		event: SegmentedButton$SelectionChangeEvent,
	): void {
		MessageToast.show(`ui5.touch.controls: ${event.getParameter("key") ?? ""}`);
	}

	/**
	 * Opens the page of the OverflowToolbar, the control that lets a control
	 * of this library live in the bar of a page or a dialog.
	 */
	public onNavToOverflowToolbar(): void {
		this.getRouter().navTo("OverflowToolbar");
	}
}
