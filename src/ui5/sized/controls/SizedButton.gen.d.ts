import Event from "sap/ui/base/Event";
import { ButtonType } from "sap/m/library";
import { URI } from "sap/ui/core/library";
import { CSSSize } from "sap/ui/core/library";
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { $ControlSettings } from "sap/ui/core/Control";

declare module "./SizedButton" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $SizedButtonSettings extends $ControlSettings {
        text?: string | PropertyBindingInfo;
        type?: ButtonType | PropertyBindingInfo | `{${string}}`;
        enabled?: boolean | PropertyBindingInfo | `{${string}}`;
        icon?: URI | PropertyBindingInfo | `{${string}}`;
        iconFirst?: boolean | PropertyBindingInfo | `{${string}}`;
        height?: CSSSize | PropertyBindingInfo | `{${string}}`;
        sidePadding?: CSSSize | PropertyBindingInfo | `{${string}}`;
        width?: CSSSize | PropertyBindingInfo | `{${string}}`;
        iconSize?: CSSSize | PropertyBindingInfo | `{${string}}`;

        /**
         * Fired when the user clicks or taps on the control.
         */
        press?: (event: SizedButton$PressEvent) => void;
    }

    export default interface SizedButton {

        // property: text
        getText(): string;
        setText(text: string): this;

        // property: type
        getType(): ButtonType;
        setType(type: ButtonType): this;

        // property: enabled
        getEnabled(): boolean;
        setEnabled(enabled: boolean): this;

        // property: icon
        getIcon(): URI;
        setIcon(icon: URI): this;

        // property: iconFirst
        getIconFirst(): boolean;
        setIconFirst(iconFirst: boolean): this;

        // property: height
        getHeight(): CSSSize;
        setHeight(height: CSSSize): this;

        // property: sidePadding
        getSidePadding(): CSSSize;
        setSidePadding(sidePadding: CSSSize): this;

        // property: width
        getWidth(): CSSSize;
        setWidth(width: CSSSize): this;

        // property: iconSize
        getIconSize(): CSSSize;
        setIconSize(iconSize: CSSSize): this;

        // event: press

        /**
         * Fired when the user clicks or taps on the control.
         */
        attachPress(fn: (event: SizedButton$PressEvent) => void, listener?: object): this;

        /**
         * Fired when the user clicks or taps on the control.
         */
        attachPress<CustomDataType extends object>(data: CustomDataType, fn: (event: SizedButton$PressEvent, data: CustomDataType) => void, listener?: object): this;

        /**
         * Fired when the user clicks or taps on the control.
         */
        detachPress(fn: (event: SizedButton$PressEvent) => void, listener?: object): this;

        /**
         * Fired when the user clicks or taps on the control.
         */
        firePress(parameters?: SizedButton$PressEventParameters): this;
    }

    /**
     * Interface describing the parameters of SizedButton's 'press' event.
     * Fired when the user clicks or taps on the control.
     */
    // eslint-disable-next-line
    export interface SizedButton$PressEventParameters {
    }

    /**
     * Type describing the SizedButton's 'press' event.
     * Fired when the user clicks or taps on the control.
     */
    export type SizedButton$PressEvent = Event<SizedButton$PressEventParameters>;
}
