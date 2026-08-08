import Control from "sap/ui/core/Control";
import RenderManager from "sap/ui/core/RenderManager";
import { MetadataOptions } from "sap/ui/core/Element";
import { ValueState } from "sap/ui/core/library";
import { ISized, SizeMode } from "./library";

/**
 * The event UI5 hands to the event handlers, narrowed to what is used here.
 * <code>setMarked</code> is added by the framework so that an enclosing
 * control can tell that the event has already been handled.
 */
interface MarkableEvent extends Event {
	setMarked(prefix?: string): void;
}

/**
 * A simplified variant of <code>sap.m.RadioButton</code> for touch devices.
 *
 * Circle, dot, label and the surrounding hit area all scale with the library's
 * central <code>size</code> property (<code>S</code>-<code>6XL</code>). At size
 * <code>M</code> the geometry matches <code>sap.m.RadioButton</code>.
 *
 * Buttons that share a <code>groupName</code> are mutually exclusive, exactly
 * as in sap.m. Inside a {@link ui5.touch.controls.RadioButtonGroup} the group
 * takes care of that and overwrites the name.
 *
 * Compared to <code>sap.m.RadioButton</code> the following simplifications
 * apply:
 * <ul>
 * <li><code>activeHandling</code>, <code>useEntireWidth</code>,
 * <code>valueStateText</code>, <code>textAlign</code> and
 * <code>textDirection</code> are not supported</li>
 * <li>the circle is drawn with CSS instead of an SVG, and the label is a plain
 * element instead of a <code>sap.m.Label</code>: the control carries
 * <code>role="radio"</code> and <code>aria-checked</code> itself</li>
 * <li>where sap.m gives the same element a different color or proportion per
 * theme - the label color and the size of the dot - the Horizon value is used,
 * Horizon being the default theme of current UI5 versions</li>
 * </ul>
 *
 * @namespace ui5.touch.controls
 */
export default class RadioButton extends Control implements ISized {
	/**
	 * All rendered radio buttons, so the ones of a group can be found when one
	 * of them is selected. A weak set would not be iterable, so the buttons
	 * remove themselves in exit().
	 */
	private static readonly instances = new Set<RadioButton>();

	static readonly metadata: MetadataOptions = {
		interfaces: ["ui5.touch.controls.ISized"],
		properties: {
			/**
			 * Whether the radio button is selected.
			 */
			selected: { type: "boolean", group: "Data", defaultValue: false },
			/**
			 * Name of the group the button belongs to. Only one button of a
			 * group can be selected at a time.
			 */
			groupName: {
				type: "string",
				group: "Behavior",
				defaultValue: "sapMRbDefaultGroup",
			},
			/**
			 * The label shown next to the circle.
			 */
			text: { type: "string", group: "Appearance", defaultValue: "" },
			/**
			 * Indicates whether the user can interact with the control.
			 */
			enabled: { type: "boolean", group: "Behavior", defaultValue: true },
			/**
			 * Defines whether the button can be selected by the user.
			 */
			editable: { type: "boolean", group: "Behavior", defaultValue: true },
			/**
			 * Visualizes the validation state, e.g. Error, Warning, Success,
			 * Information. Only shown while the control is enabled and editable.
			 */
			valueState: {
				type: "sap.ui.core.ValueState",
				group: "Appearance",
				defaultValue: ValueState.None,
			},
			/**
			 * Defines whether the label wraps. Without it a long label is
			 * truncated with an ellipsis.
			 */
			wrapping: { type: "boolean", group: "Appearance", defaultValue: false },
			/**
			 * Width of the control.
			 */
			width: {
				type: "sap.ui.core.CSSSize",
				group: "Dimension",
				defaultValue: null,
			},
			/**
			 * Touch size of the control.
			 */
			size: {
				type: "ui5.touch.controls.SizeMode",
				group: "Appearance",
				defaultValue: SizeMode.M,
			},
		},
		events: {
			/**
			 * Fired when the user selects the button. Deselecting happens by
			 * selecting another button of the group, so the event is not fired
			 * for the button that loses its selection.
			 */
			select: {
				parameters: {
					/**
					 * The new selection state, always <code>true</code>.
					 */
					selected: { type: "boolean" },
				},
			},
		},
	};

	constructor(idOrSettings?: string | $RadioButtonSettings);
	constructor(id?: string, settings?: $RadioButtonSettings);
	constructor(id?: string, settings?: $RadioButtonSettings) {
		super(id, settings);
		RadioButton.instances.add(this);
	}

	exit(): void {
		RadioButton.instances.delete(this);
	}

