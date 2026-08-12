import Control from "sap/ui/core/Control";
import { MetadataOptions } from "sap/ui/core/Element";
import RenderManager from "sap/ui/core/RenderManager";
import { ButtonType } from "sap/m/library";
import Button from "./Button";
import { ISized, SizeMode } from "./library";

/**
 * One set of keys of a keyboard: the name it is switched to by, and its rows.
 *
 * A keyboard shows one set at a time. Where the set comes from is what tells
 * the keyboards of this library apart - {@link ui5.touch.controls.Keyboard}
 * and {@link ui5.touch.controls.NumberPad} build theirs from a few
 * properties, {@link ui5.touch.controls.CustomKeyboard} is handed them.
 */
export type LayoutSet = { name: string; rows: string[] };

/**
 * The other spellings a key is known by, so a layout that was written
 * elsewhere can be used as it stands.
 */
const KEY_ALIASES: Record<string, string> = {
	"{backspace}": "{bksp}",
	"{ent}": "{enter}",
	"{escape}": "{esc}",
	"{capslock}": "{lock}",
};

/**
 * What the keys that lead to another set say, where the name of the set is
 * not what belongs on a key. A key of the display aggregation overrules it.
 */
const SET_KEY_TEXTS: Record<string, string> = {
	numbers: "123",
	abc: "ABC",
	symbols: "#+=",
	emojis: "\u{1F642}",
	shift: "\u21E7",
};

/**
 * Base class of the on-screen keyboards of this library - the machine behind
 * all three, built natively from the library's own
 * {@link ui5.touch.controls.Button} controls with no third-party dependency.
 *
 * It is not used directly. What it does not know is which keys to show; that
 * is what tells its three subclasses apart:
 * <ul>
 * <li>{@link ui5.touch.controls.Keyboard} - a keyboard of letters, built from
 * a language and a handful of switches</li>
 * <li>{@link ui5.touch.controls.NumberPad} - a pad of digits, likewise</li>
 * <li>{@link ui5.touch.controls.CustomKeyboard} - the keys are handed to it,
 * row by row</li>
 * </ul>
 *
 * Everything else lives here: the value and how keys change it, the sets of
 * keys and the switching between them, shift and the caps lock, the keys of a
 * real keyboard, the size, the width and the docking.
 *
 * A row is a string of keys separated by spaces. A special key is wrapped in
 * curly braces - <code>{bksp}</code>, <code>{enter}</code>,
 * <code>{esc}</code>, <code>{space}</code>, <code>{tab}</code>,
 * <code>{shift}</code> and <code>{lock}</code>, the caps lock - and a key
 * written as the name of one of the sets switches to that set.
 *
 * However narrow the room is, the keyboard never has to be scrolled sideways:
 * a key would like to be as wide as it is tall, and gives that width up when
 * the room is tight. Its height comes from the size and stays as it is.
 *
 * When {@link #getHardwareKeys hardwareKeys} is enabled, the keyboard also
 * accepts input from a real (physical) keyboard while it has the focus.
 *
 * With {@link #getDocked docked} the keyboard leaves the flow of the page and
 * sits at the bottom edge of the screen, over the content - the way the
 * on-screen keyboard of a phone does.
 *
 * @abstract
 * @namespace ui5.touch.controls
 */
export default class KeyboardBase extends Control implements ISized {
	/**
	 * Signature of the currently built button set, used to rebuild the
	 * buttons only when the layout changes.
	 */
	private builtLayoutSignature = "";

	/**
	 * Number of keys per row, used by the renderer to group the flat
	 * button aggregation into rows.
	 */
	private rowLengths: number[] = [];

	/**
	 * Flat list of layout keys, aligned with the button aggregation.
	 */
	private layoutKeys: string[] = [];

	/**
	 * Lowercase set of all keys in the layout, used to filter hardware
	 * keyboard input.
	 */
	private layoutKeySet = new Set<string>();

	/**
	 * Whether the one-shot shift modifier is currently active.
	 */
	private shiftActive = false;

	/**
	 * Whether the caps lock is on. Unlike shift it stays on until it is
	 * pressed again, and shift inverts it while it is - the way it works on a
	 * keyboard of keys.
	 */
	private capsActive = false;

