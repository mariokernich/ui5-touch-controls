import Event from "sap/ui/base/Event";
import { InputType } from "sap/m/library";
import { ValueState } from "sap/ui/core/library";
import { CSSSize } from "sap/ui/core/library";
import { SizeMode } from "ui5/touch/controls/library";
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { $ControlSettings } from "sap/ui/core/Control";

declare module "./Input" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $InputSettings extends $ControlSettings {

        /**
         * The value of the input.
         */
        value?: string | PropertyBindingInfo;

        /**
         * Type of the input, see sap.m.InputType (e.g. Text, Number, Password, ...).
         */
        type?: InputType | PropertyBindingInfo | `{${string}}`;

        /**
         * Placeholder text shown when the input is empty.
         */
        placeholder?: string | PropertyBindingInfo;

        /**
         * Maximum number of characters. Value <code>0</code> means unlimited.
         */
        maxLength?: number | PropertyBindingInfo | `{${string}}`;

        /**
         * Indicates whether the user can interact with the control.
         */
        enabled?: boolean | PropertyBindingInfo | `{${string}}`;

        /**
         * Defines whether the control value can be modified.
         */
        editable?: boolean | PropertyBindingInfo | `{${string}}`;

        /**
         * Visualizes the validation state, e.g. Error, Warning, Success, Information.
         */
        valueState?: ValueState | PropertyBindingInfo | `{${string}}`;

        /**
         * Width of the input field.
         */
        width?: CSSSize | PropertyBindingInfo | `{${string}}`;

        /**
         * Touch size of the input field.
         */
        size?: SizeMode | PropertyBindingInfo | `{${string}}`;

        /**
         * Fired when the value of the input has changed and the focus leaves
        the input field or the Enter key is pressed.
         */
        change?: (event: Input$ChangeEvent) => void;

        /**
         * Fired when the value of the input is changed by user interaction -
        each keystroke, delete, paste, etc.
         */
        liveChange?: (event: Input$LiveChangeEvent) => void;

