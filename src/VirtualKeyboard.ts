import Control from "sap/ui/core/Control";
import { MetadataOptions } from "sap/ui/core/Element";
import RenderManager from "sap/ui/core/RenderManager";
import { ButtonType } from "sap/m/library";
import Button from "./Button";
import type KeyboardKey from "./KeyboardKey";
import type KeyboardLayout from "./KeyboardLayout";
import { ISized, KeyboardMode, SizeMode } from "./library";

/**
 * The rows of the ready-made layouts, by the mode that selects them.
 *
 * <code>Custom</code> is not in here on purpose: it is the mode that has no
 * layout of its own and reads the <code>layout</code> property instead.
 */
type LayoutSet = { name: string; rows: string[] };

/**
 * The rows of a set of letters as a phone draws them: no row of digits, and a
 * key that leads to them instead. Everything but the two letters that tell
 * QWERTY and QWERTZ apart is the same, so both are built from here.
 */
function mobileSets(lower: string, upper: string): LayoutSet[] {
	const [lowerRow2, lowerRow4] = lower.split("|");
	const [upperRow2, upperRow4] = upper.split("|");

	return [
		{
			name: "default",
			rows: [
				lowerRow2,
				"a s d f g h j k l",
				`{shift} ${lowerRow4} {bksp}`,
				"{numbers} {space} {enter}",
			],
		},
		{
			name: "shift",
			rows: [
				upperRow2,
				"A S D F G H J K L",
				`{shift} ${upperRow4} {bksp}`,
				"{numbers} {space} {enter}",
			],
		},
		{
			name: "numbers",
			rows: ["1 2 3", "4 5 6", "7 8 9", "{abc} 0 {bksp}"],
		},
	];
}

/**
 * The modes that show more than one set of keys, and what those sets are.
 */
const LAYOUT_SETS: Partial<Record<KeyboardMode, LayoutSet[]>> = {
	[KeyboardMode.QWERTYMobile]: mobileSets(
		"q w e r t y u i o p|z x c v b n m",
		"Q W E R T Y U I O P|Z X C V B N M",
	),
	[KeyboardMode.QWERTZMobile]: mobileSets(
		"q w e r t z u i o p|y x c v b n m",
		"Q W E R T Z U I O P|Y X C V B N M",
	),
	// what an address is made of, on the keys instead of behind them
	[KeyboardMode.Email]: [
		{
			name: "default",
			rows: [
				"q w e r t y u i o p",
				"a s d f g h j k l",
				"{shift} z x c v b n m {bksp}",
				"{numbers} @ . {space} {enter}",
			],
		},
		{
			name: "shift",
			rows: [
				"Q W E R T Y U I O P",
				"A S D F G H J K L",
				"{shift} Z X C V B N M {bksp}",
				"{numbers} @ . {space} {enter}",
			],
		},
		{
			name: "numbers",
			rows: ["1 2 3 4 5 6 7 8 9 0", "- _ . @ + {bksp}", "{abc} {space} {enter}"],
		},
	],
	[KeyboardMode.URL]: [
		{
			name: "default",
			rows: [
				"q w e r t y u i o p",
				"a s d f g h j k l",
				"{shift} z x c v b n m {bksp}",
				"{numbers} . / {space} {enter}",
			],
		},
		{
			name: "shift",
			rows: [
				"Q W E R T Y U I O P",
				"A S D F G H J K L",
				"{shift} Z X C V B N M {bksp}",
				"{numbers} . / {space} {enter}",
			],
		},
		{
			name: "numbers",
			rows: ["1 2 3 4 5 6 7 8 9 0", "- _ . / : ? = & {bksp}", "{abc} {space} {enter}"],
		},
	],
};

const LAYOUTS: Record<Exclude<KeyboardMode, KeyboardMode.Custom>, string[]> = {
	[KeyboardMode.QWERTY]: [
		"1 2 3 4 5 6 7 8 9 0",
		"{tab} q w e r t y u i o p",
		"{lock} a s d f g h j k l",
		"{shift} z x c v b n m {bksp}",
		"{space} {enter}",
	],
	[KeyboardMode.QWERTZ]: [
		"1 2 3 4 5 6 7 8 9 0",
		"{tab} q w e r t z u i o p",
		"{lock} a s d f g h j k l",
		"{shift} y x c v b n m {bksp}",
		"{space} {enter}",
	],
	[KeyboardMode.QWERTYMobile]: LAYOUT_SETS[KeyboardMode.QWERTYMobile]![0].rows,
	[KeyboardMode.QWERTZMobile]: LAYOUT_SETS[KeyboardMode.QWERTZMobile]![0].rows,
	[KeyboardMode.Email]: LAYOUT_SETS[KeyboardMode.Email]![0].rows,
	[KeyboardMode.URL]: LAYOUT_SETS[KeyboardMode.URL]![0].rows,
	[KeyboardMode.Numeric]: ["7 8 9", "4 5 6", "1 2 3", "{bksp} 0 {enter}"],
	[KeyboardMode.Decimal]: [
		"7 8 9",
		"4 5 6",
		"1 2 3",
		"- 0 .",
		"{bksp} {enter}",
	],
	[KeyboardMode.PIN]: ["1 2 3", "4 5 6", "7 8 9", "{bksp} 0 {enter}"],
	[KeyboardMode.Phone]: [
		"1 2 3",
		"4 5 6",
		"7 8 9",
		"* 0 #",
		"{bksp} {enter}",
	],
	[KeyboardMode.Calculator]: [
		"7 8 9 /",
		"4 5 6 *",
		"1 2 3 -",
		"0 . = +",
		"{bksp} {enter}",
	],
};

