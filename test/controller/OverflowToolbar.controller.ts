import type Dialog from "sap/m/Dialog";
import MessageToast from "sap/m/MessageToast";
import type { Slider$LiveChangeEvent } from "sap/m/Slider";
import type Event from "sap/ui/base/Event";
import Fragment from "sap/ui/core/Fragment";
import JSONModel from "sap/ui/model/json/JSONModel";
import type SizedButton from "ui5/touch/controls/Button";
import { SizeMode } from "ui5/touch/controls/library";
import BaseController from "./BaseController";

/**
 * Controller of the OverflowToolbar page.
 *
 * @namespace ui5.touch.controls.demo.controller
 */
export default class OverflowToolbar extends BaseController {
	private model!: JSONModel;
	private dialog?: Dialog;

	public onInit(): void {
		this.setControlIntro("OverflowToolbar");

		this.model = new JSONModel(
			{ size: SizeMode.L, containerWidth: "100%" },
			true,
		);
		this.getView()?.setModel(this.model, "json");

		this.setSnippets({
			main: [
				`
<mvc:View
	xmlns:mvc="sap.ui.core.mvc"
	xmlns="sap.m"
	xmlns:tc="ui5.touch.controls">
	<Page showFooter="true">
		<footer>
			<tc:OverflowToolbar size="XL">
				<tc:Button
					text="New"
					type="Emphasized"
					icon="sap-icon://add"
					size="XL"
					press=".onNew" />
				<tc:Button
					text="Edit"
					icon="sap-icon://edit"
					size="XL"
					press=".onEdit" />
				<ToolbarSpacer />
				<tc:Button
					text="Delete"
					type="Reject"
					icon="sap-icon://delete"
					size="XL"
					press=".onDelete">
					<tc:layoutData>
						<OverflowToolbarLayoutData priority="NeverOverflow" />
					</tc:layoutData>
				</tc:Button>
			</tc:OverflowToolbar>
		</footer>
	</Page>
</mvc:View>
`,
			],
			dialog: [
				`
<core:FragmentDefinition
	xmlns="sap.m"
	xmlns:core="sap.ui.core"
	xmlns:tc="ui5.touch.controls">
	<!-- buttons only takes sap.m.Button, footer takes any sap.m.Toolbar -->
	<Dialog title="Order 4711" contentWidth="420px">
		<Text text="Approve the order?" />
		<footer>
			<tc:OverflowToolbar size="XL">
				<tc:Button
					text="Save"
					type="Emphasized"
					icon="sap-icon://save"
					size="XL"
					press=".onSave" />
				<tc:Button
					text="Cancel"
					icon="sap-icon://decline"
					size="XL"
					press=".onCancel" />
				<ToolbarSpacer />
				<tc:Button
					text="Approve"
					type="Accept"
					icon="sap-icon://accept"
					size="XL"
					press=".onApprove" />
			</tc:OverflowToolbar>
		</footer>
	</Dialog>
</core:FragmentDefinition>
`,
			],
		});
	}

	/**
	 * Opens the dialog whose footer is a touch OverflowToolbar.
	 */
	public async onOpenDialog(): Promise<void> {
		this.dialog ??= (await Fragment.load({
			id: this.getView()?.getId(),
			name: "ui5.touch.controls.demo.view.OverflowDialog",
			controller: this,
		})) as Dialog;
		this.getView()?.addDependent(this.dialog);

		this.dialog.open();
	}

	public onCloseDialog(): void {
		this.dialog?.close();
	}

	public onWidthChange(event: Slider$LiveChangeEvent): void {
		this.model.setProperty(
			"/containerWidth",
			`${event.getParameter("value")}%`,
		);
	}

	public onDemoPress(event: Event<object, SizedButton>): void {
		MessageToast.show(`"${event.getSource().getText()}" pressed`);
	}
}
