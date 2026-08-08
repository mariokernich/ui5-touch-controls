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
 * A simplified variant of <code>sap.m.CheckBox</code> for touch devices.
 *
 * Box, check mark, label and the surrounding hit area all scale with the
 * library's central <code>size</code> property (<code>S</code>-<code>6XL</code>),
 * so the control stays comfortable to hit with a finger. At size
 * <code>M</code> the geometry matches <code>sap.m.CheckBox</code>.
 *
 * Compared to <code>sap.m.CheckBox</code> the following simplifications apply:
 * <ul>
 * <li><code>displayOnly</code>, <code>activeHandling</code>,
 * <code>useEntireWidth</code>, <code>required</code>, <code>name</code>,
 * <code>valueStateText</code>, <code>textAlign</code> and
 * <code>textDirection</code> are not supported</li>
 * <li>the label is rendered as a plain element instead of a
 * <code>sap.m.Label</code>, and there is no hidden native
 * <code>&lt;input&gt;</code>: the control carries
 * <code>role="checkbox"</code> and <code>aria-checked</code> itself</li>
 * <li>where sap.m gives the same element a different color per theme, the
 * Horizon value is used - Horizon being the default theme of current UI5
 * versions</li>
 * </ul>
 *
 * @namespace ui5.touch.controls
 */
export default class CheckBox extends Control implements ISized {
	static readonly metadata: MetadataOptions = {
		interfaces: ["ui5.touch.controls.ISized"],
		properties: {
			/**
			 * Whether the check box is selected.
			 */
			selected: { type: "boolean", group: "Data", defaultValue: false },
			/**
			 * Whether the check box shows the partially selected state. Only
			 * takes effect together with <code>selected</code>, and is reset as
			 * soon as the user toggles the control.
			 */
			partiallySelected: {
				type: "boolean",
				group: "Data",
				defaultValue: false,
			},
			/**
			 * The label shown next to the box.
			 */
			text: { type: "string", group: "Appearance", defaultValue: "" },
			/**
			 * Indicates whether the user can interact with the control.
			 */
			enabled: { type: "boolean", group: "Behavior", defaultValue: true },
			/**
			 * Defines whether the check box can be toggled by the user.
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
			 * Fired when the user toggles the check box.
			 */
			select: {
				parameters: {
					/**
					 * The new selection state.
					 */
					selected: { type: "boolean" },
				},
			},
		},
	};

	constructor(idOrSettings?: string | $CheckBoxSettings);
	constructor(id?: string, settings?: $CheckBoxSettings);
	constructor(id?: string, settings?: $CheckBoxSettings) {
		super(id, settings);
	}

	ontap(event?: MarkableEvent): void {
		if (this.toggle()) {
			// tell an enclosing control (e.g. a list item) that the tap has
			// already been handled here
			event?.setMarked();
		}
	}

	/**
	 * SPACE would scroll the page, so the default is suppressed on key down and
	 * the control is toggled on key up - like sap.m.CheckBox.
	 */
	onsapspace(event: KeyboardEvent): void {
		event.preventDefault();
	}

	onkeyup(event: KeyboardEvent): void {
		if (event.key === " " && !event.shiftKey) {
			event.preventDefault();
			this.toggle();
		}
	}

	/**
	 * Toggles the control if the user is allowed to, and returns whether that
	 * happened.
	 */
	private toggle(): boolean {
		if (!this.getEnabled() || !this.getEditable()) {
			return false;
		}

		// Same rule as sap.m.CheckBox: only a plainly selected box is turned
		// off, everything else - including the partially selected state - is
		// turned into a full selection.
		const selected = !this.getSelected() || this.getPartiallySelected();

		this.setSelected(selected);
		this.setPartiallySelected(false);
		this.fireSelect({ selected });

		return true;
	}

