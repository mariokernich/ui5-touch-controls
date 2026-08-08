import HBox from "sap/m/HBox";
import Popover from "sap/m/Popover";
import VBox from "sap/m/VBox";
import { FlexRendertype, PlacementType } from "sap/m/library";
import Control from "sap/ui/core/Control";
import RenderManager from "sap/ui/core/RenderManager";
import { MetadataOptions } from "sap/ui/core/Element";
import { ValueState } from "sap/ui/core/library";
import DateFormat from "sap/ui/core/format/DateFormat";
import Locale from "sap/ui/core/Locale";
import LocaleData from "sap/ui/core/LocaleData";
import Localization from "sap/base/i18n/Localization";
import Button from "./Button";
import Text from "./Text";
import { ISized, SizeMode } from "./library";

/** the two things the calendar of the popover can show */
type CalendarView = "days" | "months";

/**
 * A simplified variant of <code>sap.m.DatePicker</code> for touch devices.
 *
 * The field is the one of {@link ui5.touch.controls.Select} with a calendar
 * icon at its end. What makes the control a touch control is the calendar
 * itself: it is built from the library's own buttons, so a day is a square
 * that grows with the <code>size</code> property instead of the fixed grid of
 * <code>sap.ui.unified.Calendar</code>, which is laid out for a mouse pointer.
 *
 * Two views are available: the days of a month, and - after a tap on the month
 * in the header - the twelve months of a year.
 *
 * Compared to <code>sap.m.DatePicker</code> the following simplifications
 * apply:
 * <ul>
 * <li>there is no year picker, no week numbers, no special dates, no date
 * ranges and no secondary calendar type</li>
 * <li><code>displayFormatType</code>, <code>showCurrentDateButton</code>,
 * <code>showFooter</code>, <code>valueStateText</code>,
 * <code>textAlign</code>, <code>textDirection</code> and <code>required</code>
 * are not supported</li>
 * <li>the calendar is a popover on every device, there is no full screen
 * dialog on a phone</li>
 * <li>text that cannot be parsed puts the field back to the last valid date
 * and is reported as <code>valid: false</code>, instead of staying in the
 * field with a value state sap.m sets on its own</li>
 * </ul>
 *
 * @namespace ui5.touch.controls
 */
export default class DatePicker extends Control implements ISized {
	private expanded = false;
	private view: CalendarView = "days";
	/** first day of the month the calendar currently shows */
	private displayedMonth = DatePicker.startOfDay(new Date());
	private changeListener: ((event: globalThis.Event) => void) | null = null;

	static readonly metadata: MetadataOptions = {
		interfaces: ["ui5.touch.controls.ISized"],
		properties: {
			/**
			 * The date as a string, in <code>valueFormat</code>.
			 */
			value: { type: "string", group: "Data", defaultValue: "" },
			/**
			 * The date as a <code>Date</code> object.
			 */
			dateValue: { type: "object", group: "Data", defaultValue: null },
			/**
			 * Format of <code>value</code>, e.g. <code>yyyy-MM-dd</code>. This
			 * is what a model sees.
			 */
			valueFormat: {
				type: "string",
				group: "Data",
				defaultValue: "yyyy-MM-dd",
			},
			/**
			 * Format shown in the field. Besides a pattern the styles
			 * <code>short</code>, <code>medium</code>, <code>long</code> and
			 * <code>full</code> are accepted, which follow the current locale.
			 */
			displayFormat: {
				type: "string",
				group: "Appearance",
				defaultValue: "medium",
			},
			/**
			 * Earliest date that can be selected.
			 */
			minDate: { type: "object", group: "Misc", defaultValue: null },
			/**
			 * Latest date that can be selected.
			 */
			maxDate: { type: "object", group: "Misc", defaultValue: null },
			/**
			 * Placeholder text shown while the field is empty.
			 */
			placeholder: { type: "string", group: "Misc", defaultValue: "" },
			/**
			 * Indicates whether the user can interact with the control.
			 */
			enabled: { type: "boolean", group: "Behavior", defaultValue: true },
			/**
			 * Defines whether the date can be changed by the user. A read-only
			 * date picker shows its value without the icon.
			 */
			editable: { type: "boolean", group: "Behavior", defaultValue: true },
			/**
			 * Visualizes the validation state, e.g. Error, Warning, Success,
			 * Information.
			 */
			valueState: {
				type: "sap.ui.core.ValueState",
				group: "Appearance",
				defaultValue: ValueState.None,
			},
			/**
			 * Width of the field.
			 */
			width: {
				type: "sap.ui.core.CSSSize",
				group: "Dimension",
				defaultValue: null,
			},
			/**
			 * Touch size of the field and of the days in the calendar.
			 */
			size: {
				type: "ui5.touch.controls.SizeMode",
				group: "Appearance",
				defaultValue: SizeMode.M,
			},
		},
		aggregations: {
			/**
			 * The popover carrying the calendar.
			 */
			_popover: {
				type: "sap.m.Popover",
				multiple: false,
				visibility: "hidden",
			},
		},
		events: {
			/**
			 * Fired when the date is changed - by picking a day or by typing
			 * into the field.
			 */
			change: {
				parameters: {
					/**
					 * The new value, in <code>valueFormat</code>.
					 */
					value: { type: "string" },
					/**
					 * The new date, <code>null</code> when the field is empty or
					 * what was typed could not be parsed.
					 */
					dateValue: { type: "object" },
					/**
					 * Whether the field holds a date that could be parsed.
					 */
					valid: { type: "boolean" },
				},
			},
		},
	};

