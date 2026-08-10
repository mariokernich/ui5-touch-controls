import Event from "sap/ui/base/Event";
import { CSSSize } from "sap/ui/core/library";
import { ValueState } from "sap/ui/core/library";
import { SizeMode } from "ui5/touch/controls/library";
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { $ControlSettings } from "sap/ui/core/Control";

declare module "./SignaturePad" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $SignaturePadSettings extends $ControlSettings {

        /**
         * The signature as a PNG data URL, empty while nothing is drawn.
        Setting it from outside is only meaningful to clear the pad -
        pass an empty string.
         */
        value?: string | PropertyBindingInfo;

        /**
         * Hint shown on the baseline while the pad is empty.
         */
        placeholder?: string | PropertyBindingInfo;

        /**
         * Height of the pad.
         */
        height?: CSSSize | PropertyBindingInfo | `{${string}}`;

        /**
         * Width of the pad.
         */
        width?: CSSSize | PropertyBindingInfo | `{${string}}`;

        /**
         * Shows the button that clears the pad.
         */
        showClearButton?: boolean | PropertyBindingInfo | `{${string}}`;

        /**
         * Indicates whether the user can sign.
         */
        enabled?: boolean | PropertyBindingInfo | `{${string}}`;

        /**
         * Visualizes the validation state, e.g. Error, Warning, Success,
        Information.
         */
        valueState?: ValueState | PropertyBindingInfo | `{${string}}`;

        /**
         * Touch size: it scales the stroke, the placeholder and the clear
        button.
         */
        size?: SizeMode | PropertyBindingInfo | `{${string}}`;

        /**
         * Fired when a stroke is finished and when the pad is cleared.
         */
        change?: (event: SignaturePad$ChangeEvent) => void;
    }

    export default interface SignaturePad {

        // property: value

        /**
         * The signature as a PNG data URL, empty while nothing is drawn.
        Setting it from outside is only meaningful to clear the pad -
        pass an empty string.
         */
        getValue(): string;

        /**
         * The signature as a PNG data URL, empty while nothing is drawn.
        Setting it from outside is only meaningful to clear the pad -
        pass an empty string.
         */
        setValue(value: string): this;

        // property: placeholder

        /**
         * Hint shown on the baseline while the pad is empty.
         */
        getPlaceholder(): string;

        /**
         * Hint shown on the baseline while the pad is empty.
         */
        setPlaceholder(placeholder: string): this;

        // property: height

        /**
         * Height of the pad.
         */
        getHeight(): CSSSize;

        /**
         * Height of the pad.
         */
        setHeight(height: CSSSize): this;

        // property: width

        /**
         * Width of the pad.
         */
        getWidth(): CSSSize;

        /**
         * Width of the pad.
         */
        setWidth(width: CSSSize): this;

        // property: showClearButton

        /**
         * Shows the button that clears the pad.
         */
        getShowClearButton(): boolean;

        /**
         * Shows the button that clears the pad.
         */
        setShowClearButton(showClearButton: boolean): this;

        // property: enabled

        /**
         * Indicates whether the user can sign.
         */
        getEnabled(): boolean;

        /**
         * Indicates whether the user can sign.
         */
        setEnabled(enabled: boolean): this;

        // property: valueState

        /**
         * Visualizes the validation state, e.g. Error, Warning, Success,
        Information.
         */
        getValueState(): ValueState;

        /**
         * Visualizes the validation state, e.g. Error, Warning, Success,
        Information.
         */
        setValueState(valueState: ValueState): this;

        // property: size

        /**
         * Touch size: it scales the stroke, the placeholder and the clear
        button.
         */
        getSize(): SizeMode;

        /**
         * Touch size: it scales the stroke, the placeholder and the clear
        button.
         */
        setSize(size: SizeMode): this;

        // event: change

        /**
         * Fired when a stroke is finished and when the pad is cleared.
         */
        attachChange(fn: (event: SignaturePad$ChangeEvent) => void, listener?: object): this;

        /**
         * Fired when a stroke is finished and when the pad is cleared.
         */
        attachChange<CustomDataType extends object>(data: CustomDataType, fn: (event: SignaturePad$ChangeEvent, data: CustomDataType) => void, listener?: object): this;

        /**
         * Fired when a stroke is finished and when the pad is cleared.
         */
        detachChange(fn: (event: SignaturePad$ChangeEvent) => void, listener?: object): this;

        /**
         * Fired when a stroke is finished and when the pad is cleared.
         */
        fireChange(parameters?: SignaturePad$ChangeEventParameters): this;
    }

    /**
     * Interface describing the parameters of SignaturePad's 'change' event.
     * Fired when a stroke is finished and when the pad is cleared.
     */
    export interface SignaturePad$ChangeEventParameters {
        value?: string;
        signed?: boolean;
    }

    /**
     * Type describing the SignaturePad's 'change' event.
     * Fired when a stroke is finished and when the pad is cleared.
     */
    export type SignaturePad$ChangeEvent = Event<SignaturePad$ChangeEventParameters>;
}
