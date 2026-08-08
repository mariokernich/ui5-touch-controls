import Item from "sap/ui/core/Item";
import Event from "sap/ui/base/Event";
import { ValueState } from "sap/ui/core/library";
import { CSSSize } from "sap/ui/core/library";
import { SizeMode } from "ui5/touch/controls/library";
import { AggregationBindingInfo } from "sap/ui/base/ManagedObject";
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { $ControlSettings } from "sap/ui/core/Control";

declare module "./Select" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $SelectSettings extends $ControlSettings {

        /**
         * Key of the selected item. Without a match the first item is
        selected, see <code>forceSelection</code>.
         */
        selectedKey?: string | PropertyBindingInfo;

        /**
         * Indicates whether the user can interact with the control.
         */
        enabled?: boolean | PropertyBindingInfo | `{${string}}`;

        /**
         * Defines whether the selection can be changed by the user. A
        read-only select shows its value without the arrow.
         */
        editable?: boolean | PropertyBindingInfo | `{${string}}`;

        /**
         * Selects the first item when <code>selectedKey</code> matches no
        item.
         */
        forceSelection?: boolean | PropertyBindingInfo | `{${string}}`;

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
         * Touch size of the field and of the rows in the list.
         */
        size?: SizeMode | PropertyBindingInfo | `{${string}}`;

        /**
         * The items of the select.
         */
        items?: Item[] | Item | AggregationBindingInfo | `{${string}}`;

        /**
         * Fired when the user selects another item.
         */
        change?: (event: Select$ChangeEvent) => void;
    }

    export default interface Select {

        // property: selectedKey

        /**
         * Key of the selected item. Without a match the first item is
        selected, see <code>forceSelection</code>.
         */
        getSelectedKey(): string;

        /**
         * Key of the selected item. Without a match the first item is
        selected, see <code>forceSelection</code>.
         */
        setSelectedKey(selectedKey: string): this;

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
         * Defines whether the selection can be changed by the user. A
        read-only select shows its value without the arrow.
         */
        getEditable(): boolean;

        /**
         * Defines whether the selection can be changed by the user. A
        read-only select shows its value without the arrow.
         */
        setEditable(editable: boolean): this;

        // property: forceSelection

        /**
         * Selects the first item when <code>selectedKey</code> matches no
        item.
         */
        getForceSelection(): boolean;

        /**
         * Selects the first item when <code>selectedKey</code> matches no
        item.
         */
        setForceSelection(forceSelection: boolean): this;

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
         * The items of the select.
         */
        getItems(): Item[];

        /**
         * The items of the select.
         */
        addItem(items: Item): this;

        /**
         * The items of the select.
         */
        insertItem(items: Item, index: number): this;

        /**
         * The items of the select.
         */
        removeItem(items: number | string | Item): Item | null;

        /**
         * The items of the select.
         */
        removeAllItems(): Item[];

        /**
         * The items of the select.
         */
        indexOfItem(items: Item): number;

        /**
         * The items of the select.
         */
        destroyItems(): this;

        /**
         * The items of the select.
         */
        bindItems(bindingInfo: AggregationBindingInfo): this;

        /**
         * The items of the select.
         */
        unbindItems(): this;

        // event: change

        /**
         * Fired when the user selects another item.
         */
        attachChange(fn: (event: Select$ChangeEvent) => void, listener?: object): this;

        /**
         * Fired when the user selects another item.
         */
        attachChange<CustomDataType extends object>(data: CustomDataType, fn: (event: Select$ChangeEvent, data: CustomDataType) => void, listener?: object): this;

        /**
         * Fired when the user selects another item.
         */
        detachChange(fn: (event: Select$ChangeEvent) => void, listener?: object): this;

        /**
         * Fired when the user selects another item.
         */
        fireChange(parameters?: Select$ChangeEventParameters): this;
    }

    /**
     * Interface describing the parameters of Select's 'change' event.
     * Fired when the user selects another item.
     */
    export interface Select$ChangeEventParameters {
        selectedItem?: Item;
        selectedKey?: string;
    }

    /**
     * Type describing the Select's 'change' event.
     * Fired when the user selects another item.
     */
    export type Select$ChangeEvent = Event<Select$ChangeEventParameters>;
}
