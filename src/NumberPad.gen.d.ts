import { NumberPadMode } from "ui5/touch/controls/library";
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { $KeyboardBaseSettings } from "./KeyboardBase";

declare module "./NumberPad" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $NumberPadSettings extends $KeyboardBaseSettings {

        /**
         * The block of digits.
        
        <code>Simple</code> is the pad of a computer, 7 8 9 on top.
        <code>Phone</code> is the pad of a telephone, 1 2 3 on top with
        a star and a hash beside the zero. <code>Calculator</code> adds
        the four basic operations and an equals sign.
         */
        mode?: NumberPadMode | PropertyBindingInfo | `{${string}}`;

        /**
         * Whether a set of signs is reachable from the pad - the one a
        password is made of, and the punctuation of a note.
         */
        showSpecialCharacters?: boolean | PropertyBindingInfo | `{${string}}`;

        /**
         * Whether the pad has a key for the decimal separator.
        
        Only looked at in <code>Simple</code>: the other two blocks have
        their fourth row taken, by the star and the hash of a telephone
        and by the operations of a calculator.
         */
        showDecimalSeparator?: boolean | PropertyBindingInfo | `{${string}}`;

        /**
         * The sign the decimal key writes. Empty takes the one of the
        current language - a comma in German, a point in English.
         */
        decimalSeparator?: string | PropertyBindingInfo;

        /**
         * /**
                     * Whether the pad has a minus key, for a value that may be
                     * negative. Only looked at in <code>Simple</code>, see
                     *
        {@link #getShowDecimalSeparator showDecimalSeparator}
        .
         */
        showSign?: boolean | PropertyBindingInfo | `{${string}}`;

        /**
         * /**
                     * Whether the pad has an <code>{esc}</code> key.
                     *
                     * It goes into the row of function keys rather than into the top
                     * left corner, where a keyboard of keys has it: the block of digits
                     * is three columns wide and keeps its shape.
                     *
                     * The key fires
        {@link #event:escape escape}
         and does nothing else;
                     * what it should mean is left to the application.
         */
        showEscape?: boolean | PropertyBindingInfo | `{${string}}`;

        /**
         * What the Enter key says. Empty leaves it the arrow it is.
         */
        enterText?: string | PropertyBindingInfo;
    }

    export default interface NumberPad {

        // property: mode

        /**
         * The block of digits.
        
        <code>Simple</code> is the pad of a computer, 7 8 9 on top.
        <code>Phone</code> is the pad of a telephone, 1 2 3 on top with
        a star and a hash beside the zero. <code>Calculator</code> adds
        the four basic operations and an equals sign.
         */
        getMode(): NumberPadMode;

        /**
         * The block of digits.
        
        <code>Simple</code> is the pad of a computer, 7 8 9 on top.
        <code>Phone</code> is the pad of a telephone, 1 2 3 on top with
        a star and a hash beside the zero. <code>Calculator</code> adds
        the four basic operations and an equals sign.
         */
        setMode(mode: NumberPadMode): this;

        // property: showSpecialCharacters

        /**
         * Whether a set of signs is reachable from the pad - the one a
        password is made of, and the punctuation of a note.
         */
        getShowSpecialCharacters(): boolean;

        /**
         * Whether a set of signs is reachable from the pad - the one a
        password is made of, and the punctuation of a note.
         */
        setShowSpecialCharacters(showSpecialCharacters: boolean): this;

        // property: showDecimalSeparator

        /**
         * Whether the pad has a key for the decimal separator.
        
        Only looked at in <code>Simple</code>: the other two blocks have
        their fourth row taken, by the star and the hash of a telephone
        and by the operations of a calculator.
         */
        getShowDecimalSeparator(): boolean;

        /**
         * Whether the pad has a key for the decimal separator.
        
        Only looked at in <code>Simple</code>: the other two blocks have
        their fourth row taken, by the star and the hash of a telephone
        and by the operations of a calculator.
         */
        setShowDecimalSeparator(showDecimalSeparator: boolean): this;

        // property: decimalSeparator

        /**
         * The sign the decimal key writes. Empty takes the one of the
        current language - a comma in German, a point in English.
         */
        getDecimalSeparator(): string;

        /**
         * The sign the decimal key writes. Empty takes the one of the
        current language - a comma in German, a point in English.
         */
        setDecimalSeparator(decimalSeparator: string): this;

        // property: showSign

        /**
         * /**
                     * Whether the pad has a minus key, for a value that may be
                     * negative. Only looked at in <code>Simple</code>, see
                     *
        {@link #getShowDecimalSeparator showDecimalSeparator}
        .
         */
        getShowSign(): boolean;

        /**
         * /**
                     * Whether the pad has a minus key, for a value that may be
                     * negative. Only looked at in <code>Simple</code>, see
                     *
        {@link #getShowDecimalSeparator showDecimalSeparator}
        .
         */
        setShowSign(showSign: boolean): this;

        // property: showEscape

        /**
         * /**
                     * Whether the pad has an <code>{esc}</code> key.
                     *
                     * It goes into the row of function keys rather than into the top
                     * left corner, where a keyboard of keys has it: the block of digits
                     * is three columns wide and keeps its shape.
                     *
                     * The key fires
        {@link #event:escape escape}
         and does nothing else;
                     * what it should mean is left to the application.
         */
        getShowEscape(): boolean;

        /**
         * /**
                     * Whether the pad has an <code>{esc}</code> key.
                     *
                     * It goes into the row of function keys rather than into the top
                     * left corner, where a keyboard of keys has it: the block of digits
                     * is three columns wide and keeps its shape.
                     *
                     * The key fires
        {@link #event:escape escape}
         and does nothing else;
                     * what it should mean is left to the application.
         */
        setShowEscape(showEscape: boolean): this;

        // property: enterText

        /**
         * What the Enter key says. Empty leaves it the arrow it is.
         */
        getEnterText(): string;

        /**
         * What the Enter key says. Empty leaves it the arrow it is.
         */
        setEnterText(enterText: string): this;
    }
}
