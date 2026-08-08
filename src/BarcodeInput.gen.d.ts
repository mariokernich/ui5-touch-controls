import Event from "sap/ui/base/Event";
import { ValueState } from "sap/ui/core/library";
import { CSSSize } from "sap/ui/core/library";
import { SizeMode } from "ui5/touch/controls/library";
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { $ControlSettings } from "sap/ui/core/Control";

declare module "./BarcodeInput" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $BarcodeInputSettings extends $ControlSettings {

        /**
         * The value of the field.
         */
        value?: string | PropertyBindingInfo;

        /**
         * Placeholder text shown while the field is empty.
         */
        placeholder?: string | PropertyBindingInfo;

        /**
         * Longest gap between two keystrokes, in milliseconds, that still
        counts as scanner input. A person does not get anywhere near it,
        a scanner stays far below.
         */
        scanTimeout?: number | PropertyBindingInfo | `{${string}}`;

        /**
         * Shortest code that is accepted as a scan. Shorter bursts are
        treated as manual input.
         */
        minLength?: number | PropertyBindingInfo | `{${string}}`;

        /**
         * Characters the scanner sends before the code. They are cut off
        the scanned value.
         */
        prefix?: string | PropertyBindingInfo;

        /**
         * Characters the scanner sends after the code, apart from the
        closing Enter. They are cut off the scanned value.
         */
        suffix?: string | PropertyBindingInfo;

        /**
         * Empties the field after a scan, so the next code can be scanned
        right away.
         */
        clearOnScan?: boolean | PropertyBindingInfo | `{${string}}`;

        /**
         * Indicates whether the user can interact with the control.
         */
        enabled?: boolean | PropertyBindingInfo | `{${string}}`;

        /**
         * Defines whether the value can be changed.
         */
        editable?: boolean | PropertyBindingInfo | `{${string}}`;

        /**
         * Visualizes the validation state, e.g. Error, Warning, Success,
        Information.
         */
        valueState?: ValueState | PropertyBindingInfo | `{${string}}`;

        /**
         * Width of the field.
         */
        width?: CSSSize | PropertyBindingInfo | `{${string}}`;

        /**
         * Touch size of the field.
         */
        size?: SizeMode | PropertyBindingInfo | `{${string}}`;

        /**
         * Fired when a barcode was scanned.
         */
        scan?: (event: BarcodeInput$ScanEvent) => void;

        /**
         * Fired when the value was changed by hand - on <kbd>Enter</kbd> or
        when the field loses the focus.
         */
        change?: (event: BarcodeInput$ChangeEvent) => void;

