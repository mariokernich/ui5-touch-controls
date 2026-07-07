import Control from "sap/ui/core/Control";
import { MetadataOptions } from "sap/ui/core/Element";
import RenderManager from "sap/ui/core/RenderManager";
import { ButtonType } from "sap/m/library";
import Button from "./Button";
import { SizeMode } from "./library";

/**
 * An on-screen keyboard optimized for touch devices, built natively from
 * the library's own {@link ui5.touch.controls.Button} controls — no
 * third-party keyboard dependency.
 *
 * The layout is defined row by row: each entry represents one row, keys are
 * separated by spaces and special keys are wrapped in curly braces
 * (<code>{bksp}</code>, <code>{enter}</code>, <code>{space}</code>,
 * <code>{shift}</code>).
 *
 * When {@link #getHardwareKeys hardwareKeys} is enabled, the keyboard also
 * accepts input from a real (physical) keyboard while it has the focus.
 *
 * @namespace ui5.touch.controls
 */
export default class VirtualKeyboard extends Control {
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

	static readonly metadata: MetadataOptions = {
		properties: {
			/**
			 * The current input value of the keyboard.
			 */
			value: { type: "string", group: "Data", defaultValue: "" },
			/**
			 * The keyboard layout rows. Each entry represents one row,
			 * keys are separated by spaces. Special keys are wrapped in
			 * curly braces, e.g. <code>{bksp}</code>, <code>{enter}</code>,
			 * <code>{space}</code> or <code>{shift}</code>.
			 */
			layout: {
				type: "string[]",
				group: "Appearance",
				defaultValue: ["7 8 9", "4 5 6", "1 2 3", "{bksp} 0 {enter}"],
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
			 */
			width: {
				type: "sap.ui.core.CSSSize",
				group: "Appearance",
				defaultValue: null,
			},
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
	 * Activates or deactivates the one-shot shift modifier and updates
	 * the key buttons accordingly.
	 */
	private setShiftActive(active: boolean): void {
		if (this.shiftActive === active) {
			return;
		}
		this.shiftActive = active;

		const buttons = this.getButtons();
		for (let i = 0; i < buttons.length; i++) {
			const key = this.layoutKeys[i];
			if (key === "{shift}") {
				buttons[i].setType(active ? ButtonType.Emphasized : ButtonType.Default);
			} else if (this.isShiftableKey(key)) {
				buttons[i].setText(active ? key.toUpperCase() : key);
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

		switch (key) {
			case "{shift}":
				this.fireKeyPress({ key });
				this.setShiftActive(!this.shiftActive);
				return;
			case "{enter}":
				this.fireKeyPress({ key });
				this.fireEnter({ value: this.getValue() });
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
					this.shiftActive && this.isShiftableKey(key)
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
			this.fireKeyPress({ key: "{enter}" });
			this.fireEnter({ value: this.getValue() });
			event.preventDefault();
			return;
		}
		if (key === "Backspace") {
			this.fireKeyPress({ key: "{bksp}" });
			this.removeLastChar();
			event.preventDefault();
			return;
		}
		if (key === " ") {
			if (this.layoutKeySet.has("{space}")) {
				this.fireKeyPress({ key: "{space}" });
				this.insertChar(" ");
				event.preventDefault();
			}
			return;
		}
		if (key.length === 1 && this.layoutKeySet.has(key.toLowerCase())) {
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

		switch (key) {
			case "{bksp}":
				button.setIcon("sap-icon://touch/backspace");
				break;
			case "{enter}":
				button.setIcon("sap-icon://touch/enter");
				break;
			case "{shift}":
				button.setText("\u21E7");
				break;
			case "{space}":
				button.setText("Space");
				button.addStyleClass("touchVirtualKeyboardSpaceKey");
				break;
			default:
				button.setText(key);
		}

		return button;
	}

	/**
	 * (Re)builds the key buttons if the layout has changed.
	 */
	private buildButtons(): void {
		const layout = this.getLayout();
		const signature = layout.join("\n");

		if (signature === this.builtLayoutSignature) {
			return;
		}

		this.destroyAggregation("_buttons", true);
		this.rowLengths = [];
		this.layoutKeys = [];
		this.layoutKeySet = new Set<string>();
		this.shiftActive = false;

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

	static renderer = {
		apiVersion: 2,
		render(rm: RenderManager, control: VirtualKeyboard) {
			rm.openStart("div", control);
			rm.class("touchVirtualKeyboard");

			if (!control.getEnabled()) {
				rm.class("touchVirtualKeyboardDisabled");
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
