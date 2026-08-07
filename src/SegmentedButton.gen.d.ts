import SegmentedButtonItem from "ui5/touch/controls/SegmentedButtonItem";
import Event from "sap/ui/base/Event";
import { CSSSize } from "sap/ui/core/library";
import { SizeMode } from "ui5/touch/controls/library";
import { ButtonType } from "sap/m/library";
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { AggregationBindingInfo } from "sap/ui/base/ManagedObject";
import { $ControlSettings } from "sap/ui/core/Control";

declare module "./SegmentedButton" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $SegmentedButtonSettings extends $ControlSettings {

        /**
         * Width of the whole control. If set, the segments share it evenly.
         */
        width?: CSSSize | PropertyBindingInfo | `{${string}}`;

        /**
         * Indicates whether the user can interact with the control.
         */
        enabled?: boolean | PropertyBindingInfo | `{${string}}`;

        /**
         * Key of the selected item. Defaults to the first item.
         */
        selectedKey?: string | PropertyBindingInfo;

        /**
         * Touch size applied to all segments together.
         */
        size?: SizeMode | PropertyBindingInfo | `{${string}}`;

        /**
         * Type used for the selected segment. The other segments stay
        neutral, so the selection stays visible with every type - with
        the default type the selected segment uses the theme's selected
        colours instead.
         */
        buttonType?: ButtonType | PropertyBindingInfo | `{${string}}`;

        /**
         * The segments of the control.
         */
        items?: SegmentedButtonItem[] | SegmentedButtonItem | AggregationBindingInfo | `{${string}}`;

        /**
         * Fired when the user selects a segment.
         */
        selectionChange?: (event: SegmentedButton$SelectionChangeEvent) => void;
    }

    export default interface SegmentedButton {

        // property: width

        /**
         * Width of the whole control. If set, the segments share it evenly.
         */
        getWidth(): CSSSize;

        /**
         * Width of the whole control. If set, the segments share it evenly.
         */
        setWidth(width: CSSSize): this;

        // property: enabled

        /**
         * Indicates whether the user can interact with the control.
         */
        getEnabled(): boolean;

        /**
         * Indicates whether the user can interact with the control.
         */
        setEnabled(enabled: boolean): this;

        // property: selectedKey

        /**
         * Key of the selected item. Defaults to the first item.
         */
        getSelectedKey(): string;

        /**
         * Key of the selected item. Defaults to the first item.
         */
        setSelectedKey(selectedKey: string): this;

        // property: size

        /**
         * Touch size applied to all segments together.
         */
        getSize(): SizeMode;

        /**
         * Touch size applied to all segments together.
         */
        setSize(size: SizeMode): this;

        // property: buttonType

        /**
         * Type used for the selected segment. The other segments stay
        neutral, so the selection stays visible with every type - with
        the default type the selected segment uses the theme's selected
        colours instead.
         */
        getButtonType(): ButtonType;

        /**
         * Type used for the selected segment. The other segments stay
        neutral, so the selection stays visible with every type - with
        the default type the selected segment uses the theme's selected
        colours instead.
         */
        setButtonType(buttonType: ButtonType): this;

        // aggregation: items

        /**
         * The segments of the control.
         */
        getItems(): SegmentedButtonItem[];

        /**
         * The segments of the control.
         */
        addItem(items: SegmentedButtonItem): this;

        /**
         * The segments of the control.
         */
        insertItem(items: SegmentedButtonItem, index: number): this;

        /**
         * The segments of the control.
         */
        removeItem(items: number | string | SegmentedButtonItem): SegmentedButtonItem | null;

        /**
         * The segments of the control.
         */
        removeAllItems(): SegmentedButtonItem[];

        /**
         * The segments of the control.
         */
        indexOfItem(items: SegmentedButtonItem): number;

        /**
         * The segments of the control.
         */
        destroyItems(): this;

        // event: selectionChange

        /**
         * Fired when the user selects a segment.
         */
        attachSelectionChange(fn: (event: SegmentedButton$SelectionChangeEvent) => void, listener?: object): this;

        /**
         * Fired when the user selects a segment.
         */
        attachSelectionChange<CustomDataType extends object>(data: CustomDataType, fn: (event: SegmentedButton$SelectionChangeEvent, data: CustomDataType) => void, listener?: object): this;

        /**
         * Fired when the user selects a segment.
         */
        detachSelectionChange(fn: (event: SegmentedButton$SelectionChangeEvent) => void, listener?: object): this;

        /**
         * Fired when the user selects a segment.
         */
        fireSelectionChange(parameters?: SegmentedButton$SelectionChangeEventParameters): this;
    }

    /**
     * Interface describing the parameters of SegmentedButton's 'selectionChange' event.
     * Fired when the user selects a segment.
     */
    export interface SegmentedButton$SelectionChangeEventParameters {
        item?: SegmentedButtonItem;
        key?: string;
    }

    /**
     * Type describing the SegmentedButton's 'selectionChange' event.
     * Fired when the user selects a segment.
     */
    export type SegmentedButton$SelectionChangeEvent = Event<SegmentedButton$SelectionChangeEventParameters>;
}
