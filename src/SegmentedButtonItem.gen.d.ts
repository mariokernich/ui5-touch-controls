import Event from "sap/ui/base/Event";
import { URI } from "sap/ui/core/library";
import { CSSSize } from "sap/ui/core/library";
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { $ItemSettings } from "sap/ui/core/Item";

declare module "./SegmentedButtonItem" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $SegmentedButtonItemSettings extends $ItemSettings {

        /**
         * The icon of the segment. This can be a URI to an image or an icon
        font URI.
         */
        icon?: URI | PropertyBindingInfo | `{${string}}`;

        /**
         * Indicates whether the segment is shown.
         */
        visible?: boolean | PropertyBindingInfo | `{${string}}`;

        /**
         * Width of this single segment. Without it the segment is as wide as
        its content.
         */
        width?: CSSSize | PropertyBindingInfo | `{${string}}`;

        /**
         * Fired when the user selects this segment.
         */
        press?: (event: SegmentedButtonItem$PressEvent) => void;
    }

    export default interface SegmentedButtonItem {

        // property: icon

        /**
         * The icon of the segment. This can be a URI to an image or an icon
        font URI.
         */
        getIcon(): URI;

        /**
         * The icon of the segment. This can be a URI to an image or an icon
        font URI.
         */
        setIcon(icon: URI): this;

        // property: visible

        /**
         * Indicates whether the segment is shown.
         */
        getVisible(): boolean;

        /**
         * Indicates whether the segment is shown.
         */
        setVisible(visible: boolean): this;

        // property: width

        /**
         * Width of this single segment. Without it the segment is as wide as
        its content.
         */
        getWidth(): CSSSize;

        /**
         * Width of this single segment. Without it the segment is as wide as
        its content.
         */
        setWidth(width: CSSSize): this;

        // event: press

        /**
         * Fired when the user selects this segment.
         */
        attachPress(fn: (event: SegmentedButtonItem$PressEvent) => void, listener?: object): this;

        /**
         * Fired when the user selects this segment.
         */
        attachPress<CustomDataType extends object>(data: CustomDataType, fn: (event: SegmentedButtonItem$PressEvent, data: CustomDataType) => void, listener?: object): this;

        /**
         * Fired when the user selects this segment.
         */
        detachPress(fn: (event: SegmentedButtonItem$PressEvent) => void, listener?: object): this;

        /**
         * Fired when the user selects this segment.
         */
        firePress(parameters?: SegmentedButtonItem$PressEventParameters): this;
    }

    /**
     * Interface describing the parameters of SegmentedButtonItem's 'press' event.
     * Fired when the user selects this segment.
     */
    // eslint-disable-next-line
    export interface SegmentedButtonItem$PressEventParameters {
    }

    /**
     * Type describing the SegmentedButtonItem's 'press' event.
     * Fired when the user selects this segment.
     */
    export type SegmentedButtonItem$PressEvent = Event<SegmentedButtonItem$PressEventParameters>;
}