	constructor(idOrSettings?: string | $DatePickerSettings);
	constructor(id?: string, settings?: $DatePickerSettings);
	constructor(id?: string, settings?: $DatePickerSettings) {
		super(id, settings);
	}

	// -----------------------------------------------------------------------
	// date helpers
	// -----------------------------------------------------------------------

	/** the given date with the time cut off, so two days compare by value */
	private static startOfDay(date: Date): Date {
		return new Date(date.getFullYear(), date.getMonth(), date.getDate());
	}

	private static isSameDay(a: Date | null, b: Date | null): boolean {
		return (
			!!a &&
			!!b &&
			a.getFullYear() === b.getFullYear() &&
			a.getMonth() === b.getMonth() &&
			a.getDate() === b.getDate()
		);
	}

	/**
	 * A style name is turned into a style instance, everything else is taken
	 * as a pattern - the same rule sap.m.DatePicker applies.
	 */
	private static getFormatter(format: string): DateFormat {
		if (["short", "medium", "long", "full"].includes(format)) {
			return DateFormat.getDateInstance({ style: format });
		}

		return DateFormat.getDateInstance({ pattern: format });
	}

	private static getLocaleData(): LocaleData {
		return LocaleData.getInstance(new Locale(Localization.getLanguage()));
	}

	private getValueFormatter(): DateFormat {
		return DatePicker.getFormatter(this.getValueFormat());
	}

	private getDisplayFormatter(): DateFormat {
		return DatePicker.getFormatter(this.getDisplayFormat());
	}

	/** the text the field shows for the current date */
	private getDisplayValue(): string {
		const date = this.getDateValue() as Date | null;

		return date ? this.getDisplayFormatter().format(date) : "";
	}

	// -----------------------------------------------------------------------
	// value handling
	// -----------------------------------------------------------------------

	setValue(value: string): this {
		this.setProperty("value", value, true);

		const parsed = value ? (this.getValueFormatter().parse(value) as Date | null) : null;
		this.setProperty("dateValue", parsed, true);
		this.syncInput();

		return this;
	}

	setDateValue(date: Date | null): this {
		this.setProperty("dateValue", date, true);
		this.setProperty(
			"value",
			date ? this.getValueFormatter().format(date) : "",
			true,
		);
		this.syncInput();

		return this;
	}

	/**
	 * Writes the formatted date into the native input without a re-rendering,
	 * so caret and focus survive.
	 */
	private syncInput(): void {
		const input = this.getInnerInput();
		const text = this.getDisplayValue();

		if (input && input.value !== text) {
			input.value = text;
		}
	}

	private getInnerInput(): HTMLInputElement | null {
		return this.getDomRef()?.querySelector("input") ?? null;
	}