	ontap(event?: MarkableEvent): void {
		if (this.select()) {
			// tell an enclosing control (e.g. a list item) that the tap has
			// already been handled here
			event?.setMarked();
		}
	}

	/**
	 * SPACE would scroll the page, so the default is suppressed on key down and
	 * the button is selected on key up - like sap.m.RadioButton.
	 */
	onsapspace(event: KeyboardEvent): void {
		event.preventDefault();
	}

	onkeyup(event: KeyboardEvent): void {
		if (event.key === " " && !event.shiftKey) {
			event.preventDefault();
			this.select();
		}
	}

	/**
	 * Selects the button and deselects the other buttons of its group. Returns
	 * whether the selection changed.
	 */
	private select(): boolean {
		if (!this.getEnabled() || !this.getEditable() || this.getSelected()) {
			return false;
		}

		this.setSelected(true);
		this.fireSelect({ selected: true });

		return true;
	}

	setSelected(selected: boolean): this {
		this.setProperty("selected", selected);

		if (selected) {
			const groupName = this.getGroupName();

			for (const button of RadioButton.instances) {
				if (button !== this && button.getGroupName() === groupName) {
					button.setProperty("selected", false);
				}
			}
		}

		return this;
	}

	static renderer = {
		apiVersion: 2,
		render(rm: RenderManager, control: RadioButton) {
			const enabled = control.getEnabled();
			const editable = control.getEditable();
			const interactive = enabled && editable;
			const selected = control.getSelected();
			const valueState = control.getValueState();
			const text = control.getText();
			const wrapping = control.getWrapping();

			let fontSize, circleSize;

			switch (control.getSize()) {
				case SizeMode.S:
					fontSize = "0.75rem";
					circleSize = "1.125rem";
					break;
				default:
				case SizeMode.M:
					fontSize = "0.875rem";
					circleSize = "1.375rem";
					break;
				case SizeMode.L:
					fontSize = "1rem";
					circleSize = "1.5rem";
					break;
				case SizeMode.XL:
					fontSize = "1.125rem";
					circleSize = "1.75rem";
					break;
				case SizeMode["2XL"]:
					fontSize = "1.25rem";
					circleSize = "2rem";
					break;
				case SizeMode["3XL"]:
					fontSize = "1.5rem";
					circleSize = "2.25rem";
					break;
				case SizeMode["4XL"]:
					fontSize = "1.75rem";
					circleSize = "2.5rem";
					break;
				case SizeMode["5XL"]:
					fontSize = "2rem";
					circleSize = "2.75rem";
					break;
				case SizeMode["6XL"]:
					fontSize = "2.25rem";
					circleSize = "3rem";
					break;
			}

			// same geometry as the check box: the circle sits in a square hit
			// area, so the row is twice as high as the circle
			const halfCircle = `calc(${circleSize} / 2)`;
			const quarterCircle = `calc(${circleSize} / 4)`;

			rm.openStart("div", control);
			rm.class("sizedRadioButton");

			if (!enabled) {
				rm.class("sizedRadioButtonDisabled");
			} else if (!editable) {
				rm.class("sizedRadioButtonReadonly");
			}
			if (wrapping) {
				rm.class("sizedRadioButtonWrapping");
			}
			if (valueState !== ValueState.None && interactive) {
				rm.class("sizedRadioButtonState");
				rm.class(`sizedRadioButton${valueState}`);
			}

			rm.style("min-height", `calc(${circleSize} * 2)`);
			rm.style("padding", `${wrapping ? quarterCircle : "0"} ${halfCircle}`);
			rm.style("gap", halfCircle);
			// the focus ring scales with the control, see RadioButton.less
			rm.style("--sized-radio-button-focus-inset", quarterCircle);
			if (control.getWidth()) {
				rm.style("width", control.getWidth());
			}

			rm.attr("role", "radio");
			rm.attr("aria-checked", `${selected}`);
			if (!enabled) {
				rm.attr("aria-disabled", "true");
			} else if (!editable) {
				rm.attr("aria-readonly", "true");
			}
			rm.attr("tabindex", interactive ? "0" : "-1");
			rm.openEnd();

			rm.openStart("div", control.getId() + "-circle");
			rm.class("sizedRadioButtonCircle");
			if (selected) {
				rm.class("sizedRadioButtonSelected");
			}
			rm.style("width", circleSize);
			rm.style("height", circleSize);
			rm.openEnd();
			rm.close("div");

			if (text) {
				rm.openStart("span", control.getId() + "-label");
				rm.class("sizedRadioButtonLabel");
				rm.style("font-size", fontSize);
				rm.openEnd();
				rm.text(text);
				rm.close("span");
			}

			rm.close("div");
		},
	};
}