	static renderer = {
		apiVersion: 2,
		render(rm: RenderManager, control: CheckBox) {
			const enabled = control.getEnabled();
			const editable = control.getEditable();
			const interactive = enabled && editable;
			const selected = control.getSelected();
			const partiallySelected = selected && control.getPartiallySelected();
			const valueState = control.getValueState();
			const text = control.getText();

			let fontSize, boxSize, markSize;

			switch (control.getSize()) {
				case SizeMode.S:
					fontSize = "0.75rem";
					boxSize = "1.125rem";
					markSize = "0.8125rem";
					break;
				default:
				case SizeMode.M:
					fontSize = "0.875rem";
					boxSize = "1.375rem";
					markSize = "1rem";
					break;
				case SizeMode.L:
					fontSize = "1rem";
					boxSize = "1.5rem";
					markSize = "1.125rem";
					break;
				case SizeMode.XL:
					fontSize = "1.125rem";
					boxSize = "1.75rem";
					markSize = "1.25rem";
					break;
				case SizeMode["2XL"]:
					fontSize = "1.25rem";
					boxSize = "2rem";
					markSize = "1.5rem";
					break;
				case SizeMode["3XL"]:
					fontSize = "1.5rem";
					boxSize = "2.25rem";
					markSize = "1.625rem";
					break;
				case SizeMode["4XL"]:
					fontSize = "1.75rem";
					boxSize = "2.5rem";
					markSize = "1.875rem";
					break;
				case SizeMode["5XL"]:
					fontSize = "2rem";
					boxSize = "2.75rem";
					markSize = "2rem";
					break;
				case SizeMode["6XL"]:
					fontSize = "2.25rem";
					boxSize = "3rem";
					markSize = "2.25rem";
					break;
			}

			// The box sits in a square hit area, so the padding on each side is
			// half the box - which also makes the whole row exactly twice as
			// high as the box, as in sap.m.CheckBox.
			const halfBox = `calc(${boxSize} / 2)`;
			const quarterBox = `calc(${boxSize} / 4)`;
			const wrapping = control.getWrapping();

			// START: outer container, it carries the checkbox semantics
			rm.openStart("div", control);
			rm.class("sizedCheckBox");

			if (!enabled) {
				rm.class("sizedCheckBoxDisabled");
			} else if (!editable) {
				rm.class("sizedCheckBoxReadonly");
			}
			if (wrapping) {
				rm.class("sizedCheckBoxWrapping");
			}
			if (valueState !== ValueState.None && interactive) {
				rm.class("sizedCheckBoxState");
				rm.class(`sizedCheckBox${valueState}`);
			}

			rm.style("min-height", `calc(${boxSize} * 2)`);
			// a wrapping label may grow past the minimum height, so it needs a
			// gap to the edge - min-height includes it, so the collapsed
			// control keeps its height
			rm.style("padding", `${wrapping ? quarterBox : "0"} ${halfBox}`);
			rm.style("gap", halfBox);
			// the focus ring scales with the control, see CheckBox.less
			rm.style("--sized-check-box-focus-inset", quarterBox);
			if (control.getWidth()) {
				rm.style("width", control.getWidth());
			}

			rm.attr("role", "checkbox");
			rm.attr("aria-checked", partiallySelected ? "mixed" : `${selected}`);
			if (!enabled) {
				rm.attr("aria-disabled", "true");
			} else if (!editable) {
				rm.attr("aria-readonly", "true");
			}
			rm.attr("tabindex", interactive ? "0" : "-1");

			rm.openEnd();

			// START: the box itself
			rm.openStart("div", control.getId() + "-box");
			rm.class("sizedCheckBoxBox");
			if (selected) {
				rm.class("sizedCheckBoxChecked");
			}
			if (partiallySelected) {
				rm.class("sizedCheckBoxPartial");
			}
			rm.style("width", boxSize);
			rm.style("height", boxSize);
			rm.style("font-size", markSize);
			rm.openEnd();
			rm.close("div");
			// END: the box itself

			if (text) {
				rm.openStart("span", control.getId() + "-label");
				rm.class("sizedCheckBoxLabel");
				rm.style("font-size", fontSize);
				rm.openEnd();
				rm.text(text);
				rm.close("span");
			}

			// END: outer container
			rm.close("div");
		},
	};
}
