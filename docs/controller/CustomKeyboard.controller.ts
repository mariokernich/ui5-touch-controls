import JSONModel from "sap/ui/model/json/JSONModel";
import KeyboardKey from "ui5/touch/controls/KeyboardKey";
import KeyboardLayout from "ui5/touch/controls/KeyboardLayout";
import type SizedCustomKeyboard from "ui5/touch/controls/CustomKeyboard";
import type {
	KeyboardBase$ChangeEvent,
	KeyboardBase$EnterEvent,
} from "ui5/touch/controls/KeyboardBase";
import BaseController from "./BaseController";

/** the layouts the example select offers, as they would stand in a view */
const EXAMPLES: Record<string, string> = {
	plate:
		"A B C D E F G H I,\nJ K L M N O P Q R,\nS T U V W X Y Z,\n1 2 3 4 5 6 7 8 9 0,\n{bksp} {space} {enter}",
	sizes: "XS S M L,\nXL 2XL 3XL,\n{bksp} {enter}",
	sets: "",
};

/**
 * Controller of the CustomKeyboard page.
 *
 * @namespace ui5.touch.controls.demo.controller
 */
export default class CustomKeyboard extends BaseController {
	private model!: JSONModel;

	public onInit(): void {
		this.setControlIntro("CustomKeyboard");

		this.model = new JSONModel(
			{
				value: "",
				example: "plate",
				layoutText: EXAMPLES.plate,
				size: "L",
				enabled: true,
				hardwareKeys: true,
				docked: false,
				width: "",
				lastEvent: "-",
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
			},
			true,
		);
		this.getView()?.setModel(this.model, "json");
		this.applyLayout();

		this.setSnippets({
			main: [
				{
					title: this.getText("exampleCustomRows"),
					code: `
<mvc:View
	xmlns:mvc="sap.ui.core.mvc"
	xmlns:tc="ui5.touch.controls">
	<!-- one set of keys: rows separated by commas, keys by spaces -->
	<tc:CustomKeyboard
		value="{/plate}"
		size="XL"
		layout="A B C D E F G H I J,
		        K L M N O P Q R S T,
		        U V W X Y Z,
		        {bksp} {space} {enter}"
		change=".onChange" />
</mvc:View>
`,
				},
				{
					title: this.getText("exampleCustomSets"),
					code: `
<!-- more than one set: a key written as the name of a set switches to it,
     and a key that names the set it is already on leads back out of it -->
<tc:CustomKeyboard value="{/text}" size="XL">
	<tc:layouts>
		<tc:KeyboardLayout
			name="default"
			rows="q w e r t y u i o p,
			      a s d f g h j k l,
			      {shift} z x c v b n m {bksp},
			      {numbers} {space} {enter}" />
		<tc:KeyboardLayout
			name="shift"
			rows="Q W E R T Y U I O P,
			      A S D F G H J K L,
			      {shift} Z X C V B N M {bksp},
			      {numbers} {space} {enter}" />
		<tc:KeyboardLayout
			name="numbers"
			rows="1 2 3, 4 5 6, 7 8 9, {abc} 0 {bksp}" />
	</tc:layouts>
</tc:CustomKeyboard>
`,
				},
				{
					title: this.getText("exampleCustomDisplay"),
					code: `
<!-- display says what a single key reads. The braces are left out: UI5
     reads a string that begins with one as a binding -->
<tc:CustomKeyboard value="{/text}" size="XL" layout="1 2 3, {numbers} 0 {ent}">
	<tc:display>
		<tc:KeyboardKey key="numbers" text="?123" />
		<tc:KeyboardKey key="ent" text="Weiter" />
		<tc:KeyboardKey key="space" text="Leerzeichen" />
	</tc:display>
</tc:CustomKeyboard>
`,
				},
				{
					title: this.getText("exampleController"),
					language: "javascript",
					code: `
// the rows are an array, so a text field cannot be bound to them directly
applyLayout() {
	const rows = this.getModel().getProperty("/layoutText")
		.split(",")
		.map((row) => row.trim())
		.filter(Boolean);

	this.byId("keyboard").setLayout(rows);
}
`,
				},
			],
		});
	}

	private getKeyboard(): SizedCustomKeyboard {
		return this.byId("keyboard") as SizedCustomKeyboard;
	}

	/**
	 * Hands the typed rows to the keyboard. The layout is an array, so it
	 * cannot be bound to the text field directly.
	 */
	public applyLayout(): void {
		const keyboard = this.getKeyboard();
		const text = this.model.getProperty("/layoutText") as string;

		keyboard.destroyLayouts();
		keyboard.setLayout(
			text
				.split(",")
				.map((row) => row.trim())
				.filter(Boolean),
		);
	}

	/**
	 * Puts one of the ready examples into the playground. The one with sets
	 * cannot be written as a single list of rows, so it fills the aggregation
	 * instead and the text field is switched off for it.
	 */
	public onExampleChange(): void {
		const example = this.model.getProperty("/example") as string;

		if (example !== "sets") {
			this.model.setProperty("/layoutText", EXAMPLES[example]);
			this.applyLayout();
			return;
		}

		this.model.setProperty("/layoutText", this.getText("phLayoutSets"));

		const keyboard = this.getKeyboard();
		keyboard.destroyLayouts();
		keyboard.addLayout_(
			new KeyboardLayout({
				name: "default",
				rows: [
					"q w e r t y u i o p",
					"a s d f g h j k l",
					"{shift} z x c v b n m {bksp}",
					"{numbers} {space} {enter}",
				],
			}),
		);
		keyboard.addLayout_(
			new KeyboardLayout({
				name: "shift",
				rows: [
					"Q W E R T Y U I O P",
					"A S D F G H J K L",
					"{shift} Z X C V B N M {bksp}",
					"{numbers} {space} {enter}",
				],
			}),
		);
		keyboard.addLayout_(
			new KeyboardLayout({
				name: "numbers",
				rows: ["1 2 3", "4 5 6", "7 8 9", "{abc} 0 {bksp}"],
			}),
		);
		keyboard.destroyDisplay();
		keyboard.addDisplayKey(new KeyboardKey({ key: "numbers", text: "?123" }));
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
}
