import type Button from "sap/m/Button";
import MessageToast from "sap/m/MessageToast";
import type ResponsivePopover from "sap/m/ResponsivePopover";
import type Event from "sap/ui/base/Event";
import JSONModel from "sap/ui/model/json/JSONModel";
import type { ColorPicker$ChangeEvent } from "sap/ui/unified/ColorPicker";
import { SizeMode } from "ui5/touch/controls/library";
import BaseController from "../BaseController";

/**
 * Controller of the Text page.
 *
 * @namespace ui5.touch.controls.demo.controller.sapm
 */
export default class Text extends BaseController {
	private model!: JSONModel;
	/**
	 * The colour picker, as the promise of it: kept from the first press on,
	 * so a second press before it has loaded opens the same picker instead of
	 * loading another one with the same ids.
	 */
	private colorPicker?: Promise<ResponsivePopover>;

	public onInit(): void {
		this.setControlIntro("Text");

		this.model = new JSONModel(
			{
				text: this.getText("smpText"),
				color: "#333333",
				size: SizeMode.L,
			},
			true,
		);
		this.getView()?.setModel(this.model, "json");

		this.setExample(`
<mvc:View
	xmlns:mvc="sap.ui.core.mvc"
	xmlns:tc="ui5.touch.controls">
	<tc:Text
		text="The quick brown fox jumps over the lazy dog"
		color="#0057d2"
		size="XL"
		press=".onTextPress" />
</mvc:View>
`);
	}

	/**
	 * Opens the colour picker next to the button that was pressed.
	 */
	public async onColorPress(event: Event<object, Button>): Promise<void> {
		const source = event.getSource();

		// prefixed with the id of the view and a dependent of it, like the
		// view's own content
		this.colorPicker ??= this.loadFragment({
			name: "ui5.touch.controls.demo.view.ColorPicker",
		}) as Promise<ResponsivePopover>;

		(await this.colorPicker).openBy(source);
	}

	public onColorChange(event: ColorPicker$ChangeEvent): void {
		this.model.setProperty("/color", event.getParameter("hex"));
	}

	public onTextPress(): void {
		MessageToast.show(this.getText("msgTextPressed"));
	}
}
