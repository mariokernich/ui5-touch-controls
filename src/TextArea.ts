import type Popover from "sap/m/Popover";
import Control from "sap/ui/core/Control";
import RenderManager from "sap/ui/core/RenderManager";
import { MetadataOptions } from "sap/ui/core/Element";
import { ValueState } from "sap/ui/core/library";
import FieldKeyboard from "./FieldKeyboard";
import type KeyboardBase from "./KeyboardBase";
import { ISized, SizeMode, sizeClass } from "./library";

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
export default class TextArea extends Control implements ISized {
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
			 * fires <code>liveChange</code> and its Enter key adds a line break,
			 * as Enter does in a multi-line field. The <code>maxLength</code> of
			 * the field is handed down to it.
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

			// START: outer container (see sap.m.InputBaseRenderer.render)
			rm.openStart("div", control);
			rm.class("sizedTextArea");
			rm.class(sizeClass(control.getSize()));

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

	init(): void {
		this.lastChangeValue = "";
		this.keyboardSupport = new FieldKeyboard(this, {
			change: (value) => {
				this.applyUserValue(value);
				this.fireLiveChange({ value: this.getValue() });
			},
			enter: (keyboard) => {
				this.insertLineBreak(keyboard);
			},
		});
	}

	/**
	 * Keeps the native textarea in step without a re-rendering, so the caret
	 * and the focus survive a value change.
	 *
	 * This is more than a matter of taste here: what a textarea shows is its
	 * text only until the user has typed into it, and a re-rendering that
	 * writes the new value as text would leave the old one on the screen.
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
		this.syncTextArea();
	}

	/**
	 * Puts the value into the native textarea, if it shows something else.
	 * The newest line is the interesting one, so it is scrolled into view.
	 */
	private syncTextArea(): void {
		const textarea = this.getInnerTextArea();

		if (textarea && textarea.value !== this.getValue()) {
			textarea.value = this.getValue();
			textarea.scrollTop = textarea.scrollHeight;
		}
	}

	/**
	 * In a multi-line field Enter is a line break, not a submit - and the
	 * keyboard leaves its own value alone on Enter, so both sides are set from
	 * here.
	 */
	private insertLineBreak(keyboard: KeyboardBase): void {
		const maxLength = this.getMaxLength();
		if (maxLength > 0 && this.getValue().length >= maxLength) {
			return;
		}

		this.applyUserValue(`${this.getValue()}\n`);
		keyboard.setValue(this.getValue());
		this.fireLiveChange({ value: this.getValue() });
	}

	/**
	 * Fires <code>change</code> if the value differs from the one the last
	 * change was fired for. The browser and the focus leaving the field both
	 * end up here, and one edit is reported once.
	 */
	private commitChange(): void {
		const value = this.getValue();

		if (value !== this.lastChangeValue) {
			this.lastChangeValue = value;
			this.fireChange({ value: value });
		}
	}

	/**
	 * Returns the inner native textarea element.
	 */
	private getInnerTextArea(): HTMLTextAreaElement | null {
		return this.getDomRef("inner") as HTMLTextAreaElement | null;
	}

	/**
	 * The inner textarea element is what the user types into, so it is also
	 * what gets the focus - e.g. when the popover of the keyboard hands
	 * the focus back to the field.
	 */
	getFocusDomRef(): Element | null {
		return this.getInnerTextArea() ?? super.getFocusDomRef();
	}

	/**
	 * A label points at the native textarea, so a tap on the label puts the
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

	onAfterRendering(): void {
		// the text of the element is only what a textarea starts with, see
		// setValue
		this.syncTextArea();
	}

	oninput(): void {
		const textarea = this.getInnerTextArea();

		if (textarea) {
			this.setProperty("value", textarea.value, true);
			this.fireLiveChange({ value: textarea.value });
		}
	}

	/** the browser's change: the focus leaving after typing */
	onchange(): void {
		this.commitChange();
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
		// a value that was typed on the on-screen keyboard alone never made
		// the textarea dirty, so the browser fires no change of its own when
		// the focus leaves - this is that change
		this.commitChange();
	}
}
