import Event from "sap/ui/base/Event";
import { KeyboardMode } from "ui5/touch/controls/library";
import { SizeMode } from "ui5/touch/controls/library";
import { CSSSize } from "sap/ui/core/library";
import KeyboardLayout from "ui5/touch/controls/KeyboardLayout";
import KeyboardKey from "ui5/touch/controls/KeyboardKey";
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { AggregationBindingInfo } from "sap/ui/base/ManagedObject";
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
         * /**
                     * Which keys the keyboard shows.
                     *
                     * All values but <code>Custom</code> are ready-made layouts that
                     * the control brings along. <code>Custom</code> is the one that
                     * reads the
        {@link #getLayout layout}
         property.
         */
        mode?: KeyboardMode | PropertyBindingInfo | `{${string}}`;

        /**
         * /**
                     * The keyboard layout rows, for
                     *
        {@link ui5.touch.controls.KeyboardMode.Custom}
        . Each entry
                     * represents one row, keys are separated by spaces. Special keys
                     * are wrapped in curly braces, e.g. <code>{bksp}</code>,
                     * <code>{enter}</code>, <code>{space}</code> or
                     * <code>{shift}</code>.
                     *
                     * It is only looked at when
        {@link #getMode mode}
         is
                     * <code>Custom</code>; with any other mode the layout of that mode
                     * is shown.
         */
        layout?: string[] | PropertyBindingInfo | `{${string}}`;

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
                     * It works the same way in the <code>virtualKeyboard</code>
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
         * /**
                     * The sets of keys the keyboard can show, for
                     *
        {@link ui5.touch.controls.KeyboardMode.Custom}
        .
                     *
                     * A keyboard with more than one set shows one of them at a time -
                     * the one called <code>default</code> to begin with - and a key
                     * written as the name of another set switches to it. That is how a
                     * keyboard of a phone gets from its letters to its digits and back
                     * without any code around it.
                     *
                     * Sets take precedence over the
        {@link #getLayout layout}
        
                     * property, which is the shorter way of writing a keyboard that
                     * only ever shows one set.
         */
        layouts?: KeyboardLayout[] | KeyboardLayout | AggregationBindingInfo | `{${string}}`;

        /**
         * What single keys say, where the sign the keyboard would pick is
        not the right one.
        
        The keyboard has a sign for every key it knows and shows the
        plain name of one it does not, which is enough for most
        keyboards. An entry here overrules that for one key, whichever
        set it appears in - the <code>display</code> option of
        simple-keyboard.
         */
        display?: KeyboardKey[] | KeyboardKey | AggregationBindingInfo | `{${string}}`;

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
        escape?: (event: VirtualKeyboard$EscapeEvent) => void;
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

        // property: mode

        /**
         * /**
                     * Which keys the keyboard shows.
                     *
                     * All values but <code>Custom</code> are ready-made layouts that
                     * the control brings along. <code>Custom</code> is the one that
                     * reads the
        {@link #getLayout layout}
         property.
         */
        getMode(): KeyboardMode;

        /**
         * /**
                     * Which keys the keyboard shows.
                     *
                     * All values but <code>Custom</code> are ready-made layouts that
                     * the control brings along. <code>Custom</code> is the one that
                     * reads the
        {@link #getLayout layout}
         property.
         */
        setMode(mode: KeyboardMode): this;

        // property: layout

        /**
         * /**
                     * The keyboard layout rows, for
                     *
        {@link ui5.touch.controls.KeyboardMode.Custom}
        . Each entry
                     * represents one row, keys are separated by spaces. Special keys
                     * are wrapped in curly braces, e.g. <code>{bksp}</code>,
                     * <code>{enter}</code>, <code>{space}</code> or
                     * <code>{shift}</code>.
                     *
                     * It is only looked at when
        {@link #getMode mode}
         is
                     * <code>Custom</code>; with any other mode the layout of that mode
                     * is shown.
         */
        getLayout(): string[];

        /**
         * /**
                     * The keyboard layout rows, for
                     *
        {@link ui5.touch.controls.KeyboardMode.Custom}
        . Each entry
                     * represents one row, keys are separated by spaces. Special keys
                     * are wrapped in curly braces, e.g. <code>{bksp}</code>,
                     * <code>{enter}</code>, <code>{space}</code> or
                     * <code>{shift}</code>.
                     *
                     * It is only looked at when
        {@link #getMode mode}
         is
                     * <code>Custom</code>; with any other mode the layout of that mode
                     * is shown.
         */
        setLayout(layout: string[]): this;

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
                     * It works the same way in the <code>virtualKeyboard</code>
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
                     * It works the same way in the <code>virtualKeyboard</code>
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

        // aggregation: layouts

        /**
         * /**
                     * The sets of keys the keyboard can show, for
                     *
        {@link ui5.touch.controls.KeyboardMode.Custom}
        .
                     *
                     * A keyboard with more than one set shows one of them at a time -
                     * the one called <code>default</code> to begin with - and a key
                     * written as the name of another set switches to it. That is how a
                     * keyboard of a phone gets from its letters to its digits and back
                     * without any code around it.
                     *
                     * Sets take precedence over the
        {@link #getLayout layout}
        
                     * property, which is the shorter way of writing a keyboard that
                     * only ever shows one set.
         */
        getLayouts(): KeyboardLayout[];

        /**
         * /**
                     * The sets of keys the keyboard can show, for
                     *
        {@link ui5.touch.controls.KeyboardMode.Custom}
        .
                     *
                     * A keyboard with more than one set shows one of them at a time -
                     * the one called <code>default</code> to begin with - and a key
                     * written as the name of another set switches to it. That is how a
                     * keyboard of a phone gets from its letters to its digits and back
                     * without any code around it.
                     *
                     * Sets take precedence over the
        {@link #getLayout layout}
        
                     * property, which is the shorter way of writing a keyboard that
                     * only ever shows one set.
         */
        addLayout_(layouts: KeyboardLayout): this;

        /**
         * /**
                     * The sets of keys the keyboard can show, for
                     *
        {@link ui5.touch.controls.KeyboardMode.Custom}
        .
                     *
                     * A keyboard with more than one set shows one of them at a time -
                     * the one called <code>default</code> to begin with - and a key
                     * written as the name of another set switches to it. That is how a
                     * keyboard of a phone gets from its letters to its digits and back
                     * without any code around it.
                     *
                     * Sets take precedence over the
        {@link #getLayout layout}
        
                     * property, which is the shorter way of writing a keyboard that
                     * only ever shows one set.
         */
        insertLayout_(layouts: KeyboardLayout, index: number): this;

        /**
         * /**
                     * The sets of keys the keyboard can show, for
                     *
        {@link ui5.touch.controls.KeyboardMode.Custom}
        .
                     *
                     * A keyboard with more than one set shows one of them at a time -
                     * the one called <code>default</code> to begin with - and a key
                     * written as the name of another set switches to it. That is how a
                     * keyboard of a phone gets from its letters to its digits and back
                     * without any code around it.
                     *
                     * Sets take precedence over the
        {@link #getLayout layout}
        
                     * property, which is the shorter way of writing a keyboard that
                     * only ever shows one set.
         */
        removeLayout_(layouts: number | string | KeyboardLayout): KeyboardLayout | null;

        /**
         * /**
                     * The sets of keys the keyboard can show, for
                     *
        {@link ui5.touch.controls.KeyboardMode.Custom}
        .
                     *
                     * A keyboard with more than one set shows one of them at a time -
                     * the one called <code>default</code> to begin with - and a key
                     * written as the name of another set switches to it. That is how a
                     * keyboard of a phone gets from its letters to its digits and back
                     * without any code around it.
                     *
                     * Sets take precedence over the
        {@link #getLayout layout}
        
                     * property, which is the shorter way of writing a keyboard that
                     * only ever shows one set.
         */
        removeAllLayouts(): KeyboardLayout[];

        /**
         * /**
                     * The sets of keys the keyboard can show, for
                     *
        {@link ui5.touch.controls.KeyboardMode.Custom}
        .
                     *
                     * A keyboard with more than one set shows one of them at a time -
                     * the one called <code>default</code> to begin with - and a key
                     * written as the name of another set switches to it. That is how a
                     * keyboard of a phone gets from its letters to its digits and back
                     * without any code around it.
                     *
                     * Sets take precedence over the
        {@link #getLayout layout}
        
                     * property, which is the shorter way of writing a keyboard that
                     * only ever shows one set.
         */
        indexOfLayout_(layouts: KeyboardLayout): number;

        /**
         * /**
                     * The sets of keys the keyboard can show, for
                     *
        {@link ui5.touch.controls.KeyboardMode.Custom}
        .
                     *
                     * A keyboard with more than one set shows one of them at a time -
                     * the one called <code>default</code> to begin with - and a key
                     * written as the name of another set switches to it. That is how a
                     * keyboard of a phone gets from its letters to its digits and back
                     * without any code around it.
                     *
                     * Sets take precedence over the
        {@link #getLayout layout}
        
                     * property, which is the shorter way of writing a keyboard that
                     * only ever shows one set.
         */
        destroyLayouts(): this;

        // aggregation: display

        /**
         * What single keys say, where the sign the keyboard would pick is
        not the right one.
        
        The keyboard has a sign for every key it knows and shows the
        plain name of one it does not, which is enough for most
        keyboards. An entry here overrules that for one key, whichever
        set it appears in - the <code>display</code> option of
        simple-keyboard.
         */
        getDisplay(): KeyboardKey[];

        /**
         * What single keys say, where the sign the keyboard would pick is
        not the right one.
        
        The keyboard has a sign for every key it knows and shows the
        plain name of one it does not, which is enough for most
        keyboards. An entry here overrules that for one key, whichever
        set it appears in - the <code>display</code> option of
        simple-keyboard.
         */
        addDisplayKey(display: KeyboardKey): this;

        /**
         * What single keys say, where the sign the keyboard would pick is
        not the right one.
        
        The keyboard has a sign for every key it knows and shows the
        plain name of one it does not, which is enough for most
        keyboards. An entry here overrules that for one key, whichever
        set it appears in - the <code>display</code> option of
        simple-keyboard.
         */
        insertDisplayKey(display: KeyboardKey, index: number): this;

        /**
         * What single keys say, where the sign the keyboard would pick is
        not the right one.
        
        The keyboard has a sign for every key it knows and shows the
        plain name of one it does not, which is enough for most
        keyboards. An entry here overrules that for one key, whichever
        set it appears in - the <code>display</code> option of
        simple-keyboard.
         */
        removeDisplayKey(display: number | string | KeyboardKey): KeyboardKey | null;

        /**
         * What single keys say, where the sign the keyboard would pick is
        not the right one.
        
        The keyboard has a sign for every key it knows and shows the
        plain name of one it does not, which is enough for most
        keyboards. An entry here overrules that for one key, whichever
        set it appears in - the <code>display</code> option of
        simple-keyboard.
         */
        removeAllDisplay(): KeyboardKey[];

        /**
         * What single keys say, where the sign the keyboard would pick is
        not the right one.
        
        The keyboard has a sign for every key it knows and shows the
        plain name of one it does not, which is enough for most
        keyboards. An entry here overrules that for one key, whichever
        set it appears in - the <code>display</code> option of
        simple-keyboard.
         */
        indexOfDisplayKey(display: KeyboardKey): number;

        /**
         * What single keys say, where the sign the keyboard would pick is
        not the right one.
        
        The keyboard has a sign for every key it knows and shows the
        plain name of one it does not, which is enough for most
        keyboards. An entry here overrules that for one key, whichever
        set it appears in - the <code>display</code> option of
        simple-keyboard.
         */
        destroyDisplay(): this;

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
        attachEscape(fn: (event: VirtualKeyboard$EscapeEvent) => void, listener?: object): this;

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
        attachEscape<CustomDataType extends object>(data: CustomDataType, fn: (event: VirtualKeyboard$EscapeEvent, data: CustomDataType) => void, listener?: object): this;

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
        detachEscape(fn: (event: VirtualKeyboard$EscapeEvent) => void, listener?: object): this;

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
        fireEscape(parameters?: VirtualKeyboard$EscapeEventParameters): this;
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
     * Interface describing the parameters of VirtualKeyboard's 'escape' event.
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
    export interface VirtualKeyboard$EscapeEventParameters {
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

    /**
     * Type describing the VirtualKeyboard's 'escape' event.
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
    export type VirtualKeyboard$EscapeEvent = Event<VirtualKeyboard$EscapeEventParameters>;
}
