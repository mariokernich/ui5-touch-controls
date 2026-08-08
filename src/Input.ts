import Popover from "sap/m/Popover";
import { InputType, PlacementType } from "sap/m/library";
import Control from "sap/ui/core/Control";
import { MetadataOptions } from "sap/ui/core/Element";
import { ValueState } from "sap/ui/core/library";
import RenderManager from "sap/ui/core/RenderManager";
import { ISized, SizeMode } from "./library";
import type VirtualKeyboard from "./VirtualKeyboard";

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
	private focusinListener: ((event: FocusEvent) => void) | null = null;
	private clickListener: ((event: MouseEvent) => void) | null = null;
	private focusoutListener: ((event: FocusEvent) => void) | null = null;

	/** the keyboards whose events are already connected to this field */
	private readonly wiredKeyboards = new WeakSet<VirtualKeyboard>();

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
			 * fires <code>liveChange</code> and its Enter key fires
			 * <code>change</code> and <code>submit</code>. The
			 * <code>maxLength</code> of the field is handed down to it.
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
				case SizeMode["2XL"]:
					fontSize = "1.25rem";
					sidePadding = "16px";
					height = "4rem";
					break;
				case SizeMode["3XL"]:
					fontSize = "1.5rem";
					sidePadding = "18px";
					height = "4.5rem";
					break;
				case SizeMode["4XL"]:
					fontSize = "1.75rem";
					sidePadding = "20px";
					height = "5rem";
					break;
				case SizeMode["5XL"]:
					fontSize = "2rem";
					sidePadding = "22px";
					height = "5.5rem";
					break;
				case SizeMode["6XL"]:
					fontSize = "2.25rem";
					sidePadding = "24px";
					height = "6rem";
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

	/**
	 * The inner input element is what the user types into, so it is also what
	 * gets the focus - e.g. when the popover of the virtual keyboard hands the
	 * focus back to the field.
	 */
	getFocusDomRef(): Element | null {
		return this.getInnerInput() ?? super.getFocusDomRef();
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
			};

			input.addEventListener("input", this.inputListener);
			input.addEventListener("change", this.changeListener);
			input.addEventListener("keydown", this.keydownListener);
			input.addEventListener("focusin", this.focusinListener);
			input.addEventListener("click", this.clickListener);
			input.addEventListener("focusout", this.focusoutListener);
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
		if (this.focusinListener) {
			input.removeEventListener("focusin", this.focusinListener);
		}
		if (this.clickListener) {
			input.removeEventListener("click", this.clickListener);
		}
		if (this.focusoutListener) {
			input.removeEventListener("focusout", this.focusoutListener);
		}
		this.inputListener = null;
		this.changeListener = null;
		this.keydownListener = null;
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
			popover.addStyleClass("sizedInputKeyboardPopover");
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

		// the keyboard stays open - the field still has the focus, and that is
		// what decides whether the keyboard is shown
		keyboard.attachEnter(() => {
			this.fireChange({ value: this.getValue() });
			this.fireSubmit({ value: this.getValue() });
		});
	}

	/**
	 * Writes a value coming from the keyboard into the field. The DOM is
	 * updated directly and the property change is suppressed, so the field is
	 * not re-rendered while the user is typing.
	 */
	private applyKeyboardValue(value: string): void {
		this.setProperty("value", value, true);

		const input = this.getInnerInput();
		if (input) {
			input.value = value;
		}
	}

	exit(): void | undefined {
		const input = this.getInnerInput();
		if (input) {
			this.detachDomListeners(input);
		}
		this.getPopoverDomRef()?.removeEventListener("mousedown", this.keepFocus);
		this.inputListener = null;
		this.changeListener = null;
		this.keydownListener = null;
		this.focusinListener = null;
		this.clickListener = null;
		this.focusoutListener = null;
	}
}
