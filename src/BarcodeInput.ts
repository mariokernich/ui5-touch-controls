import Control from "sap/ui/core/Control";
import RenderManager from "sap/ui/core/RenderManager";
import { MetadataOptions } from "sap/ui/core/Element";
import { ValueState } from "sap/ui/core/library";
import { ISized, SizeMode, sizeClass } from "./library";

/**
 * An input field that tells a barcode scanner from a person typing.
 *
 * There is no <code>sap.m</code> equivalent. On a shop floor or in a warehouse
 * most input does not come from a keyboard but from a scanner in keyboard
 * wedge mode: it types the code into the focused field within a few
 * milliseconds and finishes with <kbd>Enter</kbd>. A plain input cannot tell
 * that apart from a person, so an application ends up either reacting to every
 * <kbd>Enter</kbd> or to none.
 *
 * This control measures the time between the keystrokes. A run of at least
 * <code>minLength</code> characters whose gaps all stay below
 * <code>scanTimeout</code>, closed by <kbd>Enter</kbd>, is a scan and fires
 * {@link #event:scan scan}; everything else is treated as manual input and
 * fires {@link #event:change change}. <code>prefix</code> and
 * <code>suffix</code> take care of scanners that frame the code with extra
 * characters.
 *
 * @namespace ui5.touch.controls
 */
export default class BarcodeInput extends Control implements ISized {
	/** time stamp of the previous key, in milliseconds */
	private lastKeyTime = 0;
	/** number of characters of the current burst */
	private burstLength = 0;
	// Written by init and by setValue, which the constructor of the base class
	// calls - that is, before the field declarations of this class are
	// applied. Declared, it is a type and nothing else, so nothing is written
	// over what was put there.
	/** the value the last change event was fired for, see commitChange */
	private declare lastChangeValue: string;

	static readonly metadata: MetadataOptions = {
		interfaces: ["ui5.touch.controls.ISized"],
		properties: {
			/**
			 * The value of the field.
			 */
			value: { type: "string", group: "Data", defaultValue: "" },
			/**
			 * Placeholder text shown while the field is empty.
			 */
			placeholder: { type: "string", group: "Misc", defaultValue: "" },
			/**
			 * Longest gap between two keystrokes, in milliseconds, that still
			 * counts as scanner input. A person does not get anywhere near it,
			 * a scanner stays far below.
			 */
			scanTimeout: { type: "int", group: "Behavior", defaultValue: 40 },
			/**
			 * Shortest code that is accepted as a scan. Shorter bursts are
			 * treated as manual input.
			 */
			minLength: { type: "int", group: "Behavior", defaultValue: 3 },
			/**
			 * Characters the scanner sends before the code. They are cut off
			 * the scanned value.
			 */
			prefix: { type: "string", group: "Behavior", defaultValue: "" },
			/**
			 * Characters the scanner sends after the code, apart from the
			 * closing Enter. They are cut off the scanned value.
			 */
			suffix: { type: "string", group: "Behavior", defaultValue: "" },
			/**
			 * Empties the field after a scan, so the next code can be scanned
			 * right away.
			 */
			clearOnScan: { type: "boolean", group: "Behavior", defaultValue: true },
			/**
			 * Indicates whether the user can interact with the control.
			 */
			enabled: { type: "boolean", group: "Behavior", defaultValue: true },
			/**
			 * Defines whether the value can be changed.
			 */
			editable: { type: "boolean", group: "Behavior", defaultValue: true },
			/**
			 * Visualizes the validation state, e.g. Error, Warning, Success,
			 * Information.
			 */
			valueState: {
				type: "sap.ui.core.ValueState",
				group: "Appearance",
				defaultValue: ValueState.None,
			},
			/**
			 * Width of the field.
			 */
			width: {
				type: "sap.ui.core.CSSSize",
				group: "Dimension",
				defaultValue: null,
			},
			/**
			 * Touch size of the field.
			 */
			size: {
				type: "ui5.touch.controls.SizeMode",
				group: "Appearance",
				defaultValue: SizeMode.M,
			},
		},
		events: {
			/**
			 * Fired when a barcode was scanned.
			 */
			scan: {
				parameters: {
					/**
					 * The scanned code, without prefix and suffix.
					 */
					value: { type: "string" },
					/**
					 * The raw input as it arrived, prefix and suffix included.
					 */
					rawValue: { type: "string" },
				},
			},
			/**
			 * Fired when the value was changed by hand - on <kbd>Enter</kbd> or
			 * when the field loses the focus.
			 */
			change: {
				parameters: {
					/**
					 * The current value of the field.
					 */
					value: { type: "string" },
				},
			},
			/**
			 * Fired on every keystroke.
			 */
			liveChange: {
				parameters: {
					/**
					 * The current value of the field.
					 */
					value: { type: "string" },
				},
			},
		},
	};

	constructor(idOrSettings?: string | $BarcodeInputSettings);
	constructor(id?: string, settings?: $BarcodeInputSettings);
	constructor(id?: string, settings?: $BarcodeInputSettings) {
		super(id, settings);
	}

	init(): void {
		this.lastChangeValue = "";
	}

