import Event from "sap/ui/base/Event";
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { $SliderSettings } from "./Slider";

declare module "./RangeSlider" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $RangeSliderSettings extends $SliderSettings {

        /**
         * The second value of the range. The first one is
        <code>value</code>.
         */
        value2?: number | PropertyBindingInfo | `{${string}}`;

        /**
         * Fired when the user lets go of a handle.
         */
        change?: (event: RangeSlider$ChangeEvent) => void;

        /**
         * Fired while a handle is dragged.
         */
        liveChange?: (event: RangeSlider$LiveChangeEvent) => void;
    }

    export default interface RangeSlider {

        // property: value2

        /**
         * The second value of the range. The first one is
        <code>value</code>.
         */
        getValue2(): number;

        /**
         * The second value of the range. The first one is
        <code>value</code>.
         */
        setValue2(value2: number): this;

        // event: change

        /**
         * Fired when the user lets go of a handle.
         */
        attachChange(fn: (event: RangeSlider$ChangeEvent) => void, listener?: object): this;

        /**
         * Fired when the user lets go of a handle.
         */
        attachChange<CustomDataType extends object>(data: CustomDataType, fn: (event: RangeSlider$ChangeEvent, data: CustomDataType) => void, listener?: object): this;

        /**
         * Fired when the user lets go of a handle.
         */
        detachChange(fn: (event: RangeSlider$ChangeEvent) => void, listener?: object): this;

        /**
         * Fired when the user lets go of a handle.
         */
        fireChange(parameters?: RangeSlider$ChangeEventParameters): this;

        // event: liveChange

        /**
         * Fired while a handle is dragged.
         */
        attachLiveChange(fn: (event: RangeSlider$LiveChangeEvent) => void, listener?: object): this;

        /**
         * Fired while a handle is dragged.
         */
        attachLiveChange<CustomDataType extends object>(data: CustomDataType, fn: (event: RangeSlider$LiveChangeEvent, data: CustomDataType) => void, listener?: object): this;

        /**
         * Fired while a handle is dragged.
         */
        detachLiveChange(fn: (event: RangeSlider$LiveChangeEvent) => void, listener?: object): this;

        /**
         * Fired while a handle is dragged.
         */
        fireLiveChange(parameters?: RangeSlider$LiveChangeEventParameters): this;
    }

    /**
     * Interface describing the parameters of RangeSlider's 'change' event.
     * Fired when the user lets go of a handle.
     */
    export interface RangeSlider$ChangeEventParameters {
        value?: number;
        value2?: number;
    }

    /**
     * Interface describing the parameters of RangeSlider's 'liveChange' event.
     * Fired while a handle is dragged.
     */
    export interface RangeSlider$LiveChangeEventParameters {
        value?: number;
        value2?: number;
    }

    /**
     * Type describing the RangeSlider's 'change' event.
     * Fired when the user lets go of a handle.
     */
    export type RangeSlider$ChangeEvent = Event<RangeSlider$ChangeEventParameters>;

    /**
     * Type describing the RangeSlider's 'liveChange' event.
     * Fired while a handle is dragged.
     */
    export type RangeSlider$LiveChangeEvent = Event<RangeSlider$LiveChangeEventParameters>;
}
