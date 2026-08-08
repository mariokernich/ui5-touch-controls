import MessageToast from "sap/m/MessageToast";
import type { Slider$LiveChangeEvent } from "sap/m/Slider";
import type Event from "sap/ui/base/Event";
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

	public onInit(): void {
		this.model = new JSONModel(
			{ size: SizeMode.L, containerWidth: "100%" },
			true,
		);
		this.getView()?.setModel(this.model, "json");

		this.setExample(`
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
`);
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