	private isInteractive(): boolean {
		return this.getEnabled() && this.getEditable();
	}

	private isSelectable(date: Date): boolean {
		const min = this.getMinDate() as Date | null;
		const max = this.getMaxDate() as Date | null;

		if (min && date < DatePicker.startOfDay(min)) {
			return false;
		}

		return !(max && date > DatePicker.startOfDay(max));
	}

	onAfterRendering(): void {
		const input = this.getInnerInput();

		if (!input) {
			return;
		}

		// with renderer apiVersion 2 the DOM element is patched and reused, so
		// a previously attached listener has to go first
		if (this.changeListener) {
			input.removeEventListener("change", this.changeListener);
		}

		this.changeListener = () => {
			this.applyTypedValue(input.value);
		};
		input.addEventListener("change", this.changeListener);
	}

	exit(): void {
		const input = this.getInnerInput();

		if (input && this.changeListener) {
			input.removeEventListener("change", this.changeListener);
		}
		this.changeListener = null;
	}

	/**
	 * Takes what the user typed. An empty field clears the date, anything that
	 * cannot be parsed leaves the date alone and is reported as invalid.
	 */
	private applyTypedValue(text: string): void {
		if (!text.trim()) {
			this.setDateValue(null);
			this.fireChange({ value: "", dateValue: null, valid: true });
			return;
		}

		const parsed = this.getDisplayFormatter().parse(text) as Date | null;

		if (!parsed) {
			// unlike sap.m, which leaves the text standing and sets the value
			// state itself, the field goes back to the last valid date - the
			// application decides what to do with valid: false
			this.syncInput();
			this.fireChange({
				value: this.getValue(),
				dateValue: this.getDateValue(),
				valid: false,
			});
			return;
		}

		this.setDateValue(DatePicker.startOfDay(parsed));
		this.fireChange({
			value: this.getValue(),
			dateValue: this.getDateValue(),
			valid: true,
		});
	}

	// -----------------------------------------------------------------------
	// interaction
	// -----------------------------------------------------------------------

	/**
	 * Only the icon opens the calendar - a tap into the text is meant for the
	 * caret.
	 */
	ontap(event: Event): void {
		if (!this.isInteractive()) {
			return;
		}

		const target = event.target as HTMLElement | null;

		if (target?.classList.contains("sizedDatePickerIcon")) {
			if (this.expanded) {
				this.getPopover().close();
			} else {
				this.openCalendar();
			}
		}
	}

	onsapshow(event: KeyboardEvent): void {
		// F4 / ALT+ARROW DOWN, as in sap.m
		event.preventDefault();

		if (this.isInteractive() && !this.expanded) {
			this.openCalendar();
		}
	}

	private openCalendar(): void {
		const dom = this.getDomRef() as HTMLElement | null;

		if (!dom) {
			return;
		}

		this.view = "days";
		this.displayedMonth = DatePicker.startOfDay(
			(this.getDateValue() as Date | null) ?? new Date(),
		);
		this.displayedMonth.setDate(1);

		const popover = this.getPopover();
		this.renderCalendar();

		this.expanded = true;
		dom.setAttribute("aria-expanded", "true");
		dom.classList.add("sizedDatePickerExpanded");

		popover.openBy(this);
	}

	private renderCalendar(): void {
		const popover = this.getPopover();

		popover.destroyContent();
		popover.addContent(
			this.view === "days" ? this.createDayView() : this.createMonthView(),
		);
	}

	private shiftDisplayed(amount: number): void {
		const step = this.view === "days" ? 1 : 12;
		this.displayedMonth = new Date(
			this.displayedMonth.getFullYear(),
			this.displayedMonth.getMonth() + amount * step,
			1,
		);
		this.renderCalendar();
	}

	private createHeader(title: string, titlePressable: boolean): HBox {
		const size = this.getSize();

		const previous = new Button({
			icon: "sap-icon://slim-arrow-left",
			size: size,
			press: () => {
				this.shiftDisplayed(-1);
			},
		}).addStyleClass("sizedDatePickerNav");

		const heading = new Button({
			text: title,
			size: size,
			press: () => {
				if (titlePressable) {
					this.view = "months";
					this.renderCalendar();
				}
			},
		}).addStyleClass("sizedDatePickerTitle");

		const next = new Button({
			icon: "sap-icon://slim-arrow-right",
			size: size,
			press: () => {
				this.shiftDisplayed(1);
			},
		}).addStyleClass("sizedDatePickerNav");

		return new HBox({
			renderType: FlexRendertype.Bare,
			items: [previous, heading, next],
		}).addStyleClass("sizedDatePickerHeader");
	}

