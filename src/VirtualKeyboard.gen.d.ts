import Event from "sap/ui/base/Event";
import { SizeMode } from "ui5/touch/controls/library";
import { CSSSize } from "sap/ui/core/library";
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { $ControlSettings } from "sap/ui/core/Control";

declare module "./VirtualKeyboard" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $VirtualKeyboardSettings extends $ControlSettings {

        /**
         * The current input value of the keyboard.
         */
        value?: string | PropertyBindingInfo;

        /**
         * The keyboard layout rows. Each entry represents one row,
        keys are separated by spaces. Special keys are wrapped in
        curly braces, e.g. <code>{bksp}</code>, <code>{enter}</code>,
        <code>{space}</code> or <code>{shift}</code>.
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
         * Indicates whether input from a real (physical) keyboard is
        accepted while the keyboard has the focus. Only keys that are
        part of the layout are accepted; <code>Enter</code> and
        <code>Backspace</code> are always handled.
         */
        hardwareKeys?: boolean | PropertyBindingInfo | `{${string}}`;

        /**
         * Touch size applied to all key buttons.
         */
        size?: SizeMode | PropertyBindingInfo | `{${string}}`;

        /**
         * Width of the keyboard.
         */
        width?: CSSSize | PropertyBindingInfo | `{${string}}`;

        /**
         * Fired whenever the keyboard input changes (key press,
        backspace, ...).
         */
        change?: (event: VirtualKeyboard$ChangeEvent) => void;

        /**
         * Fired when any key is pressed.
         */
        keyPress?: (event: VirtualKeyboard$KeyPressEvent) => void;

        /**
         * Fired when the Enter key is pressed.
         */
        enter?: (event: VirtualKeyboard$EnterEvent) => void;
    }

    export default interface VirtualKeyboard {

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
        curly braces, e.g. <code>{bksp}</code>, <code>{enter}</code>,
        <code>{space}</code> or <code>{shift}</code>.
         */
        getLayout(): string[];

        /**
         * The keyboard layout rows. Each entry represents one row,
        keys are separated by spaces. Special keys are wrapped in
        curly braces, e.g. <code>{bksp}</code>, <code>{enter}</code>,
        <code>{space}</code> or <code>{shift}</code>.
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

        // property: hardwareKeys

        /**
         * Indicates whether input from a real (physical) keyboard is
        accepted while the keyboard has the focus. Only keys that are
        part of the layout are accepted; <code>Enter</code> and
        <code>Backspace</code> are always handled.
         */
        getHardwareKeys(): boolean;

        /**
         * Indicates whether input from a real (physical) keyboard is
        accepted while the keyboard has the focus. Only keys that are
        part of the layout are accepted; <code>Enter</code> and
        <code>Backspace</code> are always handled.
         */
        setHardwareKeys(hardwareKeys: boolean): this;

        // property: size

        /**
         * Touch size applied to all key buttons.
         */
        getSize(): SizeMode;

        /**
         * Touch size applied to all key buttons.
         */
        setSize(size: SizeMode): this;

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
        attachChange(fn: (event: VirtualKeyboard$ChangeEvent) => void, listener?: object): this;

        /**
         * Fired whenever the keyboard input changes (key press,
        backspace, ...).
         */
        attachChange<CustomDataType extends object>(data: CustomDataType, fn: (event: VirtualKeyboard$ChangeEvent, data: CustomDataType) => void, listener?: object): this;

        /**
         * Fired whenever the keyboard input changes (key press,
        backspace, ...).
         */
        detachChange(fn: (event: VirtualKeyboard$ChangeEvent) => void, listener?: object): this;

        /**
         * Fired whenever the keyboard input changes (key press,
        backspace, ...).
         */
        fireChange(parameters?: VirtualKeyboard$ChangeEventParameters): this;

        // event: keyPress

        /**
         * Fired when any key is pressed.
         */
        attachKeyPress(fn: (event: VirtualKeyboard$KeyPressEvent) => void, listener?: object): this;

        /**
         * Fired when any key is pressed.
         */
        attachKeyPress<CustomDataType extends object>(data: CustomDataType, fn: (event: VirtualKeyboard$KeyPressEvent, data: CustomDataType) => void, listener?: object): this;

        /**
         * Fired when any key is pressed.
         */
        detachKeyPress(fn: (event: VirtualKeyboard$KeyPressEvent) => void, listener?: object): this;

        /**
         * Fired when any key is pressed.
         */
        fireKeyPress(parameters?: VirtualKeyboard$KeyPressEventParameters): this;

        // event: enter

        /**
         * Fired when the Enter key is pressed.
         */
        attachEnter(fn: (event: VirtualKeyboard$EnterEvent) => void, listener?: object): this;

        /**
         * Fired when the Enter key is pressed.
         */
        attachEnter<CustomDataType extends object>(data: CustomDataType, fn: (event: VirtualKeyboard$EnterEvent, data: CustomDataType) => void, listener?: object): this;

        /**
         * Fired when the Enter key is pressed.
         */
        detachEnter(fn: (event: VirtualKeyboard$EnterEvent) => void, listener?: object): this;

        /**
         * Fired when the Enter key is pressed.
         */
        fireEnter(parameters?: VirtualKeyboard$EnterEventParameters): this;
    }

    /**
     * Interface describing the parameters of VirtualKeyboard's 'change' event.
     * Fired whenever the keyboard input changes (key press,
    backspace, ...).
     */
    export interface VirtualKeyboard$ChangeEventParameters {
        value?: string;
    }

    /**
     * Interface describing the parameters of VirtualKeyboard's 'keyPress' event.
     * Fired when any key is pressed.
     */
    export interface VirtualKeyboard$KeyPressEventParameters {
        key?: string;
    }

    /**
     * Interface describing the parameters of VirtualKeyboard's 'enter' event.
     * Fired when the Enter key is pressed.
     */
    export interface VirtualKeyboard$EnterEventParameters {
        value?: string;
    }

    /**
     * Type describing the VirtualKeyboard's 'change' event.
     * Fired whenever the keyboard input changes (key press,
    backspace, ...).
     */
    export type VirtualKeyboard$ChangeEvent = Event<VirtualKeyboard$ChangeEventParameters>;

    /**
     * Type describing the VirtualKeyboard's 'keyPress' event.
     * Fired when any key is pressed.
     */
    export type VirtualKeyboard$KeyPressEvent = Event<VirtualKeyboard$KeyPressEventParameters>;

    /**
     * Type describing the VirtualKeyboard's 'enter' event.
     * Fired when the Enter key is pressed.
     */
    export type VirtualKeyboard$EnterEvent = Event<VirtualKeyboard$EnterEventParameters>;
}
