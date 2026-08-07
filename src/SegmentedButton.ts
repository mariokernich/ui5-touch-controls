import Control from "sap/ui/core/Control";
import RenderManager from "sap/ui/core/RenderManager";
import { MetadataOptions } from "sap/ui/core/Element";
import Button from "./Button";
import SegmentedButtonItem from "./SegmentedButtonItem";
import { ISized, SizeMode } from "./library";

/**
 * A simplified variant of <code>sap.m.SegmentedButton</code> for touch devices.
 *
 * Shows the items as a row of joined buttons of which exactly one is selected.
 * Every segment is one of the library's own buttons, so the central
 * <code>size</code> property (<code>S</code>-<code>6XL</code>) applies to the
 * whole group.
 *
 * Compared to <code>sap.m.SegmentedButton</code> the following simplifications
 * apply:
 * <ul>
 * <li>segments are as wide as their content; set <code>width</code> on the
 * control to spread them evenly, or on a single item to size that segment</li>
 * <li>a <code>selectedKey</code> without a matching item falls back to the
 * first item instead of leaving the selection unchanged</li>
 * <li>the deprecated <code>buttons</code> aggregation and the alternative
 * rendering as a <code>sap.m.Select</code> in narrow containers are not
 * supported</li>
 * </ul>
 *
 * @namespace ui5.touch.controls
 */
export default class SegmentedButton extends Control implements ISized {
	static readonly metadata: MetadataOptions = {
		interfaces: ["ui5.touch.controls.ISized"],
		defaultAggregation: "items",
		properties: {
			/**
			 * Width of the whole control. If set, the segments share it evenly.
			 */
			width: {
				type: "sap.ui.core.CSSSize",
				group: "Dimension",
				defaultValue: null,
			},
			/**
			 * Indicates whether the user can interact with the control.
			 */
			enabled: { type: "boolean", group: "Behavior", defaultValue: true },
			/**
			 * Key of the selected item. Defaults to the first item.
			 */
			selectedKey: { type: "string", group: "Data", defaultValue: "" },
			/**
			 * Touch size applied to all segments together.
			 */
			size: {
				type: "ui5.touch.controls.SizeMode",
				group: "Appearance",
				defaultValue: SizeMode.M,
			},
		},
		aggregations: {
			/**
			 * The segments of the control.
			 */
			items: {
				type: "ui5.touch.controls.SegmentedButtonItem",
				multiple: true,
				singularName: "item",
			},
			/**
			 * Internal buttons, one per visible item.
			 */
			_buttons: {
				type: "ui5.touch.controls.Button",
				multiple: true,
				visibility: "hidden",
			},
		},
		events: {
			/**
			 * Fired when the user selects a segment.
			 */
			selectionChange: {
				parameters: {
					/**
					 * The selected item.
					 */
					item: { type: "ui5.touch.controls.SegmentedButtonItem" },
					/**
					 * The key of the selected item.
					 */
					key: { type: "string" },
				},
			},
		},
	};

	constructor(idOrSettings?: string | $SegmentedButtonSettings);
	constructor(id?: string, settings?: $SegmentedButtonSettings);
	constructor(id?: string, settings?: $SegmentedButtonSettings) {
		super(id, settings);
	}

	static renderer = {
		apiVersion: 2,
		render(rm: RenderManager, control: SegmentedButton) {
			const width = control.getWidth();

			rm.openStart("div", control);
			rm.class("sizedSegmentedButton");
			if (width) {
				// with an explicit width the segments share it evenly
				rm.class("sizedSegmentedButtonEqual");
				rm.style("width", width);
			}
			rm.openEnd();

			control.getButtons().forEach(function (button) {
				rm.renderControl(button);
			});

			rm.close("div");
		},
	};

	onBeforeRendering(): void {
		this.syncButtons();
	}

	private getButtons(): Button[] {
		return this.getAggregation("_buttons", []) as Button[];
	}

	/**
	 * Returns the items that are currently shown.
	 */
	private getVisibleItems(): SegmentedButtonItem[] {
		return this.getItems().filter((item) => item.getVisible());
	}

	/**
	 * Returns the key that is actually selected. If the selected key does not
	 * belong to any item, the first item is selected instead.
	 */
	private resolveSelectedKey(items: SegmentedButtonItem[]): string {
		const selectedKey = this.getSelectedKey();

		if (items.some((item) => item.getKey() === selectedKey)) {
			return selectedKey;
		}

		const fallback = items.length > 0 ? items[0].getKey() : "";
		// the control is about to be rendered anyway, so the property is
		// corrected without triggering another rendering
		this.setProperty("selectedKey", fallback, true);

		return fallback;
	}

	/**
	 * Brings the internal buttons in line with the items: one button per
	 * visible item, carrying its text, icon and selection state.
	 */
	private syncButtons(): void {
		const items = this.getVisibleItems();
		const selectedKey = this.resolveSelectedKey(items);
		const enabled = this.getEnabled();
		const size = this.getSize();
		const buttons = this.getButtons();

		while (buttons.length > items.length) {
			const button = buttons[buttons.length - 1];
			buttons.pop();
			this.removeAggregation("_buttons", button, true);
			button.destroy();
		}

		while (buttons.length < items.length) {
			const button = new Button(`${this.getId()}-button-${buttons.length}`, {
				press: () => {
					this.handlePress(button);
				},
			});
			buttons.push(button);
			this.addAggregation("_buttons", button, true);
		}

		items.forEach((item, index) => {
			const button = buttons[index];

			button.setText(item.getText());
			button.setIcon(item.getIcon());
			button.setEnabled(enabled && item.getEnabled());
			button.setSize(size);
			button.setWidth(item.getWidth());
			button.toggleStyleClass(
				"sizedSegmentedButtonSelected",
				item.getKey() === selectedKey,
			);
		});
	}

	/**
	 * Selects the item belonging to the pressed button.
	 */
	private handlePress(button: Button): void {
		const item = this.getVisibleItems()[this.getButtons().indexOf(button)];

		if (!item || !this.getEnabled() || !item.getEnabled()) {
			return;
		}

		if (item.getKey() !== this.getSelectedKey()) {
			this.setSelectedKey(item.getKey());
		}

		item.firePress();
		this.fireSelectionChange({ item: item, key: item.getKey() });
	}
}
