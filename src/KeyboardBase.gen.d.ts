import Event from "sap/ui/base/Event";
import { SizeMode } from "ui5/touch/controls/library";
import { CSSSize } from "sap/ui/core/library";
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { $ControlSettings } from "sap/ui/core/Control";

declare module "./KeyboardBase" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $KeyboardBaseSettings extends $ControlSettings {

        /**
         * The current input value of the keyboard.
         */
        value?: string | PropertyBindingInfo;

        /**
         * The keys that are drawn as emphasized, written the way they stand
        in the layout - <code>{enter}</code>, <code>a</code> - with the
        braces of a special key optional.
        
        A keyboard usually has one key that ends what is being done, and
        this is how it is made to look like it. A modifier is emphasized
        while it is on whatever this says.
         */
        emphasizedKeys?: string[] | PropertyBindingInfo | `{${string}}`;

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
         * /**
                     * Width of the keyboard.
                     *
                     * On a phone or a tablet a docked keyboard takes the full width of
                     * the screen and this property is not looked at - see
                     *
        {@link #getDocked docked}
        .
         */
        width?: CSSSize | PropertyBindingInfo | `{${string}}`;

        /**
         * /**
                     * Indicates whether the keyboard is docked to the bottom edge of
                     * the screen.
                     *
                     * A docked keyboard is taken out of the flow of the page: it sits
                     * at the bottom edge, centered, and over the content. On a phone
                     * or a tablet it takes the full width of the screen and
                     *
        {@link #getWidth width}
         is not looked at.
                     *
                     * It works the same way in the <code>keyboard</code>
                     * aggregation of an
        {@link ui5.touch.controls.Input}
         or an
                     *
        {@link ui5.touch.controls.TextArea}
        : the popover that carries
                     * the keyboard is docked instead of being placed at the field.
                     *
                     * How high it reaches differs between the two, and that follows
                     * from where they are in the page. A keyboard on a field is put
                     * into the static area by its popover, so it covers everything, a
                     * modal dialog included - which is what makes a field inside a
                     * dialog typeable. A keyboard standing on a page of its own stays
                     * a part of that page, and a page is a stacking context of its
                     * own: it covers the content around it, but the block layer of a
                     * modal dialog still comes out on top of it.
         */
        docked?: boolean | PropertyBindingInfo | `{${string}}`;

        /**
         * Fired whenever the keyboard input changes (key press,
        backspace, ...).
         */
        change?: (event: KeyboardBase$ChangeEvent) => void;

        /**
         * Fired when any key is pressed.
         */
        keyPress?: (event: KeyboardBase$KeyPressEvent) => void;

        /**
         * Fired when the Enter key is pressed.
         */
        enter?: (event: KeyboardBase$EnterEvent) => void;

