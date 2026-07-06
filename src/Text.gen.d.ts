import Event from "sap/ui/base/Event";
import { CSSColor } from "sap/ui/core/library";
import { CSSSize } from "sap/ui/core/library";
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { $ControlSettings } from "sap/ui/core/Control";

declare module "./Text" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $TextSettings extends $ControlSettings {
        text?: string | PropertyBindingInfo;
        color?: CSSColor | PropertyBindingInfo | `{${string}}`;
        fontSize?: CSSSize | PropertyBindingInfo | `{${string}}`;
        press?: (event: Text$PressEvent) => void;
    }

    export default interface Text {

        // property: text
        getText(): string;
        setText(text: string): this;

        // property: color
        getColor(): CSSColor;
        setColor(color: CSSColor): this;

        // property: fontSize
        getFontSize(): CSSSize;
        setFontSize(fontSize: CSSSize): this;

        // event: press
        attachPress(fn: (event: Text$PressEvent) => void, listener?: object): this;
        attachPress<CustomDataType extends object>(data: CustomDataType, fn: (event: Text$PressEvent, data: CustomDataType) => void, listener?: object): this;
        detachPress(fn: (event: Text$PressEvent) => void, listener?: object): this;
        firePress(parameters?: Text$PressEventParameters): this;
    }

    /**
     * Interface describing the parameters of Text's 'press' event.
     */
    // eslint-disable-next-line
    export interface Text$PressEventParameters {
    }

    /**
     * Type describing the Text's 'press' event.
     */
    export type Text$PressEvent = Event<Text$PressEventParameters>;
}
