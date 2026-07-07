import Control from "sap/ui/core/Control";
import RenderManager from "sap/ui/core/RenderManager";
import { MetadataOptions } from "sap/ui/core/Element";
import { ValueState } from "sap/ui/core/library";
import { SizeMode } from "./library";

/**
 * A sized multi-line text input control optimized for touch devices.
 *
 * Structure and behavior are based on <code>sap.m.TextArea</code> /
 * <code>sap.m.InputBase</code>: an outer container, a content wrapper
 * carrying the field styling (background, border, value state) and an
 * inner native <code>&lt;textarea&gt;</code> element.
 *
 * @namespace ui5.touch.controls
 */
export default class TextArea extends Control {
	private inputListener: ((event: globalThis.Event) => void) | null = null;
	private changeListener: ((event: globalThis.Event) => void) | null = null;

	static readonly metadata: MetadataOptions = {
		properties: {
			/**
			 * The value of the text area.
			 */
			value: { type: "string", group: "Data", defaultValue: "" },
			/**
			 * Placeholder text shown when the text area is empty.
			 */
			placeholder: { type: "string", group: "Misc", defaultValue: "" },
			/**
			 * Number of visible text lines.
			 */
			rows: { type: "int", group: "Appearance", defaultValue: 2 },
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
			 * Width of the text area.
			 */
			width: {
				type: "sap.ui.core.CSSSize",
				group: "Appearance",
				defaultValue: null,
			},
			/**
			 * Height of the text area. If set, it overrules the
			 * <code>rows</code> property.
			 */
			height: {
				type: "sap.ui.core.CSSSize",
				group: "Appearance",
				defaultValue: null,
			},
			/**
			 * Touch size of the text area.
			 */
			size: {
				type: "ui5.touch.controls.SizeMode",
				group: "Appearance",
				defaultValue: SizeMode.M,
			},
		},
		events: {
			/**
			 * Fired when the value of the text area has changed and the focus
			 * leaves the field.
			 */
			change: {
				parameters: {
					/**
					 * The new value of the text area.
					 */
					value: { type: "string" },
				},
			},
			/**
			 * Fired when the value of the text area is changed by user
			 * interaction - each keystroke, delete, paste, etc.
			 */
			liveChange: {
				parameters: {
					/**
					 * The current value of the text area, after a live change event.
					 */
					value: { type: "string" },
				},
			},
		},
	};

	constructor(idOrSettings?: string | $TextAreaSettings);
	constructor(id?: string, settings?: $TextAreaSettings);
	constructor(id?: string, settings?: $TextAreaSettings) {
		super(id, settings);
	}

	static renderer = {
		apiVersion: 2,
		render(rm: RenderManager, control: TextArea) {
			const id = control.getId();
			const enabled = control.getEnabled();
			const editable = control.getEditable();
			const valueState = control.getValueState();

			let fontSize, sidePadding, verticalPadding;

			switch (control.getSize()) {
				case SizeMode.S:
					fontSize = "0.75rem";
					sidePadding = "10px";
					verticalPadding = "6px";
					break;
				default:
				case SizeMode.M:
					fontSize = "0.875rem";
					sidePadding = "10px";
					verticalPadding = "7px";
					break;
				case SizeMode.L:
					fontSize = "1rem";
					sidePadding = "12px";
					verticalPadding = "8px";
					break;
				case SizeMode.XL:
					fontSize = "1.125rem";
					sidePadding = "14px";
					verticalPadding = "10px";
					break;
				case SizeMode.XXL:
					fontSize = "1.25rem";
					sidePadding = "16px";
					verticalPadding = "12px";
					break;
				case SizeMode.XXXL:
					fontSize = "1.5rem";
					sidePadding = "18px";
					verticalPadding = "14px";
					break;
			}

			// START: outer container (see sap.m.InputBaseRenderer.render)
			rm.openStart("div", control);
			rm.class("sizedTextArea");

			if (!enabled) {
				rm.class("sizedTextAreaDisabled");
			} else if (!editable) {
				rm.class("sizedTextAreaReadonly");
			}

			if (control.getWidth()) {
				rm.style("width", control.getWidth());
			}
			rm.openEnd();

			// START: content wrapper (field background, border, value state)
			rm.openStart("div", id + "-content");
			rm.class("sizedTextAreaContentWrapper");

			if (valueState !== ValueState.None && enabled && editable) {
				rm.class("sizedTextAreaState");
				rm.class(`sizedTextArea${valueState}`);
			}

			if (control.getHeight()) {
				rm.style("height", control.getHeight());
			}
			rm.openEnd();

			// START: inner textarea element
			rm.openStart("textarea", id + "-inner");
			rm.class("sizedTextAreaInner");

			rm.style("font-size", fontSize);
			rm.style("padding", `${verticalPadding} ${sidePadding}`);

			rm.attr("rows", `${Math.max(1, control.getRows())}`);

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
			rm.openEnd();
			rm.text(control.getValue());
			rm.close("textarea");
			// END: inner textarea element

			// END: content wrapper
			rm.close("div");

			// END: outer container
			rm.close("div");
		},
	};

	/**
	 * Returns the inner native textarea element.
	 */
	private getInnerTextArea(): HTMLTextAreaElement | null {
		return this.getDomRef()?.querySelector("textarea") ?? null;
	}

	onAfterRendering(): void {
		const textarea = this.getInnerTextArea();

		if (textarea) {
			// With renderer apiVersion 2 the DOM element is patched and reused
			// on re-rendering, so previously attached listeners must be removed
			// first - otherwise they accumulate and events fire multiple times.
			this.detachDomListeners(textarea);

			this.inputListener = () => {
				this.setProperty("value", textarea.value, true);
				this.fireLiveChange({ value: textarea.value });
			};
			this.changeListener = () => {
				this.setProperty("value", textarea.value, true);
				this.fireChange({ value: textarea.value });
			};

			textarea.addEventListener("input", this.inputListener);
			textarea.addEventListener("change", this.changeListener);
		}
	}

	private detachDomListeners(textarea: HTMLTextAreaElement): void {
		if (this.inputListener) {
			textarea.removeEventListener("input", this.inputListener);
		}
		if (this.changeListener) {
			textarea.removeEventListener("change", this.changeListener);
		}
		this.inputListener = null;
		this.changeListener = null;
	}

	exit(): void | undefined {
		const textarea = this.getInnerTextArea();
		if (textarea) {
			this.detachDomListeners(textarea);
		}
		this.inputListener = null;
		this.changeListener = null;
	}
}
