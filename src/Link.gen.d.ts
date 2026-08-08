import Event from "sap/ui/base/Event";
import { URI } from "sap/ui/core/library";
import { CSSSize } from "sap/ui/core/library";
import { SizeMode } from "ui5/touch/controls/library";
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { $ControlSettings } from "sap/ui/core/Control";

declare module "./Link" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $LinkSettings extends $ControlSettings {

        /**
         * The text of the link.
         */
        text?: string | PropertyBindingInfo;

        /**
         * The URL the link points to. Without it the link only fires
        <code>press</code>.
         */
        href?: URI | PropertyBindingInfo | `{${string}}`;

        /**
         * Where to open the URL, e.g. <code>_blank</code>.
         */
        target?: string | PropertyBindingInfo;

        /**
         * Indicates whether the user can interact with the link.
         */
        enabled?: boolean | PropertyBindingInfo | `{${string}}`;

        /**
         * Defines whether the text wraps. Without it a long text is
        truncated with an ellipsis.
         */
        wrapping?: boolean | PropertyBindingInfo | `{${string}}`;

        /**
         * Renders the link in a subtle color, for links of minor
        importance.
         */
        subtle?: boolean | PropertyBindingInfo | `{${string}}`;

        /**
         * Renders the link in bold, for links of major importance.
         */
        emphasized?: boolean | PropertyBindingInfo | `{${string}}`;

        /**
         * Width of the link.
         */
        width?: CSSSize | PropertyBindingInfo | `{${string}}`;

        /**
         * Touch size of the link.
         */
        size?: SizeMode | PropertyBindingInfo | `{${string}}`;

        /**
         * Fired when the user clicks or taps on the link. A link with an
        <code>href</code> is followed by the browser afterwards.
         */
        press?: (event: Link$PressEvent) => void;
    }

    export default interface Link {

        // property: text

        /**
         * The text of the link.
         */
        getText(): string;

        /**
         * The text of the link.
         */
        setText(text: string): this;

        // property: href

        /**
         * The URL the link points to. Without it the link only fires
        <code>press</code>.
         */
        getHref(): URI;

        /**
         * The URL the link points to. Without it the link only fires
        <code>press</code>.
         */
        setHref(href: URI): this;

        // property: target

        /**
         * Where to open the URL, e.g. <code>_blank</code>.
         */
        getTarget(): string;

        /**
         * Where to open the URL, e.g. <code>_blank</code>.
         */
        setTarget(target: string): this;

        // property: enabled

        /**
         * Indicates whether the user can interact with the link.
         */
        getEnabled(): boolean;

        /**
         * Indicates whether the user can interact with the link.
         */
        setEnabled(enabled: boolean): this;

        // property: wrapping

        /**
         * Defines whether the text wraps. Without it a long text is
        truncated with an ellipsis.
         */
        getWrapping(): boolean;

        /**
         * Defines whether the text wraps. Without it a long text is
        truncated with an ellipsis.
         */
        setWrapping(wrapping: boolean): this;

        // property: subtle

        /**
         * Renders the link in a subtle color, for links of minor
        importance.
         */
        getSubtle(): boolean;

        /**
         * Renders the link in a subtle color, for links of minor
        importance.
         */
        setSubtle(subtle: boolean): this;

        // property: emphasized

        /**
         * Renders the link in bold, for links of major importance.
         */
        getEmphasized(): boolean;

        /**
         * Renders the link in bold, for links of major importance.
         */
        setEmphasized(emphasized: boolean): this;

        // property: width

        /**
         * Width of the link.
         */
        getWidth(): CSSSize;

        /**
         * Width of the link.
         */
        setWidth(width: CSSSize): this;

        // property: size

        /**
         * Touch size of the link.
         */
        getSize(): SizeMode;

        /**
         * Touch size of the link.
         */
        setSize(size: SizeMode): this;

        // event: press

        /**
         * Fired when the user clicks or taps on the link. A link with an
        <code>href</code> is followed by the browser afterwards.
         */
        attachPress(fn: (event: Link$PressEvent) => void, listener?: object): this;

        /**
         * Fired when the user clicks or taps on the link. A link with an
        <code>href</code> is followed by the browser afterwards.
         */
        attachPress<CustomDataType extends object>(data: CustomDataType, fn: (event: Link$PressEvent, data: CustomDataType) => void, listener?: object): this;

        /**
         * Fired when the user clicks or taps on the link. A link with an
        <code>href</code> is followed by the browser afterwards.
         */
        detachPress(fn: (event: Link$PressEvent) => void, listener?: object): this;

        /**
         * Fired when the user clicks or taps on the link. A link with an
        <code>href</code> is followed by the browser afterwards.
         */
        firePress(parameters?: Link$PressEventParameters): this;
    }

    /**
     * Interface describing the parameters of Link's 'press' event.
     * Fired when the user clicks or taps on the link. A link with an
    <code>href</code> is followed by the browser afterwards.
     */
    // eslint-disable-next-line
    export interface Link$PressEventParameters {
    }

    /**
     * Type describing the Link's 'press' event.
     * Fired when the user clicks or taps on the link. A link with an
    <code>href</code> is followed by the browser afterwards.
     */
    export type Link$PressEvent = Event<Link$PressEventParameters>;
}