/**
 * The key names of simple-keyboard that mean the same as one of ours, so a
 * layout written for that library can be used as it stands.
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
	shift: "\u21E7",
};

/**
 * An on-screen keyboard optimized for touch devices, built natively from
 * the library's own {@link ui5.touch.controls.Button} controls — no
 * third-party keyboard dependency.
 *
 * Which keys it shows is a matter of the {@link #getMode mode} property:
 * <code>QWERTY</code> and <code>QWERTZ</code>, the two as a phone draws them
 * in <code>QWERTYMobile</code> and <code>QWERTZMobile</code>,
 * <code>Numeric</code>, <code>Phone</code> and <code>Calculator</code> are
 * ready-made; <code>Custom</code> hands the keyboard over to the
 * {@link #getLayout layout} property or to the sets in its
 * <code>layouts</code> aggregation.
 *
 * A layout is written row by row: each entry is one row, keys are separated
 * by spaces and special keys are wrapped in curly braces
 * (<code>{bksp}</code>, <code>{enter}</code>, <code>{esc}</code>,
 * <code>{space}</code>, <code>{tab}</code>, <code>{shift}</code> and
 * <code>{lock}</code>, the caps lock).
 *
 * However narrow the room is, the keyboard never has to be scrolled sideways:
 * the keys give up the padding at their sides and share what there is. Their
 * height comes from the size and stays as it is.
 *
 * When {@link #getHardwareKeys hardwareKeys} is enabled, the keyboard also
 * accepts input from a real (physical) keyboard while it has the focus.
 *
 * With {@link #getDocked docked} the keyboard leaves the flow of the page and
 * sits at the bottom edge of the screen, over the content - the way the
 * on-screen keyboard of a phone does.
 *
 * @namespace ui5.touch.controls
 */
