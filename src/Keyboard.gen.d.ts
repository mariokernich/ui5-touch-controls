import { KeyboardMode } from "ui5/touch/controls/library";
import { NumberKeys } from "ui5/touch/controls/library";
import { LetterCase } from "ui5/touch/controls/library";
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { $KeyboardBaseSettings } from "./KeyboardBase";

declare module "./Keyboard" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $KeyboardSettings extends $KeyboardBaseSettings {

        /**
         * The arrangement of the letters - the keyboard of a country, by
        the language it is used for.
         */
        mode?: KeyboardMode | PropertyBindingInfo | `{${string}}`;

        /**
         * Whether the keyboard shows digits, and how.
        
        <code>Always</code> puts a row of them over the letters, the way
        a keyboard of keys has it. <code>Toggle</code> leaves the
        letters to themselves and puts the digits behind a key, the way
        a phone does it - a row of digits there would make every key
        narrow. <code>ToggleOnMobile</code>, the default, is the first
        on a computer and a tablet and the second on a phone.
         */
        displayNumbers?: NumberKeys | PropertyBindingInfo | `{${string}}`;

        /**
         * Whether a set of brackets, signs and currencies is reachable
        from the keyboard.
        
        Where the digits are behind a key of their own, the set sits
        behind them - the way of a phone, which goes from its letters to
        its digits to its symbols and back. Otherwise a key of its own
        leads there.
         */
        showSpecialCharacters?: boolean | PropertyBindingInfo | `{${string}}`;

        /**
         * /**
                     * Whether the keyboard has a caps lock next to its shift key.
                     *
                     * Shift falls away after one letter, the lock stays on until it is
                     * pressed again - and shift while the lock is on writes lower case,
                     * the way it does on a keyboard of keys. A keyboard that writes one
                     * case only has neither, see
        {@link #getLetterCase letterCase}
        .
         */
        showCapsLock?: boolean | PropertyBindingInfo | `{${string}}`;

        /**
         * The case the keyboard writes its letters in.
        
        <code>Upper</code> and <code>Lower</code> pin it to one case and
        leave the shift key and the caps lock off - there is nothing to
        switch. That is what a field with a case of its own wants: a
        material number, a licence plate, a batch.
        
        Not looked at for a script without case; Devanagari has a second
        set of letters instead of capitals.
         */
        letterCase?: LetterCase | PropertyBindingInfo | `{${string}}`;

        /**
         * Whether a set of faces is reachable from the keyboard.
        
        A key of its own leads to them and the <code>{abc}</code> key
        leads back, the same way the digits and the special characters
        are reached. Only faces of a single character are on it: one put
        together from several - a family, a flag - would be taken apart
        again by the backspace.
         */
        showEmojis?: boolean | PropertyBindingInfo | `{${string}}`;

        /**
         * Keys that stand beside the space bar on every set of the
        keyboard, whichever one is on screen.
        
        This is where a key goes that a field needs at hand rather than
        behind a switch - the at sign of an address, the dot of a domain,
        a unit. They are written as they should be typed:
        <code>extraKeys="@,."</code> in a view, which UI5 reads as the
        two keys <code>@</code> and <code>.</code>
         */
        extraKeys?: string[] | PropertyBindingInfo | `{${string}}`;

        /**
         * /**
                     * Whether the keyboard has an <code>{esc}</code> key.
                     *
                     * It is the first key of the top row, where a keyboard of keys has
                     * it, and it is there on every set. The key fires
                     *
        {@link #event:escape escape}
         and does nothing else; what it
                     * should mean is left to the application.
         */
        showEscape?: boolean | PropertyBindingInfo | `{${string}}`;

