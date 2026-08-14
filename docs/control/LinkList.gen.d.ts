import Link from "sap/m/Link";
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { AggregationBindingInfo } from "sap/ui/base/ManagedObject";
import { $ControlSettings } from "sap/ui/core/Control";

declare module "./LinkList" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $LinkListSettings extends $ControlSettings {

        /**
         * whether the links lead away from this page
         */
        external?: boolean | PropertyBindingInfo | `{${string}}`;

        /**
         * the links of the row, in the order they are written
         */
        links?: Link[] | Link | AggregationBindingInfo | `{${string}}`;
    }

    export default interface LinkList {

        // property: external

        /**
         * whether the links lead away from this page
         */
        getExternal(): boolean;

        /**
         * whether the links lead away from this page
         */
        setExternal(external: boolean): this;

        // aggregation: links

        /**
         * the links of the row, in the order they are written
         */
        getLinks(): Link[];

        /**
         * the links of the row, in the order they are written
         */
        addLink(links: Link): this;

        /**
         * the links of the row, in the order they are written
         */
        insertLink(links: Link, index: number): this;

        /**
         * the links of the row, in the order they are written
         */
        removeLink(links: number | string | Link): Link | null;

        /**
         * the links of the row, in the order they are written
         */
        removeAllLinks(): Link[];

        /**
         * the links of the row, in the order they are written
         */
        indexOfLink(links: Link): number;

        /**
         * the links of the row, in the order they are written
         */
        destroyLinks(): this;
    }
}
