import type { Link$PressEvent } from "sap/m/Link";
import JSONModel from "sap/ui/model/json/JSONModel";
import type {
	KeyboardBase$ChangeEvent,
	KeyboardBase$EnterEvent,
	KeyboardBase$EscapeEvent,
} from "ui5/touch/controls/KeyboardBase";
import { KeyboardMode, LetterCase, NumberKeys } from "ui5/touch/controls/library";
import type { KeyboardModeDoc } from "../model/keyboardModes";
import { keyboardModeDocs } from "../model/keyboardModes";
import BaseController from "./BaseController";

/**
 * Controller of the Keyboard page.
 *
 * @namespace ui5.touch.controls.demo.controller
 */
export default class Keyboard extends BaseController {
	private model!: JSONModel;

	public onInit(): void {
		this.setControlIntro("Keyboard");

		this.model = new JSONModel(
			{
				value: "",
				mode: KeyboardMode.English,
				displayNumbers: NumberKeys.ToggleOnMobile,
				letterCase: LetterCase.Mixed,
				showSpecialCharacters: false,
				showCapsLock: false,
				showEscape: false,
				enterText: "",
				size: "L",
				enabled: true,
				hardwareKeys: true,
				docked: false,
				width: "",
				lastEvent: "-",
				modes: keyboardModeDocs,
			},
			true,
		);
		this.getView()?.setModel(this.model, "json");

		this.setSnippets({
			main: [
				{
					title: this.getText("exampleKeyboardBasic"),
					code: `
<mvc:View
	xmlns:mvc="sap.ui.core.mvc"
	xmlns:tc="ui5.touch.controls">
	<!-- the arrangement of a country, and nothing else to say -->
	<tc:Keyboard
		value="{/text}"
		size="XL"
		mode="German"
		change=".onChange"
		enter=".onEnter" />
</mvc:View>
`,
				},
				{
					title: this.getText("exampleKeyboardNumbers"),
					code: `
<!-- a row of digits over the letters, the way a keyboard of keys has it -->
<tc:Keyboard mode="English" displayNumbers="Always" size="XL" />

<!-- letters only, digits behind a key - the way a phone does it -->
<tc:Keyboard mode="English" displayNumbers="Toggle" size="XL" />

<!-- the first on a computer, the second on a phone. This is the default -->
<tc:Keyboard mode="English" displayNumbers="ToggleOnMobile" size="XL" />

<!-- letters, and no way to a digit at all -->
<tc:Keyboard mode="English" displayNumbers="Never" size="XL" />
`,
				},
				{
					title: this.getText("exampleKeyboardCase"),
					code: `
<!-- a material number is capitals, so the keyboard writes them and has
     neither a shift key nor a caps lock: there is nothing to switch -->
<tc:Keyboard
	value="{/material}"
	mode="German"
	letterCase="Upper"
	displayNumbers="Always"
	size="XL" />

<!-- and where both cases are typed, the lock stays on until it is
     pressed again, while shift falls away after one letter -->
<tc:Keyboard mode="German" letterCase="Mixed" showCapsLock="true" size="XL" />
`,
				},
				{
					title: this.getText("exampleKeyboardKeys"),
					code: `
<!-- a set of brackets, signs and currencies behind a key of its own,
     an {esc} key, and an Enter key that says what it does -->
<tc:Keyboard
	value="{/note}"
	mode="English"
	showSpecialCharacters="true"
	showEscape="true"
	enterText="Search"
	emphasizedKeys="enter"
	escape=".onEscape"
	enter=".onSearch"
	size="XL" />
`,
				},
				{
					title: this.getText("exampleKeyboardField"),
					code: `
<!-- on a field: the keyboard opens in a popover while the field has the
     focus and types into it -->
<tc:Input value="{/text}" size="XL" showKeyboard="true">
	<tc:keyboard>
		<tc:Keyboard mode="German" size="XL" />
	</tc:keyboard>
</tc:Input>
`,
				},
				{
					title: this.getText("exampleController"),
					language: "javascript",
					code: `
onChange(event) {
	// fired after every key, with the value the keyboard now holds
	this.getModel().setProperty("/text", event.getParameter("value"));
},

onEnter(event) {
	this.search(event.getParameter("value"));
},

onEscape() {
	// the keyboard does nothing about it by itself
	this.byId("dialog").close();
}
`,
				},
			],
		});
	}

	/**
	 * Switches the playground to the arrangement that was clicked in the
	 * table.
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
