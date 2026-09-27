import type ResponsivePopover from "sap/m/ResponsivePopover";
import Device from "sap/ui/Device";
import Control from "sap/ui/core/Control";
import type Item from "sap/ui/core/Item";
import RenderManager from "sap/ui/core/RenderManager";
import { MetadataOptions } from "sap/ui/core/Element";
import { ValueState } from "sap/ui/core/library";
import { getText } from "./i18n";
import { ISized, SizeMode, sizeClass } from "./library";
import { createPickerList, createPickerPopover, setPickerHeader } from "./picker";

/**
 * A simplified variant of <code>sap.m.Select</code> for touch devices.
 *
 * The field looks like <code>ui5.touch.controls.Input</code> with an arrow at
 * its end, and it is filled with plain <code>sap.ui.core.Item</code> elements,
 * so an existing <code>sap.m.Select</code> can be exchanged without touching
 * the items.
 *
 * The list opens in a popover that is built from the library's own buttons, so
 * the rows are as big as the field and can be hit with a finger - which is the
 * main reason for the control: the native drop-down list of
 * <code>sap.m.Select</code> keeps its standard row height no matter how large
 * the field is.
 *
 * Compared to <code>sap.m.Select</code> the following simplifications apply:
 * <ul>
 * <li><code>type</code> (<code>IconOnly</code>), <code>icon</code>,
 * <code>name</code>, <code>maxWidth</code>, <code>autoAdjustWidth</code>,
 * <code>showSecondaryValues</code>, <code>wrapItemsText</code>,
 * <code>valueStateText</code>, <code>textAlign</code>,
 * <code>textDirection</code> and <code>required</code> are not supported</li>
 * <li>the items are grouped neither by <code>sap.ui.core.SeparatorItem</code>
 * nor by <code>sap.ui.core.ListItem</code>: only <code>key</code> and
 * <code>text</code> are evaluated</li>
 * </ul>
 *
 * On a phone the list takes the whole screen, the way
 * <code>sap.m.Select</code> does, and is left again by the Cancel button in
 * its bar.
 *
 * @namespace ui5.touch.controls
 */
export default class Select extends Control implements ISized {
	/** whether the list is open, which the field shows as well */
	private expanded = false;

	static readonly metadata: MetadataOptions = {
		interfaces: ["ui5.touch.controls.ISized"],
		defaultAggregation: "items",
		properties: {
			/**
			 * Key of the selected item. Without a match the first item is
			 * selected, see <code>forceSelection</code>.
			 */
			selectedKey: { type: "string", group: "Data", defaultValue: "" },
			/**
			 * Indicates whether the user can interact with the control.
			 */
			enabled: { type: "boolean", group: "Behavior", defaultValue: true },
			/**
			 * Defines whether the selection can be changed by the user. A
			 * read-only select shows its value without the arrow.
			 */
			editable: { type: "boolean", group: "Behavior", defaultValue: true },
			/**
			 * Selects the first item when <code>selectedKey</code> matches no
			 * item.
			 */
			forceSelection: {
				type: "boolean",
				group: "Behavior",
				defaultValue: true,
			},
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
			 * The heading over the list on a phone, where the list takes the
			 * whole screen and the field it belongs to is behind it. An empty
			 * title falls back to <code>Select</code> in the language the
			 * application runs in, the way <code>sap.m.Select</code> does.
			 *
			 * Nothing is shown of it on a larger screen: there the list is a
			 * popover on the field and needs no heading to say what it is.
			 */
			pickerTitle: { type: "string", group: "Misc", defaultValue: "" },
			/**
			 * Touch size of the field and of the rows in the list.
			 */
			size: {
				type: "ui5.touch.controls.SizeMode",
				group: "Appearance",
				defaultValue: SizeMode.M,
			},
		},
		aggregations: {
			/**
			 * The items of the select.
			 */
			items: {
				type: "sap.ui.core.Item",
				multiple: true,
				singularName: "item",
				bindable: "bindable",
			},
			/**
			 * The popover carrying the list.
			 */
			_popover: {
				type: "sap.m.ResponsivePopover",
				multiple: false,
				visibility: "hidden",
			},
		},
		events: {
			/**
			 * Fired when the user selects another item.
			 */
			change: {
				parameters: {
					/**
					 * The selected item.
					 */
					selectedItem: { type: "sap.ui.core.Item" },
					/**
					 * The key of the selected item.
					 */
					selectedKey: { type: "string" },
				},
			},
		},
	};

	constructor(idOrSettings?: string | $SelectSettings);
	constructor(id?: string, settings?: $SelectSettings);
	constructor(id?: string, settings?: $SelectSettings) {
		super(id, settings);
	}

