import Item from "sap/ui/core/Item";
import Event from "sap/ui/base/Event";
import { ValueState } from "sap/ui/core/library";
import { CSSSize } from "sap/ui/core/library";
import { SizeMode } from "ui5/touch/controls/library";
import { AggregationBindingInfo } from "sap/ui/base/ManagedObject";
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { $ControlSettings } from "sap/ui/core/Control";

declare module "./ComboBox" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $ComboBoxSettings extends $ControlSettings {

        /**
         * The text in the field. Free text is allowed - without a matching
        item <code>selectedKey</code> is empty.
         */
        value?: string | PropertyBindingInfo;

        /**
         * Key of the selected item, empty when the value matches no item.
         */
        selectedKey?: string | PropertyBindingInfo;

        /**
         * Placeholder text shown while the field is empty.
         */
        placeholder?: string | PropertyBindingInfo;

        /**
         * Indicates whether the user can interact with the control.
         */
        enabled?: boolean | PropertyBindingInfo | `{${string}}`;

        /**
         * Defines whether the value can be changed by the user. A read-only
        combo box shows its value without the arrow.
         */
        editable?: boolean | PropertyBindingInfo | `{${string}}`;

        /**
         * Visualizes the validation state, e.g. Error, Warning, Success,
        Information.
         */
        valueState?: ValueState | PropertyBindingInfo | `{${string}}`;

        /**
         * Width of the field.
         */
        width?: CSSSize | PropertyBindingInfo | `{${string}}`;

        /**
         * Indicates whether the rows of the list show the
        <code>additionalText</code> of their item as a second value at the
        end of the row. Only <code>sap.ui.core.ListItem</code> carries that
        text; plain items are shown without one.
        
        Unlike <code>sap.m.ComboBox</code> the second value is never part
        of what the typed text is matched against - that is what
        <code>filterSecondaryValues</code> does there, and it is not
        supported here.
         */
        showSecondaryValues?: boolean | PropertyBindingInfo | `{${string}}`;

        /**
         * The heading over the list on a phone, where the list takes the
        whole screen and the field it belongs to is behind it. An empty
        title falls back to <code>Select</code>, the way
        <code>sap.m.ComboBox</code> does.
        
        Nothing is shown of it on a larger screen: there the list is a
        popover on the field and needs no heading to say what it is.
         */
        pickerTitle?: string | PropertyBindingInfo;

        /**
         * Touch size of the field and of the rows in the list.
         */
        size?: SizeMode | PropertyBindingInfo | `{${string}}`;

        /**
         * The items of the combo box.
         */
        items?: Item[] | Item | AggregationBindingInfo | `{${string}}`;

        /**
         * Fired when the value is committed - by picking an item, by
        pressing <kbd>Enter</kbd> or when the field loses the focus.
         */
        change?: (event: ComboBox$ChangeEvent) => void;

