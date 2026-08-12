import type { Link$PressEvent } from "sap/m/Link";
import MessageToast from "sap/m/MessageToast";
import JSONModel from "sap/ui/model/json/JSONModel";
import type SizedVirtualKeyboard from "ui5/touch/controls/VirtualKeyboard";
import type {
	VirtualKeyboard$ChangeEvent,
	VirtualKeyboard$EnterEvent,
} from "ui5/touch/controls/VirtualKeyboard";
import { KeyboardMode } from "ui5/touch/controls/library";
import type { KeyboardModeDoc } from "../model/keyboardModes";
import { keyboardModeDocs } from "../model/keyboardModes";
import BaseController from "./BaseController";

/**
 * Controller of the VirtualKeyboard page.
 *
 * @namespace ui5.touch.controls.demo.controller
 */
export default class VirtualKeyboard extends BaseController {
	private model!: JSONModel;

	public onInit(): void {
		this.setControlIntro("VirtualKeyboard");

		this.model = new JSONModel(
			{
				value: "",
				mode: KeyboardMode.QWERTY,
				// what the Custom mode shows: the rows of a layout, comma
				// separated, the way they are written in an XML view
				layoutText: "7 8 9, 4 5 6, 1 2 3, {bksp} 0 {enter}",
				size: "L",
				enabled: true,
				hardwareKeys: true,
				docked: false,
				width: "",
				modes: keyboardModeDocs,
			},
			true,
		);
		this.getView()?.setModel(this.model, "json");
		this.applyCustomLayout();

		this.setExample(`
<mvc:View
	xmlns:mvc="sap.ui.core.mvc"
	xmlns:tc="ui5.touch.controls">
	<!-- a ready-made layout: the mode is all it takes -->
	<tc:VirtualKeyboard
		value="{/value}"
		size="XL"
		width="700px"
		hardwareKeys="true"
		mode="QWERTY"
		change=".onChange"
		enter=".onEnter" />

	<!-- rows of your own: only Custom looks at the layout property -->
	<tc:VirtualKeyboard
		value="{/quantity}"
		size="XL"
		mode="Custom"
		layout="7 8 9, 4 5 6, 1 2 3, {bksp} 0 {enter}"
		change=".onChange" />

	<!-- more than one set of keys: every set says in full what is on it,
	     and a key named after a set switches to it -->
	<tc:VirtualKeyboard value="{/text}" size="XL" mode="Custom">
		<tc:layouts>
			<tc:KeyboardLayout
				name="default"
				rows="q w e r t y u i o p,
				      a s d f g h j k l,
				      {shift} z x c v b n m {backspace},
				      {numbers} {space} {ent}" />
			<tc:KeyboardLayout
				name="shift"
				rows="Q W E R T Y U I O P,
				      A S D F G H J K L,
				      {shift} Z X C V B N M {backspace},
				      {numbers} {space} {ent}" />
			<tc:KeyboardLayout
				name="numbers"
				rows="1 2 3, 4 5 6, 7 8 9, {abc} 0 {backspace}" />
		</tc:layouts>
	</tc:VirtualKeyboard>

	<!-- display says what a single key reads, where the sign the keyboard
	     would pick is not the right one. The braces are left out: UI5 reads
	     a string that begins with one as a binding -->
	<tc:VirtualKeyboard value="{/text}" size="XL" mode="QWERTZMobile">
		<tc:display>
			<tc:KeyboardKey key="numbers" text="?123" />
			<tc:KeyboardKey key="abc" text="Abc" />
			<tc:KeyboardKey key="ent" text="return" />
			<tc:KeyboardKey key="space" text="Leerzeichen" />
		</tc:display>
	</tc:VirtualKeyboard>

	<!-- emphasizedKeys draws the keys it names as emphasized, and escape is
	     fired by an {esc} key - the application decides what it means -->
	<tc:VirtualKeyboard
		value="{/pin}"
		size="XL"
		mode="Custom"
		layout="1 2 3, 4 5 6, 7 8 9, {esc} 0 {enter}"
		emphasizedKeys="enter"
		escape=".onEscape"
		enter=".onEnter" />

	<!-- docked: at the bottom edge of the screen, over everything else,
	     and the full width of a phone or a tablet -->
	<tc:VirtualKeyboard
		value="{/code}"
		size="XL"
		mode="QWERTZ"
		docked="true"
		change=".onChange" />
</mvc:View>
`);
	}

	/**
	 * Hands the typed rows to the keyboard. The layout is an array, so it
	 * cannot be bound to the text field directly.
	 */
	public applyCustomLayout(): void {
		const keyboard = this.byId("keyboard") as SizedVirtualKeyboard;
		const text = this.model.getProperty("/layoutText") as string;

		keyboard.setLayout(
			text
				.split(",")
				.map((row) => row.trim())
				.filter(Boolean),
		);
	}

	/**
	 * Switches the playground to the mode that was clicked in the table.
	 */
	public onModePress(event: Link$PressEvent): void {
		const entry = event.getSource().getBindingContext("json")
			?.getObject() as KeyboardModeDoc;
		this.model.setProperty("/mode", entry.mode);
	}

	public onChange(event: VirtualKeyboard$ChangeEvent): void {
		this.model.setProperty("/value", event.getParameter("value"));
	}

	public onEnter(event: VirtualKeyboard$EnterEvent): void {
		MessageToast.show(`Enter pressed: ${event.getParameter("value")}`);
	}
}
