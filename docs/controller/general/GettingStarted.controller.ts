import MessageToast from "sap/m/MessageToast";
import type Event from "sap/ui/base/Event";
import type SizedButton from "ui5/touch/controls/Button";
import BaseController from "../BaseController";

/**
 * Controller of the landing page.
 *
 * @namespace ui5.touch.controls.demo.controller.general
 */
export default class GettingStarted extends BaseController {
	public onInit(): void {
		this.setSnippets({
			comparison: [
				{
					code: `
<mvc:View
  xmlns:mvc="sap.ui.core.mvc"
  xmlns="sap.m">
  <Page title="Order">
	<footer>
	  <OverflowToolbar>
		<Button text="Save" type="Emphasized" press=".onSave" />
		<Button text="Cancel" press=".onCancel" />
		<ToolbarSpacer />
		<Button text="Approve" type="Accept" press=".onApprove" />
	  </OverflowToolbar>
	</footer>
  </Page>
</mvc:View>
`,
				},
				{
					code: `
<mvc:View
	xmlns:mvc="sap.ui.core.mvc"
	xmlns="sap.m"
	xmlns:tc="ui5.touch.controls">
	<Page title="Order">
		<footer>
			<tc:OverflowToolbar size="XL">
				<tc:Button text="Save" type="Emphasized" size="XL" press=".onSave" />
				<tc:Button text="Cancel" size="XL" press=".onCancel" />
				<ToolbarSpacer />
				<tc:Button text="Approve" type="Accept" size="XL" press=".onApprove" />
			</tc:OverflowToolbar>
		</footer>
	</Page>
</mvc:View>
`,
				},
			],
		});
	}

	public onSizePress(event: Event<object, SizedButton>): void {
		const size = event.getSource().getSize();
		MessageToast.show(this.getText("msgSizePressed", [size]));
	}

	public onSetupPress(): void {
		this.getRouter().navTo("Setup");
	}

	public onDocumentationPress(): void {
		this.getRouter().navTo("Documentation");
	}

	public onButtonPress(): void {
		this.getRouter().navTo("Button");
	}
}
