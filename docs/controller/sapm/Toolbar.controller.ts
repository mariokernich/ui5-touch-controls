import type Dialog from "sap/m/Dialog";
import MessageToast from "sap/m/MessageToast";
import JSONModel from "sap/ui/model/json/JSONModel";
import { SizeMode } from "ui5/touch/controls/library";
import BaseController from "../BaseController";

/**
 * Controller of the Toolbar page.
 *
 * @namespace ui5.touch.controls.demo.controller.sapm
 */
export default class Toolbar extends BaseController {
	/**
	 * The dialog, as the promise of it: kept from the first press on, so a
	 * second press before it has loaded opens the same dialog instead of
	 * loading another one with the same ids.
	 */
	private dialog?: Promise<Dialog>;

	public onInit(): void {
		this.setControlIntro("Toolbar");

		this.getView()?.setModel(new JSONModel({ size: SizeMode.L }, true), "json");

		this.setExample(`
<mvc:View
	xmlns:mvc="sap.ui.core.mvc"
	xmlns="sap.m"
	xmlns:tc="ui5.touch.controls">
	<Page showFooter="true">
		<footer>
			<tc:Toolbar>
				<tc:Button
					text="Add"
					type="Emphasized"
					icon="sap-icon://add"
					press=".onAdd" />
				<ToolbarSpacer />
				<tc:Button
					text="Delete"
					type="Reject"
					icon="sap-icon://delete"
					press=".onDelete" />
			</tc:Toolbar>
		</footer>
	</Page>
</mvc:View>
`);
	}

	public async onOpenDialog(): Promise<void> {
		// prefixed with the id of the view and a dependent of it, like the
		// view's own content
		this.dialog ??= this.loadFragment({
			name: "ui5.touch.controls.demo.view.SampleDialog",
		}) as Promise<Dialog>;

		(await this.dialog).open();
	}

	public async onCloseDialog(): Promise<void> {
		(await this.dialog)?.close();
	}

	public onDummyPress(): void {
		MessageToast.show(this.getText("msgDummyPressed"));
	}
}
