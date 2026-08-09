import Popover from "sap/m/Popover";
import { PlacementType } from "sap/m/library";
import Control from "sap/ui/core/Control";
import RenderManager from "sap/ui/core/RenderManager";
import { MetadataOptions } from "sap/ui/core/Element";
import { ValueState } from "sap/ui/core/library";
import { ISized, SizeMode } from "./library";
import type VirtualKeyboard from "./VirtualKeyboard";

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
	__implements__ui5_touch_controls_ISized: boolean = true;

	private inputListener: ((event: globalThis.Event) => void) | null = null;
	private changeListener: ((event: globalThis.Event) => void) | null = null;
	private focusinListener: ((event: FocusEvent) => void) | null = null;
	private clickListener: ((event: MouseEvent) => void) | null = null;
	private focusoutListener: ((event: FocusEvent) => void) | null = null;

	/** the keyboards whose events are already connected to this field */
	private readonly wiredKeyboards = new WeakSet<VirtualKeyboard>();

	/**
	 * Whether the value was last written by the virtual keyboard. Typing on it
	 * does not make the textarea dirty in the eyes of the browser, so it never
	 * fires a change of its own when the focus leaves - this field is what
	 * makes up for that.
	 */
	private keyboardDirty = false;

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
			 * {@link #getVirtualKeyboard virtualKeyboard} aggregation is shown in
			 * a popover below the field while the field has the focus.
			 *
			 * Without a keyboard in that aggregation the property has no effect.
			 */
			showVirtualKeyboard: {
				type: "boolean",
				group: "Behavior",
				defaultValue: false,
			},
		},
		aggregations: {
			/**
			 * The on-screen keyboard shown while the field has the focus, if
			 * {@link #getShowVirtualKeyboard showVirtualKeyboard} is set.
			 *
			 * The keyboard types into this field: its value is replaced with the
			 * value of the field whenever the popover opens, every key press
			 * fires <code>liveChange</code> and its Enter key adds a line break,
			 * as Enter does in a multi-line field. The <code>maxLength</code> of
			 * the field is handed down to it.
			 */
			virtualKeyboard: {
				type: "ui5.touch.controls.VirtualKeyboard",
				multiple: false,
				// the keyboard is rendered inside the popover, but stays
				// reachable through getVirtualKeyboard()
				forwarding: {
					getter: "getKeyboardPopover",
					aggregation: "content",
				},
			},
			/**
			 * The popover carrying the virtual keyboard.
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
				case SizeMode["2XL"]:
					fontSize = "1.25rem";
					sidePadding = "16px";
					verticalPadding = "12px";
					break;
				case SizeMode["3XL"]:
					fontSize = "1.5rem";
					sidePadding = "18px";
					verticalPadding = "14px";
					break;
				case SizeMode["4XL"]:
					fontSize = "1.75rem";
					sidePadding = "20px";
					verticalPadding = "16px";
					break;
				case SizeMode["5XL"]:
					fontSize = "2rem";
					sidePadding = "22px";
					verticalPadding = "18px";
					break;
				case SizeMode["6XL"]:
					fontSize = "2.25rem";
					sidePadding = "24px";
					verticalPadding = "20px";
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

	/**
	 * The inner textarea element is what the user types into, so it is also
	 * what gets the focus - e.g. when the popover of the virtual keyboard hands
	 * the focus back to the field.
	 */
	getFocusDomRef(): Element | null {
		return this.getInnerTextArea() ?? super.getFocusDomRef();
	}

	/**
	 * Returns the keyboard of the <code>virtualKeyboard</code> aggregation, or
	 * <code>null</code> when there is none.
	 */
	private getKeyboard(): VirtualKeyboard | null {
		return this.getAggregation("virtualKeyboard") as VirtualKeyboard | null;
	}

	onBeforeRendering(): void {
		// e.g. when showVirtualKeyboard is switched off while the popover is
		// still open
		if (!this.canShowKeyboard()) {
			this.closeKeyboard();
		}
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
				this.keyboardDirty = false;
				this.fireLiveChange({ value: textarea.value });
			};
			this.changeListener = () => {
				this.setProperty("value", textarea.value, true);
				this.keyboardDirty = false;
				this.fireChange({ value: textarea.value });
			};
			this.focusinListener = () => {
				this.openKeyboard();
			};
			// tapping the field brings the keyboard back when it was dismissed
			// while the field kept the focus, e.g. with the Escape key
			this.clickListener = () => {
				this.openKeyboard();
			};
			this.focusoutListener = (event: FocusEvent) => {
				// the focus can move into the popover itself, e.g. by tabbing
				// onto a key - that is not leaving the field
				const target = event.relatedTarget as Node | null;
				if (target && this.getPopoverDomRef()?.contains(target)) {
					return;
				}
				this.closeKeyboard();
				// a value that was typed on the virtual keyboard alone never
				// made the textarea dirty, so the browser fires no change of its
				// own when the focus leaves - this is that change
				if (this.keyboardDirty) {
					this.keyboardDirty = false;
					this.fireChange({ value: this.getValue() });
				}
			};

			textarea.addEventListener("input", this.inputListener);
			textarea.addEventListener("change", this.changeListener);
			textarea.addEventListener("focusin", this.focusinListener);
			textarea.addEventListener("click", this.clickListener);
			textarea.addEventListener("focusout", this.focusoutListener);
		}
	}

	private detachDomListeners(textarea: HTMLTextAreaElement): void {
		if (this.inputListener) {
			textarea.removeEventListener("input", this.inputListener);
		}
		if (this.changeListener) {
			textarea.removeEventListener("change", this.changeListener);
		}
		if (this.focusinListener) {
			textarea.removeEventListener("focusin", this.focusinListener);
		}
		if (this.clickListener) {
			textarea.removeEventListener("click", this.clickListener);
		}
		if (this.focusoutListener) {
			textarea.removeEventListener("focusout", this.focusoutListener);
		}
		this.inputListener = null;
		this.changeListener = null;
		this.focusinListener = null;
		this.clickListener = null;
		this.focusoutListener = null;
	}

	/**
	 * Returns the popover carrying the virtual keyboard, creating it on first
	 * access.
	 *
	 * This is the forwarding target of the <code>virtualKeyboard</code>
	 * aggregation, so it is also called while the settings of the constructor
	 * are applied.
	 */
	private getKeyboardPopover(): Popover {
		let popover = this.getAggregation("_popover") as Popover | null;

		if (!popover) {
			popover = new Popover(this.getId() + "-keyboardPopover", {
				showHeader: false,
				showArrow: false,
				placement: PlacementType.VerticalPreferredBottom,
				// the field keeps the focus while the keyboard is open, so the
				// popover must not pull it onto one of the keys
				initialFocus: this,
			});
			popover.addStyleClass("sizedKeyboardPopover");
			popover.attachAfterOpen(() => {
				this.getPopoverDomRef()?.addEventListener(
					"mousedown",
					this.keepFocus,
				);
			});
			popover.attachBeforeClose(() => {
				this.getPopoverDomRef()?.removeEventListener(
					"mousedown",
					this.keepFocus,
				);
			});
			this.setAggregation("_popover", popover, true);
		}

		return popover;
	}

	private getPopoverDomRef(): HTMLElement | null {
		const popover = this.getAggregation("_popover") as Popover | null;
		return (popover?.getDomRef() as HTMLElement | null) ?? null;
	}

	/**
	 * Pressing a key must not take the focus away from the field - otherwise
	 * the popover would close on the very first key.
	 */
	private readonly keepFocus = (event: MouseEvent): void => {
		event.preventDefault();
	};

	/**
	 * Whether there is a keyboard to show and the field is in a state in which
	 * the user can type at all.
	 */
	private canShowKeyboard(): boolean {
		return (
			this.getShowVirtualKeyboard() &&
			this.getEnabled() &&
			this.getEditable() &&
			this.getKeyboard() !== null
		);
	}

	/**
	 * Opens the keyboard popover below the field.
	 */
	private openKeyboard(): void {
		if (!this.canShowKeyboard()) {
			return;
		}

		const keyboard = this.getKeyboard();
		const popover = this.getKeyboardPopover();

		if (!keyboard || popover.isOpen()) {
			return;
		}

		this.wireKeyboard(keyboard);
		// the keyboard types into this field, so it starts from its value and
		// respects its limit
		keyboard.setValue(this.getValue());
		keyboard.setMaxLength(this.getMaxLength());

		popover.openBy(this);
	}

	private closeKeyboard(): void {
		const popover = this.getAggregation("_popover") as Popover | null;
		if (popover?.isOpen()) {
			popover.close();
		}
	}

	/**
	 * Connects a keyboard to this field. Every keyboard is only connected once,
	 * however often the popover is opened.
	 */
	private wireKeyboard(keyboard: VirtualKeyboard): void {
		if (this.wiredKeyboards.has(keyboard)) {
			return;
		}
		this.wiredKeyboards.add(keyboard);

		keyboard.attachChange((event) => {
			this.applyKeyboardValue(event.getParameter("value") ?? "");
			this.fireLiveChange({ value: this.getValue() });
		});

		// in a multi-line field Enter is a line break, not a submit - and the
		// keyboard leaves its own value alone on Enter, so both sides are set
		// from here
		keyboard.attachEnter(() => {
			const maxLength = this.getMaxLength();
			if (maxLength > 0 && this.getValue().length >= maxLength) {
				return;
			}

			this.applyKeyboardValue(`${this.getValue()}\n`);
			keyboard.setValue(this.getValue());
			this.fireLiveChange({ value: this.getValue() });
		});
	}

	/**
	 * Writes a value coming from the keyboard into the field. The DOM is
	 * updated directly and the property change is suppressed, so the field is
	 * not re-rendered while the user is typing.
	 */
	private applyKeyboardValue(value: string): void {
		this.setProperty("value", value, true);
		this.keyboardDirty = true;

		const textarea = this.getInnerTextArea();
		if (textarea) {
			textarea.value = value;
			// the newest line is the interesting one
			textarea.scrollTop = textarea.scrollHeight;
		}
	}

	exit(): void | undefined {
		const textarea = this.getInnerTextArea();
		if (textarea) {
			this.detachDomListeners(textarea);
		}
		this.getPopoverDomRef()?.removeEventListener("mousedown", this.keepFocus);
		this.inputListener = null;
		this.changeListener = null;
		this.focusinListener = null;
		this.clickListener = null;
		this.focusoutListener = null;
	}
}
