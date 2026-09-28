import MButton from "sap/m/Button";
import type Popover from "sap/m/Popover";
import MToolbar from "sap/m/Toolbar";
import VBox from "sap/m/VBox";
import type Control from "sap/ui/core/Control";
import type ElementMetadata from "sap/ui/core/ElementMetadata";
import Item from "sap/ui/core/Item";
import BarcodeInput from "ui5/touch/controls/BarcodeInput";
import Button from "ui5/touch/controls/Button";
import CheckBox from "ui5/touch/controls/CheckBox";
import ComboBox from "ui5/touch/controls/ComboBox";
import CustomKeyboard from "ui5/touch/controls/CustomKeyboard";
import DatePicker from "ui5/touch/controls/DatePicker";
import Input from "ui5/touch/controls/Input";
import Keyboard from "ui5/touch/controls/Keyboard";
import type KeyboardBase from "ui5/touch/controls/KeyboardBase";
import Link from "ui5/touch/controls/Link";
import NumberPad from "ui5/touch/controls/NumberPad";
import OverflowToolbar from "ui5/touch/controls/OverflowToolbar";
import RadioButton from "ui5/touch/controls/RadioButton";
import RadioButtonGroup from "ui5/touch/controls/RadioButtonGroup";
import SegmentedButton from "ui5/touch/controls/SegmentedButton";
import SegmentedButtonItem from "ui5/touch/controls/SegmentedButtonItem";
import Select from "ui5/touch/controls/Select";
import SignaturePad from "ui5/touch/controls/SignaturePad";
import StepInput from "ui5/touch/controls/StepInput";
import Switch from "ui5/touch/controls/Switch";
import TextArea from "ui5/touch/controls/TextArea";
import TimePicker from "ui5/touch/controls/TimePicker";
import Toolbar from "ui5/touch/controls/Toolbar";
import {
	cleanUp,
	EventLog,
	keydown,
	keyup,
	place,
	pointer,
	render,
	tap,
	wait,
	waitFor,
} from "./helpers";

/**
 * Disabled means disabled. A control takes no tap, no press and no key while
 * it is disabled - on its own, or because a container around it is: a
 * disabled Toolbar disables its content, the way it does in sap.m.
 *
 * Every control is tried the way a user tries it, first disabled and then
 * enabled again. The second try is what makes the first one count: it shows
 * that what the test did is something the control reacts to, so a control
 * that stays quiet while disabled is not quiet because nothing was done.
 */

/** what every control tried here has: an enabled property */
type Enableable = Control & {
	getEnabled(): boolean;
	setEnabled(enabled: boolean): unknown;
};

/** A control as a user meets it: what they do to it, and whether it reacted. */
interface Subject {
	/** the control; its own enabled property is left alone */
	control: Enableable;
	/** what the user does to it */
	act: () => void;
	/** whether what the user did got through */
	reacted: () => boolean;
}

function subject<T extends Enableable>(
	control: T,
	act: (control: T) => void,
	reacted: (control: T) => boolean,
): Subject {
	return {
		control: control,
		act: () => act(control),
		reacted: () => reacted(control),
	};
}

/** a control that tells of a reaction with an event, press say */
function reporting<T extends Enableable>(
	control: T,
	event: string,
	act: (control: T) => void,
): Subject {
	const log = new EventLog().listen(control, event);

	return subject(control, act, () => log.count(event) > 0);
}

/**
 * A field: what the user does is put the focus into it, which a disabled
 * native field does not take - and without the focus nothing is typed.
 */
function field<T extends Enableable>(
	control: T,
	native = (of: T): HTMLElement => dom(of, "inner"),
): Subject {
	return subject(
		control,
		(of) => native(of).focus(),
		(of) => document.activeElement === native(of),
	);
}

function dom(
	control: { getDomRef(suffix?: string): Element | null },
	suffix?: string,
): HTMLElement {
	const element = control.getDomRef(suffix);

	if (!element) {
		throw new Error(`${suffix ?? "the control"} is not on the page`);
	}

	return element as HTMLElement;
}

/** how the buttons of the library are pressed: the pointer goes down and up */
function push(target: Element): void {
	pointer(target, "pointerdown");
	pointer(target, "pointerup");
}

/** Space, which toggles on its way up */
function space(target: Element): void {
	keydown(target, " ");
	keyup(target, " ");
}

/** whether the popover of the control - a picker, a keyboard - is open */
function opened(control: Control): boolean {
	return Boolean((control.getAggregation("_popover") as Popover | null)?.isOpen());
}

