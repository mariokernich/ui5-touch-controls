import Control from "sap/ui/core/Control";
import RenderManager from "sap/ui/core/RenderManager";
import { MetadataOptions } from "sap/ui/core/Element";
import { ValueState } from "sap/ui/core/library";
import { InputType } from "sap/m/library";
import { ISized, SizeMode } from "./library";

/**
 * A sized input control optimized for touch devices.
 *
 * Structure and behavior are based on <code>sap.m.Input</code> /
 * <code>sap.m.InputBase</code>: an outer container, a content wrapper
 * carrying the field styling (background, border, value state) and an
 * inner native <code>&lt;input&gt;</code> element.
 *
 * @namespace ui5.touch.controls
 */
export default class Input extends Control implements ISized {
	private inputListener: ((event: globalThis.Event) => void) | null = null;
	private changeListener: ((event: globalThis.Event) => void) | null = null;
	private keydownListener: ((event: KeyboardEvent) => void) | null = null;

	static readonly metadata: MetadataOptions = {
		interfaces: ["ui5.touch.controls.ISized"],
		properties: {
			/**
			 * The value of the input.
			 */
			value: { type: "string", group: "Data", defaultValue: "" },
			/**
			 * Type of the input, see sap.m.InputType (e.g. Text, Number, Password, ...).
			 */
			type: {
				type: "sap.m.InputType",
				group: "Data",
				defaultValue: InputType.Text,
			},
			/**
			 * Placeholder text shown when the input is empty.
			 */
			placeholder: { type: "string", group: "Misc", defaultValue: "" },
			/**
			 * Maximum number of characters. Value <code>0</code> means unlimited.
			 */
			maxLength: { type: "int", group: "Behavior", defaultValue: 0 },
			/**
			 * Indicates whether the user can interact with the control.
			 */
			enabled: { type: "boolean", group: "Behavior", defaultValue: true },
			/**
			 * Defines whether the control value can be modified.
			 */
			editable: { type: "boolean", group: "Behavior", defaultValue: true },
			/**
			 * Visualizes the validation state, e.g. Error, Warning, Success, Information.
			 */
			valueState: {
				type: "sap.ui.core.ValueState",
				group: "Appearance",
				defaultValue: ValueState.None,
			},
			/**
			 * Width of the input field.
			 */
			width: {
				type: "sap.ui.core.CSSSize",
				group: "Appearance",
				defaultValue: null,
			},
			/**
			 * Touch size of the input field.
			 */
			size: {
				type: "ui5.touch.controls.SizeMode",
				group: "Appearance",
				defaultValue: SizeMode.M,
			},
		},
		events: {
			/**
			 * Fired when the value of the input has changed and the focus leaves
			 * the input field or the Enter key is pressed.
			 */
			change: {
				parameters: {
					/**
					 * The new value of the input.
					 */
					value: { type: "string" },
				},
			},
			/**
			 * Fired when the value of the input is changed by user interaction -
			 * each keystroke, delete, paste, etc.
			 */
			liveChange: {
				parameters: {
					/**
					 * The current value of the input, after a live change event.
					 */
					value: { type: "string" },
				},
			},
			/**
			 * Fired when the user presses the <kbd>Enter</kbd> key on the input.
			 */
			submit: {
				parameters: {
					/**
					 * The new value of the input.
					 */
					value: { type: "string" },
				},
			},
		},
	};

	constructor(idOrSettings?: string | $InputSettings);
	constructor(id?: string, settings?: $InputSettings);
	constructor(id?: string, settings?: $InputSettings) {
		super(id, settings);
	}

