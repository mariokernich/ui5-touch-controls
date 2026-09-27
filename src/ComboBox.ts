import type ResponsivePopover from "sap/m/ResponsivePopover";
import Device from "sap/ui/Device";
import Text from "sap/m/Text";
import VBox from "sap/m/VBox";
import Control from "sap/ui/core/Control";
import type Item from "sap/ui/core/Item";
import type ListItem from "sap/ui/core/ListItem";
import RenderManager from "sap/ui/core/RenderManager";
import { getText } from "./i18n";
import { MetadataOptions } from "sap/ui/core/Element";
import { ValueState } from "sap/ui/core/library";
import type Button from "./Button";
import Input from "./Input";
import Toolbar from "./Toolbar";
import { ISized, SizeMode, sizeClass } from "./library";
import { createPickerList, createPickerPopover, setPickerHeader } from "./picker";

/**
 * A simplified variant of <code>sap.m.ComboBox</code> for touch devices.
 *
 * A {@link ui5.touch.controls.Select} the user can type into: the field takes
 * free text, and what is typed filters the list. The list is the same popover
 * of the library's own buttons, so a row is as high as the field and can be
 * hit with a finger - which also makes the control work together with
 * {@link ui5.touch.controls.Keyboard} on a device without a keyboard.
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
 * </ul>
 *
 * On a phone the list takes the whole screen, the way
 * <code>sap.m.ComboBox</code> does. The field is behind it there, so the
 * picker brings a field of its own to go on typing in, and the OK button in
 * its bar leads back.
 *
 * @namespace ui5.touch.controls
 */
export default class ComboBox extends Control implements ISized {
	/** whether the list is open, which the field shows as well */
	private expanded = false;
	// Written by init and by setValue, which the constructor of the base class
	// calls - that is, before the field declarations of this class are
	// applied. Declared, it is a type and nothing else, so nothing is written
	// over what was put there.
	/** the value the last change event was fired for, see commitChange */
	private declare lastChangeValue: string;

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
			 * The heading over the list on a phone, where the list takes the
			 * whole screen and the field it belongs to is behind it. An empty
			 * title falls back to <code>Select</code> in the language the
			 * application runs in, the way <code>sap.m.ComboBox</code> does.
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
				type: "sap.m.ResponsivePopover",
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

