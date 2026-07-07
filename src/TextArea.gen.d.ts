import Event from "sap/ui/base/Event";
import { ValueState } from "sap/ui/core/library";
import { CSSSize } from "sap/ui/core/library";
import { SizeMode } from "ui5/touch/controls/library";
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { $ControlSettings } from "sap/ui/core/Control";

declare module "./TextArea" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $TextAreaSettings extends $ControlSettings {

        /**
         * The value of the text area.
         */
        value?: string | PropertyBindingInfo;

        /**
         * Placeholder text shown when the text area is empty.
         */
        placeholder?: string | PropertyBindingInfo;

        /**
         * Number of visible text lines.
         */
        rows?: number | PropertyBindingInfo | `{${string}}`;

        /**
         * Maximum number of characters. Value <code>0</code> means unlimited.
         */
        maxLength?: number | PropertyBindingInfo | `{${string}}`;

        /**
         * Indicates whether the user can interact with the control.
         */
        enabled?: boolean | PropertyBindingInfo | `{${string}}`;

        /**
         * Defines whether the control value can be modified.
         */
        editable?: boolean | PropertyBindingInfo | `{${string}}`;

        /**
         * Visualizes the validation state, e.g. Error, Warning, Success, Information.
         */
        valueState?: ValueState | PropertyBindingInfo | `{${string}}`;

        /**
         * Width of the text area.
         */
        width?: CSSSize | PropertyBindingInfo | `{${string}}`;

        /**
         * Height of the text area. If set, it overrules the
        <code>rows</code> property.
         */
        height?: CSSSize | PropertyBindingInfo | `{${string}}`;

        /**
         * Touch size of the text area.
         */
        size?: SizeMode | PropertyBindingInfo | `{${string}}`;

        /**
         * Fired when the value of the text area has changed and the focus
        leaves the field.
         */
        change?: (event: TextArea$ChangeEvent) => void;

        /**
         * Fired when the value of the text area is changed by user
        interaction - each keystroke, delete, paste, etc.
         */
        liveChange?: (event: TextArea$LiveChangeEvent) => void;
    }

    export default interface TextArea {

        // property: value

        /**
         * The value of the text area.
         */
        getValue(): string;

        /**
         * The value of the text area.
         */
        setValue(value: string): this;

        // property: placeholder

        /**
         * Placeholder text shown when the text area is empty.
         */
        getPlaceholder(): string;

        /**
         * Placeholder text shown when the text area is empty.
         */
        setPlaceholder(placeholder: string): this;

        // property: rows

        /**
         * Number of visible text lines.
         */
        getRows(): number;

        /**
         * Number of visible text lines.
         */
        setRows(rows: number): this;

        // property: maxLength

        /**
         * Maximum number of characters. Value <code>0</code> means unlimited.
         */
        getMaxLength(): number;

        /**
         * Maximum number of characters. Value <code>0</code> means unlimited.
         */
        setMaxLength(maxLength: number): this;

        // property: enabled

        /**
         * Indicates whether the user can interact with the control.
         */
        getEnabled(): boolean;

        /**
         * Indicates whether the user can interact with the control.
         */
        setEnabled(enabled: boolean): this;

        // property: editable

        /**
         * Defines whether the control value can be modified.
         */
        getEditable(): boolean;

        /**
         * Defines whether the control value can be modified.
         */
        setEditable(editable: boolean): this;

        // property: valueState

        /**
         * Visualizes the validation state, e.g. Error, Warning, Success, Information.
         */
        getValueState(): ValueState;

        /**
         * Visualizes the validation state, e.g. Error, Warning, Success, Information.
         */
        setValueState(valueState: ValueState): this;

        // property: width

        /**
         * Width of the text area.
         */
        getWidth(): CSSSize;

        /**
         * Width of the text area.
         */
        setWidth(width: CSSSize): this;

        // property: height

        /**
         * Height of the text area. If set, it overrules the
        <code>rows</code> property.
         */
        getHeight(): CSSSize;

        /**
         * Height of the text area. If set, it overrules the
        <code>rows</code> property.
         */
        setHeight(height: CSSSize): this;

        // property: size

        /**
         * Touch size of the text area.
         */
        getSize(): SizeMode;

        /**
         * Touch size of the text area.
         */
        setSize(size: SizeMode): this;

        // event: change

        /**
         * Fired when the value of the text area has changed and the focus
        leaves the field.
         */
        attachChange(fn: (event: TextArea$ChangeEvent) => void, listener?: object): this;

        /**
         * Fired when the value of the text area has changed and the focus
        leaves the field.
         */
        attachChange<CustomDataType extends object>(data: CustomDataType, fn: (event: TextArea$ChangeEvent, data: CustomDataType) => void, listener?: object): this;

        /**
         * Fired when the value of the text area has changed and the focus
        leaves the field.
         */
        detachChange(fn: (event: TextArea$ChangeEvent) => void, listener?: object): this;

        /**
         * Fired when the value of the text area has changed and the focus
        leaves the field.
         */
        fireChange(parameters?: TextArea$ChangeEventParameters): this;

        // event: liveChange

        /**
         * Fired when the value of the text area is changed by user
        interaction - each keystroke, delete, paste, etc.
         */
        attachLiveChange(fn: (event: TextArea$LiveChangeEvent) => void, listener?: object): this;

        /**
         * Fired when the value of the text area is changed by user
        interaction - each keystroke, delete, paste, etc.
         */
        attachLiveChange<CustomDataType extends object>(data: CustomDataType, fn: (event: TextArea$LiveChangeEvent, data: CustomDataType) => void, listener?: object): this;

        /**
         * Fired when the value of the text area is changed by user
        interaction - each keystroke, delete, paste, etc.
         */
        detachLiveChange(fn: (event: TextArea$LiveChangeEvent) => void, listener?: object): this;

        /**
         * Fired when the value of the text area is changed by user
        interaction - each keystroke, delete, paste, etc.
         */
        fireLiveChange(parameters?: TextArea$LiveChangeEventParameters): this;
    }

    /**
     * Interface describing the parameters of TextArea's 'change' event.
     * Fired when the value of the text area has changed and the focus
    leaves the field.
     */
    export interface TextArea$ChangeEventParameters {
        value?: string;
    }

    /**
     * Interface describing the parameters of TextArea's 'liveChange' event.
     * Fired when the value of the text area is changed by user
    interaction - each keystroke, delete, paste, etc.
     */
    export interface TextArea$LiveChangeEventParameters {
        value?: string;
    }

    /**
     * Type describing the TextArea's 'change' event.
     * Fired when the value of the text area has changed and the focus
    leaves the field.
     */
    export type TextArea$ChangeEvent = Event<TextArea$ChangeEventParameters>;

    /**
     * Type describing the TextArea's 'liveChange' event.
     * Fired when the value of the text area is changed by user
    interaction - each keystroke, delete, paste, etc.
     */
    export type TextArea$LiveChangeEvent = Event<TextArea$LiveChangeEventParameters>;
}