	static renderer = {
		apiVersion: 2,
		render(rm: RenderManager, control: Input) {
			const id = control.getId();
			const enabled = control.getEnabled();
			const editable = control.getEditable();
			const valueState = control.getValueState();

			let fontSize, sidePadding, height;

			switch (control.getSize()) {
				case SizeMode.S:
					fontSize = "0.75rem";
					sidePadding = "10px";
					height = "2rem";
					break;
				default:
				case SizeMode.M:
					fontSize = "0.875rem";
					sidePadding = "10px";
					height = "2.3rem";
					break;
				case SizeMode.L:
					fontSize = "1rem";
					sidePadding = "12px";
					height = "3rem";
					break;
				case SizeMode.XL:
					fontSize = "1.125rem";
					sidePadding = "14px";
					height = "3.5rem";
					break;
				case SizeMode.XXL:
					fontSize = "1.25rem";
					sidePadding = "16px";
					height = "4rem";
					break;
				case SizeMode.XXXL:
					fontSize = "1.5rem";
					sidePadding = "18px";
					height = "4.5rem";
					break;
			}

			// START: outer container (see sap.m.InputBaseRenderer.render)
			rm.openStart("div", control);
			rm.class("sizedInput");

			if (!enabled) {
				rm.class("sizedInputDisabled");
			} else if (!editable) {
				rm.class("sizedInputReadonly");
			}

			if (control.getWidth()) {
				rm.style("width", control.getWidth());
			}
			rm.openEnd();

			// START: content wrapper (field background, border, value state)
			rm.openStart("div", id + "-content");
			rm.class("sizedInputContentWrapper");

			if (valueState !== ValueState.None && enabled && editable) {
				rm.class("sizedInputState");
				rm.class(`sizedInput${valueState}`);
			}

			rm.style("height", height);
			rm.openEnd();

			// START: inner input element
			rm.voidStart("input", id + "-inner");
			rm.class("sizedInputInner");
			rm.attr("type", control.getType().toLowerCase());

			rm.style("font-size", fontSize);
			rm.style("padding-left", sidePadding);
			rm.style("padding-right", sidePadding);

			if (control.getValue()) {
				rm.attr("value", control.getValue());
			}
			if (control.getPlaceholder()) {
				rm.attr("placeholder", control.getPlaceholder());
			}
			if (control.getMaxLength() > 0) {
				rm.attr("maxlength", `${control.getMaxLength()}`);
			}
			if (!enabled) {
				rm.attr("disabled", "disabled");
			} else if (!editable) {
				rm.attr("readonly", "readonly");
			}
			rm.voidEnd();
			// END: inner input element

			// END: content wrapper
			rm.close("div");

			// END: outer container
			rm.close("div");
		},
	};

	/**
	 * Returns the inner native input element.
	 */
	private getInnerInput(): HTMLInputElement | null {
		return this.getDomRef()?.querySelector("input") ?? null;
	}

	onAfterRendering(): void {
		const input = this.getInnerInput();

		if (input) {
			// With renderer apiVersion 2 the DOM element is patched and reused
			// on re-rendering, so previously attached listeners must be removed
			// first - otherwise they accumulate and events fire multiple times.
			this.detachDomListeners(input);

			this.inputListener = () => {
				this.setProperty("value", input.value, true);
				this.fireLiveChange({ value: input.value });
			};
			this.changeListener = () => {
				this.setProperty("value", input.value, true);
				this.fireChange({ value: input.value });
			};
			this.keydownListener = (event: KeyboardEvent) => {
				if (event.key === "Enter") {
					this.setProperty("value", input.value, true);
					this.fireSubmit({ value: input.value });
				}
			};

			input.addEventListener("input", this.inputListener);
			input.addEventListener("change", this.changeListener);
			input.addEventListener("keydown", this.keydownListener);
		}
	}

	private detachDomListeners(input: HTMLInputElement): void {
		if (this.inputListener) {
			input.removeEventListener("input", this.inputListener);
		}
		if (this.changeListener) {
			input.removeEventListener("change", this.changeListener);
		}
		if (this.keydownListener) {
			input.removeEventListener("keydown", this.keydownListener);
		}
		this.inputListener = null;
		this.changeListener = null;
		this.keydownListener = null;
	}

	exit(): void | undefined {
		const input = this.getInnerInput();
		if (input) {
			this.detachDomListeners(input);
		}
		this.inputListener = null;
		this.changeListener = null;
		this.keydownListener = null;
	}
}