/** closes what the control has opened, so the next test starts from nothing */
async function settle(control: Control): Promise<void> {
	const popover = control.getAggregation("_popover") as Popover | null;

	if (popover?.isOpen()) {
		popover.close();
		await waitFor(() => !popover.isOpen(), "the popover did not close");
	}
}

function fruits(): Item[] {
	return [
		new Item({ key: "apple", text: "Apple" }),
		new Item({ key: "banana", text: "Banana" }),
	];
}

/** the key of a keyboard whose text matches */
function key(keyboard: KeyboardBase, text: RegExp): Button {
	const found = (keyboard.getAggregation("_buttons") as Button[]).find((button) =>
		text.test(button.getText()),
	);

	if (!found) {
		throw new Error(`no key ${String(text)}`);
	}

	return found;
}

/** draws a line across the pad */
function stroke(pad: SignaturePad): void {
	const canvas = dom(pad, "canvas");
	const box = canvas.getBoundingClientRect();
	const at = (x: number, y: number): PointerEventInit => ({
		clientX: box.left + x,
		clientY: box.top + y,
	});

	pointer(canvas, "pointerdown", at(10, 10));
	pointer(canvas, "pointermove", at(60, 30));
	pointer(canvas, "pointerup", at(60, 30));
}

/**
 * What the user does to each control of the library, by its name - every
 * entry makes a fresh control. A control that is added to the library and can
 * be disabled belongs in here; the last test of the module sees to that.
 */
const ATTEMPTS: Record<string, Record<string, () => Subject>> = {
	Button: {
		"a tap": () => reporting(new Button({ text: "Go" }), "press", (button) => push(dom(button))),
		// what a native button makes of Enter and Space: a click without a
		// pointer behind it
		"Enter or Space": () =>
			reporting(new Button({ text: "Go" }), "press", (button) => dom(button).click()),
	},
	Link: {
		"a tap": () => reporting(new Link({ text: "Go" }), "press", (link) => tap(dom(link))),
		Enter: () =>
			reporting(new Link({ text: "Go" }), "press", (link) => keydown(dom(link), "Enter")),
	},
	CheckBox: {
		"a tap": () =>
			subject(
				new CheckBox({ text: "Agree" }),
				(box) => tap(dom(box)),
				(box) => box.getSelected(),
			),
		Space: () =>
			subject(
				new CheckBox({ text: "Agree" }),
				(box) => space(dom(box)),
				(box) => box.getSelected(),
			),
	},
	Switch: {
		"a tap": () =>
			subject(
				new Switch(),
				(control) => tap(dom(control)),
				(control) => control.getState(),
			),
		Enter: () =>
			subject(
				new Switch(),
				(control) => keydown(dom(control), "Enter"),
				(control) => control.getState(),
			),
	},
	RadioButton: {
		"a tap": () =>
			subject(
				new RadioButton({ text: "One" }),
				(button) => tap(dom(button)),
				(button) => button.getSelected(),
			),
		Space: () =>
			subject(
				new RadioButton({ text: "One" }),
				(button) => space(dom(button)),
				(button) => button.getSelected(),
			),
	},
	RadioButtonGroup: {
		"a tap on a button": () =>
			subject(
				new RadioButtonGroup({
					buttons: [new RadioButton({ text: "One" }), new RadioButton({ text: "Two" })],
				}),
				(group) => tap(dom(group.getButtons()[1])),
				(group) => group.getSelectedIndex() === 1,
			),
	},
	SegmentedButton: {
		"a tap on a segment": () =>
			subject(
				new SegmentedButton({
					items: [
						new SegmentedButtonItem({ key: "day", text: "Day" }),
						new SegmentedButtonItem({ key: "week", text: "Week" }),
					],
				}),
				(control) => push(dom((control.getAggregation("_buttons") as Button[])[1])),
				(control) => control.getSelectedKey() === "week",
			),
	},
	Select: {
		"a tap": () => subject(new Select({ items: fruits() }), (select) => tap(dom(select)), opened),
		Enter: () =>
			subject(
				new Select({ items: fruits() }),
				(select) => keydown(dom(select), "Enter"),
				opened,
			),
	},
	ComboBox: {
		"a tap on the arrow": () =>
			subject(new ComboBox({ items: fruits() }), (box) => tap(dom(box, "arrow")), opened),
		"the arrow down key": () =>
			subject(
				new ComboBox({ items: fruits() }),
				(box) => keydown(dom(box, "inner"), "ArrowDown"),
				opened,
			),
		"the focus": () => field(new ComboBox({ items: fruits() })),
	},
	Input: {
		"the focus": () => field(new Input()),
		"a tap, which brings the on-screen keyboard": () =>
			subject(
				new Input({ showKeyboard: true, keyboard: new NumberPad() }),
				(input) => tap(dom(input)),
				opened,
			),
	},
	TextArea: {
		"the focus": () => field(new TextArea()),
		"a tap, which brings the on-screen keyboard": () =>
			subject(
				new TextArea({ showKeyboard: true, keyboard: new NumberPad() }),
				(area) => tap(dom(area)),
				opened,
			),
	},
	BarcodeInput: {
		"the focus": () => field(new BarcodeInput()),
	},
	StepInput: {
		"a tap on the plus button": () =>
			subject(
				new StepInput({ value: 1 }),
				(control) => push(dom(control.getAggregation("_plusButton") as Button)),
				(control) => control.getValue() !== 1,
			),
		"the focus": () =>
			field(new StepInput({ value: 1 }), (control) =>
				dom(control.getAggregation("_input") as Input, "inner"),
			),
	},
	DatePicker: {
		"a tap on the icon": () =>
			subject(new DatePicker(), (picker) => tap(dom(picker, "icon")), opened),
		F4: () => subject(new DatePicker(), (picker) => keydown(dom(picker, "inner"), "F4"), opened),
		"the focus": () => field(new DatePicker()),
	},
	TimePicker: {
		"a tap on the icon": () =>
			subject(new TimePicker(), (picker) => tap(dom(picker, "icon")), opened),
		F4: () => subject(new TimePicker(), (picker) => keydown(dom(picker, "inner"), "F4"), opened),
		"the focus": () => field(new TimePicker()),
	},
	SignaturePad: {
		"a stroke": () =>
			subject(
				new SignaturePad({ width: "200px", height: "100px" }),
				stroke,
				(pad) => pad.isSigned(),
			),
	},
	NumberPad: {
		"a tap on a key": () =>
			subject(
				new NumberPad(),
				(pad) => push(dom(key(pad, /^7$/))),
				(pad) => pad.getValue() !== "",
			),
		"a hardware key": () =>
			subject(
				new NumberPad({ hardwareKeys: true }),
				(pad) => keydown(dom(pad), "7"),
				(pad) => pad.getValue() !== "",
			),
	},
	Keyboard: {
		"a tap on a key": () =>
			subject(
				new Keyboard(),
				(keyboard) => push(dom(key(keyboard, /^[a-z]$/i))),
				(keyboard) => keyboard.getValue() !== "",
			),
		"a hardware key": () =>
			subject(
				new Keyboard({ hardwareKeys: true }),
				(keyboard) => keydown(dom(keyboard), "a"),
				(keyboard) => keyboard.getValue() !== "",
			),
	},
	CustomKeyboard: {
		"a tap on a key": () =>
			subject(
				new CustomKeyboard({ layout: ["a b c"] }),
				(keyboard) => push(dom(key(keyboard, /^a$/i))),
				(keyboard) => keyboard.getValue() !== "",
			),
	},
};

