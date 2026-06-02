import Control from "sap/ui/core/Control";
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { AggregationBindingInfo } from "sap/ui/base/ManagedObject";
import { $ControlSettings } from "sap/ui/core/Control";

declare module "./Toolbar" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $ToolbarSettings extends $ControlSettings {
        active?: boolean | PropertyBindingInfo | `{${string}}`;
        enabled?: boolean | PropertyBindingInfo | `{${string}}`;
        content?: Control[] | Control | AggregationBindingInfo | `{${string}}`;
    }

    export default interface Toolbar {

        // property: active
        getActive(): boolean;
        setActive(active: boolean): this;

        // property: enabled
        getEnabled(): boolean;
        setEnabled(enabled: boolean): this;

        // aggregation: content
        getContent(): Control[];
        addContent(content: Control): this;
        insertContent(content: Control, index: number): this;
        removeContent(content: number | string | Control): Control | null;
        removeAllContent(): Control[];
        indexOfContent(content: Control): number;
        destroyContent(): this;
    }
}
