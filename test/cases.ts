import type Control from "sap/ui/core/Control";
import { ValueState } from "sap/ui/core/library";
import Item from "sap/ui/core/Item";
import ListItem from "sap/ui/core/ListItem";
import ToolbarSpacer from "sap/m/ToolbarSpacer";
import { ButtonType, SwitchType } from "sap/m/library";
import BarcodeInput from "ui5/touch/controls/BarcodeInput";
import Button from "ui5/touch/controls/Button";
import CheckBox from "ui5/touch/controls/CheckBox";
import ComboBox from "ui5/touch/controls/ComboBox";
import DatePicker from "ui5/touch/controls/DatePicker";
import Input from "ui5/touch/controls/Input";
import Link from "ui5/touch/controls/Link";
import OverflowToolbar from "ui5/touch/controls/OverflowToolbar";
import QuickDialog from "ui5/touch/controls/QuickDialog";
import RadioButton from "ui5/touch/controls/RadioButton";
import RadioButtonGroup from "ui5/touch/controls/RadioButtonGroup";
import SegmentedButton from "ui5/touch/controls/SegmentedButton";
import SegmentedButtonItem from "ui5/touch/controls/SegmentedButtonItem";
import Select from "ui5/touch/controls/Select";
import SignaturePad from "ui5/touch/controls/SignaturePad";
import StepInput from "ui5/touch/controls/StepInput";
import Switch from "ui5/touch/controls/Switch";
import Text from "ui5/touch/controls/Text";
import TextArea from "ui5/touch/controls/TextArea";
import TimePicker from "ui5/touch/controls/TimePicker";
import Toolbar from "ui5/touch/controls/Toolbar";
import CustomKeyboard from "ui5/touch/controls/CustomKeyboard";
import Keyboard from "ui5/touch/controls/Keyboard";
import NumberPad from "ui5/touch/controls/NumberPad";
import {
	KeyboardMode,
	NumberKeys,
	NumberPadMode,
	SizeMode,
} from "ui5/touch/controls/library";

/**
 * One row of a test page: a caption and the controls shown next to each other.
 */
export interface TestRow {
	caption: string;
	controls: Control[];
}

/** the sizes every case is shown in, small enough to stay comparable */
const SIZES = [SizeMode.M, SizeMode.XL, SizeMode["3XL"]];

/** the value states, for the controls that have them */
const STATES = [
	ValueState.None,
	ValueState.Error,
	ValueState.Warning,
	ValueState.Success,
	ValueState.Information,
];

/** builds one control per size */
function perSize<T extends Control>(build: (size: SizeMode) => T): Control[] {
	return SIZES.map(build);
}

/**
 * A QuickDialog that is closed without an action rejects its promise. Nothing
 * is done with the outcome here, so that rejection is swallowed instead of
 * showing up as an unhandled one.
 */
function ignoreDismissed(): void {
	// nothing to do
}

/**
 * The test cases, by control name. Every entry builds its controls from
 * scratch, so a page can be reloaded without leftovers.
 *
 * These pages are deliberately plain: no descriptions, no navigation, no
 * models - just the controls, so that a broken render is visible at a glance
 * and nothing but the library is in the way.
 */
