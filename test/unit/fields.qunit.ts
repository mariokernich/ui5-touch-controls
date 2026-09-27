import type HBox from "sap/m/HBox";
import type Popover from "sap/m/Popover";
import type VBox from "sap/m/VBox";
import Localization from "sap/base/i18n/Localization";
import DateFormat from "sap/ui/core/format/DateFormat";
import BarcodeInput from "ui5/touch/controls/BarcodeInput";
import type Button from "ui5/touch/controls/Button";
import DatePicker from "ui5/touch/controls/DatePicker";
import type Input from "ui5/touch/controls/Input";
import StepInput from "ui5/touch/controls/StepInput";
import type Text from "ui5/touch/controls/Text";
import TimePicker from "ui5/touch/controls/TimePicker";
import { SizeMode } from "ui5/touch/controls/library";
import { cleanUp, commit, EventLog, keydown, place, render, tap, type, waitFor } from "./helpers";

function popoverOf(control: DatePicker | TimePicker): Popover {
	return control.getAggregation("_popover") as Popover;
}

async function opened(control: DatePicker | TimePicker): Promise<void> {
	await waitFor(() => Boolean(popoverOf(control)?.isOpen()), "the popover did not open");
}

async function closed(control: DatePicker | TimePicker): Promise<void> {
	await waitFor(() => !popoverOf(control)?.isOpen(), "the popover did not close");
}

QUnit.module("StepInput", {
	afterEach: cleanUp,
});

function parts(stepInput: StepInput): { minus: Button; input: Input; plus: Button } {
	return {
		minus: stepInput.getAggregation("_minusButton") as Button,
		input: stepInput.getAggregation("_input") as Input,
		plus: stepInput.getAggregation("_plusButton") as Button,
	};
}

QUnit.test("the buttons step the value and report it", (assert) => {
	const stepInput = place(new StepInput({ value: 1, step: 2 }));
	const log = new EventLog().listen(stepInput, "change");
	const { minus, plus, input } = parts(stepInput);

	plus.firePress();
	render();
	assert.strictEqual(stepInput.getValue(), 3);
	assert.strictEqual(input.getValue(), "3", "the field shows it");

	minus.firePress();
	minus.firePress();
	assert.strictEqual(stepInput.getValue(), 0, "and stops at the minimum");
	assert.deepEqual(
		log.entries.map((entry) => entry.parameters.value),
		[3, 1, 0],
	);
});

QUnit.test("a decimal step keeps its precision", (assert) => {
	const stepInput = place(new StepInput({ value: 0.1, step: 0.1 }));

	parts(stepInput).plus.firePress();
	parts(stepInput).plus.firePress();

	assert.strictEqual(stepInput.getValue(), 0.3, "not 0.30000000000000004");
});

QUnit.test("a button that has nowhere to go is disabled", (assert) => {
	const stepInput = place(new StepInput({ value: 0, min: 0, max: 1 }));

	assert.notOk(parts(stepInput).minus.getEnabled());
	assert.ok(parts(stepInput).plus.getEnabled());

	parts(stepInput).plus.firePress();
	render();

	assert.ok(parts(stepInput).minus.getEnabled());
	assert.notOk(parts(stepInput).plus.getEnabled());
});

QUnit.test("a typed value is taken over and kept within the limits", (assert) => {
	const stepInput = place(new StepInput({ value: 5, max: 10 }));
	const field = parts(stepInput).input.getDomRef("inner") as HTMLInputElement;
	const log = new EventLog().listen(stepInput, "change");

	type(field, "7");
	commit(field);
	assert.strictEqual(stepInput.getValue(), 7);

	type(field, "99");
	commit(field);
	render();
	assert.strictEqual(stepInput.getValue(), 10, "clamped to the maximum");
	assert.strictEqual(field.value, "10");
	assert.strictEqual(log.count("change"), 2);
});

QUnit.test("a value that is out of range or no number puts the field back", (assert) => {
	const stepInput = place(new StepInput({ value: 10, max: 10 }));
	const field = parts(stepInput).input.getDomRef("inner") as HTMLInputElement;
	const log = new EventLog().listen(stepInput, "change");

	type(field, "12");
	commit(field);

	assert.strictEqual(field.value, "10", "the field shows the value again");
	assert.strictEqual(stepInput.getValue(), 10);
	assert.strictEqual(log.count("change"), 0, "which did not change");
});

QUnit.test("the buttons carry the size and the tooltips of the library", (assert) => {
	const stepInput = place(new StepInput({ size: SizeMode.XL }));
	const { minus, plus, input } = parts(stepInput);

	assert.deepEqual(
		[minus.getSize(), input.getSize(), plus.getSize()],
		["XL", "XL", "XL"],
	);
	assert.strictEqual(minus.getTooltip_AsString(), "Decrease");
	assert.strictEqual(plus.getTooltip_AsString(), "Increase");

	Localization.setLanguage("de");
	render();

	assert.strictEqual(plus.getTooltip_AsString(), "Vergrößern", "in the language of the app");
});