	/**
	 * The set of keys that is on screen, by the name of its
	 * {@link ui5.touch.controls.KeyboardLayout}. Empty while the keyboard
	 * has no sets of its own.
	 */
	private currentLayoutName = "";

	/**
	 * The set that was on screen before this one, so a key that names the set
	 * it is already on can lead back out of it.
	 */
	private previousLayoutName = "";

	/**
	 * Pending hardware key press animation timers, keyed by button index.
	 */
	private keyAnimationTimers = new Map<number, ReturnType<typeof setTimeout>>();

	static readonly metadata: MetadataOptions = {
		"abstract": true,
		interfaces: ["ui5.touch.controls.ISized"],
		properties: {
			/**
			 * The current input value of the keyboard.
			 */
			value: { type: "string", group: "Data", defaultValue: "" },
			/**
			 * The keys that are drawn as emphasized, written the way they stand
			 * in the layout - <code>{enter}</code>, <code>a</code> - with the
			 * braces of a special key optional.
			 *
			 * A keyboard usually has one key that ends what is being done, and
			 * this is how it is made to look like it. A modifier is emphasized
			 * while it is on whatever this says.
			 */
			emphasizedKeys: {
				type: "string[]",
				group: "Appearance",
				defaultValue: [],
			},
			/**
			 * Maximum number of characters. Value <code>0</code> means unlimited.
			 */
			maxLength: { type: "int", group: "Behavior", defaultValue: 0 },
			/**
			 * Indicates whether the user can interact with the keyboard.
			 */
			enabled: { type: "boolean", group: "Behavior", defaultValue: true },
			/**
			 * Indicates whether input from a real (physical) keyboard is
			 * accepted while the keyboard has the focus. Only keys that are
			 * part of the layout are accepted; <code>Enter</code> and
			 * <code>Backspace</code> are always handled.
			 */
			hardwareKeys: {
				type: "boolean",
				group: "Behavior",
				defaultValue: false,
			},
			/**
			 * Touch size applied to all key buttons.
			 */
			size: {
				type: "ui5.touch.controls.SizeMode",
				group: "Appearance",
				defaultValue: SizeMode.M,
			},
			/**
			 * Width of the keyboard.
			 *
			 * On a phone or a tablet a docked keyboard takes the full width of
			 * the screen and this property is not looked at - see
			 * {@link #getDocked docked}.
			 */
			width: {
				type: "sap.ui.core.CSSSize",
				group: "Appearance",
				defaultValue: null,
			},
			/**
			 * Indicates whether the keyboard is docked to the bottom edge of
			 * the screen.
			 *
			 * A docked keyboard is taken out of the flow of the page: it sits
			 * at the bottom edge, centered, and over the content. On a phone
			 * or a tablet it takes the full width of the screen and
			 * {@link #getWidth width} is not looked at.
			 *
			 * It works the same way in the <code>keyboard</code>
			 * aggregation of an {@link ui5.touch.controls.Input} or an
			 * {@link ui5.touch.controls.TextArea}: the popover that carries
			 * the keyboard is docked instead of being placed at the field.
			 *
			 * How high it reaches differs between the two, and that follows
			 * from where they are in the page. A keyboard on a field is put
			 * into the static area by its popover, so it covers everything, a
			 * modal dialog included - which is what makes a field inside a
			 * dialog typeable. A keyboard standing on a page of its own stays
			 * a part of that page, and a page is a stacking context of its
			 * own: it covers the content around it, but the block layer of a
			 * modal dialog still comes out on top of it.
			 */
			docked: { type: "boolean", group: "Appearance", defaultValue: false },
		},
		aggregations: {
			/**
			 * Internal key buttons, in layout order.
			 */
			_buttons: {
				type: "ui5.touch.controls.Button",
				multiple: true,
				visibility: "hidden",
			},
		},
		events: {
			/**
			 * Fired whenever the keyboard input changes (key press,
			 * backspace, ...).
			 */
			change: {
				parameters: {
					/**
					 * The new value of the keyboard input.
					 */
					value: { type: "string" },
				},
			},
			/**
			 * Fired when any key is pressed.
			 */
			keyPress: {
				parameters: {
					/**
					 * The pressed key, e.g. <code>5</code> or <code>{enter}</code>.
					 */
					key: { type: "string" },
				},
			},
			/**
			 * Fired when the Enter key is pressed.
			 */
			enter: {
				parameters: {
					/**
					 * The current value of the keyboard input.
					 */
					value: { type: "string" },
				},
			},
			/**
			 * Fired when the Escape key is pressed - the <code>{esc}</code>
			 * key of the layout, or the one of a real keyboard while
			 * {@link #getHardwareKeys hardwareKeys} is on.
			 *
			 * The keyboard does nothing about it by itself. A field that shows
			 * one closes its popover on it, and an application is free to make
			 * it mean whatever it should: leaving a screen, dropping what was
			 * typed.
			 */
			escape: {
				parameters: {
					/**
					 * The current value of the keyboard input.
					 */
					value: { type: "string" },
				},
			},
		},
	};

