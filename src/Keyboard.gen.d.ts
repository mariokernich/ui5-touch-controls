import Event from "sap/ui/base/Event";
import { CSSSize } from "sap/ui/core/library";
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { $ControlSettings } from "sap/ui/core/Control";

declare module "./Keyboard" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $KeyboardSettings extends $ControlSettings {

        /**
         * The current input value of the keyboard.
         */
        value?: string | PropertyBindingInfo;

        /**
         * The keyboard layout rows. Each entry represents one row,
        keys are separated by spaces. Special keys are wrapped in
        curly braces, e.g. <code>{bksp}</code> or <code>{enter}</code>.
         */
        layout?: string[] | PropertyBindingInfo | `{${string}}`;

        /**
         * Maximum number of characters. Value <code>0</code> means unlimited.
         */
        maxLength?: number | PropertyBindingInfo | `{${string}}`;

        /**
         * Indicates whether the user can interact with the keyboard.
         */
        enabled?: boolean | PropertyBindingInfo | `{${string}}`;

        /**
         * Width of the keyboard.
         */
        width?: CSSSize | PropertyBindingInfo | `{${string}}`;

        /**
         * Fired whenever the keyboard input changes (key press,
        backspace, ...).
         */
        change?: (event: Keyboard$ChangeEvent) => void;

        /**
         * Fired when any key is pressed.
         */
        keyPress?: (event: Keyboard$KeyPressEvent) => void;

        /**
         * Fired when the Enter key is pressed.
         */
        enter?: (event: Keyboard$EnterEvent) => void;
    }

    export default interface Keyboard {

        // property: value

        /**
         * The current input value of the keyboard.
         */
        getValue(): string;

        /**
         * The current input value of the keyboard.
         */
        setValue(value: string): this;

        // property: layout

        /**
         * The keyboard layout rows. Each entry represents one row,
        keys are separated by spaces. Special keys are wrapped in
        curly braces, e.g. <code>{bksp}</code> or <code>{enter}</code>.
         */
        getLayout(): string[];

        /**
         * The keyboard layout rows. Each entry represents one row,
        keys are separated by spaces. Special keys are wrapped in
        curly braces, e.g. <code>{bksp}</code> or <code>{enter}</code>.
         */
        setLayout(layout: string[]): this;

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
         * Indicates whether the user can interact with the keyboard.
         */
        getEnabled(): boolean;

        /**
         * Indicates whether the user can interact with the keyboard.
         */
        setEnabled(enabled: boolean): this;

        // property: width

        /**
         * Width of the keyboard.
         */
        getWidth(): CSSSize;

        /**
         * Width of the keyboard.
         */
        setWidth(width: CSSSize): this;

        // event: change

        /**
         * Fired whenever the keyboard input changes (key press,
        backspace, ...).
         */
        attachChange(fn: (event: Keyboard$ChangeEvent) => void, listener?: object): this;

        /**
         * Fired whenever the keyboard input changes (key press,
        backspace, ...).
         */
        attachChange<CustomDataType extends object>(data: CustomDataType, fn: (event: Keyboard$ChangeEvent, data: CustomDataType) => void, listener?: object): this;

        /**
         * Fired whenever the keyboard input changes (key press,
        backspace, ...).
         */
        detachChange(fn: (event: Keyboard$ChangeEvent) => void, listener?: object): this;

        /**
         * Fired whenever the keyboard input changes (key press,
        backspace, ...).
         */
        fireChange(parameters?: Keyboard$ChangeEventParameters): this;

        // event: keyPress

        /**
         * Fired when any key is pressed.
         */
        attachKeyPress(fn: (event: Keyboard$KeyPressEvent) => void, listener?: object): this;

        /**
         * Fired when any key is pressed.
         */
        attachKeyPress<CustomDataType extends object>(data: CustomDataType, fn: (event: Keyboard$KeyPressEvent, data: CustomDataType) => void, listener?: object): this;

        /**
         * Fired when any key is pressed.
         */
        detachKeyPress(fn: (event: Keyboard$KeyPressEvent) => void, listener?: object): this;

        /**
         * Fired when any key is pressed.
         */
        fireKeyPress(parameters?: Keyboard$KeyPressEventParameters): this;

        // event: enter

        /**
         * Fired when the Enter key is pressed.
         */
        attachEnter(fn: (event: Keyboard$EnterEvent) => void, listener?: object): this;

        /**
         * Fired when the Enter key is pressed.
         */
        attachEnter<CustomDataType extends object>(data: CustomDataType, fn: (event: Keyboard$EnterEvent, data: CustomDataType) => void, listener?: object): this;

        /**
         * Fired when the Enter key is pressed.
         */
        detachEnter(fn: (event: Keyboard$EnterEvent) => void, listener?: object): this;

        /**
         * Fired when the Enter key is pressed.
         */
        fireEnter(parameters?: Keyboard$EnterEventParameters): this;
    }

    /**
     * Interface describing the parameters of Keyboard's 'change' event.
     * Fired whenever the keyboard input changes (key press,
    backspace, ...).
     */
    export interface Keyboard$ChangeEventParameters {
        value?: string;
    }

    /**
     * Interface describing the parameters of Keyboard's 'keyPress' event.
     * Fired when any key is pressed.
     */
    export interface Keyboard$KeyPressEventParameters {
        key?: string;
    }

    /**
     * Interface describing the parameters of Keyboard's 'enter' event.
     * Fired when the Enter key is pressed.
     */
    export interface Keyboard$EnterEventParameters {
        value?: string;
    }

    /**
     * Type describing the Keyboard's 'change' event.
     * Fired whenever the keyboard input changes (key press,
    backspace, ...).
     */
    export type Keyboard$ChangeEvent = Event<Keyboard$ChangeEventParameters>;

    /**
     * Type describing the Keyboard's 'keyPress' event.
     * Fired when any key is pressed.
     */
    export type Keyboard$KeyPressEvent = Event<Keyboard$KeyPressEventParameters>;

    /**
     * Type describing the Keyboard's 'enter' event.
     * Fired when the Enter key is pressed.
     */
    export type Keyboard$EnterEvent = Event<Keyboard$EnterEventParameters>;
}
