import Control from "sap/ui/core/Control";
import RenderManager from "sap/ui/core/RenderManager";
import { MetadataOptions } from "sap/ui/core/Element";
import { ButtonType, InputType } from "sap/m/library";
import Button from "./Button";
import Input from "./Input";
import { ISized, SizeMode } from "./library";

/**
 * A step input optimized for touch devices.
 *
 * Composite control consisting of a sized minus button (decrease), a sized
 * input and a sized plus button (increase). The <code>size</code> property
 * is applied to the buttons and the input together.
 *
 * @namespace ui5.touch.controls
 */
export default class StepInput extends Control implements ISized {
	static readonly metadata: MetadataOptions = {
		interfaces: ["ui5.touch.controls.ISized"],
		properties: {
			/**
			 * The current quantity value.
			 */
			value: { type: "float", group: "Data", defaultValue: 0 },
			/**
			 * The minimum allowed value.
			 */
			min: { type: "float", group: "Behavior", defaultValue: 0 },
			/**
			 * The maximum allowed value.
			 */
			max: { type: "float", group: "Behavior", defaultValue: 9999 },
			/**
			 * The amount by which the value is increased or decreased.
			 */
			step: { type: "float", group: "Behavior", defaultValue: 1 },
			/**
			 * Indicates whether the user can interact with the control.
			 */
			enabled: { type: "boolean", group: "Behavior", defaultValue: true },
			/**
			 * Defines whether the value can be typed into the input directly.
			 */
			editable: { type: "boolean", group: "Behavior", defaultValue: true },
			/**
			 * Touch size applied to the buttons and the input together.
			 */
			size: {
				type: "ui5.touch.controls.SizeMode",
				group: "Appearance",
				defaultValue: SizeMode.M,
			},
			/**
			 * Type applied to the minus and plus buttons.
			 */
			buttonType: {
				type: "sap.m.ButtonType",
				group: "Appearance",
				defaultValue: ButtonType.Default,
			},
		},
		aggregations: {
			/**
			 * Internal button to decrease the value.
			 */
			_minusButton: {
				type: "ui5.touch.controls.Button",
				multiple: false,
				visibility: "hidden",
			},
			/**
			 * Internal input showing the current value.
			 */
			_input: {
				type: "ui5.touch.controls.Input",
				multiple: false,
				visibility: "hidden",
			},
			/**
			 * Internal button to increase the value.
			 */
			_plusButton: {
				type: "ui5.touch.controls.Button",
				multiple: false,
				visibility: "hidden",
			},
		},
		events: {
			/**
			 * Fired when the value has been changed by user interaction
			 * (button press or direct input).
			 */
			change: {
				parameters: {
					/**
					 * The new value of the step input.
					 */
					value: { type: "float" },
				},
			},
		},
	};

	constructor(idOrSettings?: string | $StepInputSettings);
	constructor(id?: string, settings?: $StepInputSettings);
	constructor(id?: string, settings?: $StepInputSettings) {
		super(id, settings);
	}

	init(): void {
		this.setAggregation(
			"_minusButton",
			new Button(this.getId() + "-minus", {
				icon: "sap-icon://less",
				press: () => {
					this.increment(-1);
				},
			}),
			true,
		);

		this.setAggregation(
			"_input",
			new Input(this.getId() + "-input", {
				type: InputType.Number,
				change: (event) => {
					const parsed = parseFloat(event.getParameter("value") ?? "");
					this.updateValue(isNaN(parsed) ? this.getNumericValue() : parsed);
				},
			}),
			true,
		);

		this.setAggregation(
			"_plusButton",
			new Button(this.getId() + "-plus", {
				icon: "sap-icon://add",
				press: () => {
					this.increment(1);
				},
			}),
			true,
		);
	}

	private getMinusButton(): Button {
		return this.getAggregation("_minusButton") as Button;
	}

	private getInput(): Input {
		return this.getAggregation("_input") as Input;
	}

	private getPlusButton(): Button {
		return this.getAggregation("_plusButton") as Button;
	}

