import Button from "sap/m/Button";
import CheckBox from "sap/m/CheckBox";
import ComboBox from "sap/m/ComboBox";
import DatePicker from "sap/m/DatePicker";
import Input from "sap/m/Input";
import Link from "sap/m/Link";
import MessageBox from "sap/m/MessageBox";
import OverflowToolbar from "sap/m/OverflowToolbar";
import RadioButton from "sap/m/RadioButton";
import RadioButtonGroup from "sap/m/RadioButtonGroup";
import SegmentedButton from "sap/m/SegmentedButton";
import SegmentedButtonItem from "sap/m/SegmentedButtonItem";
import Select from "sap/m/Select";
import StepInput from "sap/m/StepInput";
import Switch from "sap/m/Switch";
import Text from "sap/m/Text";
import TextArea from "sap/m/TextArea";
import TimePicker from "sap/m/TimePicker";
import Toolbar from "sap/m/Toolbar";
import ToolbarSpacer from "sap/m/ToolbarSpacer";
import VBox from "sap/m/VBox";
import { ButtonType, SwitchType } from "sap/m/library";
import Item from "sap/ui/core/Item";
import ListItem from "sap/ui/core/ListItem";
import { ValueState } from "sap/ui/core/library";
import type { TestRow } from "./cases";

/** the value states, for the controls that have them */
const STATES = [
	ValueState.None,
	ValueState.Error,
	ValueState.Warning,
	ValueState.Success,
	ValueState.Information,
];

/**
 * The sap.m originals of the controls, by the name of the control they stand
 * next to on the test page.
 *
 * Every entry shows what its case in cases.ts shows, built from the sap.m
 * control the library replaces - so the two can be compared at a glance, and
 * the UI tests can find both in the same card. sap.m has no size, so the rows
 * of sizes come down to one control in its only size.
 *
 * A control the library adds without a sap.m equivalent has no entry. The UI
 * tests check that every control the documentation names a sap.m original for
 * has one here.
 */
