import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { $ElementSettings } from "sap/ui/core/Element";

declare module "./KeyboardKey" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $KeyboardKeySettings extends $ElementSettings {

        /**
         * The key this text belongs to: <code>numbers</code>,
        <code>ent</code>, <code>a</code>.
        
        The braces of a special key may be left out, and are better left
        out in a view: UI5 reads a string that begins with a brace as a
        binding, so <code>key="{numbers}"</code> would have to be
        escaped to be read as a text. Both spellings mean the same key,
        as do the names of simple-keyboard - <code>ent</code> and
        <code>enter</code> are one key.
         */
        key?: string | PropertyBindingInfo;

        /**
         * What the key says. An empty text leaves the key with what the
        keyboard would have shown by itself.
         */
        text?: string | PropertyBindingInfo;
    }

    export default interface KeyboardKey {

        // property: key

        /**
         * The key this text belongs to: <code>numbers</code>,
        <code>ent</code>, <code>a</code>.
        
        The braces of a special key may be left out, and are better left
        out in a view: UI5 reads a string that begins with a brace as a
        binding, so <code>key="{numbers}"</code> would have to be
        escaped to be read as a text. Both spellings mean the same key,
        as do the names of simple-keyboard - <code>ent</code> and
        <code>enter</code> are one key.
         */
        getKey(): string;

        /**
         * The key this text belongs to: <code>numbers</code>,
        <code>ent</code>, <code>a</code>.
        
        The braces of a special key may be left out, and are better left
        out in a view: UI5 reads a string that begins with a brace as a
        binding, so <code>key="{numbers}"</code> would have to be
        escaped to be read as a text. Both spellings mean the same key,
        as do the names of simple-keyboard - <code>ent</code> and
        <code>enter</code> are one key.
         */
        setKey(key: string): this;

        // property: text

        /**
         * What the key says. An empty text leaves the key with what the
        keyboard would have shown by itself.
         */
        getText(): string;

        /**
         * What the key says. An empty text leaves the key with what the
        keyboard would have shown by itself.
         */
        setText(text: string): this;
    }
}