	constructor(idOrSettings?: string | $KeyboardBaseSettings);
	constructor(id?: string, settings?: $KeyboardBaseSettings);
	constructor(id?: string, settings?: $KeyboardBaseSettings) {
		super(id, settings);
	}

	private getButtons(): Button[] {
		return (this.getAggregation("_buttons") as Button[]) ?? [];
	}

	/**
	 * Returns whether the given key is a single letter that can be
	 * shifted to uppercase.
	 */
	private isShiftableKey(key: string): boolean {
		return key.length === 1 && key.toLowerCase() !== key.toUpperCase();
	}

	/**
	 * Whether a letter comes out in upper case right now.
	 *
	 * Caps lock and shift work against each other, as they do on a keyboard of
	 * keys: shift alone writes upper case, caps lock alone writes upper case,
	 * and shift while the caps lock is on writes lower case again.
	 */
	private isUpperCase(): boolean {
		return this.shiftActive !== this.capsActive;
	}

	/**
	 * Activates or deactivates the one-shot shift modifier.
	 */
	private setShiftActive(active: boolean): void {
		if (this.shiftActive === active) {
			return;
		}
		this.shiftActive = active;
		this.updateKeys();
	}

	/**
	 * Turns the caps lock on or off. It stays as it is set until it is pressed
	 * again - that is what makes it a lock.
	 */
	private setCapsActive(active: boolean): void {
		if (this.capsActive === active) {
			return;
		}
		this.capsActive = active;
		this.updateKeys();
	}

	/**
	 * Writes the state of the two modifiers onto the keys: the letters take
	 * the case they would be typed in, and a modifier that is on is
	 * emphasized.
	 */
	private updateKeys(): void {
		const upperCase = this.isUpperCase();
		const buttons = this.getButtons();

		for (let i = 0; i < buttons.length; i++) {
			const key = this.layoutKeys[i];

			if (key === "{shift}" || key === "{lock}") {
				const on = key === "{shift}" ? this.shiftActive : this.capsActive;
				buttons[i].setType(
					on || this.isEmphasizedKey(key)
						? ButtonType.Emphasized
						: ButtonType.Default,
				);
			} else if (this.isShiftableKey(key)) {
				buttons[i].setText(upperCase ? key.toUpperCase() : key);
			}
		}
	}

	/**
	 * Appends a character to the value, respecting <code>maxLength</code>.
	 */
	private insertChar(char: string): void {
		const oldValue = this.getValue();
		const maxLength = this.getMaxLength();

		if (maxLength > 0 && oldValue.length >= maxLength) {
			return;
		}

		const newValue = oldValue + char;
		this.setProperty("value", newValue, true);
		this.fireChange({ value: newValue });
	}

	/**
	 * Removes the last character from the value.
	 *
	 * A character is what is written, not what a string is measured in: a face
	 * is one key press and two of the units a string counts, and cutting one of
	 * them off would leave half a character behind.
	 */
	private removeLastChar(): void {
		const oldValue = this.getValue();
		if (!oldValue.length) {
			return;
		}
		const newValue = [...oldValue].slice(0, -1).join("");
		this.setProperty("value", newValue, true);
		this.fireChange({ value: newValue });
	}

