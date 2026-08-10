import Popover from "sap/m/Popover";
import Text from "sap/m/Text";
import VBox from "sap/m/VBox";
import { FlexRendertype, PlacementType } from "sap/m/library";
import Control from "sap/ui/core/Control";
import type Item from "sap/ui/core/Item";
import type ListItem from "sap/ui/core/ListItem";
import RenderManager from "sap/ui/core/RenderManager";
import { MetadataOptions } from "sap/ui/core/Element";
import { ValueState } from "sap/ui/core/library";
import Button from "./Button";
import { ISized, SizeMode, sizeClass } from "./library";

/**
 * A simplified variant of <code>sap.m.ComboBox</code> for touch devices.
 *
 * A {@link ui5.touch.controls.Select} the user can type into: the field takes
 * free text, and what is typed filters the list. The list is the same popover
 * of the library's own buttons, so a row is as high as the field and can be
 * hit with a finger - which also makes the control work together with
 * {@link ui5.touch.controls.VirtualKeyboard} on a device without a keyboard.
 *
 * The items are plain <code>sap.ui.core.Item</code> elements, so an existing
 * <code>sap.m.ComboBox</code> can be exchanged without touching them. With
 * {@link #getShowSecondaryValues showSecondaryValues} the rows show a second
 * value at their end, which comes from the <code>additionalText</code> of a
 * <code>sap.ui.core.ListItem</code> - the same as in
 * <code>sap.m.ComboBox</code>.
 *
 * Compared to <code>sap.m.ComboBox</code> the following simplifications apply:
 * <ul>
 * <li><code>filterSecondaryValues</code>,
 * <code>showClearIcon</code>, <code>maxWidth</code>, <code>name</code>,
 * <code>valueStateText</code>, <code>textAlign</code>,
 * <code>textDirection</code> and <code>required</code> are not supported</li>
 * <li>the filter always matches anywhere in the text, not only at the
 * beginning, and it is case insensitive</li>
 * <li>the list is a popover on every device, there is no full screen dialog on
 * a phone</li>
 * </ul>
 *
 * @namespace ui5.touch.controls
 */
export default class ComboBox extends Control implements ISized {
	private expanded = false;
	private inputListener: ((event: globalThis.Event) => void) | null = null;
	private changeListener: ((event: globalThis.Event) => void) | null = null;