/** where the control is disabled from: itself, or a container around it */
const PLACES: Record<string, (control: Enableable) => Enableable> = {
	"disabled on its own": (control) => control,
	"in a disabled Toolbar": (control) => new Toolbar({ content: [control] }),
	"in a disabled OverflowToolbar": (control) => new OverflowToolbar({ content: [control] }),
	"in a disabled sap.m.Toolbar": (control) => new MToolbar({ content: [control] }),
};

/** the controls of the library that are containers rather than content */
const CONTAINERS = ["Toolbar", "OverflowToolbar"];

QUnit.module("disabled controls", {
	afterEach: cleanUp,
});

for (const [name, attempts] of Object.entries(ATTEMPTS)) {
	for (const [what, make] of Object.entries(attempts)) {
		for (const [where, wrap] of Object.entries(PLACES)) {
			QUnit.test(`${name} ${where}: ${what}`, async (assert) => {
				const { control, act, reacted } = make();
				const outer = wrap(control);

				outer.setEnabled(false);
				place(outer);

				assert.notOk(control.getEnabled(), "it says it is disabled");
				act();
				assert.notOk(reacted(), "and does not react");

				outer.setEnabled(true);
				render();

				assert.ok(control.getEnabled(), "enabled again, it says so");
				act();
				assert.ok(reacted(), "and reacts - to what it ignored before");

				await settle(control);
			});
		}
	}
}

/** a class of a control, as it is loaded by its name */
interface ControlClass {
	new (): Control;
	getMetadata(): ElementMetadata;
}

function load(name: string): Promise<ControlClass> {
	return new Promise((resolve, reject) => {
		sap.ui.require([name.replace(/\./g, "/")], resolve, reject);
	});
}