        /**
         * Fired on every keystroke.
         */
        liveChange?: (event: BarcodeInput$LiveChangeEvent) => void;
    }

    export default interface BarcodeInput {

        // property: value

        /**
         * The value of the field.
         */
        getValue(): string;

        /**
         * The value of the field.
         */
        setValue(value: string): this;

        // property: placeholder

        /**
         * Placeholder text shown while the field is empty.
         */
        getPlaceholder(): string;

        /**
         * Placeholder text shown while the field is empty.
         */
        setPlaceholder(placeholder: string): this;

        // property: scanTimeout

        /**
         * Longest gap between two keystrokes, in milliseconds, that still
        counts as scanner input. A person does not get anywhere near it,
        a scanner stays far below.
         */
        getScanTimeout(): number;

        /**
         * Longest gap between two keystrokes, in milliseconds, that still
        counts as scanner input. A person does not get anywhere near it,
        a scanner stays far below.
         */
        setScanTimeout(scanTimeout: number): this;

        // property: minLength

        /**
         * Shortest code that is accepted as a scan. Shorter bursts are
        treated as manual input.
         */
        getMinLength(): number;

        /**
         * Shortest code that is accepted as a scan. Shorter bursts are
        treated as manual input.
         */
        setMinLength(minLength: number): this;

        // property: prefix

        /**
         * Characters the scanner sends before the code. They are cut off
        the scanned value.
         */
        getPrefix(): string;

        /**
         * Characters the scanner sends before the code. They are cut off
        the scanned value.
         */
        setPrefix(prefix: string): this;

        // property: suffix

        /**
         * Characters the scanner sends after the code, apart from the
        closing Enter. They are cut off the scanned value.
         */
        getSuffix(): string;

        /**
         * Characters the scanner sends after the code, apart from the
        closing Enter. They are cut off the scanned value.
         */
        setSuffix(suffix: string): this;

        // property: clearOnScan

        /**
         * Empties the field after a scan, so the next code can be scanned
        right away.
         */
        getClearOnScan(): boolean;

        /**
         * Empties the field after a scan, so the next code can be scanned
        right away.
         */
        setClearOnScan(clearOnScan: boolean): this;

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
         * Defines whether the value can be changed.
         */
        getEditable(): boolean;

        /**
         * Defines whether the value can be changed.
         */
        setEditable(editable: boolean): this;

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

        // property: width

        /**
         * Width of the field.
         */
        getWidth(): CSSSize;

        /**
         * Width of the field.
         */
        setWidth(width: CSSSize): this;

        // property: size

        /**
         * Touch size of the field.
         */
        getSize(): SizeMode;

        /**
         * Touch size of the field.
         */
        setSize(size: SizeMode): this;

        // event: scan

        /**
         * Fired when a barcode was scanned.
         */
        attachScan(fn: (event: BarcodeInput$ScanEvent) => void, listener?: object): this;

        /**
         * Fired when a barcode was scanned.
         */
        attachScan<CustomDataType extends object>(data: CustomDataType, fn: (event: BarcodeInput$ScanEvent, data: CustomDataType) => void, listener?: object): this;

        /**
         * Fired when a barcode was scanned.
         */
        detachScan(fn: (event: BarcodeInput$ScanEvent) => void, listener?: object): this;

        /**
         * Fired when a barcode was scanned.
         */
        fireScan(parameters?: BarcodeInput$ScanEventParameters): this;

        // event: change

        /**
         * Fired when the value was changed by hand - on <kbd>Enter</kbd> or
        when the field loses the focus.
         */
        attachChange(fn: (event: BarcodeInput$ChangeEvent) => void, listener?: object): this;

        /**
         * Fired when the value was changed by hand - on <kbd>Enter</kbd> or
        when the field loses the focus.
         */
        attachChange<CustomDataType extends object>(data: CustomDataType, fn: (event: BarcodeInput$ChangeEvent, data: CustomDataType) => void, listener?: object): this;

        /**
         * Fired when the value was changed by hand - on <kbd>Enter</kbd> or
        when the field loses the focus.
         */
        detachChange(fn: (event: BarcodeInput$ChangeEvent) => void, listener?: object): this;

        /**
         * Fired when the value was changed by hand - on <kbd>Enter</kbd> or
        when the field loses the focus.
         */
        fireChange(parameters?: BarcodeInput$ChangeEventParameters): this;

        // event: liveChange

        /**
         * Fired on every keystroke.
         */
        attachLiveChange(fn: (event: BarcodeInput$LiveChangeEvent) => void, listener?: object): this;

        /**
         * Fired on every keystroke.
         */
        attachLiveChange<CustomDataType extends object>(data: CustomDataType, fn: (event: BarcodeInput$LiveChangeEvent, data: CustomDataType) => void, listener?: object): this;

        /**
         * Fired on every keystroke.
         */
        detachLiveChange(fn: (event: BarcodeInput$LiveChangeEvent) => void, listener?: object): this;

        /**
         * Fired on every keystroke.
         */
        fireLiveChange(parameters?: BarcodeInput$LiveChangeEventParameters): this;
    }

    /**
     * Interface describing the parameters of BarcodeInput's 'scan' event.
     * Fired when a barcode was scanned.
     */
    export interface BarcodeInput$ScanEventParameters {
        value?: string;
        rawValue?: string;
    }

    /**
     * Interface describing the parameters of BarcodeInput's 'change' event.
     * Fired when the value was changed by hand - on <kbd>Enter</kbd> or
    when the field loses the focus.
     */
    export interface BarcodeInput$ChangeEventParameters {
        value?: string;
    }

    /**
     * Interface describing the parameters of BarcodeInput's 'liveChange' event.
     * Fired on every keystroke.
     */
    export interface BarcodeInput$LiveChangeEventParameters {
        value?: string;
    }

    /**
     * Type describing the BarcodeInput's 'scan' event.
     * Fired when a barcode was scanned.
     */
    export type BarcodeInput$ScanEvent = Event<BarcodeInput$ScanEventParameters>;

    /**
     * Type describing the BarcodeInput's 'change' event.
     * Fired when the value was changed by hand - on <kbd>Enter</kbd> or
    when the field loses the focus.
     */
    export type BarcodeInput$ChangeEvent = Event<BarcodeInput$ChangeEventParameters>;

    /**
     * Type describing the BarcodeInput's 'liveChange' event.
     * Fired on every keystroke.
     */
    export type BarcodeInput$LiveChangeEvent = Event<BarcodeInput$LiveChangeEventParameters>;
}