        /**
         * Fired when the user presses the <kbd>Enter</kbd> key on the input.
         */
        submit?: (event: Input$SubmitEvent) => void;
    }

    export default interface Input {

        // property: value

        /**
         * The value of the input.
         */
        getValue(): string;

        /**
         * The value of the input.
         */
        setValue(value: string): this;

        // property: type

        /**
         * Type of the input, see sap.m.InputType (e.g. Text, Number, Password, ...).
         */
        getType(): InputType;

        /**
         * Type of the input, see sap.m.InputType (e.g. Text, Number, Password, ...).
         */
        setType(type: InputType): this;

        // property: placeholder

        /**
         * Placeholder text shown when the input is empty.
         */
        getPlaceholder(): string;

        /**
         * Placeholder text shown when the input is empty.
         */
        setPlaceholder(placeholder: string): this;

        // property: maxLength

        /**
         * Maximum number of characters. Value <code>0</code> means unlimited.
         */
        getMaxLength(): number;

        /**
         * Maximum number of characters. Value <code>0</code> means unlimited.
         */
        setMaxLength(maxLength: number): this;

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
         * Defines whether the control value can be modified.
         */
        getEditable(): boolean;

        /**
         * Defines whether the control value can be modified.
         */
        setEditable(editable: boolean): this;

        // property: valueState

        /**
         * Visualizes the validation state, e.g. Error, Warning, Success, Information.
         */
        getValueState(): ValueState;

        /**
         * Visualizes the validation state, e.g. Error, Warning, Success, Information.
         */
        setValueState(valueState: ValueState): this;

        // property: width

        /**
         * Width of the input field.
         */
        getWidth(): CSSSize;

        /**
         * Width of the input field.
         */
        setWidth(width: CSSSize): this;

        // property: size

        /**
         * Touch size of the input field.
         */
        getSize(): SizeMode;

        /**
         * Touch size of the input field.
         */
        setSize(size: SizeMode): this;

        // event: change

        /**
         * Fired when the value of the input has changed and the focus leaves
        the input field or the Enter key is pressed.
         */
        attachChange(fn: (event: Input$ChangeEvent) => void, listener?: object): this;

        /**
         * Fired when the value of the input has changed and the focus leaves
        the input field or the Enter key is pressed.
         */
        attachChange<CustomDataType extends object>(data: CustomDataType, fn: (event: Input$ChangeEvent, data: CustomDataType) => void, listener?: object): this;

        /**
         * Fired when the value of the input has changed and the focus leaves
        the input field or the Enter key is pressed.
         */
        detachChange(fn: (event: Input$ChangeEvent) => void, listener?: object): this;

        /**
         * Fired when the value of the input has changed and the focus leaves
        the input field or the Enter key is pressed.
         */
        fireChange(parameters?: Input$ChangeEventParameters): this;

        // event: liveChange

        /**
         * Fired when the value of the input is changed by user interaction -
        each keystroke, delete, paste, etc.
         */
        attachLiveChange(fn: (event: Input$LiveChangeEvent) => void, listener?: object): this;

        /**
         * Fired when the value of the input is changed by user interaction -
        each keystroke, delete, paste, etc.
         */
        attachLiveChange<CustomDataType extends object>(data: CustomDataType, fn: (event: Input$LiveChangeEvent, data: CustomDataType) => void, listener?: object): this;

        /**
         * Fired when the value of the input is changed by user interaction -
        each keystroke, delete, paste, etc.
         */
        detachLiveChange(fn: (event: Input$LiveChangeEvent) => void, listener?: object): this;

        /**
         * Fired when the value of the input is changed by user interaction -
        each keystroke, delete, paste, etc.
         */
        fireLiveChange(parameters?: Input$LiveChangeEventParameters): this;

        // event: submit

        /**
         * Fired when the user presses the <kbd>Enter</kbd> key on the input.
         */
        attachSubmit(fn: (event: Input$SubmitEvent) => void, listener?: object): this;

        /**
         * Fired when the user presses the <kbd>Enter</kbd> key on the input.
         */
        attachSubmit<CustomDataType extends object>(data: CustomDataType, fn: (event: Input$SubmitEvent, data: CustomDataType) => void, listener?: object): this;

        /**
         * Fired when the user presses the <kbd>Enter</kbd> key on the input.
         */
        detachSubmit(fn: (event: Input$SubmitEvent) => void, listener?: object): this;

        /**
         * Fired when the user presses the <kbd>Enter</kbd> key on the input.
         */
        fireSubmit(parameters?: Input$SubmitEventParameters): this;
    }

    /**
     * Interface describing the parameters of Input's 'change' event.
     * Fired when the value of the input has changed and the focus leaves
    the input field or the Enter key is pressed.
     */
    export interface Input$ChangeEventParameters {
        value?: string;
    }

    /**
     * Interface describing the parameters of Input's 'liveChange' event.
     * Fired when the value of the input is changed by user interaction -
    each keystroke, delete, paste, etc.
     */
    export interface Input$LiveChangeEventParameters {
        value?: string;
    }

    /**
     * Interface describing the parameters of Input's 'submit' event.
     * Fired when the user presses the <kbd>Enter</kbd> key on the input.
     */
    export interface Input$SubmitEventParameters {
        value?: string;
    }

    /**
     * Type describing the Input's 'change' event.
     * Fired when the value of the input has changed and the focus leaves
    the input field or the Enter key is pressed.
     */
    export type Input$ChangeEvent = Event<Input$ChangeEventParameters>;

    /**
     * Type describing the Input's 'liveChange' event.
     * Fired when the value of the input is changed by user interaction -
    each keystroke, delete, paste, etc.
     */
    export type Input$LiveChangeEvent = Event<Input$LiveChangeEventParameters>;

    /**
     * Type describing the Input's 'submit' event.
     * Fired when the user presses the <kbd>Enter</kbd> key on the input.
     */
    export type Input$SubmitEvent = Event<Input$SubmitEventParameters>;
}
