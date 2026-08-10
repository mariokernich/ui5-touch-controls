import { SizeMode } from "ui5/touch/controls/library";
import Control from "sap/ui/core/Control";
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { AggregationBindingInfo } from "sap/ui/base/ManagedObject";
import { $ToolbarSettings } from "sap/m/Toolbar";

declare module "./OverflowToolbar" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $OverflowToolbarSettings extends $ToolbarSettings {

        /**
         * Touch size of the overflow button.
         */
        size?: SizeMode | PropertyBindingInfo | `{${string}}`;

        /**
         * The content of the toolbar.
         */
        content?: Control[] | Control | AggregationBindingInfo | `{${string}}`;
    }

    export default interface OverflowToolbar {

        // property: size

        /**
         * Touch size of the overflow button.
         */
        getSize(): SizeMode;

        /**
         * Touch size of the overflow button.
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