QUnit.test("every control that can be disabled is disabled by its container, and tried here", async (assert) => {
	// the list the library declares itself with - so a control that is added
	// to it is asked about here without anyone having to remember
	const library = sap.ui.getCore().getLoadedLibraries()["ui5.touch.controls"] as unknown as {
		controls: string[];
	};

	for (const qualified of library.controls) {
		const Class = await load(qualified);
		const metadata = Class.getMetadata();
		const name = qualified.split(".").pop() as string;

		if (metadata.isAbstract() || !metadata.hasProperty("enabled")) {
			continue;
		}

		const control = new Class() as Enableable;
		const container = new MToolbar({ enabled: false, content: [control] });

		assert.notOk(control.getEnabled(), `${name} is disabled by a disabled container`);
		assert.ok(name in ATTEMPTS || CONTAINERS.includes(name), `${name} is tried in this module`);

		container.destroy();
	}
});

QUnit.module("disabled containers", {
	afterEach: cleanUp,
});

/** a button of a width that is easy to count with */
function wide(text: string): Button {
	return new Button({ text: text, width: "100px" });
}

/** an OverflowToolbar too narrow for its content, laid out until it settles */
async function narrow(content: Control[]): Promise<OverflowToolbar> {
	const toolbar = new OverflowToolbar({ content: content });
	place(new VBox({ width: "300px", items: [toolbar] }));

	// laying out renders the toolbar again, a few times at most
	for (let i = 0; i < 5; i++) {
		render();
		await wait(20);
	}

	return toolbar;
}

function overflowButton(toolbar: OverflowToolbar): Button {
	return toolbar.getAggregation("_overflowButton") as Button;
}

QUnit.test("a disabled OverflowToolbar keeps its overflow area closed", async (assert) => {
	const toolbar = await narrow([wide("a"), wide("b"), wide("c"), wide("d")]);

	toolbar.setEnabled(false);
	render();

	assert.notOk(overflowButton(toolbar).getEnabled(), "the overflow button is disabled with it");
	push(dom(overflowButton(toolbar)));
	assert.notOk(opened(toolbar), "and opens nothing");

	toolbar.setEnabled(true);
	render();

	push(dom(overflowButton(toolbar)));
	assert.ok(opened(toolbar), "enabled again, it opens the overflow area");

	await settle(toolbar);
});

QUnit.test("what is in the overflow area is disabled along with the toolbar", async (assert) => {
	const buttons = [wide("a"), wide("b"), wide("c"), wide("d")];
	const log = new EventLog();
	buttons.forEach((button) => log.listen(button, "press"));
	const toolbar = await narrow(buttons);

	push(dom(overflowButton(toolbar)));
	await waitFor(() => opened(toolbar), "the overflow area did not open");
	const inArea = (toolbar.getAggregation("_popover") as Popover).getContent()[0] as Button;

	toolbar.setEnabled(false);
	render();

	assert.notOk(inArea.getEnabled(), "a button in the overflow area says it is disabled");
	push(dom(inArea));
	assert.strictEqual(log.count("press"), 0, "and is not pressed");

	toolbar.setEnabled(true);
	render();

	push(dom(inArea));
	assert.strictEqual(log.count("press"), 1, "enabled again, it is");

	await settle(toolbar);
});

QUnit.test("a control disabled on its own stays so when its container is enabled again", (assert) => {
	const button = new Button({ text: "Go", enabled: false });
	const log = new EventLog().listen(button, "press");
	const toolbar = place(new Toolbar({ enabled: false, content: [button] }));

	toolbar.setEnabled(true);
	render();
	push(dom(button));

	assert.notOk(button.getEnabled());
	assert.strictEqual(log.count("press"), 0);
});

QUnit.test("the buttons of a group are enabled as soon as the container around it is", (assert) => {
	const group = new RadioButtonGroup({
		buttons: [new RadioButton({ text: "One" }), new RadioButton({ text: "Two" })],
	});
	const toolbar = place(new Toolbar({ enabled: false, content: [group] }));

	assert.notOk(group.getButtons()[1].getEnabled());

	toolbar.setEnabled(true);

	assert.ok(group.getButtons()[1].getEnabled(), "right away, not only after the next rendering");
});

QUnit.test("the toolbars of the library disable the controls of sap.m in them as well", (assert) => {
	for (const Container of [Toolbar, OverflowToolbar]) {
		const button = new MButton({ text: "Go" });
		const log = new EventLog().listen(button, "press");
		const toolbar = place(new Container({ enabled: false, content: [button] }));
		const name = toolbar.getMetadata().getName();

		tap(dom(button));
		assert.strictEqual(log.count("press"), 0, `not pressed in a disabled ${name}`);

		toolbar.setEnabled(true);
		render();

		tap(dom(button));
		assert.strictEqual(log.count("press"), 1, "enabled again, it is");
	}
});
