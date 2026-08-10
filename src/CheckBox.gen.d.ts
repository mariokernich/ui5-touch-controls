import Event from "sap/ui/base/Event";
import { ValueState } from "sap/ui/core/library";
import { CSSSize } from "sap/ui/core/library";
import { SizeMode } from "ui5/touch/controls/library";
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { $ControlSettings } from "sap/ui/core/Control";

declare module "./CheckBox" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $CheckBoxSettings extends $ControlSettings {

        /**
         * Whether the check box is selected.
         */
        selected?: boolean | PropertyBindingInfo | `{${string}}`;

        /**
         * Whether the check box shows the partially selected state. Only
        takes effect together with <code>selected</code>, and is reset as
        soon as the user toggles the control.
         */
        partiallySelected?: boolean | PropertyBindingInfo | `{${string}}`;

        /**
         * The label shown next to the box.
         */
        text?: string | PropertyBindingInfo;

        /**
         * Indicates whether the user can interact with the control.
         */
        enabled?: boolean | PropertyBindingInfo | `{${string}}`;

        /**
         * Defines whether the check box can be toggled by the user.
         */
        editable?: boolean | PropertyBindingInfo | `{${string}}`;

        /**
         * Visualizes the validation state, e.g. Error, Warning, Success,
        Information. Only shown while the control is enabled and editable.
         */
        valueState?: ValueState | PropertyBindingInfo | `{${string}}`;

        /**
         * Defines whether the label wraps. Without it a long label is
        truncated with an ellipsis.
         */
        wrapping?: boolean | PropertyBindingInfo | `{${string}}`;

        /**
         * Width of the control.
         */
        width?: CSSSize | PropertyBindingInfo | `{${string}}`;

        /**
         * Touch size of the control.
         */
        size?: SizeMode | PropertyBindingInfo | `{${string}}`;

        /**
         * Fired when the user toggles the check box.
         */
        select?: (event: CheckBox$SelectEvent) => void;
    }

    export default interface CheckBox {

        // property: selected

        /**
         * Whether the check box is selected.
         */
        getSelected(): boolean;

        /**
         * Whether the check box is selected.
         */
        setSelected(selected: boolean): this;

        // property: partiallySelected

        /**
         * Whether the check box shows the partially selected state. Only
        takes effect together with <code>selected</code>, and is reset as
        soon as the user toggles the control.
         */
        getPartiallySelected(): boolean;

        /**
         * Whether the check box shows the partially selected state. Only
        takes effect together with <code>selected</code>, and is reset as
        soon as the user toggles the control.
         */
        setPartiallySelected(partiallySelected: boolean): this;

        // property: text

        /**
         * The label shown next to the box.
         */
        getText(): string;

        /**
         * The label shown next to the box.
         */
        setText(text: string): this;

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
         * Defines whether the check box can be toggled by the user.
         */
        getEditable(): boolean;

        /**
         * Defines whether the check box can be toggled by the user.
         */
        setEditable(editable: boolean): this;

        // property: valueState

        /**
         * Visualizes the validation state, e.g. Error, Warning, Success,
        Information. Only shown while the control is enabled and editable.
         */
        getValueState(): ValueState;

        /**
         * Visualizes the validation state, e.g. Error, Warning, Success,
        Information. Only shown while the control is enabled and editable.
         */
        setValueState(valueState: ValueState): this;

        // property: wrapping

        /**
         * Defines whether the label wraps. Without it a long label is
        truncated with an ellipsis.
         */
        getWrapping(): boolean;

        /**
         * Defines whether the label wraps. Without it a long label is
        truncated with an ellipsis.
         */
        setWrapping(wrapping: boolean): this;

        // property: width

        /**
         * Width of the control.
         */
        getWidth(): CSSSize;

        /**
         * Width of the control.
         */
        setWidth(width: CSSSize): this;

        // property: size

        /**
         * Touch size of the control.
         */
        getSize(): SizeMode;

        /**
         * Touch size of the control.
         */
        setSize(size: SizeMode): this;

        // event: select

        /**
         * Fired when the user toggles the check box.
         */
        attachSelect(fn: (event: CheckBox$SelectEvent) => void, listener?: object): this;

        /**
         * Fired when the user toggles the check box.
         */
        attachSelect<CustomDataType extends object>(data: CustomDataType, fn: (event: CheckBox$SelectEvent, data: CustomDataType) => void, listener?: object): this;

        /**
         * Fired when the user toggles the check box.
         */
        detachSelect(fn: (event: CheckBox$SelectEvent) => void, listener?: object): this;

        /**
         * Fired when the user toggles the check box.
         */
        fireSelect(parameters?: CheckBox$SelectEventParameters): this;
    }

    /**
     * Interface describing the parameters of CheckBox's 'select' event.
     * Fired when the user toggles the check box.
     */
    export interface CheckBox$SelectEventParameters {
        selected?: boolean;
    }

    /**
     * Type describing the CheckBox's 'select' event.
     * Fired when the user toggles the check box.
     */
    export type CheckBox$SelectEvent = Event<CheckBox$SelectEventParameters>;
}
