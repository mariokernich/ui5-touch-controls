import Event from "sap/ui/base/Event";
import { ValueState } from "sap/ui/core/library";
import { CSSSize } from "sap/ui/core/library";
import { SizeMode } from "ui5/touch/controls/library";
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { $ControlSettings } from "sap/ui/core/Control";

declare module "./DatePicker" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $DatePickerSettings extends $ControlSettings {

        /**
         * The date as a string, in <code>valueFormat</code>.
         */
        value?: string | PropertyBindingInfo;

        /**
         * The date as a <code>Date</code> object.
         */
        dateValue?: (object | null) | PropertyBindingInfo | `{${string}}`;

        /**
         * Format of <code>value</code>, e.g. <code>yyyy-MM-dd</code>. This
        is what a model sees.
         */
        valueFormat?: string | PropertyBindingInfo;

        /**
         * Format shown in the field. Besides a pattern the styles
        <code>short</code>, <code>medium</code>, <code>long</code> and
        <code>full</code> are accepted, which follow the current locale.
         */
        displayFormat?: string | PropertyBindingInfo;

        /**
         * Earliest date that can be selected.
         */
        minDate?: (object | null) | PropertyBindingInfo | `{${string}}`;

        /**
         * Latest date that can be selected.
         */
        maxDate?: (object | null) | PropertyBindingInfo | `{${string}}`;

        /**
         * Placeholder text shown while the field is empty.
         */
        placeholder?: string | PropertyBindingInfo;

        /**
         * Indicates whether the user can interact with the control.
         */
        enabled?: boolean | PropertyBindingInfo | `{${string}}`;

        /**
         * Defines whether the date can be changed by the user. A read-only
        date picker shows its value without the icon.
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
         * Touch size of the field and of the days in the calendar.
         */
        size?: SizeMode | PropertyBindingInfo | `{${string}}`;

        /**
         * Fired when the date is changed - by picking a day or by typing
        into the field.
         */
        change?: (event: DatePicker$ChangeEvent) => void;
    }

    export default interface DatePicker {

        // property: value

        /**
         * The date as a string, in <code>valueFormat</code>.
         */
        getValue(): string;

        /**
         * The date as a string, in <code>valueFormat</code>.
         */
        setValue(value: string): this;

        // property: dateValue

        /**
         * The date as a <code>Date</code> object.
         */
        getDateValue(): object | null;

        /**
         * The date as a <code>Date</code> object.
         */
        setDateValue(dateValue: object | null): this;

        // property: valueFormat

        /**
         * Format of <code>value</code>, e.g. <code>yyyy-MM-dd</code>. This
        is what a model sees.
         */
        getValueFormat(): string;

        /**
         * Format of <code>value</code>, e.g. <code>yyyy-MM-dd</code>. This
        is what a model sees.
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

        // property: minDate

        /**
         * Earliest date that can be selected.
         */
        getMinDate(): object | null;

        /**
         * Earliest date that can be selected.
         */
        setMinDate(minDate: object | null): this;

        // property: maxDate

        /**
         * Latest date that can be selected.
         */
        getMaxDate(): object | null;

        /**
         * Latest date that can be selected.
         */
        setMaxDate(maxDate: object | null): this;

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
         * Defines whether the date can be changed by the user. A read-only
        date picker shows its value without the icon.
         */
        getEditable(): boolean;

        /**
         * Defines whether the date can be changed by the user. A read-only
        date picker shows its value without the icon.
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
         * Touch size of the field and of the days in the calendar.
         */
        getSize(): SizeMode;

        /**
         * Touch size of the field and of the days in the calendar.
         */
        setSize(size: SizeMode): this;

        // event: change

        /**
         * Fired when the date is changed - by picking a day or by typing
        into the field.
         */
        attachChange(fn: (event: DatePicker$ChangeEvent) => void, listener?: object): this;

        /**
         * Fired when the date is changed - by picking a day or by typing
        into the field.
         */
        attachChange<CustomDataType extends object>(data: CustomDataType, fn: (event: DatePicker$ChangeEvent, data: CustomDataType) => void, listener?: object): this;

        /**
         * Fired when the date is changed - by picking a day or by typing
        into the field.
         */
        detachChange(fn: (event: DatePicker$ChangeEvent) => void, listener?: object): this;

        /**
         * Fired when the date is changed - by picking a day or by typing
        into the field.
         */
        fireChange(parameters?: DatePicker$ChangeEventParameters): this;
    }

    /**
     * Interface describing the parameters of DatePicker's 'change' event.
     * Fired when the date is changed - by picking a day or by typing
    into the field.
     */
    export interface DatePicker$ChangeEventParameters {
        value?: string;
        dateValue?: object | null;
        valid?: boolean;
    }

    /**
     * Type describing the DatePicker's 'change' event.
     * Fired when the date is changed - by picking a day or by typing
    into the field.
     */
    export type DatePicker$ChangeEvent = Event<DatePicker$ChangeEventParameters>;
}
