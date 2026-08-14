import Event from "sap/ui/base/Event";
import { SwitchType } from "sap/m/library";
import { SizeMode } from "ui5/touch/controls/library";
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { $ControlSettings } from "sap/ui/core/Control";

declare module "./Switch" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $SwitchSettings extends $ControlSettings {

        /**
         * Whether the switch is on.
         */
        state?: boolean | PropertyBindingInfo | `{${string}}`;

        /**
         * Label of the on state. Empty, the switch says the "on" of the
        library in the language the application runs in; with type
        <code>AcceptReject</code> a check mark is shown instead.
         */
        customTextOn?: string | PropertyBindingInfo;

        /**
         * Label of the off state. Empty, the switch says the "off" of the
        library in the language the application runs in; with type
        <code>AcceptReject</code> a cross is shown instead.
         */
        customTextOff?: string | PropertyBindingInfo;

        /**
         * Type of the switch: <code>Default</code> shows the labels,
        <code>AcceptReject</code> a green check mark and a red cross.
         */
        type?: SwitchType | PropertyBindingInfo | `{${string}}`;

        /**
         * Indicates whether the user can interact with the control.
         */
        enabled?: boolean | PropertyBindingInfo | `{${string}}`;

        /**
         * Touch size of the control.
         */
        size?: SizeMode | PropertyBindingInfo | `{${string}}`;

        /**
         * Fired when the user flips the switch.
         */
        change?: (event: Switch$ChangeEvent) => void;
    }

    export default interface Switch {

        // property: state

        /**
         * Whether the switch is on.
         */
        getState(): boolean;

        /**
         * Whether the switch is on.
         */
        setState(state: boolean): this;

        // property: customTextOn

        /**
         * Label of the on state. Empty, the switch says the "on" of the
        library in the language the application runs in; with type
        <code>AcceptReject</code> a check mark is shown instead.
         */
        getCustomTextOn(): string;

        /**
         * Label of the on state. Empty, the switch says the "on" of the
        library in the language the application runs in; with type
        <code>AcceptReject</code> a check mark is shown instead.
         */
        setCustomTextOn(customTextOn: string): this;

        // property: customTextOff

        /**
         * Label of the off state. Empty, the switch says the "off" of the
        library in the language the application runs in; with type
        <code>AcceptReject</code> a cross is shown instead.
         */
        getCustomTextOff(): string;

        /**
         * Label of the off state. Empty, the switch says the "off" of the
        library in the language the application runs in; with type
        <code>AcceptReject</code> a cross is shown instead.
         */
        setCustomTextOff(customTextOff: string): this;

        // property: type

        /**
         * Type of the switch: <code>Default</code> shows the labels,
        <code>AcceptReject</code> a green check mark and a red cross.
         */
        getType(): SwitchType;

        /**
         * Type of the switch: <code>Default</code> shows the labels,
        <code>AcceptReject</code> a green check mark and a red cross.
         */
        setType(type: SwitchType): this;

        // property: enabled

        /**
         * Indicates whether the user can interact with the control.
         */
        getEnabled(): boolean;

        /**
         * Indicates whether the user can interact with the control.
         */
        setEnabled(enabled: boolean): this;

        // property: size

        /**
         * Touch size of the control.
         */
        getSize(): SizeMode;

        /**
         * Touch size of the control.
         */
        setSize(size: SizeMode): this;

        // event: change

        /**
         * Fired when the user flips the switch.
         */
        attachChange(fn: (event: Switch$ChangeEvent) => void, listener?: object): this;

        /**
         * Fired when the user flips the switch.
         */
        attachChange<CustomDataType extends object>(data: CustomDataType, fn: (event: Switch$ChangeEvent, data: CustomDataType) => void, listener?: object): this;

        /**
         * Fired when the user flips the switch.
         */
        detachChange(fn: (event: Switch$ChangeEvent) => void, listener?: object): this;

        /**
         * Fired when the user flips the switch.
         */
        fireChange(parameters?: Switch$ChangeEventParameters): this;
    }

    /**
     * Interface describing the parameters of Switch's 'change' event.
     * Fired when the user flips the switch.
     */
    export interface Switch$ChangeEventParameters {
        state?: boolean;
    }

    /**
     * Type describing the Switch's 'change' event.
     * Fired when the user flips the switch.
     */
    export type Switch$ChangeEvent = Event<Switch$ChangeEventParameters>;
}
