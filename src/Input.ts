import type Popover from "sap/m/Popover";
import { InputType } from "sap/m/library";
import Control from "sap/ui/core/Control";
import { MetadataOptions } from "sap/ui/core/Element";
import { ValueState } from "sap/ui/core/library";
import RenderManager from "sap/ui/core/RenderManager";
import FieldKeyboard from "./FieldKeyboard";
import { ISized, SizeMode, sizeClass } from "./library";

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
	// Written by init, which UI5 calls from the constructor of the base class
	// - that is, before the field declarations of this class are applied.
	// Declared, they are types and nothing else, so nothing is written over
	// what init put there.
	/** the popover with the on-screen keyboard, and what goes with it */
	private declare keyboardSupport: FieldKeyboard;
	/** the value the last change event was fired for, see commitChange */
	private declare lastChangeValue: string;

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
			/**
			 * Indicates whether the keyboard in the
			 * {@link #getKeyboard keyboard} aggregation is shown in
			 * a popover below the field while the field has the focus.
			 *
			 * Without a keyboard in that aggregation the property has no effect.
			 */
			showKeyboard: {
				type: "boolean",
				group: "Behavior",
				defaultValue: false,
			},
		},
		aggregations: {
			/**
			 * The on-screen keyboard shown while the field has the focus, if
			 * {@link #getShowKeyboard showKeyboard} is set.
			 *
			 * The keyboard types into this field: its value is replaced with the
			 * value of the field whenever the popover opens, every key press
			 * fires <code>liveChange</code> and its Enter key fires
			 * <code>change</code> and <code>submit</code>. The
			 * <code>maxLength</code> of the field is handed down to it.
			 */
			keyboard: {
				type: "ui5.touch.controls.KeyboardBase",
				multiple: false,
				// the keyboard is rendered inside the popover, but stays
				// reachable through getKeyboard()
				forwarding: {
					getter: "getKeyboardPopover",
					aggregation: "content",
				},
			},
			/**
			 * The popover carrying the keyboard.
			 */
			_popover: {
				type: "sap.m.Popover",
				multiple: false,
				visibility: "hidden",
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

			// START: outer container (see sap.m.InputBaseRenderer.render)
			rm.openStart("div", control);
			rm.class("sizedInput");
			rm.class(sizeClass(control.getSize()));

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

			rm.openEnd();

			// START: inner input element
			rm.voidStart("input", id + "-inner");
			rm.class("sizedInputInner");
			rm.attr("type", control.getType().toLowerCase());
			// always written, an empty one included: patching an input puts
			// the value attribute into what the field shows, and a field the
			// user has typed into would otherwise keep showing what was typed
			rm.attr("value", control.getValue());

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

	init(): void {
		this.lastChangeValue = "";
		this.keyboardSupport = new FieldKeyboard(this, {
			change: (value) => {
				this.applyUserValue(value);
				this.fireLiveChange({ value: value });
			},
			// the keyboard stays open - the field still has the focus, and that
			// is what decides whether the keyboard is shown
			enter: () => {
				this.commitChange();
				this.fireSubmit({ value: this.getValue() });
			},
		});
	}

	/**
	 * Keeps the native input in step without a re-rendering, so the caret and
	 * the focus survive a value change - and a field the user has typed into
	 * shows the new value, too.
	 *
	 * A value set from the outside is not a change of the user: it fires no
	 * <code>change</code>, now or when the focus leaves.
	 */
	setValue(value: string): this {
		this.applyUserValue(value);
		this.lastChangeValue = this.getValue();

		return this;
	}

	/** Takes over a value without re-rendering the field. */
	private applyUserValue(value: string): void {
		this.setProperty("value", value, true);

		const input = this.getInnerInput();
		if (input && input.value !== this.getValue()) {
			input.value = this.getValue();
		}
	}

	/**
	 * Fires <code>change</code> if the value differs from the one the last
	 * change was fired for. The browser, the Enter key and the focus leaving
	 * the field all end up here, and one edit is reported once.
	 */
	private commitChange(): void {
		const value = this.getValue();

		if (value !== this.lastChangeValue) {
			this.lastChangeValue = value;
			this.fireChange({ value: value });
		}
	}

	/**
	 * Returns the inner native input element.
	 */
	private getInnerInput(): HTMLInputElement | null {
		return this.getDomRef("inner") as HTMLInputElement | null;
	}

	/**
	 * The inner input element is what the user types into, so it is also what
	 * gets the focus - e.g. when the popover of the keyboard hands the
	 * focus back to the field.
	 */
	getFocusDomRef(): Element | null {
		return this.getInnerInput() ?? super.getFocusDomRef();
	}

	/**
	 * A label points at the native input, so a tap on the label puts the
	 * caret into the field.
	 */
	getIdForLabel(): string {
		return this.getId() + "-inner";
	}

	/**
	 * The popover of the keyboard puts the focus back into the field when it
	 * closes. When it closes because the focus has just left the field, the
	 * field declines - the focus stays wherever the user put it, see
	 * {@link FieldKeyboard#closeForFocusLoss}.
	 */
	applyFocusInfo(focusInfo: { preventScroll?: boolean }): this {
		if (this.keyboardSupport.isClosingForFocusLoss()) {
			return this;
		}

		return super.applyFocusInfo(focusInfo);
	}

	/**
	 * The forwarding target of the <code>keyboard</code> aggregation, see
	 * {@link FieldKeyboard#getPopover}.
	 */
	private getKeyboardPopover(): Popover {
		return this.keyboardSupport.getPopover();
	}

	onBeforeRendering(): void {
		// e.g. when showKeyboard is switched off while the popover is
		// still open
		if (!this.keyboardSupport.canShow()) {
			this.keyboardSupport.close();
		}
	}

	oninput(): void {
		const input = this.getInnerInput();

		if (input) {
			this.setProperty("value", input.value, true);
			this.fireLiveChange({ value: input.value });
		}
	}

	/** the browser's change: Enter, or the focus leaving after typing */
	onchange(): void {
		this.commitChange();
	}

	onsapenter(): void {
		// the browser fires its change after this; commitChange lets only one
		// of the two through, and the order is the one of sap.m
		this.commitChange();
		this.fireSubmit({ value: this.getValue() });
	}

	onfocusin(): void {
		this.keyboardSupport.open();
	}

	/**
	 * Tapping the field brings the keyboard back when it was dismissed while
	 * the field kept the focus, e.g. with the Escape key.
	 */
	ontap(): void {
		this.keyboardSupport.open();
	}

	onfocusout(event: FocusEvent): void {
		// the focus can move into the popover itself, e.g. by tabbing onto a
		// key - that is not leaving the field
		if (this.keyboardSupport.contains(event.relatedTarget as Node | null)) {
			return;
		}

		this.keyboardSupport.closeForFocusLoss();
		// what was typed on the on-screen keyboard alone never made the field
		// dirty in the eyes of the browser, which therefore fires no change of
		// its own - this is that change
		this.commitChange();
	}
}
