import type { Link$PressEvent } from "sap/m/Link";
import JSONModel from "sap/ui/model/json/JSONModel";
import type {
	KeyboardBase$ChangeEvent,
	KeyboardBase$EnterEvent,
	KeyboardBase$EscapeEvent,
} from "ui5/touch/controls/KeyboardBase";
import { NumberPadMode } from "ui5/touch/controls/library";
import type { KeyboardModeDoc } from "../../model/keyboardModes";
import { numberPadModeDocs } from "../../model/keyboardModes";
import BaseController from "../BaseController";

/**
 * Controller of the NumberPad page.
 *
 * @namespace ui5.touch.controls.demo.controller.new
 */
export default class NumberPad extends BaseController {
	private model!: JSONModel;

	public onInit(): void {
		this.setControlIntro("NumberPad");
		this.setApi("NumberPad");

		this.model = new JSONModel(
			{
				value: "",
				mode: NumberPadMode.Simple,
				showDecimalSeparator: false,
				decimalSeparator: "",
				showSign: false,
				showSpecialCharacters: false,
				showEscape: false,
				enterText: "",
				size: "2XL",
				enabled: true,
				hardwareKeys: true,
				docked: false,
				width: "",
				lastEvent: "-",
				modes: numberPadModeDocs,
			},
			true,
		);
		this.getView()?.setModel(this.model, "json");
		this.followDockedKeyboard("NumberPad", this.model);

		this.setSnippets({
			main: [
				{
					title: this.getText("examplePadBasic"),
					code: `
<mvc:View
	xmlns:mvc="sap.ui.core.mvc"
	xmlns:tc="ui5.touch.controls">
	<!-- a count: digits, a backspace and an Enter key -->
	<tc:NumberPad
		value="{/quantity}"
		size="XL"
		change=".onChange"
		enter=".onEnter" />
</mvc:View>
`,
				},
				{
					title: this.getText("examplePadModes"),
					code: `
<!-- the pad of a computer, 7 8 9 on top -->
<tc:NumberPad mode="Simple" size="XL" />

<!-- the pad of a telephone, 1 2 3 on top with a star and a hash -->
<tc:NumberPad mode="Phone" size="XL" />

<!-- and one with the four basic operations -->
<tc:NumberPad mode="Calculator" size="XL" />
`,
				},
				{
					title: this.getText("examplePadDecimal"),
					code: `
<!-- a weight may be negative and has decimals. The separator is the one
     of the current language unless another one is named -->
<tc:NumberPad
	value="{/weight}"
	mode="Simple"
	showSign="true"
	showDecimalSeparator="true"
	size="XL" />

<!-- a point, whatever the language says -->
<tc:NumberPad showDecimalSeparator="true" decimalSeparator="." size="XL" />
`,
				},
				{
					title: this.getText("examplePadPassword"),
					code: `
<!-- a code of digits and signs: the set of signs is behind a key of its
     own, and the pad keeps its three columns -->
<tc:NumberPad
	value="{/code}"
	maxLength="8"
	showSpecialCharacters="true"
	showEscape="true"
	emphasizedKeys="enter"
	escape=".onCancel"
	size="XL" />
`,
				},
				{
					title: this.getText("exampleKeyboardField"),
					code: `
<!-- on a field: the pad opens in a popover while the field has the focus -->
<tc:Input value="{/quantity}" size="XL" showKeyboard="true">
	<tc:keyboard>
		<tc:NumberPad showDecimalSeparator="true" size="XL" />
	</tc:keyboard>
</tc:Input>
`,
				},
			],
		});
	}

	/**
	 * Switches the playground to the mode that was clicked in the table.
	 */
	public onModePress(event: Link$PressEvent): void {
		const entry = event
			.getSource()
			.getBindingContext("json")
			?.getObject() as KeyboardModeDoc;
		this.model.setProperty("/mode", entry.mode);
	}

	public onChange(event: KeyboardBase$ChangeEvent): void {
		this.model.setProperty("/value", event.getParameter("value"));
	}

	public onEnter(event: KeyboardBase$EnterEvent): void {
		this.model.setProperty(
			"/lastEvent",
			`enter: ${event.getParameter("value") ?? ""}`,
		);
	}

	public onEscape(event: KeyboardBase$EscapeEvent): void {
		this.model.setProperty(
			"/lastEvent",
			`escape: ${event.getParameter("value") ?? ""}`,
		);
	}
}
