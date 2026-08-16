import type { ListBase$ItemPressEvent } from "sap/m/ListBase";
import JSONModel from "sap/ui/model/json/JSONModel";
import BaseController from "../BaseController";

/**
 * Controller of the KeyboardBase page.
 *
 * The page documents a base class rather than a control: there is nothing to
 * play with, so what would be the playground of a control page is the list of
 * what the three keyboards have in common - the properties, the events and the
 * keys with a meaning of their own - and a way over to each of the three.
 *
 * @namespace ui5.touch.controls.demo.controller.new
 */
export default class KeyboardBase extends BaseController {
	public onInit(): void {
		this.setControlIntro("KeyboardBase");

		this.getView()?.setModel(
			new JSONModel({
				// the three keyboards built on this class, in the order of the
				// navigation
				subclasses: [
					{
						key: "Keyboard",
						name: "ui5.touch.controls.Keyboard",
						text: this.getText("subKeyboard"),
						icon: "sap-icon://demo/keyboard",
					},
					{
						key: "NumberPad",
						name: "ui5.touch.controls.NumberPad",
						text: this.getText("subNumberPad"),
						icon: "sap-icon://demo/number-pad",
					},
					{
						key: "CustomKeyboard",
						name: "ui5.touch.controls.CustomKeyboard",
						text: this.getText("subCustomKeyboard"),
						icon: "sap-icon://demo/custom-keyboard",
					},
				],
				// what the class itself brings - the properties every keyboard
				// of this library has, whatever its keys are
				properties: [
					{
						name: "value",
						type: "string",
						default: '""',
						text: this.getText("propValue"),
					},
					{
						name: "emphasizedKeys",
						type: "string[]",
						default: "[]",
						text: this.getText("propEmphasizedKeys"),
					},
					{
						name: "maxLength",
						type: "int",
						default: "0",
						text: this.getText("propMaxLength"),
					},
					{
						name: "enabled",
						type: "boolean",
						default: "true",
						text: this.getText("propEnabled"),
					},
					{
						name: "hardwareKeys",
						type: "boolean",
						default: "false",
						text: this.getText("propHardwareKeys"),
					},
					{
						name: "size",
						type: "ui5.touch.controls.SizeMode",
						default: "M",
						text: this.getText("propSize"),
					},
					{
						name: "width",
						type: "sap.ui.core.CSSSize",
						default: "-",
						text: this.getText("propWidth"),
					},
					{
						name: "docked",
						type: "boolean",
						default: "false",
						text: this.getText("propDocked"),
					},
				],
				events: [
					{
						name: "change",
						parameters: "value",
						text: this.getText("evtChange"),
					},
					{
						name: "keyPress",
						parameters: "key",
						text: this.getText("evtKeyPress"),
					},
					{
						name: "enter",
						parameters: "value",
						text: this.getText("evtEnter"),
					},
					{
						name: "escape",
						parameters: "value",
						text: this.getText("evtEscape"),
					},
				],
				// the same table the CustomKeyboard page shows, because the
				// keys are handled here and therefore mean the same on all three
				specialKeys: [
					{ key: "{bksp}", meaning: this.getText("keyBksp") },
					{ key: "{enter}", meaning: this.getText("keyEnter") },
					{ key: "{space}", meaning: this.getText("keySpace") },
					{ key: "{shift}", meaning: this.getText("keyShift") },
					{ key: "{lock}", meaning: this.getText("keyLock") },
					{ key: "{tab}", meaning: this.getText("keyTab") },
					{ key: "{esc}", meaning: this.getText("keyEsc") },
					{ key: "{name}", meaning: this.getText("keySet") },
				],
			}),
			"json",
		);

		// the one snippet that is about the base class rather than about one
		// of the three: the aggregation of a field takes any of them
		this.setExample(
			`
<tc:Input value="{/text}">
	<tc:keyboard>
		<!-- a tc:Keyboard, a tc:NumberPad or a tc:CustomKeyboard -
		     the aggregation is typed to tc:KeyboardBase -->
		<tc:Keyboard
			mode="English"
			size="L"
			docked="true" />
	</tc:keyboard>
</tc:Input>
			`,
			"xml",
			this.getText("exampleBaseField"),
		);
	}

	/**
	 * Opens the page of the keyboard that was picked from the list of the
	 * three.
	 */
	public onNavToSubclass(event: ListBase$ItemPressEvent): void {
		const entry = event
			.getParameter("listItem")
			?.getBindingContext("json")
			?.getObject() as { key: string } | undefined;

		if (entry) {
			this.getRouter().navTo(entry.key);
		}
	}
}
