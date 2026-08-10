import Control from "sap/ui/core/Control";
import RenderManager from "sap/ui/core/RenderManager";
import { MetadataOptions } from "sap/ui/core/Element";
import { ValueState } from "sap/ui/core/library";
import { ISized, SizeMode, sizeClass } from "./library";

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


			const wrapping = control.getWrapping();

			// START: outer container, it carries the checkbox semantics
			rm.openStart("div", control);
			rm.class("sizedCheckBox");
			rm.class(sizeClass(control.getSize()));

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
			rm.openEnd();
			rm.close("div");
			// END: the box itself

			if (text) {
				rm.openStart("span", control.getId() + "-label");
				rm.class("sizedCheckBoxLabel");
				rm.openEnd();
				rm.text(text);
				rm.close("span");
			}

			// END: outer container
			rm.close("div");
		},
	};
}