export default class VirtualKeyboard extends Control implements ISized {
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
		interfaces: ["ui5.touch.controls.ISized"],
		properties: {
			/**
			 * The current input value of the keyboard.
			 */
			value: { type: "string", group: "Data", defaultValue: "" },
			/**
			 * Which keys the keyboard shows.
			 *
			 * All values but <code>Custom</code> are ready-made layouts that
			 * the control brings along. <code>Custom</code> is the one that
			 * reads the {@link #getLayout layout} property.
			 */
			mode: {
				type: "ui5.touch.controls.KeyboardMode",
				group: "Appearance",
				defaultValue: KeyboardMode.QWERTY,
			},
			/**
			 * The keyboard layout rows, for
			 * {@link ui5.touch.controls.KeyboardMode.Custom}. Each entry
			 * represents one row, keys are separated by spaces. Special keys
			 * are wrapped in curly braces, e.g. <code>{bksp}</code>,
			 * <code>{enter}</code>, <code>{space}</code> or
			 * <code>{shift}</code>.
			 *
			 * It is only looked at when {@link #getMode mode} is
			 * <code>Custom</code>; with any other mode the layout of that mode
			 * is shown.
			 */
			layout: {
				type: "string[]",
				group: "Appearance",
				defaultValue: ["7 8 9", "4 5 6", "1 2 3", "{bksp} 0 {enter}"],
			},
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
			 * It works the same way in the <code>virtualKeyboard</code>
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
			 * The sets of keys the keyboard can show, for
			 * {@link ui5.touch.controls.KeyboardMode.Custom}.
			 *
			 * A keyboard with more than one set shows one of them at a time -
			 * the one called <code>default</code> to begin with - and a key
			 * written as the name of another set switches to it. That is how a
			 * keyboard of a phone gets from its letters to its digits and back
			 * without any code around it.
			 *
			 * Sets take precedence over the {@link #getLayout layout}
			 * property, which is the shorter way of writing a keyboard that
			 * only ever shows one set.
			 */
			layouts: {
				type: "ui5.touch.controls.KeyboardLayout",
				multiple: true,
				singularName: "layout_",
			},
			/**
			 * What single keys say, where the sign the keyboard would pick is
			 * not the right one.
			 *
			 * The keyboard has a sign for every key it knows and shows the
			 * plain name of one it does not, which is enough for most
			 * keyboards. An entry here overrules that for one key, whichever
			 * set it appears in - the <code>display</code> option of
			 * simple-keyboard.
			 */
			display: {
				type: "ui5.touch.controls.KeyboardKey",
				multiple: true,
				singularName: "displayKey",
			},
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

	constructor(idOrSettings?: string | $VirtualKeyboardSettings);
	constructor(id?: string, settings?: $VirtualKeyboardSettings);
	constructor(id?: string, settings?: $VirtualKeyboardSettings) {
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
	 */
	private removeLastChar(): void {
		const oldValue = this.getValue();
		if (!oldValue.length) {
			return;
		}
		const newValue = oldValue.slice(0, -1);
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
		const said = this.getDisplayText(key);
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
				button.addStyleClass("touchVirtualKeyboardSpaceKey");
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
	 * The rows this keyboard shows: the layout of its mode, or the one from
	 * the <code>layout</code> property when the mode is <code>Custom</code>.
	 */
	public getEffectiveLayout(): string[] {
		const mode = this.getMode();

		const set = this.getCurrentLayoutSet();

		if (mode !== KeyboardMode.Custom && !set) {
			return LAYOUTS[mode];
		}

		return set ? set.rows : this.getLayout();
	}

	/**
	 * The key as the control knows it: what a layout of simple-keyboard calls
	 * <code>{backspace}</code> is the <code>{bksp}</code> of this one.
	 */
	private normalizeKey(key: string): string {
		return KEY_ALIASES[key] ?? key;
	}

	/**
	 * What was said about a key in the <code>display</code> aggregation, if
	 * anything was. The key is looked up as it stands in the layout and under
	 * the name the control knows it by, so a display written for
	 * simple-keyboard reaches a key of ours as well.
	 */
	private getDisplayText(key: string): string {
		const entries =
			(this.getAggregation("display") as KeyboardKey[] | null) ?? [];
		const wanted = this.plainKeyName(key);
		const entry = entries.find(
			(candidate) => this.plainKeyName(candidate.getKey()) === wanted,
		);

		return entry?.getText() ?? "";
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
	private plainKeyName(key: string): string {
		const braced = key.startsWith("{") ? key : `{${key}}`;

		return this.normalizeKey(braced).replace(/^\{|\}$/g, "");
	}

	/**
	 * The set a key leads to, if it leads to one.
	 *
	 * A key is the name of a set in curly braces. <code>{abc}</code> is the
	 * one exception: it is what a layout of simple-keyboard uses to get back
	 * to the letters, so it leads to the set called <code>default</code> when
	 * there is no set of its own name.
	 */
	private getLayoutSetFor(key: string): LayoutSet | undefined {
		const name = /^\{(\w+)\}$/.exec(key)?.[1];

		if (!name) {
			return undefined;
		}

		const sets = this.getLayoutSets();

		return (
			sets.find((set) => set.name === name) ??
			(name === "abc"
				? sets.find((set) => set.name === "default")
				: undefined)
		);
	}

	/**
	 * The sets of keys this keyboard shows: the ones its mode brings along, or
	 * the ones it was given. A mode with sets of its own is not open to the
	 * aggregation, the same way a ready-made mode does not read the layout
	 * property.
	 */
	private getLayoutSets(): LayoutSet[] {
		const ofMode = LAYOUT_SETS[this.getMode()];

		if (ofMode) {
			return ofMode;
		}

		return (
			(this.getAggregation("layouts") as KeyboardLayout[] | null) ?? []
		).map((set) => ({ name: set.getName(), rows: set.getRows() }));
	}

	/**
	 * The set that is on screen: the one that was switched to, the one called
	 * <code>default</code>, or the first one there is.
	 */
	private getCurrentLayoutSet(): LayoutSet | undefined {
		const sets = this.getLayoutSets();

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
	 * The rows of one of the ready-made layouts - a starting point for a
	 * custom one, and what the documentation of the library lists.
	 *
	 * @param mode the mode to look up; <code>Custom</code> has no layout of
	 *   its own and yields an empty list
	 */
	public static getLayoutForMode(mode: KeyboardMode): string[] {
		return mode === KeyboardMode.Custom ? [] : [...LAYOUTS[mode]];
	}

	/**
	 * (Re)builds the key buttons if the layout has changed.
	 */
	private buildButtons(): void {
		const layout = this.getEffectiveLayout();
		const signature = layout.join("\n");

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

	static renderer = {
		apiVersion: 2,
		render(rm: RenderManager, control: VirtualKeyboard) {
			rm.openStart("div", control);
			rm.class("touchVirtualKeyboard");

			if (!control.getEnabled()) {
				rm.class("touchVirtualKeyboardDisabled");
			}
			if (control.getDocked()) {
				rm.class("touchVirtualKeyboardDocked");
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
				rm.class("touchVirtualKeyboardRow");
				rm.openEnd();

				for (const button of row) {
					rm.renderControl(button);
				}

				rm.close("div");
			}

			rm.close("div");
		},
	};
}
