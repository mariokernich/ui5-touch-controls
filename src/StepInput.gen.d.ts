import Event from "sap/ui/base/Event";
import { SizeMode } from "ui5/touch/controls/library";
import { ButtonType } from "sap/m/library";
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { $ControlSettings } from "sap/ui/core/Control";

declare module "./QuantityPicker" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $QuantityPickerSettings extends $ControlSettings {

        /**
         * The current quantity value.
         */
        value?: number | PropertyBindingInfo | `{${string}}`;

        /**
         * The minimum allowed value.
         */
        min?: number | PropertyBindingInfo | `{${string}}`;

        /**
         * The maximum allowed value.
         */
        max?: number | PropertyBindingInfo | `{${string}}`;

        /**
         * The amount by which the value is increased or decreased.
         */
        step?: number | PropertyBindingInfo | `{${string}}`;

        /**
         * Indicates whether the user can interact with the control.
         */
        enabled?: boolean | PropertyBindingInfo | `{${string}}`;

        /**
         * Defines whether the value can be typed into the input directly.
         */
        editable?: boolean | PropertyBindingInfo | `{${string}}`;

        /**
         * Touch size applied to the buttons and the input together.
         */
        size?: SizeMode | PropertyBindingInfo | `{${string}}`;

        /**
         * Type applied to the minus and plus buttons.
         */
        buttonType?: ButtonType | PropertyBindingInfo | `{${string}}`;

        /**
         * Fired when the value has been changed by user interaction
        (button press or direct input).
         */
        change?: (event: QuantityPicker$ChangeEvent) => void;
    }

    export default interface QuantityPicker {

        // property: value

        /**
         * The current quantity value.
         */
        getValue(): number;

        /**
         * The current quantity value.
         */
        setValue(value: number): this;

        // property: min

        /**
         * The minimum allowed value.
         */
        getMin(): number;

        /**
         * The minimum allowed value.
         */
        setMin(min: number): this;

        // property: max

        /**
         * The maximum allowed value.
         */
        getMax(): number;

        /**
         * The maximum allowed value.
         */
        setMax(max: number): this;

        // property: step

        /**
         * The amount by which the value is increased or decreased.
         */
        getStep(): number;

        /**
         * The amount by which the value is increased or decreased.
         */
        setStep(step: number): this;

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
         * Defines whether the value can be typed into the input directly.
         */
        getEditable(): boolean;

        /**
         * Defines whether the value can be typed into the input directly.
         */
        setEditable(editable: boolean): this;

        // property: size

        /**
         * Touch size applied to the buttons and the input together.
         */
        getSize(): SizeMode;

        /**
         * Touch size applied to the buttons and the input together.
         */
        setSize(size: SizeMode): this;

        // property: buttonType

        /**
         * Type applied to the minus and plus buttons.
         */
        getButtonType(): ButtonType;

        /**
         * Type applied to the minus and plus buttons.
         */
        setButtonType(buttonType: ButtonType): this;

        // event: change

        /**
         * Fired when the value has been changed by user interaction
        (button press or direct input).
         */
        attachChange(fn: (event: QuantityPicker$ChangeEvent) => void, listener?: object): this;

        /**
         * Fired when the value has been changed by user interaction
        (button press or direct input).
         */
        attachChange<CustomDataType extends object>(data: CustomDataType, fn: (event: QuantityPicker$ChangeEvent, data: CustomDataType) => void, listener?: object): this;

        /**
         * Fired when the value has been changed by user interaction
        (button press or direct input).
         */
        detachChange(fn: (event: QuantityPicker$ChangeEvent) => void, listener?: object): this;

        /**
         * Fired when the value has been changed by user interaction
        (button press or direct input).
         */
        fireChange(parameters?: QuantityPicker$ChangeEventParameters): this;
    }

    /**
     * Interface describing the parameters of QuantityPicker's 'change' event.
     * Fired when the value has been changed by user interaction
    (button press or direct input).
     */
    export interface QuantityPicker$ChangeEventParameters {
        value?: number;
    }

    /**
     * Type describing the QuantityPicker's 'change' event.
     * Fired when the value has been changed by user interaction
    (button press or direct input).
     */
    export type QuantityPicker$ChangeEvent = Event<QuantityPicker$ChangeEventParameters>;
}