	/**
	 * Handles a key press coming from one of the key buttons.
	 */
	private handleKeyPress(key: string): void {
		if (!this.getEnabled()) {
			return;
		}

		// a key that carries the name of one of the sets of this keyboard puts
		// that set on screen - {numbers} to the digits, {abc} back to the
		// letters. It is looked at first, so a set called shift takes the
		// place of the modifier: such a keyboard writes its upper case out.
		const target = this.getLayoutSetFor(key);
		if (target) {
			this.fireKeyPress({ key });
			this.switchLayoutSet(target.name);
			return;
		}

		switch (this.normalizeKey(key)) {
			case "{shift}":
				this.fireKeyPress({ key });
				this.setShiftActive(!this.shiftActive);
				return;
			case "{lock}":
				this.fireKeyPress({ key });
				this.setCapsActive(!this.capsActive);
				return;
			case "{tab}":
				this.fireKeyPress({ key });
				this.insertChar("\t");
				return;
			case "{enter}":
				this.fireKeyPress({ key });
				this.fireEnter({ value: this.getValue() });
				return;
			case "{esc}":
				this.fireKeyPress({ key });
				this.fireEscape({ value: this.getValue() });
				return;
			case "{bksp}":
				this.fireKeyPress({ key });
				this.removeLastChar();
				return;
			case "{space}":
				this.fireKeyPress({ key });
				this.insertChar(" ");
				return;
			default: {
				const char =
					this.isUpperCase() && this.isShiftableKey(key)
						? key.toUpperCase()
						: key;
				this.fireKeyPress({ key: char });
				this.insertChar(char);
				if (this.shiftActive) {
					this.setShiftActive(false);
				}
			}
		}
	}

	/**
	 * Briefly applies the pressed (active) state to the key button that
	 * corresponds to the given layout key, so hardware key presses are
	 * visually reflected on the on-screen keyboard.
	 */
	private animateKeyButton(key: string): void {
		const lowerKey = key.toLowerCase();
		const index = this.layoutKeys.findIndex(
			(layoutKey) => layoutKey.toLowerCase() === lowerKey,
		);
		if (index < 0) {
			return;
		}

		const dom = this.getButtons()[index]?.getDomRef();
		if (!dom) {
			return;
		}

		const pendingTimer = this.keyAnimationTimers.get(index);
		if (pendingTimer !== undefined) {
			clearTimeout(pendingTimer);
		}

		dom.classList.add("sizedButtonActive");
		this.keyAnimationTimers.set(
			index,
			setTimeout(() => {
				dom.classList.remove("sizedButtonActive");
				this.keyAnimationTimers.delete(index);
			}, 120),
		);
	}

	/**
	 * Cancels all pending hardware key press animations.
	 */
	private clearKeyAnimations(): void {
		for (const timer of this.keyAnimationTimers.values()) {
			clearTimeout(timer);
		}
		this.keyAnimationTimers.clear();
	}

	/**
	 * Handles input from a real (physical) keyboard while the control
	 * has the focus.
	 */
	onkeydown(event: KeyboardEvent): void {
		if (!this.getHardwareKeys() || !this.getEnabled()) {
			return;
		}
		if (event.ctrlKey || event.metaKey || event.altKey) {
			return;
		}

		const key = event.key;

		if (key === "Enter") {
			this.animateKeyButton("{enter}");
			this.fireKeyPress({ key: "{enter}" });
			this.fireEnter({ value: this.getValue() });
			event.preventDefault();
			return;
		}
		if (key === "Backspace") {
			this.animateKeyButton("{bksp}");
			this.fireKeyPress({ key: "{bksp}" });
			this.removeLastChar();
			event.preventDefault();
			return;
		}
		if (key === " ") {
			if (this.layoutKeySet.has("{space}")) {
				this.animateKeyButton("{space}");
				this.fireKeyPress({ key: "{space}" });
				this.insertChar(" ");
				event.preventDefault();
			}
			return;
		}
		if (key.length === 1 && this.layoutKeySet.has(key.toLowerCase())) {
			this.animateKeyButton(key);
			this.fireKeyPress({ key });
			this.insertChar(key);
			this.setShiftActive(false);
			event.preventDefault();
		}
	}