        /**
         * Fired when the user picks an item from the list.
         */
        selectionChange?: (event: ComboBox$SelectionChangeEvent) => void;
    }

    export default interface ComboBox {

        // property: value

        /**
         * The text in the field. Free text is allowed - without a matching
        item <code>selectedKey</code> is empty.
         */
        getValue(): string;

        /**
         * The text in the field. Free text is allowed - without a matching
        item <code>selectedKey</code> is empty.
         */
        setValue(value: string): this;

        // property: selectedKey

        /**
         * Key of the selected item, empty when the value matches no item.
         */
        getSelectedKey(): string;

        /**
         * Key of the selected item, empty when the value matches no item.
         */
        setSelectedKey(selectedKey: string): this;

        // property: placeholder

        /**
         * Placeholder text shown while the field is empty.
         */
        getPlaceholder(): string;

        /**
         * Placeholder text shown while the field is empty.
         */
        setPlaceholder(placeholder: string): this;

        // property: enabled

        /**
         * Indicates whether the user can interact with the control.
         */
        getEnabled(): boolean;

        /**
         * Indicates whether the user can interact with the control.
         */
        setEnabled(enabled: boolean): this;

        // property: editable

        /**
         * Defines whether the value can be changed by the user. A read-only
        combo box shows its value without the arrow.
         */
        getEditable(): boolean;

        /**
         * Defines whether the value can be changed by the user. A read-only
        combo box shows its value without the arrow.
         */
        setEditable(editable: boolean): this;

        // property: valueState

        /**
         * Visualizes the validation state, e.g. Error, Warning, Success,
        Information.
         */
        getValueState(): ValueState;

        /**
         * Visualizes the validation state, e.g. Error, Warning, Success,
        Information.
         */
        setValueState(valueState: ValueState): this;

        // property: width

        /**
         * Width of the field.
         */
        getWidth(): CSSSize;

        /**
         * Width of the field.
         */
        setWidth(width: CSSSize): this;

        // property: showSecondaryValues

        /**
         * Indicates whether the rows of the list show the
        <code>additionalText</code> of their item as a second value at the
        end of the row. Only <code>sap.ui.core.ListItem</code> carries that
        text; plain items are shown without one.
        
        Unlike <code>sap.m.ComboBox</code> the second value is never part
        of what the typed text is matched against - that is what
        <code>filterSecondaryValues</code> does there, and it is not
        supported here.
         */
        getShowSecondaryValues(): boolean;

        /**
         * Indicates whether the rows of the list show the
        <code>additionalText</code> of their item as a second value at the
        end of the row. Only <code>sap.ui.core.ListItem</code> carries that
        text; plain items are shown without one.
        
        Unlike <code>sap.m.ComboBox</code> the second value is never part
        of what the typed text is matched against - that is what
        <code>filterSecondaryValues</code> does there, and it is not
        supported here.
         */
        setShowSecondaryValues(showSecondaryValues: boolean): this;

        // property: pickerTitle

        /**
         * The heading over the list on a phone, where the list takes the
        whole screen and the field it belongs to is behind it. An empty
        title falls back to <code>Select</code>, the way
        <code>sap.m.ComboBox</code> does.
        
        Nothing is shown of it on a larger screen: there the list is a
        popover on the field and needs no heading to say what it is.
         */
        getPickerTitle(): string;

        /**
         * The heading over the list on a phone, where the list takes the
        whole screen and the field it belongs to is behind it. An empty
        title falls back to <code>Select</code>, the way
        <code>sap.m.ComboBox</code> does.
        
        Nothing is shown of it on a larger screen: there the list is a
        popover on the field and needs no heading to say what it is.
         */
        setPickerTitle(pickerTitle: string): this;

        // property: size

        /**
         * Touch size of the field and of the rows in the list.
         */
        getSize(): SizeMode;

        /**
         * Touch size of the field and of the rows in the list.
         */
        setSize(size: SizeMode): this;

        // aggregation: items

        /**
         * The items of the combo box.
         */
        getItems(): Item[];

        /**
         * The items of the combo box.
         */
        addItem(items: Item): this;

        /**
         * The items of the combo box.
         */
        insertItem(items: Item, index: number): this;

        /**
         * The items of the combo box.
         */
        removeItem(items: number | string | Item): Item | null;

        /**
         * The items of the combo box.
         */
        removeAllItems(): Item[];

        /**
         * The items of the combo box.
         */
        indexOfItem(items: Item): number;

        /**
         * The items of the combo box.
         */
        destroyItems(): this;

        /**
         * The items of the combo box.
         */
        bindItems(bindingInfo: AggregationBindingInfo): this;

        /**
         * The items of the combo box.
         */
        unbindItems(): this;

        // event: change

        /**
         * Fired when the value is committed - by picking an item, by
        pressing <kbd>Enter</kbd> or when the field loses the focus.
         */
        attachChange(fn: (event: ComboBox$ChangeEvent) => void, listener?: object): this;

        /**
         * Fired when the value is committed - by picking an item, by
        pressing <kbd>Enter</kbd> or when the field loses the focus.
         */
        attachChange<CustomDataType extends object>(data: CustomDataType, fn: (event: ComboBox$ChangeEvent, data: CustomDataType) => void, listener?: object): this;

        /**
         * Fired when the value is committed - by picking an item, by
        pressing <kbd>Enter</kbd> or when the field loses the focus.
         */
        detachChange(fn: (event: ComboBox$ChangeEvent) => void, listener?: object): this;

        /**
         * Fired when the value is committed - by picking an item, by
        pressing <kbd>Enter</kbd> or when the field loses the focus.
         */
        fireChange(parameters?: ComboBox$ChangeEventParameters): this;

        // event: selectionChange

        /**
         * Fired when the user picks an item from the list.
         */
        attachSelectionChange(fn: (event: ComboBox$SelectionChangeEvent) => void, listener?: object): this;

        /**
         * Fired when the user picks an item from the list.
         */
        attachSelectionChange<CustomDataType extends object>(data: CustomDataType, fn: (event: ComboBox$SelectionChangeEvent, data: CustomDataType) => void, listener?: object): this;

        /**
         * Fired when the user picks an item from the list.
         */
        detachSelectionChange(fn: (event: ComboBox$SelectionChangeEvent) => void, listener?: object): this;

        /**
         * Fired when the user picks an item from the list.
         */
        fireSelectionChange(parameters?: ComboBox$SelectionChangeEventParameters): this;
    }

    /**
     * Interface describing the parameters of ComboBox's 'change' event.
     * Fired when the value is committed - by picking an item, by
    pressing <kbd>Enter</kbd> or when the field loses the focus.
     */
    export interface ComboBox$ChangeEventParameters {
        value?: string;
        selectedKey?: string;
        selectedItem?: Item;
    }

    /**
     * Interface describing the parameters of ComboBox's 'selectionChange' event.
     * Fired when the user picks an item from the list.
     */
    export interface ComboBox$SelectionChangeEventParameters {
        selectedItem?: Item;
        selectedKey?: string;
    }

    /**
     * Type describing the ComboBox's 'change' event.
     * Fired when the value is committed - by picking an item, by
    pressing <kbd>Enter</kbd> or when the field loses the focus.
     */
    export type ComboBox$ChangeEvent = Event<ComboBox$ChangeEventParameters>;

    /**
     * Type describing the ComboBox's 'selectionChange' event.
     * Fired when the user picks an item from the list.
     */
    export type ComboBox$SelectionChangeEvent = Event<ComboBox$SelectionChangeEventParameters>;
}