        /**
         * /**
                     * What the Enter key says. Empty leaves it the arrow it is.
                     *
                     * A keyboard that ends a search says Search on it, one that leads
                     * on says Next. This is the one key a keyboard of this kind has
                     * reason to rename; everything further is a
                     *
        {@link ui5.touch.controls.CustomKeyboard}
         with its
                     * <code>display</code> aggregation.
         */
        enterText?: string | PropertyBindingInfo;
    }

    export default interface Keyboard {

        // property: mode

        /**
         * The arrangement of the letters - the keyboard of a country, by
        the language it is used for.
         */
        getMode(): KeyboardMode;

        /**
         * The arrangement of the letters - the keyboard of a country, by
        the language it is used for.
         */
        setMode(mode: KeyboardMode): this;

        // property: displayNumbers

        /**
         * Whether the keyboard shows digits, and how.
        
        <code>Always</code> puts a row of them over the letters, the way
        a keyboard of keys has it. <code>Toggle</code> leaves the
        letters to themselves and puts the digits behind a key, the way
        a phone does it - a row of digits there would make every key
        narrow. <code>ToggleOnMobile</code>, the default, is the first
        on a computer and a tablet and the second on a phone.
         */
        getDisplayNumbers(): NumberKeys;

        /**
         * Whether the keyboard shows digits, and how.
        
        <code>Always</code> puts a row of them over the letters, the way
        a keyboard of keys has it. <code>Toggle</code> leaves the
        letters to themselves and puts the digits behind a key, the way
        a phone does it - a row of digits there would make every key
        narrow. <code>ToggleOnMobile</code>, the default, is the first
        on a computer and a tablet and the second on a phone.
         */
        setDisplayNumbers(displayNumbers: NumberKeys): this;

        // property: showSpecialCharacters

        /**
         * Whether a set of brackets, signs and currencies is reachable
        from the keyboard.
        
        Where the digits are behind a key of their own, the set sits
        behind them - the way of a phone, which goes from its letters to
        its digits to its symbols and back. Otherwise a key of its own
        leads there.
         */
        getShowSpecialCharacters(): boolean;

        /**
         * Whether a set of brackets, signs and currencies is reachable
        from the keyboard.
        
        Where the digits are behind a key of their own, the set sits
        behind them - the way of a phone, which goes from its letters to
        its digits to its symbols and back. Otherwise a key of its own
        leads there.
         */
        setShowSpecialCharacters(showSpecialCharacters: boolean): this;

        // property: showCapsLock

        /**
         * /**
                     * Whether the keyboard has a caps lock next to its shift key.
                     *
                     * Shift falls away after one letter, the lock stays on until it is
                     * pressed again - and shift while the lock is on writes lower case,
                     * the way it does on a keyboard of keys. A keyboard that writes one
                     * case only has neither, see
        {@link #getLetterCase letterCase}
        .
         */
        getShowCapsLock(): boolean;

        /**
         * /**
                     * Whether the keyboard has a caps lock next to its shift key.
                     *
                     * Shift falls away after one letter, the lock stays on until it is
                     * pressed again - and shift while the lock is on writes lower case,
                     * the way it does on a keyboard of keys. A keyboard that writes one
                     * case only has neither, see
        {@link #getLetterCase letterCase}
        .
         */
        setShowCapsLock(showCapsLock: boolean): this;

        // property: letterCase

        /**
         * The case the keyboard writes its letters in.
        
        <code>Upper</code> and <code>Lower</code> pin it to one case and
        leave the shift key and the caps lock off - there is nothing to
        switch. That is what a field with a case of its own wants: a
        material number, a licence plate, a batch.
        
        Not looked at for a script without case; Devanagari has a second
        set of letters instead of capitals.
         */
        getLetterCase(): LetterCase;

        /**
         * The case the keyboard writes its letters in.
        
        <code>Upper</code> and <code>Lower</code> pin it to one case and
        leave the shift key and the caps lock off - there is nothing to
        switch. That is what a field with a case of its own wants: a
        material number, a licence plate, a batch.
        
        Not looked at for a script without case; Devanagari has a second
        set of letters instead of capitals.
         */
        setLetterCase(letterCase: LetterCase): this;

        // property: showEmojis

        /**
         * Whether a set of faces is reachable from the keyboard.
        
        A key of its own leads to them and the <code>{abc}</code> key
        leads back, the same way the digits and the special characters
        are reached. Only faces of a single character are on it: one put
        together from several - a family, a flag - would be taken apart
        again by the backspace.
         */
        getShowEmojis(): boolean;

        /**
         * Whether a set of faces is reachable from the keyboard.
        
        A key of its own leads to them and the <code>{abc}</code> key
        leads back, the same way the digits and the special characters
        are reached. Only faces of a single character are on it: one put
        together from several - a family, a flag - would be taken apart
        again by the backspace.
         */
        setShowEmojis(showEmojis: boolean): this;

        // property: extraKeys

        /**
         * Keys that stand beside the space bar on every set of the
        keyboard, whichever one is on screen.
        
        This is where a key goes that a field needs at hand rather than
        behind a switch - the at sign of an address, the dot of a domain,
        a unit. They are written as they should be typed:
        <code>extraKeys="@,."</code> in a view, which UI5 reads as the
        two keys <code>@</code> and <code>.</code>
         */
        getExtraKeys(): string[];

        /**
         * Keys that stand beside the space bar on every set of the
        keyboard, whichever one is on screen.
        
        This is where a key goes that a field needs at hand rather than
        behind a switch - the at sign of an address, the dot of a domain,
        a unit. They are written as they should be typed:
        <code>extraKeys="@,."</code> in a view, which UI5 reads as the
        two keys <code>@</code> and <code>.</code>
         */
        setExtraKeys(extraKeys: string[]): this;

        // property: showEscape

        /**
         * /**
                     * Whether the keyboard has an <code>{esc}</code> key.
                     *
                     * It is the first key of the top row, where a keyboard of keys has
                     * it, and it is there on every set. The key fires
                     *
        {@link #event:escape escape}
         and does nothing else; what it
                     * should mean is left to the application.
         */
        getShowEscape(): boolean;

        /**
         * /**
                     * Whether the keyboard has an <code>{esc}</code> key.
                     *
                     * It is the first key of the top row, where a keyboard of keys has
                     * it, and it is there on every set. The key fires
                     *
        {@link #event:escape escape}
         and does nothing else; what it
                     * should mean is left to the application.
         */
        setShowEscape(showEscape: boolean): this;

        // property: enterText

        /**
         * /**
                     * What the Enter key says. Empty leaves it the arrow it is.
                     *
                     * A keyboard that ends a search says Search on it, one that leads
                     * on says Next. This is the one key a keyboard of this kind has
                     * reason to rename; everything further is a
                     *
        {@link ui5.touch.controls.CustomKeyboard}
         with its
                     * <code>display</code> aggregation.
         */
        getEnterText(): string;

        /**
         * /**
                     * What the Enter key says. Empty leaves it the arrow it is.
                     *
                     * A keyboard that ends a search says Search on it, one that leads
                     * on says Next. This is the one key a keyboard of this kind has
                     * reason to rename; everything further is a
                     *
        {@link ui5.touch.controls.CustomKeyboard}
         with its
                     * <code>display</code> aggregation.
         */
        setEnterText(enterText: string): this;
    }
}
