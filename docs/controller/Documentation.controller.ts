import type { Link$PressEvent } from "sap/m/Link";
import JSONModel from "sap/ui/model/json/JSONModel";
import {
	newControls,
	portedControls,
	themes,
	type ControlDoc,
} from "../model/documentation";
import BaseController from "./BaseController";

/**
 * Controller of the control reference.
 *
 * @namespace ui5.touch.controls.demo.controller
 */
export default class Documentation extends BaseController {
	public onInit(): void {
		this.getView()?.setModel(
			new JSONModel({
				ported: portedControls,
				new: newControls,
				themes: themes,
			}),
			"docs",
		);

		this.setSnippets({
			sizes: [
				{
					code: '<tc:Button text="Save" size="{settings>/touchSize}" press=".onSave" />',
				},
			],
			isized: [
				{
					language: "typescript",
					code: `
import { ISized, SizeMode } from "ui5/touch/controls/library";

if (control.isA<ISized>("ui5.touch.controls.ISized")) {
	control.setSize(SizeMode.XL);
}
`,
				},
			],
			keyboard: [
				{
					code: `
<tc:VirtualKeyboard
	value="{/quantity}"
	size="XL"
	width="700px"
	layout="7 8 9, 4 5 6, 1 2 3, {bksp} 0 {enter}"
	change=".onChange"
	enter=".onEnter" />
`,
				},
			],
			pitfallBroken: [
				{
					code: `
<!-- does NOT work — these aggregations only accept sap.m.Button -->
<Dialog title="Delete order">
	<buttons>
		<tc:Button text="Delete" type="Reject" size="XL" press=".onDelete" />
		<tc:Button text="Cancel" size="XL" press=".onCancel" />
	</buttons>
</Dialog>
`,
				},
			],
			pitfallWorks: [
				{
					code: `
<!-- works — the footer takes any sap.m.Toolbar, so also the touch ones -->
<Dialog title="Delete order">
	<footer>
		<tc:OverflowToolbar size="XL">
			<tc:Button text="Delete" type="Reject" size="XL" press=".onDelete" />
			<ToolbarSpacer />
			<tc:Button text="Cancel" size="XL" press=".onCancel" />
		</tc:OverflowToolbar>
	</footer>
</Dialog>
`,
				},
			],
		});
	}

	/**
	 * Opens the page of the control that was clicked in one of the tables.
	 */
	public onControlPress(event: Link$PressEvent): void {
		const control = event
			.getSource()
			.getBindingContext("docs")
			?.getObject() as ControlDoc;
		this.getRouter().navTo(control.name);
	}

	public onSetupPress(): void {
		this.getRouter().navTo("Setup");
	}

	public onButtonPress(): void {
		this.getRouter().navTo("Button");
	}
}