        /**
         * /**
                     * Fired when the Escape key is pressed - the <code>{esc}</code>
                     * key of the layout, or the one of a real keyboard while
                     *
        {@link #getHardwareKeys hardwareKeys}
         is on.
                     *
                     * The keyboard does nothing about it by itself. A field that shows
                     * one closes its popover on it, and an application is free to make
                     * it mean whatever it should: leaving a screen, dropping what was
                     * typed.
         */
        escape?: (event: KeyboardBase$EscapeEvent) => void;
    }

    export default interface KeyboardBase {

        // property: value

        /**
         * The current input value of the keyboard.
         */
        getValue(): string;

        /**
         * The current input value of the keyboard.
         */
        setValue(value: string): this;

        // property: emphasizedKeys

        /**
         * The keys that are drawn as emphasized, written the way they stand
        in the layout - <code>{enter}</code>, <code>a</code> - with the
        braces of a special key optional.
        
        A keyboard usually has one key that ends what is being done, and
        this is how it is made to look like it. A modifier is emphasized
        while it is on whatever this says.
         */
        getEmphasizedKeys(): string[];

        /**
         * The keys that are drawn as emphasized, written the way they stand
        in the layout - <code>{enter}</code>, <code>a</code> - with the
        braces of a special key optional.
        
        A keyboard usually has one key that ends what is being done, and
        this is how it is made to look like it. A modifier is emphasized
        while it is on whatever this says.
         */
        setEmphasizedKeys(emphasizedKeys: string[]): this;

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
         * /**
                     * Width of the keyboard.
                     *
                     * On a phone or a tablet a docked keyboard takes the full width of
                     * the screen and this property is not looked at - see
                     *
        {@link #getDocked docked}
        .
         */
        getWidth(): CSSSize;

        /**
         * /**
                     * Width of the keyboard.
                     *
                     * On a phone or a tablet a docked keyboard takes the full width of
                     * the screen and this property is not looked at - see
                     *
        {@link #getDocked docked}
        .
         */
        setWidth(width: CSSSize): this;

        // property: docked

        /**
         * /**
                     * Indicates whether the keyboard is docked to the bottom edge of
                     * the screen.
                     *
                     * A docked keyboard is taken out of the flow of the page: it sits
                     * at the bottom edge, centered, and over the content. On a phone
                     * or a tablet it takes the full width of the screen and
                     *
        {@link #getWidth width}
         is not looked at.
                     *
                     * It works the same way in the <code>keyboard</code>
                     * aggregation of an
        {@link ui5.touch.controls.Input}
         or an
                     *
        {@link ui5.touch.controls.TextArea}
        : the popover that carries
                     * the keyboard is docked instead of being placed at the field.
                     *
                     * How high it reaches differs between the two, and that follows
                     * from where they are in the page. A keyboard on a field is put
                     * into the static area by its popover, so it covers everything, a
                     * modal dialog included - which is what makes a field inside a
                     * dialog typeable. A keyboard standing on a page of its own stays
                     * a part of that page, and a page is a stacking context of its
                     * own: it covers the content around it, but the block layer of a
                     * modal dialog still comes out on top of it.
         */
        getDocked(): boolean;

        /**
         * /**
                     * Indicates whether the keyboard is docked to the bottom edge of
                     * the screen.
                     *
                     * A docked keyboard is taken out of the flow of the page: it sits
                     * at the bottom edge, centered, and over the content. On a phone
                     * or a tablet it takes the full width of the screen and
                     *
        {@link #getWidth width}
         is not looked at.
                     *
                     * It works the same way in the <code>keyboard</code>
                     * aggregation of an
        {@link ui5.touch.controls.Input}
         or an
                     *
        {@link ui5.touch.controls.TextArea}
        : the popover that carries
                     * the keyboard is docked instead of being placed at the field.
                     *
                     * How high it reaches differs between the two, and that follows
                     * from where they are in the page. A keyboard on a field is put
                     * into the static area by its popover, so it covers everything, a
                     * modal dialog included - which is what makes a field inside a
                     * dialog typeable. A keyboard standing on a page of its own stays
                     * a part of that page, and a page is a stacking context of its
                     * own: it covers the content around it, but the block layer of a
                     * modal dialog still comes out on top of it.
         */
        setDocked(docked: boolean): this;

        // event: change

        /**
         * Fired whenever the keyboard input changes (key press,
        backspace, ...).
         */
        attachChange(fn: (event: KeyboardBase$ChangeEvent) => void, listener?: object): this;

        /**
         * Fired whenever the keyboard input changes (key press,
        backspace, ...).
         */
        attachChange<CustomDataType extends object>(data: CustomDataType, fn: (event: KeyboardBase$ChangeEvent, data: CustomDataType) => void, listener?: object): this;

        /**
         * Fired whenever the keyboard input changes (key press,
        backspace, ...).
         */
        detachChange(fn: (event: KeyboardBase$ChangeEvent) => void, listener?: object): this;

        /**
         * Fired whenever the keyboard input changes (key press,
        backspace, ...).
         */
        fireChange(parameters?: KeyboardBase$ChangeEventParameters): this;

        // event: keyPress

        /**
         * Fired when any key is pressed.
         */
        attachKeyPress(fn: (event: KeyboardBase$KeyPressEvent) => void, listener?: object): this;

        /**
         * Fired when any key is pressed.
         */
        attachKeyPress<CustomDataType extends object>(data: CustomDataType, fn: (event: KeyboardBase$KeyPressEvent, data: CustomDataType) => void, listener?: object): this;

        /**
         * Fired when any key is pressed.
         */
        detachKeyPress(fn: (event: KeyboardBase$KeyPressEvent) => void, listener?: object): this;

        /**
         * Fired when any key is pressed.
         */
        fireKeyPress(parameters?: KeyboardBase$KeyPressEventParameters): this;

        // event: enter

        /**
         * Fired when the Enter key is pressed.
         */
        attachEnter(fn: (event: KeyboardBase$EnterEvent) => void, listener?: object): this;

        /**
         * Fired when the Enter key is pressed.
         */
        attachEnter<CustomDataType extends object>(data: CustomDataType, fn: (event: KeyboardBase$EnterEvent, data: CustomDataType) => void, listener?: object): this;

        /**
         * Fired when the Enter key is pressed.
         */
        detachEnter(fn: (event: KeyboardBase$EnterEvent) => void, listener?: object): this;

        /**
         * Fired when the Enter key is pressed.
         */
        fireEnter(parameters?: KeyboardBase$EnterEventParameters): this;

        // event: escape

        /**
         * /**
                     * Fired when the Escape key is pressed - the <code>{esc}</code>
                     * key of the layout, or the one of a real keyboard while
                     *
        {@link #getHardwareKeys hardwareKeys}
         is on.
                     *
                     * The keyboard does nothing about it by itself. A field that shows
                     * one closes its popover on it, and an application is free to make
                     * it mean whatever it should: leaving a screen, dropping what was
                     * typed.
         */
        attachEscape(fn: (event: KeyboardBase$EscapeEvent) => void, listener?: object): this;

        /**
         * /**
                     * Fired when the Escape key is pressed - the <code>{esc}</code>
                     * key of the layout, or the one of a real keyboard while
                     *
        {@link #getHardwareKeys hardwareKeys}
         is on.
                     *
                     * The keyboard does nothing about it by itself. A field that shows
                     * one closes its popover on it, and an application is free to make
                     * it mean whatever it should: leaving a screen, dropping what was
                     * typed.
         */
        attachEscape<CustomDataType extends object>(data: CustomDataType, fn: (event: KeyboardBase$EscapeEvent, data: CustomDataType) => void, listener?: object): this;

        /**
         * /**
                     * Fired when the Escape key is pressed - the <code>{esc}</code>
                     * key of the layout, or the one of a real keyboard while
                     *
        {@link #getHardwareKeys hardwareKeys}
         is on.
                     *
                     * The keyboard does nothing about it by itself. A field that shows
                     * one closes its popover on it, and an application is free to make
                     * it mean whatever it should: leaving a screen, dropping what was
                     * typed.
         */
        detachEscape(fn: (event: KeyboardBase$EscapeEvent) => void, listener?: object): this;

        /**
         * /**
                     * Fired when the Escape key is pressed - the <code>{esc}</code>
                     * key of the layout, or the one of a real keyboard while
                     *
        {@link #getHardwareKeys hardwareKeys}
         is on.
                     *
                     * The keyboard does nothing about it by itself. A field that shows
                     * one closes its popover on it, and an application is free to make
                     * it mean whatever it should: leaving a screen, dropping what was
                     * typed.
         */
        fireEscape(parameters?: KeyboardBase$EscapeEventParameters): this;
    }

    /**
     * Interface describing the parameters of KeyboardBase's 'change' event.
     * Fired whenever the keyboard input changes (key press,
    backspace, ...).
     */
    export interface KeyboardBase$ChangeEventParameters {
        value?: string;
    }

    /**
     * Interface describing the parameters of KeyboardBase's 'keyPress' event.
     * Fired when any key is pressed.
     */
    export interface KeyboardBase$KeyPressEventParameters {
        key?: string;
    }

    /**
     * Interface describing the parameters of KeyboardBase's 'enter' event.
     * Fired when the Enter key is pressed.
     */
    export interface KeyboardBase$EnterEventParameters {
        value?: string;
    }

    /**
     * Interface describing the parameters of KeyboardBase's 'escape' event.
     * /**
                 * Fired when the Escape key is pressed - the <code>{esc}</code>
                 * key of the layout, or the one of a real keyboard while
                 *
    {@link #getHardwareKeys hardwareKeys}
     is on.
                 *
                 * The keyboard does nothing about it by itself. A field that shows
                 * one closes its popover on it, and an application is free to make
                 * it mean whatever it should: leaving a screen, dropping what was
                 * typed.
     */
    export interface KeyboardBase$EscapeEventParameters {
        value?: string;
    }

    /**
     * Type describing the KeyboardBase's 'change' event.
     * Fired whenever the keyboard input changes (key press,
    backspace, ...).
     */
    export type KeyboardBase$ChangeEvent = Event<KeyboardBase$ChangeEventParameters>;

    /**
     * Type describing the KeyboardBase's 'keyPress' event.
     * Fired when any key is pressed.
     */
    export type KeyboardBase$KeyPressEvent = Event<KeyboardBase$KeyPressEventParameters>;

    /**
     * Type describing the KeyboardBase's 'enter' event.
     * Fired when the Enter key is pressed.
     */
    export type KeyboardBase$EnterEvent = Event<KeyboardBase$EnterEventParameters>;

    /**
     * Type describing the KeyboardBase's 'escape' event.
     * /**
                 * Fired when the Escape key is pressed - the <code>{esc}</code>
                 * key of the layout, or the one of a real keyboard while
                 *
    {@link #getHardwareKeys hardwareKeys}
     is on.
                 *
                 * The keyboard does nothing about it by itself. A field that shows
                 * one closes its popover on it, and an application is free to make
                 * it mean whatever it should: leaving a screen, dropping what was
                 * typed.
     */
    export type KeyboardBase$EscapeEvent = Event<KeyboardBase$EscapeEventParameters>;
}
