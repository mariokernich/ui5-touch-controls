import type Dialog from "sap/m/Dialog";
import MessageToast from "sap/m/MessageToast";
import Fragment from "sap/ui/core/Fragment";
import JSONModel from "sap/ui/model/json/JSONModel";
import { SizeMode } from "ui5/touch/controls/library";
import BaseController from "./BaseController";

/**
 * Controller of the Toolbar page.
 *
 * @namespace ui5.touch.controls.demo.controller
 */
export default class Toolbar extends BaseController {
	private dialog?: Dialog;

	public onInit(): void {
		this.getView()?.setModel(
			new JSONModel({ size: SizeMode.L }, true),
			"json",
		);

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
		this.dialog ??= (await Fragment.load({
			id: this.getView()?.getId(),
			name: "ui5.touch.controls.demo.view.SampleDialog",
			controller: this,
		})) as Dialog;
		this.getView()?.addDependent(this.dialog);

		this.dialog.open();
	}

	public onCloseDialog(): void {
		this.dialog?.close();
	}

	public onDummyPress(): void {
		MessageToast.show("Dummy button pressed");
	}
}
