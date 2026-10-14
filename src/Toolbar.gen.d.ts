import { SizeMode } from "ui5/touch/controls/library";
import Control from "sap/ui/core/Control";
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { AggregationBindingInfo } from "sap/ui/base/ManagedObject";
import { $ToolbarSettings } from "sap/m/Toolbar";

declare module "./Toolbar" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $ToolbarSettings_1 extends $ToolbarSettings {

        /**
         * Touch size of the toolbar: it is at least as tall as a button of
        this size, so it keeps its height when its content changes.
         */
        size?: SizeMode | PropertyBindingInfo | `{${string}}`;

        /**
         * The content of the toolbar.
         */
        content?: Control[] | Control | AggregationBindingInfo | `{${string}}`;
    }

    export default interface Toolbar {

        // property: size

        /**
         * Touch size of the toolbar: it is at least as tall as a button of
        this size, so it keeps its height when its content changes.
         */
        getSize(): SizeMode;

        /**
         * Touch size of the toolbar: it is at least as tall as a button of
        this size, so it keeps its height when its content changes.
         */
        setSize(size: SizeMode): this;

        // aggregation: content

        /**
         * The content of the toolbar.
         */
        getContent(): Control[];

        /**
         * The content of the toolbar.
         */
        addContent(content: Control): this;

        /**
         * The content of the toolbar.
         */
        insertContent(content: Control, index: number): this;

        /**
         * The content of the toolbar.
         */
        removeContent(content: number | string | Control): Control | null;

        /**
         * The content of the toolbar.
         */
        removeAllContent(): Control[];

        /**
         * The content of the toolbar.
         */
        indexOfContent(content: Control): number;

        /**
         * The content of the toolbar.
         */
        destroyContent(): this;
    }
}
