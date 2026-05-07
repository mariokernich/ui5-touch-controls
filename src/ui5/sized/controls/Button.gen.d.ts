import Event from "sap/ui/base/Event";
import { ButtonType } from "sap/m/library";
import { URI } from "sap/ui/core/library";
import { CSSSize } from "sap/ui/core/library";
import { SizeMode } from "ui5/sized/controls/library";
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { $ControlSettings } from "sap/ui/core/Control";

declare module "./Button" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $ButtonSettings extends $ControlSettings {
        text?: string | PropertyBindingInfo;
        type?: ButtonType | PropertyBindingInfo | `{${string}}`;
        enabled?: boolean | PropertyBindingInfo | `{${string}}`;
        icon?: URI | PropertyBindingInfo | `{${string}}`;
        iconFirst?: boolean | PropertyBindingInfo | `{${string}}`;
        sidePadding?: CSSSize | PropertyBindingInfo | `{${string}}`;
        width?: CSSSize | PropertyBindingInfo | `{${string}}`;
        size?: SizeMode | PropertyBindingInfo | `{${string}}`;

        /**
         * Fired when the user clicks or taps on the control.
         */
        press?: (event: Button$PressEvent) => void;
    }

    export default interface Button {

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

        // property: sidePadding
        getSidePadding(): CSSSize;
        setSidePadding(sidePadding: CSSSize): this;

        // property: width
        getWidth(): CSSSize;
        setWidth(width: CSSSize): this;

        // property: size
        getSize(): SizeMode;
        setSize(size: SizeMode): this;

        // event: press

        /**
         * Fired when the user clicks or taps on the control.
         */
        attachPress(fn: (event: Button$PressEvent) => void, listener?: object): this;

        /**
         * Fired when the user clicks or taps on the control.
         */
        attachPress<CustomDataType extends object>(data: CustomDataType, fn: (event: Button$PressEvent, data: CustomDataType) => void, listener?: object): this;

        /**
         * Fired when the user clicks or taps on the control.
         */
        detachPress(fn: (event: Button$PressEvent) => void, listener?: object): this;

        /**
         * Fired when the user clicks or taps on the control.
         */
        firePress(parameters?: Button$PressEventParameters): this;
    }

    /**
     * Interface describing the parameters of Button's 'press' event.
     * Fired when the user clicks or taps on the control.
     */
    // eslint-disable-next-line
    export interface Button$PressEventParameters {
    }

    /**
     * Type describing the Button's 'press' event.
     * Fired when the user clicks or taps on the control.
     */
    export type Button$PressEvent = Event<Button$PressEventParameters>;
}