	private createDayView(): VBox {
		const size = this.getSize();
		const localeData = DatePicker.getLocaleData();
		const firstDayOfWeek = localeData.getFirstDayOfWeek();
		const dayNames = localeData.getDaysStandAlone("abbreviated");
		const today = DatePicker.startOfDay(new Date());
		const selected = this.getDateValue() as Date | null;

		const title = DateFormat.getDateInstance({ pattern: "MMMM yyyy" }).format(
			this.displayedMonth,
		);

		// the grid starts on the first day of the week before the first of the
		// month, and always shows six weeks so the popover does not jump
		const start = new Date(this.displayedMonth);
		const offset = (start.getDay() - firstDayOfWeek + 7) % 7;
		start.setDate(start.getDate() - offset);

		const cells: Control[] = [];

		for (let index = 0; index < 7; index++) {
			cells.push(
				// the library's own text, so the weekday names scale with the
				// control just like the days do
				new Text({
					text: dayNames[(firstDayOfWeek + index) % 7],
					size: size,
				}).addStyleClass("sizedDatePickerWeekday"),
			);
		}

		for (let index = 0; index < 42; index++) {
			const date = new Date(
				start.getFullYear(),
				start.getMonth(),
				start.getDate() + index,
			);
			const selectable = this.isSelectable(date);

			const button = new Button({
				text: `${date.getDate()}`,
				size: size,
				enabled: selectable,
				press: () => {
					this.selectDate(date);
				},
			});

			button.addStyleClass("sizedDatePickerDay");
			if (date.getMonth() !== this.displayedMonth.getMonth()) {
				button.addStyleClass("sizedDatePickerDayOther");
			}
			if (DatePicker.isSameDay(date, today)) {
				button.addStyleClass("sizedDatePickerDayToday");
			}
			if (DatePicker.isSameDay(date, selected)) {
				button.addStyleClass("sizedDatePickerDaySelected");
			}

			cells.push(button);
		}

		return new VBox({
			renderType: FlexRendertype.Bare,
			items: [
				this.createHeader(title, true),
				new VBox({
					renderType: FlexRendertype.Bare,
					items: cells,
				}).addStyleClass("sizedDatePickerGrid"),
			],
		}).addStyleClass("sizedDatePickerCalendar");
	}

	private createMonthView(): VBox {
		const size = this.getSize();
		const monthNames = DatePicker.getLocaleData().getMonthsStandAlone(
			"abbreviated",
		);
		const year = this.displayedMonth.getFullYear();
		const selected = this.getDateValue() as Date | null;

		const cells = monthNames.map((name, month) => {
			const button = new Button({
				text: name,
				size: size,
				press: () => {
					this.displayedMonth = new Date(year, month, 1);
					this.view = "days";
					this.renderCalendar();
				},
			});

			button.addStyleClass("sizedDatePickerMonth");
			if (selected && selected.getFullYear() === year && selected.getMonth() === month) {
				button.addStyleClass("sizedDatePickerDaySelected");
			}

			return button;
		});

		return new VBox({
			renderType: FlexRendertype.Bare,
			items: [
				this.createHeader(`${year}`, false),
				new VBox({
					renderType: FlexRendertype.Bare,
					items: cells,
				}).addStyleClass("sizedDatePickerMonthGrid"),
			],
		}).addStyleClass("sizedDatePickerCalendar");
	}

	private selectDate(date: Date): void {
		this.setDateValue(DatePicker.startOfDay(date));
		this.getPopover().close();
		this.fireChange({
			value: this.getValue(),
			dateValue: this.getDateValue(),
			valid: true,
		});
	}