	/**
	 * Returns the item the control currently shows, or <code>null</code> when
	 * nothing is selected.
	 */
	getSelectedItem(): Item | null {
		const items = this.getItems();
		const selectedKey = this.getSelectedKey();
		const item = items.find((candidate) => candidate.getKey() === selectedKey);

		if (item) {
			return item;
		}

		return this.getForceSelection() && items.length > 0 ? items[0] : null;
	}

	onBeforeRendering(): void {
		const item = this.getSelectedItem();

		if (item && item.getKey() !== this.getSelectedKey()) {
			// forceSelection has stepped in, so the property is brought in line
			// with what is about to be rendered - silently, the control is
			// being rendered anyway
			this.setProperty("selectedKey", item.getKey(), true);
		}
	}

	ontap(): void {
		this.togglePicker();
	}

	onsapenter(): void {
		this.togglePicker();
	}

	onsapspace(event: KeyboardEvent): void {
		// SPACE would scroll the page
		event.preventDefault();
		this.togglePicker();
	}

	private isInteractive(): boolean {
		return this.getEnabled() && this.getEditable();
	}

	private togglePicker(): void {
		if (!this.isInteractive()) {
			return;
		}

		if (this.expanded) {
			this.getPopover().close();
		} else {
			this.openPicker();
		}
	}

	private openPicker(): void {
		const dom = this.getDomRef() as HTMLElement | null;

		if (!dom) {
			return;
		}

		const popover = this.getPopover();

		popover.destroyContent();
		popover.addContent(
			createPickerList(this.getItems(), {
				size: this.getSize(),
				selectedItem: this.getSelectedItem(),
				select: (item) => {
					this.selectItem(item);
				},
			}),
		);

		if (Device.system.phone) {
			// built anew every time, so it carries the size the control has now
			setPickerHeader(
				popover,
				this.getPickerTitle() || getText("PICKER_TITLE"),
				getText("SELECT_CANCEL"),
				this.getSize(),
			);
		} else {
			// the list should be at least as wide as the field, like in sap.m -
			// on a phone the picker takes the screen and there is nothing to
			// widen
			popover.setContentWidth(`${dom.offsetWidth}px`);
		}

		this.setExpanded(true);
		popover.openBy(this);
	}

	private selectItem(item: Item): void {
		const changed = item !== this.getSelectedItem();

		this.setSelectedKey(item.getKey());
		this.getPopover().close();

		if (changed) {
			this.fireChange({ selectedItem: item, selectedKey: item.getKey() });
		}
	}

	private getPopover(): ResponsivePopover {
		return (
			(this.getAggregation("_popover") as ResponsivePopover | null) ??
			createPickerPopover(this, {
				styleClass: "sizedSelectPopover",
				afterClose: () => {
					this.setExpanded(false);
				},
			})
		);
	}

	/**
	 * Shows whether the list is open, without a re-rendering. The renderer
	 * reads the same state, so a rendering while the list is open keeps it.
	 */
	private setExpanded(expanded: boolean): void {
		this.expanded = expanded;

		const dom = this.getDomRef();
		dom?.setAttribute("aria-expanded", `${expanded}`);
		dom?.classList.toggle("sizedSelectExpanded", expanded);
	}

	static renderer = {
		apiVersion: 2,
		render(rm: RenderManager, control: Select) {
			const enabled = control.getEnabled();
			const editable = control.getEditable();
			const interactive = enabled && editable;
			const valueState = control.getValueState();
			const selectedItem = control.getSelectedItem();

			rm.openStart("div", control);
			rm.class("sizedSelect");
			rm.class(sizeClass(control.getSize()));

			if (!enabled) {
				rm.class("sizedSelectDisabled");
			} else if (!editable) {
				rm.class("sizedSelectReadonly");
			}
			if (valueState !== ValueState.None && interactive) {
				rm.class("sizedSelectState");
				rm.class(`sizedSelect${valueState}`);
			}
			if (control.expanded) {
				rm.class("sizedSelectExpanded");
			}

			if (control.getWidth()) {
				rm.style("width", control.getWidth());
			}

			rm.attr("role", "combobox");
			rm.attr("aria-haspopup", "listbox");
			rm.attr("aria-expanded", `${control.expanded}`);
			if (!enabled) {
				rm.attr("aria-disabled", "true");
			} else if (!editable) {
				rm.attr("aria-readonly", "true");
			}
			rm.attr("tabindex", interactive ? "0" : "-1");
			rm.openEnd();

			rm.openStart("span", control.getId() + "-label");
			rm.class("sizedSelectLabel");
			rm.openEnd();
			rm.text(selectedItem ? selectedItem.getText() : "");
			rm.close("span");

			if (editable) {
				rm.openStart("span", control.getId() + "-arrow");
				rm.class("sizedSelectArrow");
				rm.openEnd();
				rm.close("span");
			}

			rm.close("div");
		},
	};
}
