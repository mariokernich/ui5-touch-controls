import Popover from "sap/m/Popover";
import VBox from "sap/m/VBox";
import { FlexRendertype, PlacementType } from "sap/m/library";
import Control from "sap/ui/core/Control";
import type Item from "sap/ui/core/Item";
import RenderManager from "sap/ui/core/RenderManager";
import { MetadataOptions } from "sap/ui/core/Element";
import { ValueState } from "sap/ui/core/library";
import Button from "./Button";
import { ISized, SizeMode } from "./library";

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
 * <li>the list is a popover on every device, there is no full screen dialog on
 * a phone</li>
 * </ul>
 *
 * @namespace ui5.touch.controls
 */
export default class Select extends Control implements ISized {
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
				type: "sap.m.Popover",
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
		popover.addContent(this.createList());
		// the list should be at least as wide as the field, like in sap.m
		popover.setContentMinWidth(`${dom.offsetWidth}px`);

		this.expanded = true;
		dom.setAttribute("aria-expanded", "true");
		dom.classList.add("sizedSelectExpanded");

		popover.openBy(this);
	}

	/**
	 * Builds the list of the popover: one of the library's buttons per item, so
	 * the rows carry the size of the control.
	 */
	private createList(): VBox {
		const size = this.getSize();
		const selectedItem = this.getSelectedItem();

		return new VBox({
			// without Bare the flex box would wrap every row in a div of its
			// own, which the styling of the list would have to work around
			renderType: FlexRendertype.Bare,
			items: this.getItems().map((item) => {
				const button = new Button({
					text: item.getText(),
					size: size,
					width: "100%",
					press: () => {
						this.selectItem(item);
					},
				});

				button.addStyleClass("sizedSelectItem");
				if (item === selectedItem) {
					button.addStyleClass("sizedSelectItemSelected");
				}

				return button;
			}),
		}).addStyleClass("sizedSelectList");
	}

	private selectItem(item: Item): void {
		const changed = item !== this.getSelectedItem();

		this.setSelectedKey(item.getKey());
		this.getPopover().close();

		if (changed) {
			this.fireChange({ selectedItem: item, selectedKey: item.getKey() });
		}
	}

	private getPopover(): Popover {
		let popover = this.getAggregation("_popover") as Popover | null;

		if (!popover) {
			popover = new Popover(this.getId() + "-popover", {
				showHeader: false,
				showArrow: false,
				placement: PlacementType.VerticalPreferredBottom,
				afterClose: () => {
					this.onPopoverClosed();
				},
			});
			popover.addStyleClass("sizedSelectPopover");
			this.setAggregation("_popover", popover, true);
		}

		return popover;
	}

	private onPopoverClosed(): void {
		this.expanded = false;

		const dom = this.getDomRef();
		dom?.setAttribute("aria-expanded", "false");
		dom?.classList.remove("sizedSelectExpanded");
	}

	static renderer = {
		apiVersion: 2,
		render(rm: RenderManager, control: Select) {
			const enabled = control.getEnabled();
			const editable = control.getEditable();
			const interactive = enabled && editable;
			const valueState = control.getValueState();
			const selectedItem = control.getSelectedItem();

			let fontSize, arrowSize, sidePadding, height;

			switch (control.getSize()) {
				case SizeMode.S:
					fontSize = "0.75rem";
					arrowSize = "0.875rem";
					sidePadding = "10px";
					height = "2rem";
					break;
				default:
				case SizeMode.M:
					fontSize = "0.875rem";
					arrowSize = "1rem";
					sidePadding = "10px";
					height = "2.3rem";
					break;
				case SizeMode.L:
					fontSize = "1rem";
					arrowSize = "1.25rem";
					sidePadding = "12px";
					height = "3rem";
					break;
				case SizeMode.XL:
					fontSize = "1.125rem";
					arrowSize = "1.5rem";
					sidePadding = "14px";
					height = "3.5rem";
					break;
				case SizeMode["2XL"]:
					fontSize = "1.25rem";
					arrowSize = "1.55rem";
					sidePadding = "16px";
					height = "4rem";
					break;
				case SizeMode["3XL"]:
					fontSize = "1.5rem";
					arrowSize = "1.65rem";
					sidePadding = "18px";
					height = "4.5rem";
					break;
				case SizeMode["4XL"]:
					fontSize = "1.75rem";
					arrowSize = "1.85rem";
					sidePadding = "20px";
					height = "5rem";
					break;
				case SizeMode["5XL"]:
					fontSize = "2rem";
					arrowSize = "2.05rem";
					sidePadding = "22px";
					height = "5.5rem";
					break;
				case SizeMode["6XL"]:
					fontSize = "2.25rem";
					arrowSize = "2.25rem";
					sidePadding = "24px";
					height = "6rem";
					break;
			}

			rm.openStart("div", control);
			rm.class("sizedSelect");

			if (!enabled) {
				rm.class("sizedSelectDisabled");
			} else if (!editable) {
				rm.class("sizedSelectReadonly");
			}
			if (valueState !== ValueState.None && interactive) {
				rm.class("sizedSelectState");
				rm.class(`sizedSelect${valueState}`);
			}

			rm.style("height", height);
			// like sap.m: enough room for the arrow, one letter and the
			// ellipsis, so the field never collapses
			rm.style("min-width", `calc(${height} * 2)`);
			if (control.getWidth()) {
				rm.style("width", control.getWidth());
			}

			rm.attr("role", "combobox");
			rm.attr("aria-haspopup", "listbox");
			rm.attr("aria-expanded", "false");
			if (!enabled) {
				rm.attr("aria-disabled", "true");
			} else if (!editable) {
				rm.attr("aria-readonly", "true");
			}
			rm.attr("tabindex", interactive ? "0" : "-1");
			rm.openEnd();

			rm.openStart("span", control.getId() + "-label");
			rm.class("sizedSelectLabel");
			rm.style("font-size", fontSize);
			rm.style("padding-left", sidePadding);
			rm.openEnd();
			rm.text(selectedItem ? selectedItem.getText() : "");
			rm.close("span");

			if (editable) {
				rm.openStart("span", control.getId() + "-arrow");
				rm.class("sizedSelectArrow");
				rm.style("width", height);
				rm.style("font-size", arrowSize);
				rm.openEnd();
				rm.close("span");
			}

			rm.close("div");
		},
	};
}
