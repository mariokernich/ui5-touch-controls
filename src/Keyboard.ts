import Control from "sap/ui/core/Control";
import { MetadataOptions } from "sap/ui/core/Element";
import RenderManager from "sap/ui/core/RenderManager";
import { default as SimpleKeyboard } from "simple-keyboard";

/**
 * An on-screen keyboard optimized for touch devices, based on
 * <a href="https://github.com/hodgef/simple-keyboard">simple-keyboard</a>.
 *
 * @namespace ui5.touch.controls
 */
export default class Keyboard extends Control {
	protected keyboard?: SimpleKeyboard;

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
			 * Width of the keyboard.
			 */
			width: {
				type: "sap.ui.core.CSSSize",
				group: "Appearance",
				defaultValue: null,
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

	constructor(idOrSettings?: string | $KeyboardSettings);
	constructor(id?: string, settings?: $KeyboardSettings);
	constructor(id?: string, settings?: $KeyboardSettings) {
		super(id, settings);
	}

	/**
	 * Builds the simple-keyboard display map, replacing special keys
	 * with SVG icons from the library's icons folder (rendered via
	 * CSS mask so they follow the theme-aware button text color).
	 */
	private getDisplayMap(): Record<string, string> {
		return {
			"{bksp}":
				'<span class="touchKeyboardKeyIcon touchKeyboardKeyIconBackspace"></span>',
			"{enter}":
				'<span class="touchKeyboardKeyIcon touchKeyboardKeyIconEnter"></span>',
		};
	}

	public onAfterRendering(): void {
		// The keyboard DOM is (re)created by simple-keyboard inside the
		// control's div. UI5 re-rendering replaces those children, so any
		// existing instance is destroyed and a new one is created.
		this.destroyKeyboard();

		const dom = this.getDomRef() as HTMLDivElement | null;
		if (!dom) {
			return;
		}

		this.keyboard = new SimpleKeyboard(dom, {
			layout: {
				default: this.getLayout(),
			},
			display: this.getDisplayMap(),
			maxLength: this.getMaxLength() > 0 ? this.getMaxLength() : undefined,
			physicalKeyboardHighlight: true,
			mergeDisplay: true,
			theme: "simple-keyboard hg-theme-default hg-layout-numeric numeric-theme",
			onChange: (input: string) => {
				if (!this.getEnabled()) {
					return;
				}
				this.setProperty("value", input, true);
				this.fireChange({ value: input });
			},
			onKeyPress: (key: string) => {
				if (!this.getEnabled()) {
					return;
				}
				this.fireKeyPress({ key });
				if (key === "{enter}") {
					this.fireEnter({ value: this.getValue() });
				}
			},
		});

		this.keyboard.setInput(this.getValue());
	}

	/**
	 * Sets the value and synchronizes the internal simple-keyboard
	 * input state without re-rendering.
	 */
	public setValue(value: string): this {
		this.setProperty("value", value, true);
		this.keyboard?.setInput(value ?? "");
		return this;
	}

	private destroyKeyboard(): void {
		if (this.keyboard) {
			this.keyboard.destroy();
			this.keyboard = undefined;
		}
	}

	public exit(): void {
		this.destroyKeyboard();
	}

	public static renderer = {
		apiVersion: 2,
		render: function (rm: RenderManager, control: Keyboard) {
			rm.openStart("div", control);
			rm.class("simple-keyboard");
			rm.class("touchKeyboard");

			if (!control.getEnabled()) {
				rm.class("touchKeyboardDisabled");
			}
			if (control.getWidth()) {
				rm.style("width", control.getWidth());
			}

			rm.openEnd();
			rm.close("div");
		},
	};
}
