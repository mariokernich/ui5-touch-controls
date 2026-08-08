import Event from "sap/ui/base/Event";
import { CSSSize } from "sap/ui/core/library";
import { SizeMode } from "ui5/touch/controls/library";
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { $ControlSettings } from "sap/ui/core/Control";

declare module "./Slider" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $SliderSettings extends $ControlSettings {

        /**
         * The current value.
         */
        value?: number | PropertyBindingInfo | `{${string}}`;

        /**
         * Smallest value that can be selected.
         */
        min?: number | PropertyBindingInfo | `{${string}}`;

        /**
         * Largest value that can be selected.
         */
        max?: number | PropertyBindingInfo | `{${string}}`;

        /**
         * Distance between two selectable values.
         */
        step?: number | PropertyBindingInfo | `{${string}}`;

        /**
         * Shows the current value in a bubble above the handle while the
        slider is touched.
         */
        showTooltip?: boolean | PropertyBindingInfo | `{${string}}`;

        /**
         * Draws a tick for every step. Ignored when the steps would end up
        closer together than two pixels.
         */
        enableTickmarks?: boolean | PropertyBindingInfo | `{${string}}`;

        /**
         * Indicates whether the user can interact with the control.
         */
        enabled?: boolean | PropertyBindingInfo | `{${string}}`;

        /**
         * Width of the control.
         */
        width?: CSSSize | PropertyBindingInfo | `{${string}}`;

        /**
         * Touch size: it scales handle, track and the row around them.
         */
        size?: SizeMode | PropertyBindingInfo | `{${string}}`;

        /**
         * Fired when the user lets go of the handle.
         */
        change?: (event: Slider$ChangeEvent) => void;

        /**
         * Fired while the handle is dragged.
         */
        liveChange?: (event: Slider$LiveChangeEvent) => void;
    }

    export default interface Slider {

        // property: value

        /**
         * The current value.
         */
        getValue(): number;

        /**
         * The current value.
         */
        setValue(value: number): this;

        // property: min

        /**
         * Smallest value that can be selected.
         */
        getMin(): number;

        /**
         * Smallest value that can be selected.
         */
        setMin(min: number): this;

        // property: max

        /**
         * Largest value that can be selected.
         */
        getMax(): number;

        /**
         * Largest value that can be selected.
         */
        setMax(max: number): this;

        // property: step

        /**
         * Distance between two selectable values.
         */
        getStep(): number;

        /**
         * Distance between two selectable values.
         */
        setStep(step: number): this;

        // property: showTooltip

        /**
         * Shows the current value in a bubble above the handle while the
        slider is touched.
         */
        getShowTooltip(): boolean;

        /**
         * Shows the current value in a bubble above the handle while the
        slider is touched.
         */
        setShowTooltip(showTooltip: boolean): this;

        // property: enableTickmarks

        /**
         * Draws a tick for every step. Ignored when the steps would end up
        closer together than two pixels.
         */
        getEnableTickmarks(): boolean;

        /**
         * Draws a tick for every step. Ignored when the steps would end up
        closer together than two pixels.
         */
        setEnableTickmarks(enableTickmarks: boolean): this;

        // property: enabled

        /**
         * Indicates whether the user can interact with the control.
         */
        getEnabled(): boolean;

        /**
         * Indicates whether the user can interact with the control.
         */
        setEnabled(enabled: boolean): this;

        // property: width

        /**
         * Width of the control.
         */
        getWidth(): CSSSize;

        /**
         * Width of the control.
         */
        setWidth(width: CSSSize): this;

        // property: size

        /**
         * Touch size: it scales handle, track and the row around them.
         */
        getSize(): SizeMode;

        /**
         * Touch size: it scales handle, track and the row around them.
         */
        setSize(size: SizeMode): this;

        // event: change

        /**
         * Fired when the user lets go of the handle.
         */
        attachChange(fn: (event: Slider$ChangeEvent) => void, listener?: object): this;

        /**
         * Fired when the user lets go of the handle.
         */
        attachChange<CustomDataType extends object>(data: CustomDataType, fn: (event: Slider$ChangeEvent, data: CustomDataType) => void, listener?: object): this;

        /**
         * Fired when the user lets go of the handle.
         */
        detachChange(fn: (event: Slider$ChangeEvent) => void, listener?: object): this;

        /**
         * Fired when the user lets go of the handle.
         */
        fireChange(parameters?: Slider$ChangeEventParameters): this;

        // event: liveChange

        /**
         * Fired while the handle is dragged.
         */
        attachLiveChange(fn: (event: Slider$LiveChangeEvent) => void, listener?: object): this;

        /**
         * Fired while the handle is dragged.
         */
        attachLiveChange<CustomDataType extends object>(data: CustomDataType, fn: (event: Slider$LiveChangeEvent, data: CustomDataType) => void, listener?: object): this;

        /**
         * Fired while the handle is dragged.
         */
        detachLiveChange(fn: (event: Slider$LiveChangeEvent) => void, listener?: object): this;

        /**
         * Fired while the handle is dragged.
         */
        fireLiveChange(parameters?: Slider$LiveChangeEventParameters): this;
    }

    /**
     * Interface describing the parameters of Slider's 'change' event.
     * Fired when the user lets go of the handle.
     */
    export interface Slider$ChangeEventParameters {
        value?: number;
    }

    /**
     * Interface describing the parameters of Slider's 'liveChange' event.
     * Fired while the handle is dragged.
     */
    export interface Slider$LiveChangeEventParameters {
        value?: number;
    }

    /**
     * Type describing the Slider's 'change' event.
     * Fired when the user lets go of the handle.
     */
    export type Slider$ChangeEvent = Event<Slider$ChangeEventParameters>;

    /**
     * Type describing the Slider's 'liveChange' event.
     * Fired while the handle is dragged.
     */
    export type Slider$LiveChangeEvent = Event<Slider$LiveChangeEventParameters>;
}
