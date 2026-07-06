import Control from "sap/ui/core/Control";
import { AggregationBindingInfo } from "sap/ui/base/ManagedObject";
import { $ControlSettings } from "sap/ui/core/Control";

declare module "./Toolbar" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $ToolbarSettings extends $ControlSettings {

        /**
         * The content of the toolbar.
         */
        content?: Control[] | Control | AggregationBindingInfo | `{${string}}`;

        /**
         * Association to controls / ids which label this control (see WAI-ARIA attribute aria-labelledby).
         */
        ariaLabelledBy?: Control | string | (Control | string)[];
    }

    export default interface Toolbar {

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

        // association: ariaLabelledBy

        /**
         * Association to controls / ids which label this control (see WAI-ARIA attribute aria-labelledby).
         */
        getAriaLabelledBy(): string[];

        /**
         * Association to controls / ids which label this control (see WAI-ARIA attribute aria-labelledby).
         */
        addAriaLabelledBy(ariaLabelledBy: string | Control): this;

        /**
         * Association to controls / ids which label this control (see WAI-ARIA attribute aria-labelledby).
         */
        removeAriaLabelledBy(ariaLabelledBy: number | string | Control): string;

        /**
         * Association to controls / ids which label this control (see WAI-ARIA attribute aria-labelledby).
         */
        removeAllAriaLabelledBy(): string[];
    }
}
