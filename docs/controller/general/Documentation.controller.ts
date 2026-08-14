import type { Link$PressEvent } from "sap/m/Link";
import JSONModel from "sap/ui/model/json/JSONModel";
import {
	classControls,
	newControls,
	portedControls,
	themes,
	type ControlDoc,
} from "../../model/documentation";
import BaseController from "../BaseController";

/**
 * Controller of the control reference.
 *
 * @namespace ui5.touch.controls.demo.controller.general
 */
export default class Documentation extends BaseController {
	public onInit(): void {
		this.getView()?.setModel(
			new JSONModel({
				ported: this.describe(portedControls),
				new: this.describe(newControls),
				classes: this.describe(classControls),
				themes: themes.map((theme) => ({
					...theme,
					note: this.getText(theme.noteKey),
				})),
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
<!-- letters: the arrangement of a country, and nothing else to say -->
<tc:Keyboard value="{/text}" size="XL" mode="German" change=".onChange" />

<!-- digits -->
<tc:NumberPad value="{/quantity}" size="XL" showDecimalSeparator="true" />

<!-- and keys of your own, row by row -->
<tc:CustomKeyboard
	value="{/code}"
	size="XL"
	layout="A B C, D E F, {bksp} {space} {enter}"
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
	 * Resolves the sentences of the entries of a table. The tables bind the
	 * description, which the entry itself only names by its key.
	 */
	private describe(controls: ControlDoc[]): (ControlDoc & {
		description: string;
	})[] {
		return controls.map((control) => ({
			...control,
			description: this.getText(control.descriptionKey),
		}));
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