	static readonly metadata: MetadataOptions = {
		interfaces: ["ui5.touch.controls.ISized"],
		defaultAggregation: "items",
		properties: {
			/**
			 * The text in the field. Free text is allowed - without a matching
			 * item <code>selectedKey</code> is empty.
			 */
			value: { type: "string", group: "Data", defaultValue: "" },
			/**
			 * Key of the selected item, empty when the value matches no item.
			 */
			selectedKey: { type: "string", group: "Data", defaultValue: "" },
			/**
			 * Placeholder text shown while the field is empty.
			 */
			placeholder: { type: "string", group: "Misc", defaultValue: "" },
			/**
			 * Indicates whether the user can interact with the control.
			 */
			enabled: { type: "boolean", group: "Behavior", defaultValue: true },
			/**
			 * Defines whether the value can be changed by the user. A read-only
			 * combo box shows its value without the arrow.
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
			 * Indicates whether the rows of the list show the
			 * <code>additionalText</code> of their item as a second value at the
			 * end of the row. Only <code>sap.ui.core.ListItem</code> carries that
			 * text; plain items are shown without one.
			 *
			 * Unlike <code>sap.m.ComboBox</code> the second value is never part
			 * of what the typed text is matched against - that is what
			 * <code>filterSecondaryValues</code> does there, and it is not
			 * supported here.
			 */
			showSecondaryValues: {
				type: "boolean",
				group: "Misc",
				defaultValue: false,
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
			 * The items of the combo box.
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
			 * Fired when the value is committed - by picking an item, by
			 * pressing <kbd>Enter</kbd> or when the field loses the focus.
			 */
			change: {
				parameters: {
					/**
					 * The current value of the field.
					 */
					value: { type: "string" },
					/**
					 * The key of the matching item, empty for free text.
					 */
					selectedKey: { type: "string" },
					/**
					 * The matching item, <code>null</code> for free text.
					 */
					selectedItem: { type: "sap.ui.core.Item" },
				},
			},
			/**
			 * Fired when the user picks an item from the list.
			 */
			selectionChange: {
				parameters: {
					/**
					 * The picked item.
					 */
					selectedItem: { type: "sap.ui.core.Item" },
					/**
					 * The key of the picked item.
					 */
					selectedKey: { type: "string" },
				},
			},
		},
	};

	constructor(idOrSettings?: string | $ComboBoxSettings);
	constructor(id?: string, settings?: $ComboBoxSettings);
	constructor(id?: string, settings?: $ComboBoxSettings) {
		super(id, settings);
	}

	/**
	 * Returns the item whose text equals the current value, or
	 * <code>null</code> when the value is free text.
	 */
	getSelectedItem(): Item | null {
		const value = this.getValue().toLowerCase();

		return (
			this.getItems().find((item) => item.getText().toLowerCase() === value) ??
			null
		);
	}

	/**
	 * Keeps the native input in sync without a re-rendering, so the caret and
	 * the focus survive a value change.
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
	 * Selecting by key also puts the text of the item into the field, like in
	 * sap.m.
	 */
	setSelectedKey(key: string): this {
		this.setProperty("selectedKey", key, true);
		this.applySelectedKey(key);

		return this;
	}

	/**
	 * Puts the text of the item with that key into the field. Returns whether
	 * there was such an item.
	 */
	private applySelectedKey(key: string): boolean {
		const item = this.getItems().find((candidate) => candidate.getKey() === key);

		if (item) {
			this.setValue(item.getText());
		}

		return Boolean(item);
	}

	/**
	 * Properties are applied before aggregations, both in a constructor and in
	 * an XML view, so a <code>selectedKey</code> written next to the items
	 * cannot be resolved when it arrives - there are no items yet. It is
	 * caught up on here, once they are known.
	 *
	 * An empty field is the only case this applies to: everything a user types
	 * keeps the key and the value in step, so a key that is left over from
	 * before cannot put text back into a field that was cleared.
	 */
	onBeforeRendering(): void {
		if (this.getSelectedKey() && !this.getValue()) {
			this.applySelectedKey(this.getSelectedKey());
		}
	}

	private getInnerInput(): HTMLInputElement | null {
		return this.getDomRef()?.querySelector("input") ?? null;
	}

	private isInteractive(): boolean {
		return this.getEnabled() && this.getEditable();
	}

	onAfterRendering(): void {
		const input = this.getInnerInput();

		if (!input) {
			return;
		}

		// with renderer apiVersion 2 the DOM element is patched and reused, so
		// previously attached listeners have to go first
		this.detachDomListeners(input);

		this.inputListener = () => {
			this.setProperty("value", input.value, true);
			this.setProperty("selectedKey", this.getSelectedItem()?.getKey() ?? "", true);
			this.openPicker();
		};
		this.changeListener = () => {
			this.setProperty("value", input.value, true);
			this.fireChangeEvent();
		};

		input.addEventListener("input", this.inputListener);
		input.addEventListener("change", this.changeListener);
	}

	private detachDomListeners(input: HTMLInputElement): void {
		if (this.inputListener) {
			input.removeEventListener("input", this.inputListener);
		}
		if (this.changeListener) {
			input.removeEventListener("change", this.changeListener);
		}
		this.inputListener = null;
		this.changeListener = null;
	}

	exit(): void {
		const input = this.getInnerInput();
		if (input) {
			this.detachDomListeners(input);
		}
	}

	/**
	 * Only the arrow opens the whole list - a tap into the text is meant for
	 * the caret.
	 */
	ontap(event: Event): void {
		if (!this.isInteractive()) {
			return;
		}

		const target = event.target as HTMLElement | null;

		if (target?.classList.contains("sizedComboBoxArrow")) {
			if (this.expanded) {
				this.getPopover().close();
			} else {
				this.openPicker(true);
			}
		}
	}

	onsapenter(): void {
		if (this.expanded) {
			this.getPopover().close();
		}
		this.fireChangeEvent();
	}

	onsapdown(): void {
		if (this.isInteractive() && !this.expanded) {
			this.openPicker(true);
		}
	}

	private fireChangeEvent(): void {
		const item = this.getSelectedItem();

		this.setProperty("selectedKey", item?.getKey() ?? "", true);
		this.fireChange({
			value: this.getValue(),
			selectedKey: item?.getKey() ?? "",
			selectedItem: item ?? undefined,
		});
	}

	/**
	 * Returns the items matching the current value. An empty value or a value
	 * that is exactly one of the items shows the full list, so the user can
	 * always see what there is to choose from.
	 */
	private getFilteredItems(showAll: boolean): Item[] {
		const value = this.getValue().trim().toLowerCase();
		const items = this.getItems();

		if (showAll || !value || items.some((item) => item.getText().toLowerCase() === value)) {
			return items;
		}

		return items.filter((item) => item.getText().toLowerCase().includes(value));
	}

	private openPicker(showAll = false): void {
		const dom = this.getDomRef() as HTMLElement | null;

		if (!dom || !this.isInteractive()) {
			return;
		}

		const popover = this.getPopover();

		popover.destroyContent();
		popover.addContent(this.createList(this.getFilteredItems(showAll)));
		popover.setContentMinWidth(`${dom.offsetWidth}px`);

		if (!this.expanded) {
			this.expanded = true;
			dom.setAttribute("aria-expanded", "true");
			dom.classList.add("sizedComboBoxExpanded");
			popover.openBy(this);
		}
	}

	/**
	 * Puts the second value of an item at the end of its row.
	 *
	 * The row is one of the library's buttons, which knows nothing about a
	 * second value, so the text goes into a CSS custom property that the
	 * styling of the picker renders - that way the row keeps the size, the
	 * press handling and the hover state of a plain button.
	 */
	private addSecondaryValue(button: Button, item: Item): void {
		if (!this.getShowSecondaryValues()) {
			return;
		}

		const text = item.isA("sap.ui.core.ListItem")
			? (item as ListItem).getAdditionalText()
			: "";

		if (!text) {
			return;
		}

		button.addStyleClass("sizedPickerItemSecondary");
		button.addEventDelegate({
			onAfterRendering: () => {
				(button.getDomRef() as HTMLElement | null)?.style.setProperty(
					"--sized-picker-secondary-text",
					// a CSS string, so quotes and backslashes have to be escaped
					JSON.stringify(text),
				);
			},
		});
	}

	private createList(items: Item[]): VBox {
		const size = this.getSize();
		const selectedItem = this.getSelectedItem();

		if (items.length === 0) {
			return new VBox({
				items: [
					new Text({ text: "No matching entry", width: "100%" }).addStyleClass(
						"sizedPickerNoData sapUiSmallMargin",
					),
				],
			});
		}

		return new VBox({
			// without Bare the flex box would wrap every row in a div of its own
			renderType: FlexRendertype.Bare,
			items: items.map((item) => {
				const button = new Button({
					text: item.getText(),
					size: size,
					width: "100%",
					press: () => {
						this.selectItem(item);
					},
				});

				button.addStyleClass("sizedPickerItem");
				if (item === selectedItem) {
					button.addStyleClass("sizedPickerItemSelected");
				}
				this.addSecondaryValue(button, item);

				return button;
			}),
		}).addStyleClass("sizedPickerList");
	}

	private selectItem(item: Item): void {
		this.setValue(item.getText());
		this.setProperty("selectedKey", item.getKey(), true);
		this.getPopover().close();

		this.fireSelectionChange({ selectedItem: item, selectedKey: item.getKey() });
		this.fireChange({
			value: item.getText(),
			selectedKey: item.getKey(),
			selectedItem: item,
		});

		this.getInnerInput()?.focus();
	}

	private getPopover(): Popover {
		let popover = this.getAggregation("_popover") as Popover | null;

		if (!popover) {
			popover = new Popover(this.getId() + "-popover", {
				showHeader: false,
				showArrow: false,
				placement: PlacementType.VerticalPreferredBottom,
				// the field keeps the focus, so the user can go on typing while
				// the list is open
				initialFocus: this,
				afterClose: () => {
					this.onPopoverClosed();
				},
			});
			popover.addStyleClass("sizedComboBoxPopover");
			this.setAggregation("_popover", popover, true);
		}

		return popover;
	}

	private onPopoverClosed(): void {
		this.expanded = false;

		const dom = this.getDomRef();
		dom?.setAttribute("aria-expanded", "false");
		dom?.classList.remove("sizedComboBoxExpanded");
	}

	static renderer = {
		apiVersion: 2,
		render(rm: RenderManager, control: ComboBox) {
			const enabled = control.getEnabled();
			const editable = control.getEditable();
			const interactive = enabled && editable;
			const valueState = control.getValueState();

			rm.openStart("div", control);
			rm.class("sizedComboBox");
			rm.class(sizeClass(control.getSize()));

			if (!enabled) {
				rm.class("sizedComboBoxDisabled");
			} else if (!editable) {
				rm.class("sizedComboBoxReadonly");
			}
			if (valueState !== ValueState.None && interactive) {
				rm.class("sizedComboBoxState");
				rm.class(`sizedComboBox${valueState}`);
			}

			if (control.getWidth()) {
				rm.style("width", control.getWidth());
			}

			rm.attr("role", "combobox");
			rm.attr("aria-haspopup", "listbox");
			rm.attr("aria-expanded", "false");
			rm.openEnd();

			rm.voidStart("input", control.getId() + "-inner");
			rm.class("sizedComboBoxInner");
			rm.attr("type", "text");
			rm.attr("autocomplete", "off");
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

			if (editable) {
				rm.openStart("span", control.getId() + "-arrow");
				rm.class("sizedComboBoxArrow");
				rm.openEnd();
				rm.close("span");
			}

			rm.close("div");
		},
	};
}
