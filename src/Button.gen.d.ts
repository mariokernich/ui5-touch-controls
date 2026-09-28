import Event from "sap/ui/base/Event";
import { ButtonType } from "sap/m/library";
import { URI } from "sap/ui/core/library";
import { CSSSize } from "sap/ui/core/library";
import { SizeMode } from "ui5/touch/controls/library";
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { $ControlSettings } from "sap/ui/core/Control";

declare module "./Button" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $ButtonSettings extends $ControlSettings {

        /**
         * The text of the button.
         */
        text?: string | PropertyBindingInfo;

        /**
         * The type of the button, as in <code>sap.m.Button</code>.
         */
        type?: ButtonType | PropertyBindingInfo | `{${string}}`;

        /**
         * Indicates whether the user can press the button.
         */
        enabled?: boolean | PropertyBindingInfo | `{${string}}`;

        /**
         * The icon of the button: an icon font URI such as
        <code>sap-icon://add</code>, or the URL of an image.
         */
        icon?: URI | PropertyBindingInfo | `{${string}}`;

        /**
         * Whether the icon stands before the text or after it.
         */
        iconFirst?: boolean | PropertyBindingInfo | `{${string}}`;

        /**
         * Has no effect: the padding of the button follows its
        <code>size</code>.
         *
         * @deprecated As of version 1.4.0 - the padding comes from the size
        ladder of the stylesheet and cannot be set per button.
         */
        sidePadding?: CSSSize | PropertyBindingInfo | `{${string}}`;

        /**
         * Width of the button. Without it the button is as wide as its
        content.
         */
        width?: CSSSize | PropertyBindingInfo | `{${string}}`;

        /**
         * Touch size of the button.
         */
        size?: SizeMode | PropertyBindingInfo | `{${string}}`;

        /**
         * Fired when the user clicks or taps on the control, or presses it
        with <kbd>Enter</kbd> or <kbd>Space</kbd>.
         */
        press?: (event: Button$PressEvent) => void;
    }

    export default interface Button {

        // property: text

        /**
         * The text of the button.
         */
        getText(): string;

        /**
         * The text of the button.
         */
        setText(text: string): this;

        // property: type

        /**
         * The type of the button, as in <code>sap.m.Button</code>.
         */
        getType(): ButtonType;

        /**
         * The type of the button, as in <code>sap.m.Button</code>.
         */
        setType(type: ButtonType): this;

        // property: enabled

        /**
         * Indicates whether the user can press the button.
         */
        getEnabled(): boolean;

        /**
         * Indicates whether the user can press the button.
         */
        setEnabled(enabled: boolean): this;

        // property: icon

        /**
         * The icon of the button: an icon font URI such as
        <code>sap-icon://add</code>, or the URL of an image.
         */
        getIcon(): URI;

        /**
         * The icon of the button: an icon font URI such as
        <code>sap-icon://add</code>, or the URL of an image.
         */
        setIcon(icon: URI): this;

        // property: iconFirst

        /**
         * Whether the icon stands before the text or after it.
         */
        getIconFirst(): boolean;

        /**
         * Whether the icon stands before the text or after it.
         */
        setIconFirst(iconFirst: boolean): this;

        // property: sidePadding

        /**
         * Has no effect: the padding of the button follows its
        <code>size</code>.
         *
         * @deprecated As of version 1.4.0 - the padding comes from the size
        ladder of the stylesheet and cannot be set per button.
         */
        getSidePadding(): CSSSize;

        /**
         * Has no effect: the padding of the button follows its
        <code>size</code>.
         *
         * @deprecated As of version 1.4.0 - the padding comes from the size
        ladder of the stylesheet and cannot be set per button.
         */
        setSidePadding(sidePadding: CSSSize): this;

        // property: width

        /**
         * Width of the button. Without it the button is as wide as its
        content.
         */
        getWidth(): CSSSize;

        /**
         * Width of the button. Without it the button is as wide as its
        content.
         */
        setWidth(width: CSSSize): this;

        // property: size

        /**
         * Touch size of the button.
         */
        getSize(): SizeMode;

        /**
         * Touch size of the button.
         */
        setSize(size: SizeMode): this;

        // event: press

        /**
         * Fired when the user clicks or taps on the control, or presses it
        with <kbd>Enter</kbd> or <kbd>Space</kbd>.
         */
        attachPress(fn: (event: Button$PressEvent) => void, listener?: object): this;

        /**
         * Fired when the user clicks or taps on the control, or presses it
        with <kbd>Enter</kbd> or <kbd>Space</kbd>.
         */
        attachPress<CustomDataType extends object>(data: CustomDataType, fn: (event: Button$PressEvent, data: CustomDataType) => void, listener?: object): this;

        /**
         * Fired when the user clicks or taps on the control, or presses it
        with <kbd>Enter</kbd> or <kbd>Space</kbd>.
         */
        detachPress(fn: (event: Button$PressEvent) => void, listener?: object): this;

        /**
         * Fired when the user clicks or taps on the control, or presses it
        with <kbd>Enter</kbd> or <kbd>Space</kbd>.
         */
        firePress(parameters?: Button$PressEventParameters): this;
    }

    /**
     * Interface describing the parameters of Button's 'press' event.
     * Fired when the user clicks or taps on the control, or presses it
    with <kbd>Enter</kbd> or <kbd>Space</kbd>.
     */
    // eslint-disable-next-line
    export interface Button$PressEventParameters {
    }

    /**
     * Type describing the Button's 'press' event.
     * Fired when the user clicks or taps on the control, or presses it
    with <kbd>Enter</kbd> or <kbd>Space</kbd>.
     */
    export type Button$PressEvent = Event<Button$PressEventParameters>;
}