	init(): void {
		this.lastChangeValue = "";
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
	 *
	 * A value set from the outside is not a change of the user: it fires no
	 * <code>change</code>, now or when the focus leaves.
	 */
	setValue(value: string): this {
		this.applyValue(value);
		this.lastChangeValue = this.getValue();

		return this;
	}

	/** Takes over a value without re-rendering the field. */
	private applyValue(value: string): void {
		this.setProperty("value", value, true);

		const input = this.getInnerInput();
		if (input && input.value !== this.getValue()) {
			input.value = this.getValue();
		}
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
		return this.getDomRef("inner") as HTMLInputElement | null;
	}

	/**
	 * The inner input element is what the user types into, so it is also what
	 * gets the focus.
	 */
	getFocusDomRef(): Element | null {
		return this.getInnerInput() ?? super.getFocusDomRef();
	}

	/**
	 * A label points at the native input, so a tap on the label puts the
	 * caret into the field.
	 */
	getIdForLabel(): string {
		return this.getId() + "-inner";
	}

	private isInteractive(): boolean {
		return this.getEnabled() && this.getEditable();
	}

	oninput(): void {
		const input = this.getInnerInput();

		if (!input) {
			return;
		}

		this.setProperty("value", input.value, true);
		this.setProperty("selectedKey", this.getSelectedItem()?.getKey() ?? "", true);
		this.openPicker();
	}

	/** the browser's change: Enter, or the focus leaving after typing */
	onchange(): void {
		this.commitChange();
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
		// the browser fires its change after this; commitChange lets only one
		// of the two through
		this.commitChange();
	}

	onsapdown(): void {
		if (this.isInteractive() && !this.expanded) {
			this.openPicker(true);
		}
	}

	/**
	 * Fires <code>change</code> if the value differs from the one the last
	 * change was fired for. The browser, the Enter key and the picker of a
	 * phone all end up here, and one edit is reported once.
	 */
	private commitChange(): void {
		const value = this.getValue();

		if (value === this.lastChangeValue) {
			return;
		}

		const item = this.getSelectedItem();

		this.lastChangeValue = value;
		this.setProperty("selectedKey", item?.getKey() ?? "", true);
		this.fireChange({
			value: value,
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

		this.renderList(showAll);
		// on a phone the picker is a dialog of its own and takes the screen
		if (!Device.system.phone) {
			popover.setContentWidth(`${dom.offsetWidth}px`);
		}

		if (this.expanded) {
			return;
		}

		if (Device.system.phone) {
			// built anew for every opening, so both carry the size the control
			// has now and the field starts on its current value. It says OK
			// rather than Cancel because what is typed into the field below is
			// taken over as it is typed - there is nothing left to undo by then.
			setPickerHeader(
				popover,
				this.getPickerTitle() || getText("PICKER_TITLE"),
				getText("COMBOBOX_OK"),
				this.getSize(),
			);
			popover.destroySubHeader();
			popover.setSubHeader(this.createPickerFilter());
		}

		this.setExpanded(true);
		popover.openBy(this);
	}

	/**
	 * Puts the items matching the current value into the popover.
	 */
	private renderList(showAll: boolean): void {
		const popover = this.getPopover();

		popover.destroyContent();
		popover.addContent(this.createList(this.getFilteredItems(showAll)));
	}

	/**
	 * The field a phone picker is typed into.
	 *
	 * The field of the control itself is behind the picker there, so without
	 * one of its own the list could only be picked from, not filtered - which
	 * is what tells a combo box from a select.
	 */
	private createPickerFilter(): Toolbar {
		return new Toolbar({
			content: [
				new Input({
					value: this.getValue(),
					placeholder: this.getPlaceholder(),
					size: this.getSize(),
					width: "100%",
					liveChange: (event) => {
						// what is typed here is the user's, so it is not taken
						// over as a value set from the outside - the change it
						// stands for is reported when the picker closes
						this.applyValue(event.getParameter("value") ?? "");
						this.setProperty(
							"selectedKey",
							this.getSelectedItem()?.getKey() ?? "",
							true,
						);
						this.renderList(false);
					},
				}),
			],
		});
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
		if (items.length === 0) {
			return new VBox({
				items: [
					new Text({
						text: getText("COMBOBOX_NO_MATCHING_ENTRY"),
						width: "100%",
					}).addStyleClass("sizedPickerNoData sapUiSmallMargin"),
				],
			});
		}

		return createPickerList(items, {
			size: this.getSize(),
			selectedItem: this.getSelectedItem(),
			select: (item) => {
				this.selectItem(item);
			},
			decorate: (button, item) => {
				this.addSecondaryValue(button, item);
			},
		});
	}

	private selectItem(item: Item): void {
		this.applyValue(item.getText());
		this.setProperty("selectedKey", item.getKey(), true);
		this.getPopover().close();

		this.fireSelectionChange({ selectedItem: item, selectedKey: item.getKey() });
		// the item that was picked is the one reported, not the first one with
		// the same text
		if (this.getValue() !== this.lastChangeValue) {
			this.lastChangeValue = this.getValue();
			this.fireChange({
				value: this.getValue(),
				selectedKey: item.getKey(),
				selectedItem: item,
			});
		}

		// on a phone the focus would bring up the keyboard of the device over
		// the list the user has just picked from
		if (!Device.system.phone) {
			this.getInnerInput()?.focus();
		}
	}

	private getPopover(): ResponsivePopover {
		return (
			(this.getAggregation("_popover") as ResponsivePopover | null) ??
			createPickerPopover(this, {
				styleClass: "sizedComboBoxPopover",
				// the field keeps the focus, so the user can go on typing while
				// the list is open - on a phone it is behind the picker, which
				// brings a field of its own instead
				initialFocus: Device.system.phone ? undefined : this,
				afterClose: () => {
					this.onPopoverClosed();
				},
			})
		);
	}

	private onPopoverClosed(): void {
		this.setExpanded(false);

		// what was typed into the picker of a phone never reaches the field
		// itself, so the change it stands for is reported from here
		if (Device.system.phone) {
			this.commitChange();
		}
	}

	/**
	 * Shows whether the list is open, without a re-rendering. The renderer
	 * reads the same state, so a rendering while the list is open keeps it.
	 */
	private setExpanded(expanded: boolean): void {
		this.expanded = expanded;

		const dom = this.getDomRef();
		dom?.setAttribute("aria-expanded", `${expanded}`);
		dom?.classList.toggle("sizedComboBoxExpanded", expanded);
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
			if (control.expanded) {
				rm.class("sizedComboBoxExpanded");
			}

			if (control.getWidth()) {
				rm.style("width", control.getWidth());
			}

			rm.attr("role", "combobox");
			rm.attr("aria-haspopup", "listbox");
			rm.attr("aria-expanded", `${control.expanded}`);
			rm.openEnd();

			rm.voidStart("input", control.getId() + "-inner");
			rm.class("sizedComboBoxInner");
			rm.attr("type", "text");
			rm.attr("autocomplete", "off");
			// always written, an empty one included: patching an input puts
			// the value attribute into what the field shows
			rm.attr("value", control.getValue());
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
