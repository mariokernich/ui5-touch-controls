import KeyboardLayout from "ui5/touch/controls/KeyboardLayout";
import KeyboardKey from "ui5/touch/controls/KeyboardKey";
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { AggregationBindingInfo } from "sap/ui/base/ManagedObject";
import { $KeyboardBaseSettings } from "./KeyboardBase";

declare module "./CustomKeyboard" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $CustomKeyboardSettings extends $KeyboardBaseSettings {

        /**
         * The rows of keys, for a keyboard that only ever shows one set.
        Each entry is one row, keys are separated by spaces.
        
        A keyboard with sets in its <code>layouts</code> aggregation
        does not look at this property: the sets are the longer, fuller
        way of saying the same thing.
         */
        layout?: string[] | PropertyBindingInfo | `{${string}}`;

        /**
         * /**
                     * The sets of keys the keyboard can show.
                     *
                     * A keyboard with more than one set shows one of them at a time -
                     * the one called <code>default</code> to begin with - and a key
                     * written as the name of another set switches to it. That is how a
                     * keyboard of a phone gets from its letters to its digits and back
                     * without any code around it.
                     *
                     * Sets take precedence over the
        {@link #getLayout layout}
        
                     * property.
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
    }

    export default interface CustomKeyboard {

        // property: layout

        /**
         * The rows of keys, for a keyboard that only ever shows one set.
        Each entry is one row, keys are separated by spaces.
        
        A keyboard with sets in its <code>layouts</code> aggregation
        does not look at this property: the sets are the longer, fuller
        way of saying the same thing.
         */
        getLayout(): string[];

        /**
         * The rows of keys, for a keyboard that only ever shows one set.
        Each entry is one row, keys are separated by spaces.
        
        A keyboard with sets in its <code>layouts</code> aggregation
        does not look at this property: the sets are the longer, fuller
        way of saying the same thing.
         */
        setLayout(layout: string[]): this;

        // aggregation: layouts

        /**
         * /**
                     * The sets of keys the keyboard can show.
                     *
                     * A keyboard with more than one set shows one of them at a time -
                     * the one called <code>default</code> to begin with - and a key
                     * written as the name of another set switches to it. That is how a
                     * keyboard of a phone gets from its letters to its digits and back
                     * without any code around it.
                     *
                     * Sets take precedence over the
        {@link #getLayout layout}
        
                     * property.
         */
        getLayouts(): KeyboardLayout[];

        /**
         * /**
                     * The sets of keys the keyboard can show.
                     *
                     * A keyboard with more than one set shows one of them at a time -
                     * the one called <code>default</code> to begin with - and a key
                     * written as the name of another set switches to it. That is how a
                     * keyboard of a phone gets from its letters to its digits and back
                     * without any code around it.
                     *
                     * Sets take precedence over the
        {@link #getLayout layout}
        
                     * property.
         */
        addLayout_(layouts: KeyboardLayout): this;

        /**
         * /**
                     * The sets of keys the keyboard can show.
                     *
                     * A keyboard with more than one set shows one of them at a time -
                     * the one called <code>default</code> to begin with - and a key
                     * written as the name of another set switches to it. That is how a
                     * keyboard of a phone gets from its letters to its digits and back
                     * without any code around it.
                     *
                     * Sets take precedence over the
        {@link #getLayout layout}
        
                     * property.
         */
        insertLayout_(layouts: KeyboardLayout, index: number): this;

        /**
         * /**
                     * The sets of keys the keyboard can show.
                     *
                     * A keyboard with more than one set shows one of them at a time -
                     * the one called <code>default</code> to begin with - and a key
                     * written as the name of another set switches to it. That is how a
                     * keyboard of a phone gets from its letters to its digits and back
                     * without any code around it.
                     *
                     * Sets take precedence over the
        {@link #getLayout layout}
        
                     * property.
         */
        removeLayout_(layouts: number | string | KeyboardLayout): KeyboardLayout | null;

        /**
         * /**
                     * The sets of keys the keyboard can show.
                     *
                     * A keyboard with more than one set shows one of them at a time -
                     * the one called <code>default</code> to begin with - and a key
                     * written as the name of another set switches to it. That is how a
                     * keyboard of a phone gets from its letters to its digits and back
                     * without any code around it.
                     *
                     * Sets take precedence over the
        {@link #getLayout layout}
        
                     * property.
         */
        removeAllLayouts(): KeyboardLayout[];

        /**
         * /**
                     * The sets of keys the keyboard can show.
                     *
                     * A keyboard with more than one set shows one of them at a time -
                     * the one called <code>default</code> to begin with - and a key
                     * written as the name of another set switches to it. That is how a
                     * keyboard of a phone gets from its letters to its digits and back
                     * without any code around it.
                     *
                     * Sets take precedence over the
        {@link #getLayout layout}
        
                     * property.
         */
        indexOfLayout_(layouts: KeyboardLayout): number;

        /**
         * /**
                     * The sets of keys the keyboard can show.
                     *
                     * A keyboard with more than one set shows one of them at a time -
                     * the one called <code>default</code> to begin with - and a key
                     * written as the name of another set switches to it. That is how a
                     * keyboard of a phone gets from its letters to its digits and back
                     * without any code around it.
                     *
                     * Sets take precedence over the
        {@link #getLayout layout}
        
                     * property.
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
    }
}
