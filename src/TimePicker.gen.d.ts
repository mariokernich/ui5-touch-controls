import Event from "sap/ui/base/Event";
import { ValueState } from "sap/ui/core/library";
import { CSSSize } from "sap/ui/core/library";
import { SizeMode } from "ui5/touch/controls/library";
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { $ControlSettings } from "sap/ui/core/Control";

declare module "./TimePicker" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $TimePickerSettings extends $ControlSettings {

        /**
         * The time as a string, in <code>valueFormat</code>.
         */
        value?: string | PropertyBindingInfo;

        /**
         * The time as a <code>Date</code> object. Only the time part is
        evaluated.
         */
        dateValue?: (object | null) | PropertyBindingInfo | `{${string}}`;

        /**
         * Format of <code>value</code>. This is what a model sees.
         */
        valueFormat?: string | PropertyBindingInfo;

        /**
         * Format shown in the field. Besides a pattern the styles
        <code>short</code>, <code>medium</code>, <code>long</code> and
        <code>full</code> are accepted, which follow the current locale.
         */
        displayFormat?: string | PropertyBindingInfo;

        /**
         * Step of the minutes column, e.g. <code>5</code> for a column of
        00, 05, 10 ...
         */
        minutesStep?: number | PropertyBindingInfo | `{${string}}`;

        /**
         * Placeholder text shown while the field is empty.
         */
        placeholder?: string | PropertyBindingInfo;

        /**
         * Indicates whether the user can interact with the control.
         */
        enabled?: boolean | PropertyBindingInfo | `{${string}}`;

        /**
         * Defines whether the time can be changed by the user. A read-only
        time picker shows its value without the icon.
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
         * Touch size of the field and of the entries in the columns.
         */
        size?: SizeMode | PropertyBindingInfo | `{${string}}`;

        /**
         * Fired when the time is changed - after picking in the popover or
        by typing into the field.
         */
        change?: (event: TimePicker$ChangeEvent) => void;
    }

    export default interface TimePicker {

        // property: value

        /**
         * The time as a string, in <code>valueFormat</code>.
         */
        getValue(): string;

        /**
         * The time as a string, in <code>valueFormat</code>.
         */
        setValue(value: string): this;

        // property: dateValue

        /**
         * The time as a <code>Date</code> object. Only the time part is
        evaluated.
         */
        getDateValue(): object | null;

        /**
         * The time as a <code>Date</code> object. Only the time part is
        evaluated.
         */
        setDateValue(dateValue: object | null): this;

        // property: valueFormat

        /**
         * Format of <code>value</code>. This is what a model sees.
         */
        getValueFormat(): string;

        /**
         * Format of <code>value</code>. This is what a model sees.
         */
        setValueFormat(valueFormat: string): this;

        // property: displayFormat

        /**
         * Format shown in the field. Besides a pattern the styles
        <code>short</code>, <code>medium</code>, <code>long</code> and
        <code>full</code> are accepted, which follow the current locale.
         */
        getDisplayFormat(): string;

        /**
         * Format shown in the field. Besides a pattern the styles
        <code>short</code>, <code>medium</code>, <code>long</code> and
        <code>full</code> are accepted, which follow the current locale.
         */
        setDisplayFormat(displayFormat: string): this;

        // property: minutesStep

        /**
         * Step of the minutes column, e.g. <code>5</code> for a column of
        00, 05, 10 ...
         */
        getMinutesStep(): number;

        /**
         * Step of the minutes column, e.g. <code>5</code> for a column of
        00, 05, 10 ...
         */
        setMinutesStep(minutesStep: number): this;

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
         * Defines whether the time can be changed by the user. A read-only
        time picker shows its value without the icon.
         */
        getEditable(): boolean;

        /**
         * Defines whether the time can be changed by the user. A read-only
        time picker shows its value without the icon.
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

        // property: size

        /**
         * Touch size of the field and of the entries in the columns.
         */
        getSize(): SizeMode;

        /**
         * Touch size of the field and of the entries in the columns.
         */
        setSize(size: SizeMode): this;

        // event: change

        /**
         * Fired when the time is changed - after picking in the popover or
        by typing into the field.
         */
        attachChange(fn: (event: TimePicker$ChangeEvent) => void, listener?: object): this;

        /**
         * Fired when the time is changed - after picking in the popover or
        by typing into the field.
         */
        attachChange<CustomDataType extends object>(data: CustomDataType, fn: (event: TimePicker$ChangeEvent, data: CustomDataType) => void, listener?: object): this;

        /**
         * Fired when the time is changed - after picking in the popover or
        by typing into the field.
         */
        detachChange(fn: (event: TimePicker$ChangeEvent) => void, listener?: object): this;

        /**
         * Fired when the time is changed - after picking in the popover or
        by typing into the field.
         */
        fireChange(parameters?: TimePicker$ChangeEventParameters): this;
    }

    /**
     * Interface describing the parameters of TimePicker's 'change' event.
     * Fired when the time is changed - after picking in the popover or
    by typing into the field.
     */
    export interface TimePicker$ChangeEventParameters {
        value?: string;
        dateValue?: object | null;
        valid?: boolean;
    }

    /**
     * Type describing the TimePicker's 'change' event.
     * Fired when the time is changed - after picking in the popover or
    by typing into the field.
     */
    export type TimePicker$ChangeEvent = Event<TimePicker$ChangeEventParameters>;
}