QUnit.module("DatePicker", {
	afterEach: cleanUp,
});

function dateField(datePicker: DatePicker): HTMLInputElement {
	return datePicker.getDomRef("inner") as HTMLInputElement;
}

/** the buttons of the days in the calendar that is open */
function days(datePicker: DatePicker): Button[] {
	const calendar = popoverOf(datePicker).getContent()[0] as VBox;
	const grid = calendar.getItems()[1] as VBox;

	return grid.getItems().filter((item) => item.isA("ui5.touch.controls.Button")) as Button[];
}

function header(datePicker: DatePicker): Button[] {
	const calendar = popoverOf(datePicker).getContent()[0] as VBox;

	return (calendar.getItems()[0] as HBox).getItems() as Button[];
}

QUnit.test("value and dateValue follow each other", (assert) => {
	const datePicker = place(new DatePicker({ value: "2026-09-27" }));

	assert.deepEqual(datePicker.getDateValue(), new Date(2026, 8, 27));
	assert.strictEqual(dateField(datePicker).value, "Sep 27, 2026", "shown in the display format");

	datePicker.setDateValue(new Date(2026, 0, 2));

	assert.strictEqual(datePicker.getValue(), "2026-01-02");
	assert.strictEqual(dateField(datePicker).value, "Jan 2, 2026");
	assert.strictEqual(datePicker.getFocusDomRef(), dateField(datePicker));
	assert.strictEqual(datePicker.getIdForLabel(), dateField(datePicker).id);
});

QUnit.test("a typed date is taken over, anything else is reported as invalid", (assert) => {
	const datePicker = place(new DatePicker({ value: "2026-09-27" }));
	const log = new EventLog().listen(datePicker, "change");

	type(dateField(datePicker), "Oct 3, 2026");
	commit(dateField(datePicker));

	assert.strictEqual(datePicker.getValue(), "2026-10-03");
	assert.deepEqual(log.last("change"), {
		value: "2026-10-03",
		dateValue: new Date(2026, 9, 3),
		valid: true,
	});

	type(dateField(datePicker), "no date");
	commit(dateField(datePicker));

	assert.strictEqual(log.last("change")?.valid, false);
	assert.strictEqual(datePicker.getValue(), "2026-10-03", "the date stays");
	assert.strictEqual(dateField(datePicker).value, "Oct 3, 2026", "and so does the field");

	type(dateField(datePicker), "");
	commit(dateField(datePicker));

	assert.deepEqual(log.last("change"), { value: "", dateValue: null, valid: true });
	assert.strictEqual(datePicker.getDateValue(), null);
});

QUnit.test("the calendar opens on the month of the date, and a day picks it", async (assert) => {
	const datePicker = place(new DatePicker({ value: "2026-09-27" }));
	const log = new EventLog().listen(datePicker, "change");

	tap(datePicker.getDomRef("icon") as HTMLElement);
	await opened(datePicker);

	assert.strictEqual(datePicker.getDomRef()?.getAttribute("aria-expanded"), "true");
	assert.strictEqual(header(datePicker)[1].getText(), "September 2026");
	assert.strictEqual(days(datePicker).length, 42, "six weeks, so the popover does not jump");
	assert.ok(
		days(datePicker).some(
			(day) => day.getText() === "27" && day.hasStyleClass("sizedDatePickerDaySelected"),
		),
		"the date is marked",
	);

	days(datePicker)
		.find((day) => day.getText() === "15" && !day.hasStyleClass("sizedDatePickerDayOther"))
		?.firePress();
	await closed(datePicker);

	assert.strictEqual(datePicker.getValue(), "2026-09-15");
	assert.deepEqual(log.last("change"), {
		value: "2026-09-15",
		dateValue: new Date(2026, 8, 15),
		valid: true,
	});
	assert.strictEqual(datePicker.getDomRef()?.getAttribute("aria-expanded"), "false");
});

QUnit.test("the heading names the month the way the language does", async (assert) => {
	Localization.setLanguage("ja");
	const datePicker = place(new DatePicker({ value: "2026-09-27" }));

	tap(datePicker.getDomRef("icon") as HTMLElement);
	await opened(datePicker);

	assert.strictEqual(
		header(datePicker)[1].getText(),
		DateFormat.getDateInstance({ format: "yMMMM" }).format(new Date(2026, 8, 1)),
	);
	assert.ok(header(datePicker)[1].getText().startsWith("2026"), "the year comes first in Japanese");
	popoverOf(datePicker).close();
	await closed(datePicker);
});