	/**
	 * Keeps the native input in sync without a re-rendering, so the caret and
	 * the focus survive a value change - which matters here, because the field
	 * usually keeps the focus while one code after the other is scanned.
	 *
	 * A value set from the outside is not a change of the user: it fires no
	 * <code>change</code>, now or when the focus leaves.
	 */
	setValue(value: string): this {
		this.setProperty("value", value, true);
		this.lastChangeValue = this.getValue();

		const input = this.getInnerInput();
		if (input && input.value !== this.getValue()) {
			input.value = this.getValue();
		}

		return this;
	}

	private getInnerInput(): HTMLInputElement | null {
		return this.getDomRef("inner") as HTMLInputElement | null;
	}

	/**
	 * The inner input is what a scanner types into, so it is what gets the
	 * focus - <code>focus()</code> puts it there, which is worth calling after
	 * a dialog closes, so the next scan lands here.
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
	 * Counts the characters of the current burst and decides on Enter whether
	 * what arrived came from a scanner.
	 */
	onkeydown(event: KeyboardEvent): void {
		const input = this.getInnerInput();

		if (!input) {
			return;
		}

		const now = performance.now();
		const gap = now - this.lastKeyTime;
		const timeout = this.getScanTimeout();
		const key = event.key ?? "";

		if (key === "Enter") {
			const scanned = this.burstLength >= this.getMinLength() && gap <= timeout;

			this.lastKeyTime = 0;
			this.burstLength = 0;

			// no form submit either way, the control reports what happened
			event.preventDefault();

			if (scanned) {
				this.handleScan(input);
			} else {
				// Enter is how a code typed by hand is handed over, so it is
				// reported every time - the same code entered a second time
				// included
				this.setProperty("value", input.value, true);
				this.lastChangeValue = this.getValue();
				this.fireChange({ value: this.getValue() });
			}

			return;
		}

		// a burst is a maximal run of single characters whose gaps all stay
		// below the timeout - a person always breaks it after the first key
		if (key.length === 1) {
			this.burstLength = gap <= timeout ? this.burstLength + 1 : 1;
			this.lastKeyTime = now;
		}
	}

	oninput(): void {
		const input = this.getInnerInput();

		if (input) {
			this.setProperty("value", input.value, true);
			this.fireLiveChange({ value: input.value });
		}
	}

	/**
	 * The browser's change, when the focus leaves after typing. Enter was
	 * handled on its own and kept from reaching the browser, which therefore
	 * still sees the field as changed - a value Enter has already reported is
	 * not reported again.
	 */
	onchange(): void {
		const input = this.getInnerInput();

		if (input) {
			this.setProperty("value", input.value, true);
		}
		this.commitChange();
	}

	/**
	 * Fires <code>change</code> if the value differs from the one the last
	 * change was fired for.
	 */
	private commitChange(): void {
		const value = this.getValue();

		if (value !== this.lastChangeValue) {
			this.lastChangeValue = value;
			this.fireChange({ value: value });
		}
	}

	private handleScan(input: HTMLInputElement): void {
		const rawValue = input.value;
		let value = rawValue;
		const prefix = this.getPrefix();
		const suffix = this.getSuffix();

		if (prefix && value.startsWith(prefix)) {
			value = value.slice(prefix.length);
		}
		if (suffix && value.endsWith(suffix)) {
			value = value.slice(0, -suffix.length);
		}

		this.setValue(this.getClearOnScan() ? "" : value);
		this.fireScan({ value, rawValue });
	}

	/** a tap on the icon puts the focus into the field */
	ontap(event: Event): void {
		const target = event.target as HTMLElement | null;

		if (target?.classList.contains("sizedBarcodeInputIcon")) {
			this.focus();
		}
	}

	static renderer = {
		apiVersion: 2,
		render(rm: RenderManager, control: BarcodeInput) {
			const enabled = control.getEnabled();
			const editable = control.getEditable();
			const interactive = enabled && editable;
			const valueState = control.getValueState();

			rm.openStart("div", control);
			rm.class("sizedBarcodeInput");
			rm.class(sizeClass(control.getSize()));

			if (!enabled) {
				rm.class("sizedBarcodeInputDisabled");
			} else if (!editable) {
				rm.class("sizedBarcodeInputReadonly");
			}
			if (valueState !== ValueState.None && interactive) {
				rm.class("sizedBarcodeInputState");
				rm.class(`sizedBarcodeInput${valueState}`);
			}

			if (control.getWidth()) {
				rm.style("width", control.getWidth());
			}
			rm.openEnd();

			rm.voidStart("input", control.getId() + "-inner");
			rm.class("sizedBarcodeInputInner");
			rm.attr("type", "text");
			rm.attr("autocomplete", "off");
			// always written, an empty one included: patching an input puts
			// the value attribute into what the field shows
			rm.attr("value", control.getValue());
			if (control.getPlaceholder()) {
				rm.attr("placeholder", control.getPlaceholder());
			}
			if (!enabled) {
				rm.attr("disabled", "disabled");
			} else if (!editable) {
				rm.attr("readonly", "readonly");
			}
			rm.voidEnd();

			rm.openStart("span", control.getId() + "-icon");
			rm.class("sizedBarcodeInputIcon");
			rm.openEnd();
			rm.close("span");

			rm.close("div");
		},
	};
}