export const originals: Record<string, () => TestRow[]> = {
	Button: () => [
		{
			caption: "default",
			controls: [new Button({ text: "Button", icon: "sap-icon://save" })],
		},
		{
			caption: "types",
			controls: Object.values(ButtonType).map(
				(type) => new Button({ text: type, type }),
			),
		},
		{
			caption: "icon only, text only, disabled",
			controls: [
				new Button({ icon: "sap-icon://add" }),
				new Button({ text: "Text only" }),
				new Button({ text: "Disabled", enabled: false }),
			],
		},
	],

	Text: () => [
		{
			caption: "default",
			controls: [new Text({ text: "Text" })],
		},
	],

	Link: () => [
		{
			caption: "default",
			controls: [new Link({ text: "Link", href: "#" })],
		},
		{
			caption: "subtle, emphasized, disabled",
			controls: [
				new Link({ text: "Subtle", subtle: true }),
				new Link({ text: "Emphasized", emphasized: true }),
				new Link({ text: "Disabled", enabled: false }),
			],
		},
	],

	Input: () => [
		{
			caption: "default",
			controls: [new Input({ value: "Input", width: "12rem" })],
		},
		{
			caption: "value states",
			controls: STATES.map(
				(valueState) =>
					new Input({ value: valueState, valueState, width: "10rem" }),
			),
		},
		{
			caption: "placeholder, read-only, disabled",
			controls: [
				new Input({ placeholder: "Placeholder", width: "10rem" }),
				new Input({ value: "Read-only", editable: false, width: "10rem" }),
				new Input({ value: "Disabled", enabled: false, width: "10rem" }),
			],
		},
	],

	TextArea: () => [
		{
			caption: "default",
			controls: [
				new TextArea({
					value: "TextArea\nsecond line",
					rows: 3,
					width: "14rem",
				}),
			],
		},
		{
			caption: "value states",
			controls: STATES.map(
				(valueState) =>
					new TextArea({ value: valueState, valueState, rows: 2, width: "10rem" }),
			),
		},
		{
			caption: "read-only, disabled",
			controls: [
				new TextArea({ value: "Read-only", editable: false }),
				new TextArea({ value: "Disabled", enabled: false }),
			],
		},
	],

	CheckBox: () => [
		{
			caption: "default",
			controls: [new CheckBox({ text: "CheckBox", selected: true })],
		},
		{
			caption: "unselected, partially selected, read-only, disabled",
			controls: [
				new CheckBox({ text: "Unselected" }),
				new CheckBox({ text: "Partial", partiallySelected: true, selected: true }),
				new CheckBox({ text: "Read-only", selected: true, editable: false }),
				new CheckBox({ text: "Disabled", selected: true, enabled: false }),
			],
		},
		{
			caption: "value states",
			controls: STATES.map(
				(valueState) => new CheckBox({ text: valueState, valueState }),
			),
		},
	],

	RadioButton: () => [
		{
			caption: "default",
			controls: [
				new RadioButton({
					text: "RadioButton",
					groupName: "original-default",
					selected: true,
				}),
			],
		},
		{
			caption: "group of three, two columns",
			controls: [
				new RadioButtonGroup({
					columns: 2,
					selectedIndex: 1,
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
					groupName: "original-state",
					selected: true,
					editable: false,
				}),
				new RadioButton({
					text: "Disabled",
					groupName: "original-state2",
					selected: true,
					enabled: false,
				}),
			],
		},
	],

	Switch: () => [
		{
			caption: "on",
			controls: [new Switch({ state: true })],
		},
		{
			caption: "off, accept/reject, custom texts, disabled",
			controls: [
				new Switch(),
				new Switch({ state: true, type: SwitchType.AcceptReject }),
				new Switch({ state: true, customTextOn: "JA", customTextOff: "NEIN" }),
				new Switch({ state: true, enabled: false }),
			],
		},
	],

	SegmentedButton: () => [
		{
			caption: "default",
			controls: [
				new SegmentedButton({
					selectedKey: "b",
					items: [
						new SegmentedButtonItem({ key: "a", text: "A" }),
						new SegmentedButtonItem({ key: "b", text: "B" }),
						new SegmentedButtonItem({ key: "c", text: "C" }),
					],
				}),
			],
		},
		{
			caption: "icons, disabled item",
			controls: [
				new SegmentedButton({
					selectedKey: "list",
					items: [
						new SegmentedButtonItem({ key: "list", icon: "sap-icon://list" }),
						new SegmentedButtonItem({ key: "grid", icon: "sap-icon://grid" }),
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
			caption: "default",
			controls: [
				new Select({
					selectedKey: "b",
					width: "10rem",
					items: [
						new Item({ key: "a", text: "Assembly" }),
						new Item({ key: "b", text: "Packaging" }),
						new Item({ key: "c", text: "Shipping" }),
					],
				}),
			],
		},
		{
			caption: "value states",
			controls: STATES.map(
				(valueState) =>
					new Select({
						valueState,
						width: "9rem",
						items: [new Item({ key: "a", text: valueState })],
					}),
			),
		},
	],

	ComboBox: () => [
		{
			caption: "default",
			controls: [
				new ComboBox({
					selectedKey: "b",
					width: "12rem",
					items: [
						new ListItem({ key: "a", text: "Steel", additionalText: "A-1" }),
						new ListItem({ key: "b", text: "Copper", additionalText: "B-2" }),
					],
				}),
			],
		},
		{
			caption: "secondary values, read-only, disabled",
			controls: [
				new ComboBox({
					selectedKey: "a",
					showSecondaryValues: true,
					width: "12rem",
					items: [
						new ListItem({ key: "a", text: "Steel", additionalText: "A-1" }),
					],
				}),
				new ComboBox({ value: "Read-only", editable: false }),
				new ComboBox({ value: "Disabled", enabled: false }),
			],
		},
	],

	DatePicker: () => [
		{
			caption: "default",
			controls: [new DatePicker({ value: "2026-08-09", valueFormat: "yyyy-MM-dd" })],
		},
		{
			caption: "placeholder, read-only, disabled",
			controls: [
				new DatePicker({ placeholder: "Pick a date" }),
				new DatePicker({
					value: "2026-08-09",
					valueFormat: "yyyy-MM-dd",
					editable: false,
				}),
				new DatePicker({
					value: "2026-08-09",
					valueFormat: "yyyy-MM-dd",
					enabled: false,
				}),
			],
		},
	],

	TimePicker: () => [
		{
			caption: "default",
			controls: [new TimePicker({ value: "14:30", valueFormat: "HH:mm" })],
		},
		{
			caption: "placeholder, read-only, disabled",
			controls: [
				new TimePicker({ placeholder: "Pick a time" }),
				new TimePicker({ value: "14:30", valueFormat: "HH:mm", editable: false }),
				new TimePicker({ value: "14:30", valueFormat: "HH:mm", enabled: false }),
			],
		},
	],

	StepInput: () => [
		{
			caption: "default",
			controls: [new StepInput({ value: 3, min: 0, max: 10 })],
		},
		{
			caption: "at the minimum, disabled",
			controls: [
				new StepInput({ value: 0, min: 0, max: 10 }),
				new StepInput({ value: 5, enabled: false }),
			],
		},
	],

	Toolbar: () => [
		{
			caption: "default",
			controls: [
				new Toolbar({
					width: "22rem",
					content: [
						new Button({ text: "Save", type: ButtonType.Emphasized }),
						new ToolbarSpacer(),
						new Button({ text: "Cancel" }),
					],
				}),
			],
		},
		{
			caption: "disabled, and with it what is in it",
			controls: [
				new Toolbar({
					enabled: false,
					content: [
						new Button({ text: "Save" }),
						new CheckBox({ text: "Agree" }),
						new Switch(),
						new Input({ width: "8rem" }),
					],
				}),
			],
		},
	],

	OverflowToolbar: () => [
		{
			caption: "wide enough for everything",
			controls: [
				new OverflowToolbar({
					width: "34rem",
					content: [
						new Button({ text: "New" }),
						new Button({ text: "Edit" }),
						new ToolbarSpacer(),
						new Button({ text: "Delete" }),
					],
				}),
			],
		},
		{
			caption: "too narrow, so it overflows",
			controls: [
				new OverflowToolbar({
					width: "10rem",
					content: [
						new Button({ text: "New" }),
						new Button({ text: "Edit" }),
						new Button({ text: "Delete" }),
					],
				}),
			],
		},
		{
			caption: "disabled, and too narrow",
			controls: [
				new VBox({
					width: "8rem",
					items: [
						new OverflowToolbar({
							enabled: false,
							content: [
								new Button({ text: "New" }),
								new Button({ text: "Edit" }),
								new Button({ text: "Delete" }),
							],
						}),
					],
				}),
			],
		},
	],

	// the QuickDialog stands in for sap.m.MessageBox; input and select have
	// no MessageBox counterpart
	QuickDialog: () => [
		{
			caption: "the dialogs, one button each",
			controls: [
				new Button({
					text: "show",
					press: () => {
						MessageBox.show("A message and one action.", { title: "Show" });
					},
				}),
				new Button({
					text: "confirm",
					press: () => {
						MessageBox.confirm("Yes or no?", { title: "Confirm" });
					},
				}),
				new Button({
					text: "error",
					press: () => {
						MessageBox.error("Something went wrong.", { title: "Error" });
					},
				}),
				new Button({
					text: "information",
					press: () => {
						MessageBox.information("Good to know.", { title: "Information" });
					},
				}),
				new Button({
					text: "details",
					press: () => {
						MessageBox.error("Something went wrong.", {
							title: "Details",
							details: "The long text behind the Show details link.",
						});
					},
				}),
			],
		},
	],
};
