import Event from "sap/ui/base/Event";
import { ValueState } from "sap/ui/core/library";
import { CSSSize } from "sap/ui/core/library";
import { SizeMode } from "ui5/touch/controls/library";
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { $ControlSettings } from "sap/ui/core/Control";

declare module "./RadioButton" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $RadioButtonSettings extends $ControlSettings {

        /**
         * Whether the radio button is selected.
         */
        selected?: boolean | PropertyBindingInfo | `{${string}}`;

        /**
         * Name of the group the button belongs to. Only one button of a
        group can be selected at a time.
         */
        groupName?: string | PropertyBindingInfo;

        /**
         * The label shown next to the circle.
         */
        text?: string | PropertyBindingInfo;

        /**
         * Indicates whether the user can interact with the control.
         */
        enabled?: boolean | PropertyBindingInfo | `{${string}}`;

        /**
         * Defines whether the button can be selected by the user.
         */
        editable?: boolean | PropertyBindingInfo | `{${string}}`;

        /**
         * Visualizes the validation state, e.g. Error, Warning, Success,
        Information. Only shown while the control is enabled and editable.
         */
        valueState?: ValueState | PropertyBindingInfo | `{${string}}`;

        /**
         * Defines whether the label wraps. Without it a long label is
        truncated with an ellipsis.
         */
        wrapping?: boolean | PropertyBindingInfo | `{${string}}`;

        /**
         * Width of the control.
         */
        width?: CSSSize | PropertyBindingInfo | `{${string}}`;

        /**
         * Touch size of the control.
         */
        size?: SizeMode | PropertyBindingInfo | `{${string}}`;

        /**
         * Fired when the user selects the button. Deselecting happens by
        selecting another button of the group, so the event is not fired
        for the button that loses its selection.
         */
        select?: (event: RadioButton$SelectEvent) => void;
    }

    export default interface RadioButton {

        // property: selected

        /**
         * Whether the radio button is selected.
         */
        getSelected(): boolean;

        /**
         * Whether the radio button is selected.
         */
        setSelected(selected: boolean): this;

        // property: groupName

        /**
         * Name of the group the button belongs to. Only one button of a
        group can be selected at a time.
         */
        getGroupName(): string;

        /**
         * Name of the group the button belongs to. Only one button of a
        group can be selected at a time.
         */
        setGroupName(groupName: string): this;

        // property: text

        /**
         * The label shown next to the circle.
         */
        getText(): string;

        /**
         * The label shown next to the circle.
         */
        setText(text: string): this;

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
         * Defines whether the button can be selected by the user.
         */
        getEditable(): boolean;

        /**
         * Defines whether the button can be selected by the user.
         */
        setEditable(editable: boolean): this;

        // property: valueState

        /**
         * Visualizes the validation state, e.g. Error, Warning, Success,
        Information. Only shown while the control is enabled and editable.
         */
        getValueState(): ValueState;

        /**
         * Visualizes the validation state, e.g. Error, Warning, Success,
        Information. Only shown while the control is enabled and editable.
         */
        setValueState(valueState: ValueState): this;

        // property: wrapping

        /**
         * Defines whether the label wraps. Without it a long label is
        truncated with an ellipsis.
         */
        getWrapping(): boolean;

        /**
         * Defines whether the label wraps. Without it a long label is
        truncated with an ellipsis.
         */
        setWrapping(wrapping: boolean): this;

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
         * Touch size of the control.
         */
        getSize(): SizeMode;

        /**
         * Touch size of the control.
         */
        setSize(size: SizeMode): this;

        // event: select

        /**
         * Fired when the user selects the button. Deselecting happens by
        selecting another button of the group, so the event is not fired
        for the button that loses its selection.
         */
        attachSelect(fn: (event: RadioButton$SelectEvent) => void, listener?: object): this;

        /**
         * Fired when the user selects the button. Deselecting happens by
        selecting another button of the group, so the event is not fired
        for the button that loses its selection.
         */
        attachSelect<CustomDataType extends object>(data: CustomDataType, fn: (event: RadioButton$SelectEvent, data: CustomDataType) => void, listener?: object): this;

        /**
         * Fired when the user selects the button. Deselecting happens by
        selecting another button of the group, so the event is not fired
        for the button that loses its selection.
         */
        detachSelect(fn: (event: RadioButton$SelectEvent) => void, listener?: object): this;

        /**
         * Fired when the user selects the button. Deselecting happens by
        selecting another button of the group, so the event is not fired
        for the button that loses its selection.
         */
        fireSelect(parameters?: RadioButton$SelectEventParameters): this;
    }

    /**
     * Interface describing the parameters of RadioButton's 'select' event.
     * Fired when the user selects the button. Deselecting happens by
    selecting another button of the group, so the event is not fired
    for the button that loses its selection.
     */
    export interface RadioButton$SelectEventParameters {
        selected?: boolean;
    }

    /**
     * Type describing the RadioButton's 'select' event.
     * Fired when the user selects the button. Deselecting happens by
    selecting another button of the group, so the event is not fired
    for the button that loses its selection.
     */
    export type RadioButton$SelectEvent = Event<RadioButton$SelectEventParameters>;
}
