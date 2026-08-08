import Control from "sap/ui/core/Control";
import RenderManager from "sap/ui/core/RenderManager";
import { MetadataOptions } from "sap/ui/core/Element";
import { ValueState } from "sap/ui/core/library";
import { ISized, SizeMode } from "./library";

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
	private keydownListener: ((event: KeyboardEvent) => void) | null = null;
	private inputListener: ((event: globalThis.Event) => void) | null = null;
	private changeListener: ((event: globalThis.Event) => void) | null = null;

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

	/**
	 * Keeps the native input in sync without a re-rendering, so the caret and
	 * the focus survive a value change - which matters here, because the field
	 * usually keeps the focus while one code after the other is scanned.
	 */
	setValue(value: string): this {
		this.setProperty("value", value, true);

		const input = this.getInnerInput();
		if (input && input.value !== value) {
			input.value = value;
		}

		return this;
	}

	/**
	 * Puts the focus into the field, so the next scan lands here. Worth calling
	 * after a dialog closes.
	 */
	focus(): void {
		this.getInnerInput()?.focus();
	}

	private getInnerInput(): HTMLInputElement | null {
		return this.getDomRef()?.querySelector("input") ?? null;
	}

	onAfterRendering(): void {
		const input = this.getInnerInput();

		if (!input) {
			return;
		}

		// with renderer apiVersion 2 the DOM element is patched and reused, so
		// previously attached listeners have to go first
		this.detachDomListeners(input);

		this.keydownListener = (event: KeyboardEvent) => {
			this.onKeyDown(event, input);
		};
		this.inputListener = () => {
			this.setProperty("value", input.value, true);
			this.fireLiveChange({ value: input.value });
		};
		this.changeListener = () => {
			this.setProperty("value", input.value, true);
			this.fireChange({ value: input.value });
		};

		input.addEventListener("keydown", this.keydownListener);
		input.addEventListener("input", this.inputListener);
		input.addEventListener("change", this.changeListener);
	}

	/**
	 * Counts the characters of the current burst and decides on Enter whether
	 * what arrived came from a scanner.
	 */
	private onKeyDown(event: KeyboardEvent, input: HTMLInputElement): void {
		const now = performance.now();
		const gap = now - this.lastKeyTime;
		const timeout = this.getScanTimeout();

		if (event.key === "Enter") {
			const scanned = this.burstLength >= this.getMinLength() && gap <= timeout;

			this.lastKeyTime = 0;
			this.burstLength = 0;

			// no form submit either way, the control reports what happened
			event.preventDefault();

			if (scanned) {
				this.handleScan(input);
			} else {
				this.setProperty("value", input.value, true);
				this.fireChange({ value: input.value });
			}

			return;
		}

		// a burst is a maximal run of single characters whose gaps all stay
		// below the timeout - a person always breaks it after the first key
		if (event.key.length === 1) {
			this.burstLength = gap <= timeout ? this.burstLength + 1 : 1;
			this.lastKeyTime = now;
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

	private detachDomListeners(input: HTMLInputElement): void {
		if (this.keydownListener) {
			input.removeEventListener("keydown", this.keydownListener);
		}
		if (this.inputListener) {
			input.removeEventListener("input", this.inputListener);
		}
		if (this.changeListener) {
			input.removeEventListener("change", this.changeListener);
		}
		this.keydownListener = null;
		this.inputListener = null;
		this.changeListener = null;
	}

	exit(): void {
		const input = this.getInnerInput();

		if (input) {
			this.detachDomListeners(input);
		}
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

			let fontSize, iconSize, sidePadding, height;

			switch (control.getSize()) {
				case SizeMode.S:
					fontSize = "0.75rem";
					iconSize = "0.875rem";
					sidePadding = "10px";
					height = "2rem";
					break;
				default:
				case SizeMode.M:
					fontSize = "0.875rem";
					iconSize = "1rem";
					sidePadding = "10px";
					height = "2.3rem";
					break;
				case SizeMode.L:
					fontSize = "1rem";
					iconSize = "1.25rem";
					sidePadding = "12px";
					height = "3rem";
					break;
				case SizeMode.XL:
					fontSize = "1.125rem";
					iconSize = "1.5rem";
					sidePadding = "14px";
					height = "3.5rem";
					break;
				case SizeMode["2XL"]:
					fontSize = "1.25rem";
					iconSize = "1.55rem";
					sidePadding = "16px";
					height = "4rem";
					break;
				case SizeMode["3XL"]:
					fontSize = "1.5rem";
					iconSize = "1.65rem";
					sidePadding = "18px";
					height = "4.5rem";
					break;
				case SizeMode["4XL"]:
					fontSize = "1.75rem";
					iconSize = "1.85rem";
					sidePadding = "20px";
					height = "5rem";
					break;
				case SizeMode["5XL"]:
					fontSize = "2rem";
					iconSize = "2.05rem";
					sidePadding = "22px";
					height = "5.5rem";
					break;
				case SizeMode["6XL"]:
					fontSize = "2.25rem";
					iconSize = "2.25rem";
					sidePadding = "24px";
					height = "6rem";
					break;
			}

			rm.openStart("div", control);
			rm.class("sizedBarcodeInput");

			if (!enabled) {
				rm.class("sizedBarcodeInputDisabled");
			} else if (!editable) {
				rm.class("sizedBarcodeInputReadonly");
			}
			if (valueState !== ValueState.None && interactive) {
				rm.class("sizedBarcodeInputState");
				rm.class(`sizedBarcodeInput${valueState}`);
			}

			rm.style("height", height);
			rm.style("min-width", `calc(${height} * 3)`);
			if (control.getWidth()) {
				rm.style("width", control.getWidth());
			}
			rm.openEnd();

			rm.voidStart("input", control.getId() + "-inner");
			rm.class("sizedBarcodeInputInner");
			rm.attr("type", "text");
			rm.attr("autocomplete", "off");
			rm.style("font-size", fontSize);
			rm.style("padding-left", sidePadding);
			rm.style("padding-right", sidePadding);
			if (control.getValue()) {
				rm.attr("value", control.getValue());
			}
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
			rm.style("width", height);
			rm.style("font-size", iconSize);
			rm.openEnd();
			rm.close("span");

			rm.close("div");
		},
	};
}