QUnit.test("the arrows step through the months and say what they do", async (assert) => {
	const datePicker = place(new DatePicker({ value: "2026-01-15" }));

	tap(datePicker.getDomRef("icon") as HTMLElement);
	await opened(datePicker);
	const [previous, , next] = header(datePicker);

	assert.strictEqual(previous.getTooltip_AsString(), "Previous");
	assert.strictEqual(next.getTooltip_AsString(), "Next");

	previous.firePress();
	assert.strictEqual(header(datePicker)[1].getText(), "December 2025");

	header(datePicker)[2].firePress();
	header(datePicker)[2].firePress();
	assert.strictEqual(header(datePicker)[1].getText(), "February 2026");
	popoverOf(datePicker).close();
	await closed(datePicker);
});

QUnit.test("the days outside of minDate and maxDate cannot be picked", async (assert) => {
	const datePicker = place(
		new DatePicker({
			value: "2026-09-15",
			minDate: new Date(2026, 8, 10),
			maxDate: new Date(2026, 8, 20),
		}),
	);

	tap(datePicker.getDomRef("icon") as HTMLElement);
	await opened(datePicker);

	const inMonth = days(datePicker).filter((day) => !day.hasStyleClass("sizedDatePickerDayOther"));
	const enabled = inMonth.filter((day) => day.getEnabled()).map((day) => Number(day.getText()));

	assert.deepEqual(enabled, [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
	popoverOf(datePicker).close();
	await closed(datePicker);
});

QUnit.module("TimePicker", {
	afterEach: cleanUp,
});

function timeField(timePicker: TimePicker): HTMLInputElement {
	return timePicker.getDomRef("inner") as HTMLInputElement;
}

/** the two columns of the open popover, as their buttons */
function columns(timePicker: TimePicker): [Button[], Button[]] {
	const clock = popoverOf(timePicker).getContent()[0] as VBox;
	const both = (clock.getItems()[1] as HBox).getItems() as VBox[];

	return [both[0].getItems() as Button[], both[1].getItems() as Button[]];
}

function marked(buttons: Button[]): string[] {
	return buttons
		.filter((button) => button.hasStyleClass("sizedTimePickerItemSelected"))
		.map((button) => button.getText());
}

QUnit.test("value and dateValue follow each other", (assert) => {
	const timePicker = place(new TimePicker({ value: "08:30" }));
	const date = timePicker.getDateValue() as Date;

	assert.deepEqual([date.getHours(), date.getMinutes()], [8, 30]);
	assert.strictEqual(timeField(timePicker).value, "08:30");

	const later = new Date(date.getTime());
	later.setHours(17, 5);
	timePicker.setDateValue(later);

	assert.strictEqual(timePicker.getValue(), "17:05");
	assert.strictEqual(timeField(timePicker).value, "17:05");
	assert.strictEqual(timePicker.getFocusDomRef(), timeField(timePicker));
});

QUnit.test("the columns show the hours and the minutes in their step, with the time marked", async (assert) => {
	const timePicker = place(new TimePicker({ value: "08:58", minutesStep: 5 }));

	tap(timePicker.getDomRef("icon") as HTMLElement);
	await opened(timePicker);
	const [hours, minutes] = columns(timePicker);

	assert.strictEqual(hours.length, 24);
	assert.deepEqual(
		minutes.map((button) => button.getText()),
		["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"],
	);
	assert.deepEqual(marked(hours), ["08"]);
	assert.deepEqual(marked(minutes), ["55"], "the nearest entry of the hour");

	const clock = popoverOf(timePicker).getContent()[0] as VBox;
	const headings = (clock.getItems()[0] as HBox).getItems() as Text[];
	assert.deepEqual(
		headings.map((heading) => heading.getText()),
		["Hours", "Minutes"],
	);
	popoverOf(timePicker).close();
	await closed(timePicker);
});

QUnit.test("picking marks the entry where it is, and change waits for the popover to close", async (assert) => {
	const timePicker = place(new TimePicker({ value: "08:30" }));
	const log = new EventLog().listen(timePicker, "change");

	tap(timePicker.getDomRef("icon") as HTMLElement);
	await opened(timePicker);
	const [hours] = columns(timePicker);
	const column = hours[0].getDomRef()?.parentElement as HTMLElement;

	column.scrollTop = 200;
	hours[19].firePress();
	render();

	assert.strictEqual(timePicker.getValue(), "19:30");
	assert.deepEqual(marked(columns(timePicker)[0]), ["19"]);
	assert.strictEqual(hours[0].getDomRef()?.parentElement, column, "the column was not rendered again");
	assert.strictEqual(column.scrollTop, 200, "and stays where it was scrolled to");
	assert.strictEqual(log.count("change"), 0, "nothing is reported yet");

	popoverOf(timePicker).close();
	await closed(timePicker);

	assert.strictEqual(log.count("change"), 1);
	assert.strictEqual(log.last("change")?.value, "19:30");
});

QUnit.test("the picked entries are scrolled into view, whatever the id of the control", async (assert) => {
	const timePicker = place(new TimePicker("with.dot:and-colon", { value: "20:15" }));

	tap(timePicker.getDomRef("icon") as HTMLElement);
	await opened(timePicker);
	const column = columns(timePicker)[0][0].getDomRef()?.parentElement as HTMLElement;

	await waitFor(() => column.scrollTop > 0, "the hours column was not scrolled");
	assert.ok(column.scrollTop > 0);
	popoverOf(timePicker).close();
	await closed(timePicker);
});

QUnit.test("a typed time is taken over, anything else is reported as invalid", (assert) => {
	const timePicker = place(new TimePicker({ value: "08:30" }));
	const log = new EventLog().listen(timePicker, "change");

	type(timeField(timePicker), "09:45");
	commit(timeField(timePicker));
	assert.strictEqual(timePicker.getValue(), "09:45");
	assert.strictEqual(log.last("change")?.valid, true);

	type(timeField(timePicker), "later");
	commit(timeField(timePicker));
	assert.strictEqual(log.last("change")?.valid, false);
	assert.strictEqual(timeField(timePicker).value, "09:45");
});

QUnit.module("BarcodeInput", {
	afterEach: cleanUp,
});

/**
 * Sends the characters as keys with the given gap between them, and Enter
 * after the last one - the way a scanner or a person would. The clock of the
 * page is replaced for the duration, so the gaps are exact.
 */
function send(barcodeInput: BarcodeInput, text: string, gap: number): void {
	const field = barcodeInput.getDomRef("inner") as HTMLInputElement;
	const now = performance.now.bind(performance);
	let clock = 1000;

	performance.now = () => clock;

	try {
		for (const char of text) {
			clock += gap;
			keydown(field, char);
			type(field, field.value + char);
		}
		clock += gap;
		keydown(field, "Enter");
	} finally {
		performance.now = now;
	}
}

QUnit.test("a burst of keys closed by Enter is a scan", (assert) => {
	const barcodeInput = place(new BarcodeInput({ prefix: "]C1", suffix: "#" }));
	const log = new EventLog().listen(barcodeInput, "scan", "change");

	send(barcodeInput, "]C14006381333931#", 5);

	assert.deepEqual(log.names(), ["scan"]);
	assert.deepEqual(log.last("scan"), { value: "4006381333931", rawValue: "]C14006381333931#" });
	assert.strictEqual(barcodeInput.getValue(), "", "the field is emptied for the next scan");
	assert.strictEqual((barcodeInput.getDomRef("inner") as HTMLInputElement).value, "");
});

QUnit.test("without clearOnScan the code stays in the field", (assert) => {
	const barcodeInput = place(new BarcodeInput({ clearOnScan: false }));

	send(barcodeInput, "12345", 5);

	assert.strictEqual(barcodeInput.getValue(), "12345");
});

QUnit.test("keys typed by a person are a change", (assert) => {
	const barcodeInput = place(new BarcodeInput());
	const log = new EventLog().listen(barcodeInput, "scan", "change");

	send(barcodeInput, "12345", 150);

	assert.deepEqual(log.names(), ["change"]);
	assert.deepEqual(log.last("change"), { value: "12345" });
});

QUnit.test("a burst shorter than minLength is no scan", (assert) => {
	const barcodeInput = place(new BarcodeInput({ minLength: 4 }));
	const log = new EventLog().listen(barcodeInput, "scan", "change");

	send(barcodeInput, "123", 5);

	assert.deepEqual(log.names(), ["change"]);
});

QUnit.test("a change Enter reported is not reported again when the focus leaves", (assert) => {
	const barcodeInput = place(new BarcodeInput());
	const log = new EventLog().listen(barcodeInput, "change");
	const field = barcodeInput.getDomRef("inner") as HTMLInputElement;

	send(barcodeInput, "12", 150);
	commit(field);

	assert.strictEqual(log.count("change"), 1);

	keydown(field, "Enter");
	assert.strictEqual(log.count("change"), 2, "another Enter hands the code over again");
});

QUnit.test("a tap on the icon puts the focus into the field", (assert) => {
	const barcodeInput = place(new BarcodeInput());

	tap(barcodeInput.getDomRef("icon") as HTMLElement);

	assert.strictEqual(document.activeElement, barcodeInput.getDomRef("inner"));
	assert.strictEqual(barcodeInput.getIdForLabel(), `${barcodeInput.getId()}-inner`);
});