	/**
	 * Returns the given property value coerced to a number. Bound values may
	 * arrive as strings at runtime (e.g. two-way binding from an input field).
	 */
	private getNumericProperty(name: string, fallback: number): number {
		const value = Number(this.getProperty(name));
		return isNaN(value) ? fallback : value;
	}

	private getNumericValue(): number {
		return this.getNumericProperty("value", 0);
	}

	private getNumericMin(): number {
		return this.getNumericProperty("min", 0);
	}

	private getNumericMax(): number {
		return this.getNumericProperty("max", 9999);
	}

	private getNumericStep(): number {
		return this.getNumericProperty("step", 1);
	}

	/**
	 * Increases or decreases the value by one step in the given direction.
	 */
	private increment(direction: 1 | -1): void {
		this.updateValue(
			this.getNumericValue() + direction * this.getNumericStep(),
		);
	}

	/**
	 * Rounds the given value to the decimal precision of the step to avoid
	 * floating point artifacts (e.g. 0.1 + 0.2 = 0.30000000000000004).
	 */
	private roundToStepPrecision(value: number): number {
		const step = `${this.getNumericStep()}`;
		const decimalIndex = step.indexOf(".");
		const decimals = decimalIndex >= 0 ? step.length - decimalIndex - 1 : 0;
		return parseFloat(value.toFixed(decimals));
	}

	/**
	 * Clamps the given value to the min/max range, updates the control
	 * and fires the change event if the value has changed.
	 */
	private updateValue(newValue: number): void {
		const clamped = this.roundToStepPrecision(
			Math.min(this.getNumericMax(), Math.max(this.getNumericMin(), newValue)),
		);

		if (clamped !== this.getNumericValue()) {
			this.setProperty("value", clamped);
			this.fireChange({ value: clamped });
		} else {
			// re-render to reset an out-of-range or invalid input value
			this.invalidate();
		}
	}

	/**
	 * Returns the input width matching the current size.
	 */
	private getInputWidth(): string {
		switch (this.getSize()) {
			case SizeMode.S:
				return "3rem";
			default:
			case SizeMode.M:
				return "3.5rem";
			case SizeMode.L:
				return "4rem";
			case SizeMode.XL:
				return "4.5rem";
			case SizeMode.XXL:
				return "5rem";
			case SizeMode.XXXL:
				return "5.5rem";
		}
	}

	/**
	 * Returns the square button width matching the current size
	 * (same as the button height of the respective size).
	 */
	private getButtonWidth(): string {
		switch (this.getSize()) {
			case SizeMode.S:
				return "2rem";
			default:
			case SizeMode.M:
				return "2.3rem";
			case SizeMode.L:
				return "3rem";
			case SizeMode.XL:
				return "3.5rem";
			case SizeMode.XXL:
				return "4rem";
			case SizeMode.XXXL:
				return "4.5rem";
		}
	}

	onBeforeRendering(): void {
		const size = this.getSize();
		const enabled = this.getEnabled();
		const value = this.getNumericValue();
		const buttonWidth = this.getButtonWidth();
		const buttonType = this.getButtonType();

		const minusButton = this.getMinusButton();
		minusButton.setSize(size);
		minusButton.setType(buttonType);
		minusButton.setEnabled(enabled && value > this.getNumericMin());
		minusButton.setSidePadding("0px");
		minusButton.setWidth(buttonWidth);

		const input = this.getInput();
		input.setSize(size);
		input.setEnabled(enabled);
		input.setEditable(this.getEditable());
		input.setWidth(this.getInputWidth());
		input.setValue(`${value}`);

		const plusButton = this.getPlusButton();
		plusButton.setSize(size);
		plusButton.setType(buttonType);
		plusButton.setEnabled(enabled && value < this.getNumericMax());
		plusButton.setSidePadding("0px");
		plusButton.setWidth(buttonWidth);
	}

	static renderer = {
		apiVersion: 2,
		render(rm: RenderManager, control: StepInput) {
			rm.openStart("div", control);
			rm.class("touchStepInput");
			rm.openEnd();

			rm.renderControl(control.getMinusButton());
			rm.renderControl(control.getInput());
			rm.renderControl(control.getPlusButton());

			rm.close("div");
		},
	};
}
