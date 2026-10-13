import { caseNames } from "./cases";

/** a heading on the test page and the cases shown under it */
export interface CaseGroup {
	title: string;
	names: string[];
}

/** where each case belongs; the order is the order on the page */
const GROUPS: CaseGroup[] = [
	{
		title: "Actions",
		names: ["Button", "Link", "SegmentedButton", "Toolbar", "OverflowToolbar"],
	},
	{
		title: "Text and input",
		names: ["Text", "Input", "TextArea", "StepInput", "BarcodeInput"],
	},
	{
		title: "Selection",
		names: ["CheckBox", "RadioButton", "Switch", "Select", "ComboBox"],
	},
	{
		title: "Date and time",
		names: ["DatePicker", "TimePicker"],
	},
	{
		title: "Keyboards",
		names: ["Keyboard", "NumberPad", "CustomKeyboard"],
	},
	{
		title: "More",
		names: ["SignaturePad", "QuickDialog"],
	},
];

/**
 * The cases, grouped for the page.
 *
 * A case that is in no group above ends up in the last one, so a control that
 * is added to cases.ts is on the page even before it is sorted in - the UI
 * tests look for every case, and a forgotten entry here must not hide one.
 * A name above that is not a case is left out.
 */
export function groupedCases(): CaseGroup[] {
	const grouped = new Set(GROUPS.flatMap((group) => group.names));
	const ungrouped = caseNames.filter((name) => !grouped.has(name));

	return GROUPS.map((group, index) => ({
		title: group.title,
		names: [
			...group.names.filter((name) => caseNames.includes(name)),
			...(index === GROUPS.length - 1 ? ungrouped : []),
		],
	})).filter((group) => group.names.length > 0);
}
