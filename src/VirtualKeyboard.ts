import { ButtonType } from "sap/m/library";
import Control from "sap/ui/core/Control";
import { MetadataOptions } from "sap/ui/core/Element";
import RenderManager from "sap/ui/core/RenderManager";
import Button from "./Button";
import { SizeMode } from "./library";

/**
 * An on-screen keyboard optimized for touch devices, built natively from
 * the library's own {@link ui5.touch.controls.Button} controls — no
 * third-party keyboard dependency.
 *
 * The layout is defined row by row: each entry represents one row, keys are
 * separated by spaces and special keys are wrapped in curly braces
 * (<code>{bksp}</code>, <code>{enter}</code>).
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

	static readonly metadata: MetadataOptions = {
		properties: {
			/**
			 * The current input value of the keyboard.
			 */
			value: { type: "string", group: "Data", defaultValue: "" },
			/**
			 * The keyboard layout rows. Each entry represents one row,
			 * keys are separated by spaces. Special keys are wrapped in
			 * curly braces, e.g. <code>{bksp}</code> or <code>{enter}</code>.
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
			 * Touch size applied to all key buttons.
			 */
			size: {
				type: "ui5.touch.controls.SizeMode",
				group: "Appearance",
				defaultValue: SizeMode.M,
			},
			/**
			 * Type applied to all key buttons.
			 */
			buttonType: {
				type: "sap.m.ButtonType",
				group: "Appearance",
				defaultValue: ButtonType.Default,
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
	 * Handles a key press coming from one of the key buttons.
	 */
	private handleKeyPress(key: string): void {
		if (!this.getEnabled()) {
			return;
		}

		this.fireKeyPress({ key });

		if (key === "{enter}") {
			this.fireEnter({ value: this.getValue() });
			return;
		}

		const oldValue = this.getValue();
		let newValue: string;

		if (key === "{bksp}") {
			newValue = oldValue.slice(0, -1);
		} else {
			const maxLength = this.getMaxLength();
			if (maxLength > 0 && oldValue.length >= maxLength) {
				return;
			}
			newValue = oldValue + key;
		}

		if (newValue !== oldValue) {
			this.setProperty("value", newValue, true);
			this.fireChange({ value: newValue });
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

		let index = 0;
		for (const row of layout) {
			const keys = row.split(" ").filter((key) => key.length > 0);
			this.rowLengths.push(keys.length);
			for (const key of keys) {
				this.addAggregation("_buttons", this.createKeyButton(key, index), true);
				index++;
			}
		}

		this.builtLayoutSignature = signature;
	}

	onBeforeRendering(): void {
		this.buildButtons();

		const size = this.getSize();
		const buttonType = this.getButtonType();
		const enabled = this.getEnabled();

		for (const button of this.getButtons()) {
			button.setSize(size);
			button.setType(buttonType);
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