	/**
	 * Creates the button settings (text or icon) for the given key.
	 */
	private createKeyButton(key: string, index: number): Button {
		const button = new Button(`${this.getId()}-key${index}`, {
			press: () => {
				this.handleKeyPress(key);
			},
		});

		if (this.isEmphasizedKey(key)) {
			button.setType(ButtonType.Emphasized);
		}

		// what was said about this key in the display aggregation comes first:
		// it is there to overrule the sign the keyboard would pick
		const said = this.getKeyText(key);
		if (said) {
			button.setText(said);
			return button;
		}

		// The keys the control knows come with a sign of their own, whether
		// they switch a set or not: a {shift} that leads to a set of capitals
		// is still the key with the arrow on it. Only a key it does not know -
		// {numbers}, {abc} - is left to say what it is written as.
		switch (this.normalizeKey(key)) {
			case "{bksp}":
				button.setIcon("sap-icon://touch/backspace");
				break;
			case "{enter}":
				button.setIcon("sap-icon://touch/enter");
				break;
			case "{shift}":
				button.setText("\u21E7");
				break;
			case "{lock}":
				button.setText("\u21EA");
				break;
			case "{tab}":
				button.setText("\u21E5");
				break;
			case "{esc}":
				button.setText("esc");
				break;
			case "{space}":
				button.setText("Space");
				button.addStyleClass("touchKeyboardSpaceKey");
				break;
			default: {
				const setName = this.getLayoutSetFor(key)
					? key.slice(1, -1)
					: undefined;
				button.setText(
					setName ? (SET_KEY_TEXTS[setName] ?? setName) : key,
				);
			}
		}

		return button;
	}

	/**
	 * The rows that are on screen right now - the set the keyboard currently
	 * shows.
	 */
	public getEffectiveLayout(): string[] {
		return this.getCurrentLayoutSet()?.rows ?? [];
	}

	/**
	 * The sets of keys this keyboard shows.
	 *
	 * This is the one thing the base class does not know. A subclass says here
	 * what is on its keyboard - built from its properties, or handed to it -
	 * and gets everything else in return.
	 *
	 * @returns the sets, the first one or the one called <code>default</code>
	 *   being the one the keyboard starts on
	 */
	protected getKeySets(): LayoutSet[] {
		return [];
	}

	/**
	 * What a single key says, where the sign the keyboard would pick is not
	 * the right one. An empty text leaves the key as it is.
	 *
	 * The base class asks for every key it draws; a subclass answers for the
	 * ones it has something to say about.
	 *
	 * @param key the key as it stands in the layout
	 */
	protected getKeyText(key: string): string {
		void key;

		return "";
	}

	/**
	 * Everything besides the rows that changes what the keys look like.
	 *
	 * The buttons are built anew when the rows change, which is what keeps a
	 * keyboard from rebuilding on every rendering. A subclass whose properties
	 * change the text of a key without changing the rows says so here.
	 */
	protected getKeySignature(): string {
		return "";
	}

	/**
	 * The key as the control knows it: a layout that writes
	 * <code>{backspace}</code> means the <code>{bksp}</code> of this one.
	 */
	private normalizeKey(key: string): string {
		return KEY_ALIASES[key] ?? key;
	}


	/**
	 * Whether this key was named in {@link #getEmphasizedKeys emphasizedKeys}.
	 */
	private isEmphasizedKey(key: string): boolean {
		const wanted = this.plainKeyName(key);

		return this.getEmphasizedKeys().some(
			(named) => this.plainKeyName(named) === wanted,
		);
	}

	/**
	 * A key under the one name it is compared by: without its braces and
	 * under the name the control knows it by, so that <code>{ent}</code>,
	 * <code>ent</code> and <code>enter</code> all mean the same key.
	 *
	 * The braces are optional on purpose. UI5 reads a string that begins with
	 * one as a binding, so a key could not be written as
	 * <code>key="{numbers}"</code> in a view without escaping it.
	 */
	protected plainKeyName(key: string): string {
		const braced = key.startsWith("{") ? key : `{${key}}`;

		return this.normalizeKey(braced).replace(/^\{|\}$/g, "");
	}

	/**
	 * The set a key leads to, if it leads to one.
	 *
	 * A key is the name of a set in curly braces. <code>{abc}</code> is the
	 * one exception: it is the conventional way back to the letters, so it
	 * leads to the set called <code>default</code> when there is no set of its
	 * own name.
	 */
	private getLayoutSetFor(key: string): LayoutSet | undefined {
		const name = /^\{(\w+)\}$/.exec(key)?.[1];

		if (!name) {
			return undefined;
		}

		const sets = this.getKeySets();

		return (
			sets.find((set) => set.name === name) ??
			(name === "abc"
				? sets.find((set) => set.name === "default")
				: undefined)
		);
	}


