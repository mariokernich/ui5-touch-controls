import Control from "sap/ui/core/Control";
import RenderManager from "sap/ui/core/RenderManager";
import { MetadataOptions } from "sap/ui/core/Element";
import { ValueState } from "sap/ui/core/library";
import RadioButton from "./RadioButton";
import { ISized, SizeMode } from "./library";

/**
 * A simplified variant of <code>sap.m.RadioButtonGroup</code> for touch
 * devices.
 *
 * Arranges {@link ui5.touch.controls.RadioButton}s in the given number of
 * columns and keeps exactly one of them selected. Size, enabled state,
 * editability and value state are handed down to the buttons, so they only
 * have to be set once on the group.
 *
 * Compared to <code>sap.m.RadioButtonGroup</code> the following
 * simplifications apply:
 * <ul>
 * <li><code>selectedButton</code>, <code>valueStateText</code> and
 * <code>textDirection</code> are not supported - the selection is addressed
 * through <code>selectedIndex</code></li>
 * <li>the buttons are laid out with a CSS grid, so a column keeps its width
 * even when a button in another row is longer</li>
 * </ul>
 *
 * @namespace ui5.touch.controls
 */
export default class RadioButtonGroup extends Control implements ISized {
	/** buttons whose select event is already forwarded to the group */
	private readonly wired = new WeakSet<RadioButton>();

	static readonly metadata: MetadataOptions = {
		interfaces: ["ui5.touch.controls.ISized"],
		defaultAggregation: "buttons",
		properties: {
			/**
			 * Number of columns the buttons are distributed over.
			 */
			columns: { type: "int", group: "Appearance", defaultValue: 1 },
			/**
			 * Index of the selected button, <code>-1</code> for no selection.
			 */
			selectedIndex: { type: "int", group: "Data", defaultValue: 0 },
			/**
			 * Indicates whether the user can interact with the buttons.
			 */
			enabled: { type: "boolean", group: "Behavior", defaultValue: true },
			/**
			 * Defines whether the selection can be changed by the user.
			 */
			editable: { type: "boolean", group: "Behavior", defaultValue: true },
			/**
			 * Visualizes the validation state of all buttons.
			 */
			valueState: {
				type: "sap.ui.core.ValueState",
				group: "Appearance",
				defaultValue: ValueState.None,
			},
			/**
			 * Width of the group.
			 */
			width: {
				type: "sap.ui.core.CSSSize",
				group: "Dimension",
				defaultValue: null,
			},
			/**
			 * Touch size of all buttons of the group.
			 */
			size: {
				type: "ui5.touch.controls.SizeMode",
				group: "Appearance",
				defaultValue: SizeMode.M,
			},
		},
		aggregations: {
			/**
			 * The buttons of the group.
			 */
			buttons: {
				type: "ui5.touch.controls.RadioButton",
				multiple: true,
				singularName: "button",
				bindable: "bindable",
			},
		},
		events: {
			/**
			 * Fired when the user selects another button.
			 */
			select: {
				parameters: {
					/**
					 * Index of the selected button.
					 */
					selectedIndex: { type: "int" },
				},
			},
		},
	};

	constructor(idOrSettings?: string | $RadioButtonGroupSettings);
	constructor(id?: string, settings?: $RadioButtonGroupSettings);
	constructor(id?: string, settings?: $RadioButtonGroupSettings) {
		super(id, settings);
	}

	/**
	 * Returns the selected button, or <code>null</code> when the index points
	 * nowhere.
	 */
	getSelectedButton(): RadioButton | null {
		return this.getButtons()[this.getSelectedIndex()] ?? null;
	}

	onBeforeRendering(): void {
		const size = this.getSize();
		const enabled = this.getEnabled();
		const editable = this.getEditable();
		const valueState = this.getValueState();
		const selectedIndex = this.getSelectedIndex();

		this.getButtons().forEach((button, index) => {
			// the group owns these properties, a button inside a group is not
			// configured on its own
			button.setGroupName(this.getId());
			button.setSize(size);
			button.setEnabled(enabled);
			button.setEditable(editable);
			button.setValueState(valueState);
			button.setSelected(index === selectedIndex);

			if (!this.wired.has(button)) {
				this.wired.add(button);
				button.attachSelect(() => {
					this.onButtonSelect(button);
				});
			}
		});
	}

	private onButtonSelect(button: RadioButton): void {
		const index = this.getButtons().indexOf(button);

		if (index === -1 || index === this.getSelectedIndex()) {
			return;
		}

		this.setProperty("selectedIndex", index, true);
		this.fireSelect({ selectedIndex: index });
	}

	static renderer = {
		apiVersion: 2,
		render(rm: RenderManager, control: RadioButtonGroup) {
			const columns = Math.max(1, control.getColumns());

			rm.openStart("div", control);
			rm.class("sizedRadioButtonGroup");
			rm.style("grid-template-columns", `repeat(${columns}, auto)`);
			if (control.getWidth()) {
				rm.style("width", control.getWidth());
			}
			rm.attr("role", "radiogroup");
			rm.openEnd();

			control.getButtons().forEach((button) => {
				rm.renderControl(button);
			});

			rm.close("div");
		},
	};
}