	private getPopover(): Popover {
		let popover = this.getAggregation("_popover") as Popover | null;

		if (!popover) {
			popover = new Popover(this.getId() + "-popover", {
				showHeader: false,
				showArrow: false,
				placement: PlacementType.VerticalPreferredBottom,
				afterClose: () => {
					this.onPopoverClosed();
				},
			});
			popover.addStyleClass("sizedDatePickerPopover");
			this.setAggregation("_popover", popover, true);
		}

		return popover;
	}

	private onPopoverClosed(): void {
		this.expanded = false;

		const dom = this.getDomRef();
		dom?.setAttribute("aria-expanded", "false");
		dom?.classList.remove("sizedDatePickerExpanded");
	}

	static renderer = {
		apiVersion: 2,
		render(rm: RenderManager, control: DatePicker) {
			const enabled = control.getEnabled();
			const editable = control.getEditable();
			const interactive = enabled && editable;
			const valueState = control.getValueState();

			let fontSize, iconSize, sidePadding, height;

			switch (control.getSize()) {
				case SizeMode.S:
					fontSize = "0.75rem";
					iconSize = "0.875rem";
					sidePadding = "10px";
					height = "2rem";
					break;
				default:
				case SizeMode.M:
					fontSize = "0.875rem";
					iconSize = "1rem";
					sidePadding = "10px";
					height = "2.3rem";
					break;
				case SizeMode.L:
					fontSize = "1rem";
					iconSize = "1.25rem";
					sidePadding = "12px";
					height = "3rem";
					break;
				case SizeMode.XL:
					fontSize = "1.125rem";
					iconSize = "1.5rem";
					sidePadding = "14px";
					height = "3.5rem";
					break;
				case SizeMode["2XL"]:
					fontSize = "1.25rem";
					iconSize = "1.55rem";
					sidePadding = "16px";
					height = "4rem";
					break;
				case SizeMode["3XL"]:
					fontSize = "1.5rem";
					iconSize = "1.65rem";
					sidePadding = "18px";
					height = "4.5rem";
					break;
				case SizeMode["4XL"]:
					fontSize = "1.75rem";
					iconSize = "1.85rem";
					sidePadding = "20px";
					height = "5rem";
					break;
				case SizeMode["5XL"]:
					fontSize = "2rem";
					iconSize = "2.05rem";
					sidePadding = "22px";
					height = "5.5rem";
					break;
				case SizeMode["6XL"]:
					fontSize = "2.25rem";
					iconSize = "2.25rem";
					sidePadding = "24px";
					height = "6rem";
					break;
			}

			rm.openStart("div", control);
			rm.class("sizedDatePicker");

			if (!enabled) {
				rm.class("sizedDatePickerDisabled");
			} else if (!editable) {
				rm.class("sizedDatePickerReadonly");
			}
			if (valueState !== ValueState.None && interactive) {
				rm.class("sizedDatePickerState");
				rm.class(`sizedDatePicker${valueState}`);
			}

			rm.style("height", height);
			rm.style("min-width", `calc(${height} * 3)`);
			if (control.getWidth()) {
				rm.style("width", control.getWidth());
			}

			rm.attr("role", "combobox");
			rm.attr("aria-haspopup", "grid");
			rm.attr("aria-expanded", "false");
			rm.openEnd();

			rm.voidStart("input", control.getId() + "-inner");
			rm.class("sizedDatePickerInner");
			rm.attr("type", "text");
			rm.attr("autocomplete", "off");
			rm.style("font-size", fontSize);
			rm.style("padding-left", sidePadding);
			rm.style("padding-right", sidePadding);

			const text = control.getDisplayValue();
			if (text) {
				rm.attr("value", text);
			}
			if (control.getPlaceholder()) {
				rm.attr("placeholder", control.getPlaceholder());
			}
			if (!enabled) {
				rm.attr("disabled", "disabled");
			} else if (!editable) {
				rm.attr("readonly", "readonly");
			}
			rm.voidEnd();

			if (editable) {
				rm.openStart("span", control.getId() + "-icon");
				rm.class("sizedDatePickerIcon");
				rm.style("width", height);
				rm.style("font-size", iconSize);
				rm.openEnd();
				rm.close("span");
			}

			rm.close("div");
		},
	};
}