	/**
	 * The set that is on screen: the one that was switched to, the one called
	 * <code>default</code>, or the first one there is.
	 */
	private getCurrentLayoutSet(): LayoutSet | undefined {
		const sets = this.getKeySets();

		if (sets.length === 0) {
			return undefined;
		}

		return (
			sets.find((set) => set.name === this.currentLayoutName) ??
			sets.find((set) => set.name === "default") ??
			sets[0]
		);
	}

	/**
	 * Puts another set of keys on screen.
	 *
	 * A key that names the set it is already on leads back out of it instead,
	 * to whatever was there before. That is what makes a {shift} key work in
	 * the set of capitals it leads to: pressing it again comes back, the way
	 * it does on the keyboard of a phone.
	 */
	private switchLayoutSet(name: string): void {
		const current = this.getCurrentLayoutSet()?.name ?? "";
		const target =
			name === current ? this.previousLayoutName || "default" : name;

		this.previousLayoutName = current;
		this.currentLayoutName = target;
		// the keys are different ones now, so the buttons are built anew
		this.builtLayoutSignature = "";
		this.invalidate();
	}

	/**
	 * (Re)builds the key buttons if the layout has changed.
	 */
	private buildButtons(): void {
		const layout = this.getEffectiveLayout();
		const signature = `${layout.join("\n")}\u0000${this.getKeySignature()}`;

		if (signature === this.builtLayoutSignature) {
			return;
		}

		this.clearKeyAnimations();
		this.destroyAggregation("_buttons", true);
		this.rowLengths = [];
		this.layoutKeys = [];
		this.layoutKeySet = new Set<string>();
		this.shiftActive = false;
		this.capsActive = false;

		let index = 0;
		for (const row of layout) {
			const keys = row.split(" ").filter((key) => key.length > 0);
			this.rowLengths.push(keys.length);
			for (const key of keys) {
				this.addAggregation("_buttons", this.createKeyButton(key, index), true);
				this.layoutKeys.push(key);
				this.layoutKeySet.add(key.toLowerCase());
				index++;
			}
		}

		this.builtLayoutSignature = signature;
	}

	onBeforeRendering(): void {
		this.buildButtons();

		const size = this.getSize();
		const enabled = this.getEnabled();

		for (const button of this.getButtons()) {
			button.setSize(size);
			button.setEnabled(enabled);
			button.setSidePadding("0px");
		}
	}

	/**
	 * Returns the buttons grouped into layout rows.
	 */
	private getRows(): Button[][] {
		const buttons = this.getButtons();
		const rows: Button[][] = [];
		let offset = 0;
		for (const length of this.rowLengths) {
			rows.push(buttons.slice(offset, offset + length));
			offset += length;
		}
		return rows;
	}

	exit(): void {
		this.clearKeyAnimations();
	}

	/**
	 * Draws a keyboard: the set of keys that is on screen, row by row.
	 *
	 * It is a method of its own rather than only the body of the renderer
	 * because every keyboard of this library draws the same way, and a
	 * subclass has to be able to point its own renderer here - UI5 keeps a
	 * renderer in the metadata of a control, not on the class, so there is
	 * nothing to inherit from there.
	 *
	 * @param rm the render manager
	 * @param control the keyboard to draw
	 */
	public static renderKeyboard(rm: RenderManager, control: KeyboardBase): void {
		rm.openStart("div", control);
		rm.class("touchKeyboard");

		if (!control.getEnabled()) {
			rm.class("touchKeyboardDisabled");
		}
		if (control.getDocked()) {
			rm.class("touchKeyboardDocked");
		}
		if (control.getWidth()) {
			rm.style("width", control.getWidth());
		}
		if (control.getHardwareKeys() && control.getEnabled()) {
			rm.attr("tabindex", "0");
		}

		rm.openEnd();

		for (const row of control.getRows()) {
			rm.openStart("div");
			rm.class("touchKeyboardRow");
			rm.openEnd();

			for (const button of row) {
				rm.renderControl(button);
			}

			rm.close("div");
		}

		rm.close("div");
	}

	static renderer = {
		apiVersion: 2,
		render(rm: RenderManager, control: KeyboardBase) {
			KeyboardBase.renderKeyboard(rm, control);
		},
	};
}
