import Event from "sap/ui/base/Event";
import { ValueState } from "sap/ui/core/library";
import { CSSSize } from "sap/ui/core/library";
import { SizeMode } from "ui5/touch/controls/library";
import RadioButton from "ui5/touch/controls/RadioButton";
import { AggregationBindingInfo } from "sap/ui/base/ManagedObject";
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { $ControlSettings } from "sap/ui/core/Control";

declare module "./RadioButtonGroup" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $RadioButtonGroupSettings extends $ControlSettings {

        /**
         * Number of columns the buttons are distributed over.
         */
        columns?: number | PropertyBindingInfo | `{${string}}`;

        /**
         * Index of the selected button, <code>-1</code> for no selection.
         */
        selectedIndex?: number | PropertyBindingInfo | `{${string}}`;

        /**
         * Indicates whether the user can interact with the buttons.
         */
        enabled?: boolean | PropertyBindingInfo | `{${string}}`;

        /**
         * Defines whether the selection can be changed by the user.
         */
        editable?: boolean | PropertyBindingInfo | `{${string}}`;

        /**
         * Visualizes the validation state of all buttons.
         */
        valueState?: ValueState | PropertyBindingInfo | `{${string}}`;

        /**
         * Width of the group.
         */
        width?: CSSSize | PropertyBindingInfo | `{${string}}`;

        /**
         * Touch size of all buttons of the group.
         */
        size?: SizeMode | PropertyBindingInfo | `{${string}}`;

        /**
         * The buttons of the group.
         */
        buttons?: RadioButton[] | RadioButton | AggregationBindingInfo | `{${string}}`;

        /**
         * Fired when the user selects another button.
         */
        select?: (event: RadioButtonGroup$SelectEvent) => void;
    }

    export default interface RadioButtonGroup {

        // property: columns

        /**
         * Number of columns the buttons are distributed over.
         */
        getColumns(): number;

        /**
         * Number of columns the buttons are distributed over.
         */
        setColumns(columns: number): this;

        // property: selectedIndex

        /**
         * Index of the selected button, <code>-1</code> for no selection.
         */
        getSelectedIndex(): number;

        /**
         * Index of the selected button, <code>-1</code> for no selection.
         */
        setSelectedIndex(selectedIndex: number): this;

        // property: enabled

        /**
         * Indicates whether the user can interact with the buttons.
         */
        getEnabled(): boolean;

        /**
         * Indicates whether the user can interact with the buttons.
         */
        setEnabled(enabled: boolean): this;

        // property: editable

        /**
         * Defines whether the selection can be changed by the user.
         */
        getEditable(): boolean;

        /**
         * Defines whether the selection can be changed by the user.
         */
        setEditable(editable: boolean): this;

        // property: valueState

        /**
         * Visualizes the validation state of all buttons.
         */
        getValueState(): ValueState;

        /**
         * Visualizes the validation state of all buttons.
         */
        setValueState(valueState: ValueState): this;

        // property: width

        /**
         * Width of the group.
         */
        getWidth(): CSSSize;

        /**
         * Width of the group.
         */
        setWidth(width: CSSSize): this;

        // property: size

        /**
         * Touch size of all buttons of the group.
         */
        getSize(): SizeMode;

        /**
         * Touch size of all buttons of the group.
         */
        setSize(size: SizeMode): this;

        // aggregation: buttons

        /**
         * The buttons of the group.
         */
        getButtons(): RadioButton[];

        /**
         * The buttons of the group.
         */
        addButton(buttons: RadioButton): this;

        /**
         * The buttons of the group.
         */
        insertButton(buttons: RadioButton, index: number): this;

        /**
         * The buttons of the group.
         */
        removeButton(buttons: number | string | RadioButton): RadioButton | null;

        /**
         * The buttons of the group.
         */
        removeAllButtons(): RadioButton[];

        /**
         * The buttons of the group.
         */
        indexOfButton(buttons: RadioButton): number;

        /**
         * The buttons of the group.
         */
        destroyButtons(): this;

        /**
         * The buttons of the group.
         */
        bindButtons(bindingInfo: AggregationBindingInfo): this;

        /**
         * The buttons of the group.
         */
        unbindButtons(): this;

        // event: select

        /**
         * Fired when the user selects another button.
         */
        attachSelect(fn: (event: RadioButtonGroup$SelectEvent) => void, listener?: object): this;

        /**
         * Fired when the user selects another button.
         */
        attachSelect<CustomDataType extends object>(data: CustomDataType, fn: (event: RadioButtonGroup$SelectEvent, data: CustomDataType) => void, listener?: object): this;

        /**
         * Fired when the user selects another button.
         */
        detachSelect(fn: (event: RadioButtonGroup$SelectEvent) => void, listener?: object): this;

        /**
         * Fired when the user selects another button.
         */
        fireSelect(parameters?: RadioButtonGroup$SelectEventParameters): this;
    }

    /**
     * Interface describing the parameters of RadioButtonGroup's 'select' event.
     * Fired when the user selects another button.
     */
    export interface RadioButtonGroup$SelectEventParameters {
        selectedIndex?: number;
    }

    /**
     * Type describing the RadioButtonGroup's 'select' event.
     * Fired when the user selects another button.
     */
    export type RadioButtonGroup$SelectEvent = Event<RadioButtonGroup$SelectEventParameters>;
}
