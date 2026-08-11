import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { $ElementSettings } from "sap/ui/core/Element";

declare module "./KeyboardLayout" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $KeyboardLayoutSettings extends $ElementSettings {

        /**
         * The name of the set, and the key that switches to it: a set
        called <code>numbers</code> is reached by a
        <code>{numbers}</code> key.
        
        <code>default</code> is the set the keyboard starts with.
         */
        name?: string | PropertyBindingInfo;

        /**
         * /**
                     * The rows of the set. Each entry is one row, keys are separated by
                     * spaces, and a key in curly braces is a special one - the keys of
                     *
        {@link ui5.touch.controls.VirtualKeyboard}
         plus the name of any
                     * other set of this keyboard.
         */
        rows?: string[] | PropertyBindingInfo | `{${string}}`;
    }

    export default interface KeyboardLayout {

        // property: name

        /**
         * The name of the set, and the key that switches to it: a set
        called <code>numbers</code> is reached by a
        <code>{numbers}</code> key.
        
        <code>default</code> is the set the keyboard starts with.
         */
        getName(): string;

        /**
         * The name of the set, and the key that switches to it: a set
        called <code>numbers</code> is reached by a
        <code>{numbers}</code> key.
        
        <code>default</code> is the set the keyboard starts with.
         */
        setName(name: string): this;

        // property: rows

        /**
         * /**
                     * The rows of the set. Each entry is one row, keys are separated by
                     * spaces, and a key in curly braces is a special one - the keys of
                     *
        {@link ui5.touch.controls.VirtualKeyboard}
         plus the name of any
                     * other set of this keyboard.
         */
        getRows(): string[];

        /**
         * /**
                     * The rows of the set. Each entry is one row, keys are separated by
                     * spaces, and a key in curly braces is a special one - the keys of
                     *
        {@link ui5.touch.controls.VirtualKeyboard}
         plus the name of any
                     * other set of this keyboard.
         */
        setRows(rows: string[]): this;
    }
}