export const cases: Record<string, () => TestRow[]> = {
	Button: () => [
		{
			caption: "sizes",
			controls: perSize(
				(size) => new Button({ text: "Button", icon: "sap-icon://save", size }),
			),
		},
		{
			caption: "types",
			controls: Object.values(ButtonType).map(
				(type) =>
					new Button({ text: type, type, size: SizeMode.L }),
			),
		},
		{
			caption: "icon only, text only, disabled",
			controls: [
				new Button({ icon: "sap-icon://add", size: SizeMode.L }),
				new Button({ text: "Text only", size: SizeMode.L }),
				new Button({ text: "Disabled", enabled: false, size: SizeMode.L }),
			],
		},
	],

	Text: () => [
		{
			caption: "sizes",
			controls: perSize((size) => new Text({ text: `Text ${size}`, size })),
		},
		{
			caption: "colored",
			controls: [new Text({ text: "Colored", color: "#c00", size: SizeMode.L })],
		},
	],

	Link: () => [
		{
			caption: "sizes",
			controls: perSize(
				(size) => new Link({ text: `Link ${size}`, href: "#", size }),
			),
		},
		{
			caption: "subtle, emphasized, disabled",
			controls: [
				new Link({ text: "Subtle", subtle: true, size: SizeMode.L }),
				new Link({ text: "Emphasized", emphasized: true, size: SizeMode.L }),
				new Link({ text: "Disabled", enabled: false, size: SizeMode.L }),
			],
		},
	],

	Input: () => [
		{
			caption: "sizes",
			controls: perSize(
				(size) => new Input({ value: `Input ${size}`, size, width: "12rem" }),
			),
		},
		{
			caption: "value states",
			controls: STATES.map(
				(valueState) =>
					new Input({
						value: valueState,
						valueState,
						size: SizeMode.L,
						width: "10rem",
					}),
			),
		},
		{
			caption: "placeholder, read-only, disabled",
			controls: [
				new Input({ placeholder: "Placeholder", size: SizeMode.L }),
				new Input({ value: "Read-only", editable: false, size: SizeMode.L }),
				new Input({ value: "Disabled", enabled: false, size: SizeMode.L }),
			],
		},
	],

	TextArea: () => [
		{
			caption: "sizes",
			controls: perSize(
				(size) =>
					new TextArea({
						value: `TextArea ${size}\nsecond line`,
						rows: 3,
						size,
						width: "14rem",
					}),
			),
		},
		{
			caption: "value states",
			controls: STATES.map(
				(valueState) =>
					new TextArea({
						value: valueState,
						valueState,
						rows: 2,
						size: SizeMode.L,
						width: "10rem",
					}),
			),
		},
		{
			caption: "read-only, disabled",
			controls: [
				new TextArea({ value: "Read-only", editable: false, size: SizeMode.L }),
				new TextArea({ value: "Disabled", enabled: false, size: SizeMode.L }),
			],
		},
	],

	CheckBox: () => [
		{
			caption: "sizes",
			controls: perSize(
				(size) => new CheckBox({ text: `CheckBox ${size}`, selected: true, size }),
			),
		},
		{
			caption: "unselected, partially selected, read-only, disabled",
			controls: [
				new CheckBox({ text: "Unselected", size: SizeMode.L }),
				new CheckBox({
					text: "Partial",
					partiallySelected: true,
					selected: true,
					size: SizeMode.L,
				}),
				new CheckBox({
					text: "Read-only",
					selected: true,
					editable: false,
					size: SizeMode.L,
				}),
				new CheckBox({
					text: "Disabled",
					selected: true,
					enabled: false,
					size: SizeMode.L,
				}),
			],
		},
		{
			caption: "value states",
			controls: STATES.map(
				(valueState) =>
					new CheckBox({ text: valueState, valueState, size: SizeMode.L }),
			),
		},
	],

	RadioButton: () => [
		{
			caption: "sizes",
			controls: perSize(
				(size) =>
					new RadioButton({
						text: `RadioButton ${size}`,
						groupName: `size-${size}`,
						selected: true,
						size,
					}),
			),
		},
		{
			caption: "group of three, two columns",
			controls: [
				new RadioButtonGroup({
					columns: 2,
					selectedIndex: 1,
					size: SizeMode.L,
					buttons: [
						new RadioButton({ text: "One" }),
						new RadioButton({ text: "Two" }),
						new RadioButton({ text: "Three" }),
					],
				}),
			],
		},
		{
			caption: "read-only, disabled",
			controls: [
				new RadioButton({
					text: "Read-only",
					groupName: "state",
					selected: true,
					editable: false,
					size: SizeMode.L,
				}),
				new RadioButton({
					text: "Disabled",
					groupName: "state2",
					selected: true,
					enabled: false,
					size: SizeMode.L,
				}),
			],
		},
	],

	Switch: () => [
		{
			caption: "sizes, on",
			controls: perSize((size) => new Switch({ state: true, size })),
		},
		{
			caption: "off, accept/reject, custom texts, disabled",
			controls: [
				new Switch({ size: SizeMode.L }),
				new Switch({
					state: true,
					type: SwitchType.AcceptReject,
					size: SizeMode.L,
				}),
				new Switch({
					state: true,
					customTextOn: "JA",
					customTextOff: "NEIN",
					size: SizeMode.L,
				}),
				new Switch({ state: true, enabled: false, size: SizeMode.L }),
			],
		},
	],

	SegmentedButton: () => [
		{
			caption: "sizes",
			controls: perSize(
				(size) =>
					new SegmentedButton({
						selectedKey: "b",
						size,
						items: [
							new SegmentedButtonItem({ key: "a", text: "A" }),
							new SegmentedButtonItem({ key: "b", text: "B" }),
							new SegmentedButtonItem({ key: "c", text: "C" }),
						],
					}),
			),
		},
		{
			caption: "icons, disabled item",
			controls: [
				new SegmentedButton({
					selectedKey: "list",
					size: SizeMode.L,
					items: [
						new SegmentedButtonItem({
							key: "list",
							icon: "sap-icon://list",
						}),
						new SegmentedButtonItem({
							key: "grid",
							icon: "sap-icon://grid",
						}),
						new SegmentedButtonItem({
							key: "off",
							icon: "sap-icon://table-view",
							enabled: false,
						}),
					],
				}),
			],
		},
	],

	Select: () => [
		{
			caption: "sizes",
			controls: perSize(
				(size) =>
					new Select({
						selectedKey: "b",
						size,
						width: "10rem",
						items: [
							new Item({ key: "a", text: "Assembly" }),
							new Item({ key: "b", text: "Packaging" }),
							new Item({ key: "c", text: "Shipping" }),
						],
					}),
			),
		},
		{
			caption: "value states",
			controls: STATES.map(
				(valueState) =>
					new Select({
						valueState,
						size: SizeMode.L,
						width: "9rem",
						items: [new Item({ key: "a", text: valueState })],
					}),
			),
		},
	],

	ComboBox: () => [
		{
			caption: "sizes",
			controls: perSize(
				(size) =>
					new ComboBox({
						selectedKey: "b",
						size,
						width: "12rem",
						items: [
							new ListItem({ key: "a", text: "Steel", additionalText: "A-1" }),
							new ListItem({ key: "b", text: "Copper", additionalText: "B-2" }),
						],
					}),
			),
		},
		{
			caption: "secondary values, read-only, disabled",
			controls: [
				new ComboBox({
					selectedKey: "a",
					showSecondaryValues: true,
					size: SizeMode.L,
					width: "12rem",
					items: [
						new ListItem({ key: "a", text: "Steel", additionalText: "A-1" }),
					],
				}),
				new ComboBox({ value: "Read-only", editable: false, size: SizeMode.L }),
				new ComboBox({ value: "Disabled", enabled: false, size: SizeMode.L }),
			],
		},
	],

	DatePicker: () => [
		{
			caption: "sizes",
			controls: perSize((size) => new DatePicker({ value: "2026-08-09", size })),
		},
		{
			caption: "placeholder, read-only, disabled",
			controls: [
				new DatePicker({ placeholder: "Pick a date", size: SizeMode.L }),
				new DatePicker({
					value: "2026-08-09",
					editable: false,
					size: SizeMode.L,
				}),
				new DatePicker({
					value: "2026-08-09",
					enabled: false,
					size: SizeMode.L,
				}),
			],
		},
	],

	TimePicker: () => [
		{
			caption: "sizes",
			controls: perSize((size) => new TimePicker({ value: "14:30", size })),
		},
		{
			caption: "placeholder, read-only, disabled",
			controls: [
				new TimePicker({ placeholder: "Pick a time", size: SizeMode.L }),
				new TimePicker({ value: "14:30", editable: false, size: SizeMode.L }),
				new TimePicker({ value: "14:30", enabled: false, size: SizeMode.L }),
			],
		},
	],

	StepInput: () => [
		{
			caption: "sizes",
			controls: perSize(
				(size) => new StepInput({ value: 3, min: 0, max: 10, size }),
			),
		},
		{
			caption: "at the minimum, disabled",
			controls: [
				new StepInput({ value: 0, min: 0, max: 10, size: SizeMode.L }),
				new StepInput({ value: 5, enabled: false, size: SizeMode.L }),
			],
		},
	],

	Toolbar: () => [
		{
			caption: "sizes",
			controls: perSize(
				(size) =>
					new Toolbar({
						width: "22rem",
						content: [
							new Button({ text: "Save", type: ButtonType.Emphasized, size }),
							new ToolbarSpacer(),
							new Button({ text: "Cancel", size }),
						],
					}),
			),
		},
	],

	OverflowToolbar: () => [
		{
			caption: "wide enough for everything",
			controls: [
				new OverflowToolbar({
					size: SizeMode.L,
					width: "34rem",
					content: [
						new Button({ text: "New", size: SizeMode.L }),
						new Button({ text: "Edit", size: SizeMode.L }),
						new ToolbarSpacer(),
						new Button({ text: "Delete", size: SizeMode.L }),
					],
				}),
			],
		},
		{
			caption: "too narrow, so it overflows",
			controls: [
				new OverflowToolbar({
					size: SizeMode.L,
					width: "16rem",
					content: [
						new Button({ text: "New", size: SizeMode.L }),
						new Button({ text: "Edit", size: SizeMode.L }),
						new Button({ text: "Delete", size: SizeMode.L }),
					],
				}),
			],
		},
	],

	Keyboard: () => [
		{
			caption: "the arrangements",
			controls: [
				new Keyboard({
					mode: KeyboardMode.English,
					displayNumbers: NumberKeys.Always,
					size: SizeMode.M,
				}),
				new Keyboard({
					mode: KeyboardMode.German,
					displayNumbers: NumberKeys.Always,
					size: SizeMode.M,
				}),
			],
		},
		{
			caption: "digits behind a key, with special characters",
			controls: [
				new Keyboard({
					mode: KeyboardMode.English,
					displayNumbers: NumberKeys.Toggle,
					showSpecialCharacters: true,
					size: SizeMode.M,
				}),
			],
		},
	],

	NumberPad: () => [
		{
			caption: "the digit blocks",
			controls: [
				new NumberPad({ mode: NumberPadMode.Simple, size: SizeMode.M }),
				new NumberPad({ mode: NumberPadMode.Phone, size: SizeMode.M }),
				new NumberPad({ mode: NumberPadMode.Calculator, size: SizeMode.M }),
			],
		},
	],

	CustomKeyboard: () => [
		{
			caption: "rows of your own",
			controls: [
				new CustomKeyboard({
					layout: ["A B C", "D E F", "{bksp} {space} {enter}"],
					size: SizeMode.M,
				}),
			],
		},
	],

	BarcodeInput: () => [
		{
			caption: "sizes",
			controls: perSize(
				(size) => new BarcodeInput({ placeholder: "Scan a code", size }),
			),
		},
		{
			caption: "with a value, disabled",
			controls: [
				new BarcodeInput({ value: "4006381333931", size: SizeMode.L }),
				new BarcodeInput({ value: "Disabled", enabled: false, size: SizeMode.L }),
			],
		},
	],

	SignaturePad: () => [
		{
			caption: "sizes",
			controls: perSize(
				(size) =>
					new SignaturePad({ size, width: "18rem", height: "8rem" }),
			),
		},
		{
			caption: "disabled",
			controls: [
				new SignaturePad({
					enabled: false,
					size: SizeMode.L,
					width: "18rem",
					height: "8rem",
				}),
			],
		},
	],

	QuickDialog: () => [
		{
			caption: "the dialogs, one button each",
			controls: [
				new Button({
					text: "show",
					size: SizeMode.L,
					press: () => {
						void QuickDialog.show({
							title: "Show",
							message: "A message and one action.",
							buttonSize: SizeMode.L,
						}).catch(ignoreDismissed);
					},
				}),
				new Button({
					text: "confirm",
					size: SizeMode.L,
					press: () => {
						void QuickDialog.confirm({
							title: "Confirm",
							message: "Yes or no?",
							buttonSize: SizeMode.L,
						}).catch(ignoreDismissed);
					},
				}),
				new Button({
					text: "input",
					size: SizeMode.L,
					press: () => {
						void QuickDialog.input({
							title: "Input",
							label: "Quantity",
							value: "1",
							buttonSize: SizeMode.L,
						}).catch(ignoreDismissed);
					},
				}),
				new Button({
					text: "select",
					size: SizeMode.L,
					press: () => {
						void QuickDialog.select({
							title: "Select",
							label: "Material",
							selectedKey: "b",
							items: [
								{ key: "a", text: "Steel", additionalText: "A-1" },
								{ key: "b", text: "Copper", additionalText: "B-2" },
							],
							buttonSize: SizeMode.L,
						}).catch(ignoreDismissed);
					},
				}),
				new Button({
					text: "error",
					size: SizeMode.L,
					press: () => {
						void QuickDialog.error({
							title: "Error",
							message: "Something went wrong.",
							buttonSize: SizeMode.L,
						}).catch(ignoreDismissed);
					},
				}),
				new Button({
					text: "information",
					size: SizeMode.L,
					press: () => {
						void QuickDialog.information({
							title: "Information",
							message: "Good to know.",
							buttonSize: SizeMode.L,
						}).catch(ignoreDismissed);
					},
				}),
				new Button({
					text: "details",
					size: SizeMode.L,
					press: () => {
						void QuickDialog.details({
							title: "Details",
							details: "The long text behind the Show details link.",
							buttonSize: SizeMode.L,
						}).catch(ignoreDismissed);
					},
				}),
			],
		},
	],
};

/** the control names, in the order the index lists them */
export const caseNames = Object.keys(cases);
