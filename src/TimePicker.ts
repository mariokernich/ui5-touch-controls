import HBox from "sap/m/HBox";
import Popover from "sap/m/Popover";
import VBox from "sap/m/VBox";
import { FlexRendertype, PlacementType } from "sap/m/library";
import Control from "sap/ui/core/Control";
import RenderManager from "sap/ui/core/RenderManager";
import { MetadataOptions } from "sap/ui/core/Element";
import { ValueState } from "sap/ui/core/library";
import DateFormat from "sap/ui/core/format/DateFormat";
import Button from "./Button";
import Text from "./Text";
import { ISized, SizeMode } from "./library";

/**
 * A simplified variant of <code>sap.m.TimePicker</code> for touch devices.
 *
 * The field is the one of {@link ui5.touch.controls.DatePicker} with a clock
 * icon, and the popover holds two columns of the library's own buttons - hours
 * and minutes - so a value is picked with one tap on a target that grows with
 * the <code>size</code> property. <code>sap.m.TimePicker</code> uses a slider
 * that has to be dragged, which is hard to hit precisely with a glove.
 *
 * Compared to <code>sap.m.TimePicker</code> the following simplifications
 * apply:
 * <ul>
 * <li>there are no seconds, no AM/PM column and no <code>support2400</code>:
 * the hours run from 0 to 23, and how they are shown is a matter of
 * <code>displayFormat</code></li>
 * <li><code>maskMode</code>, <code>displayFormatType</code>,
 * <code>valueStateText</code>, <code>textAlign</code>,
 * <code>textDirection</code> and <code>required</code> are not supported</li>
 * <li>picking updates the field right away and <code>change</code> is fired
 * once, when the popover closes</li>
 * </ul>
 *
 * @namespace ui5.touch.controls
 */
export default class TimePicker extends Control implements ISized {
	private expanded = false;
	/** the value when the popover was opened, to fire change only on a change */
	private valueOnOpen = "";
	private changeListener: ((event: globalThis.Event) => void) | null = null;

	static readonly metadata: MetadataOptions = {
		interfaces: ["ui5.touch.controls.ISized"],
		properties: {
			/**
			 * The time as a string, in <code>valueFormat</code>.
			 */
			value: { type: "string", group: "Data", defaultValue: "" },
			/**
			 * The time as a <code>Date</code> object. Only the time part is
			 * evaluated.
			 */
			dateValue: { type: "object", group: "Data", defaultValue: null },
			/**
			 * Format of <code>value</code>. This is what a model sees.
			 */
			valueFormat: { type: "string", group: "Data", defaultValue: "HH:mm" },
			/**
			 * Format shown in the field. Besides a pattern the styles
			 * <code>short</code>, <code>medium</code>, <code>long</code> and
			 * <code>full</code> are accepted, which follow the current locale.
			 */
			displayFormat: {
				type: "string",
				group: "Appearance",
				defaultValue: "HH:mm",
			},
			/**
			 * Step of the minutes column, e.g. <code>5</code> for a column of
			 * 00, 05, 10 ...
			 */
			minutesStep: { type: "int", group: "Misc", defaultValue: 1 },
			/**
			 * Placeholder text shown while the field is empty.
			 */
			placeholder: { type: "string", group: "Misc", defaultValue: "" },
			/**
			 * Indicates whether the user can interact with the control.
			 */
			enabled: { type: "boolean", group: "Behavior", defaultValue: true },
			/**
			 * Defines whether the time can be changed by the user. A read-only
			 * time picker shows its value without the icon.
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
			 * Touch size of the field and of the entries in the columns.
			 */
			size: {
				type: "ui5.touch.controls.SizeMode",
				group: "Appearance",
				defaultValue: SizeMode.M,
			},
		},
		aggregations: {
			/**
			 * The popover carrying the two columns.
			 */
			_popover: {
				type: "sap.m.Popover",
				multiple: false,
				visibility: "hidden",
			},
		},
		events: {
			/**
			 * Fired when the time is changed - after picking in the popover or
			 * by typing into the field.
			 */
			change: {
				parameters: {
					/**
					 * The new value, in <code>valueFormat</code>.
					 */
					value: { type: "string" },
					/**
					 * The new time, <code>null</code> when the field is empty or
					 * what was typed could not be parsed.
					 */
					dateValue: { type: "object" },
					/**
					 * Whether the field holds a time that could be parsed.
					 */
					valid: { type: "boolean" },
				},
			},
		},
	};

	constructor(idOrSettings?: string | $TimePickerSettings);
	constructor(id?: string, settings?: $TimePickerSettings);
	constructor(id?: string, settings?: $TimePickerSettings) {
		super(id, settings);
	}

	// -----------------------------------------------------------------------
	// format helpers
	// -----------------------------------------------------------------------

	/**
	 * A style name is turned into a style instance, everything else is taken as
	 * a pattern - the same rule sap.m.TimePicker applies.
	 */
	private static getFormatter(format: string): DateFormat {
		if (["short", "medium", "long", "full"].includes(format)) {
			return DateFormat.getTimeInstance({ style: format });
		}

		return DateFormat.getTimeInstance({ pattern: format });
	}

	private getValueFormatter(): DateFormat {
		return TimePicker.getFormatter(this.getValueFormat());
	}

	private getDisplayFormatter(): DateFormat {
		return TimePicker.getFormatter(this.getDisplayFormat());
	}

	/** the text the field shows for the current time */
	private getDisplayValue(): string {
		const date = this.getDateValue() as Date | null;

		return date ? this.getDisplayFormatter().format(date) : "";
	}

	// -----------------------------------------------------------------------
	// value handling
	// -----------------------------------------------------------------------

	setValue(value: string): this {
		this.setProperty("value", value, true);

		const parsed = value
			? (this.getValueFormatter().parse(value) as Date | null)
			: null;
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
	 * Writes the formatted time into the native input without a re-rendering,
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
	 * Takes what the user typed. An empty field clears the time, anything that
	 * cannot be parsed puts the field back and is reported as invalid.
	 */
	private applyTypedValue(text: string): void {
		if (!text.trim()) {
			this.setDateValue(null);
			this.fireChange({ value: "", dateValue: null, valid: true });
			return;
		}

		const parsed = this.getDisplayFormatter().parse(text) as Date | null;

		if (!parsed) {
			this.syncInput();
			this.fireChange({
				value: this.getValue(),
				dateValue: this.getDateValue(),
				valid: false,
			});
			return;
		}

		this.setDateValue(parsed);
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
	 * Only the icon opens the columns - a tap into the text is meant for the
	 * caret.
	 */
	ontap(event: Event): void {
		if (!this.isInteractive()) {
			return;
		}

		const target = event.target as HTMLElement | null;

		if (target?.classList.contains("sizedTimePickerIcon")) {
			if (this.expanded) {
				this.getPopover().close();
			} else {
				this.openPicker();
			}
		}
	}

	onsapshow(event: KeyboardEvent): void {
		// F4 / ALT+ARROW DOWN, as in sap.m
		event.preventDefault();

		if (this.isInteractive() && !this.expanded) {
			this.openPicker();
		}
	}

	/** the time the columns currently point at, defaulting to the full hour */
	private getPickedTime(): Date {
		const date = this.getDateValue() as Date | null;

		if (date) {
			return new Date(date.getTime());
		}

		const now = new Date();
		now.setMinutes(0, 0, 0);

		return now;
	}

	private openPicker(): void {
		const dom = this.getDomRef() as HTMLElement | null;

		if (!dom) {
			return;
		}

		this.valueOnOpen = this.getValue();

		const popover = this.getPopover();
		this.renderColumns();

		this.expanded = true;
		dom.setAttribute("aria-expanded", "true");
		dom.classList.add("sizedTimePickerExpanded");

		popover.openBy(this);
	}

	private renderColumns(): void {
		const popover = this.getPopover();

		popover.destroyContent();
		popover.addContent(this.createColumns());
	}

	private createColumns(): VBox {
		const size = this.getSize();
		const picked = this.getPickedTime();
		const step = Math.max(1, this.getMinutesStep());

		const hours: number[] = [];
		for (let hour = 0; hour < 24; hour++) {
			hours.push(hour);
		}

		const minutes: number[] = [];
		for (let minute = 0; minute < 60; minute += step) {
			minutes.push(minute);
		}

		const createColumn = (
			values: number[],
			selected: number,
			apply: (value: number) => void,
		): VBox =>
			new VBox({
				renderType: FlexRendertype.Bare,
				items: values.map((value) => {
					const button = new Button({
						text: `${value}`.padStart(2, "0"),
						size: size,
						width: "100%",
						press: () => {
							apply(value);
						},
					});

					button.addStyleClass("sizedTimePickerItem");
					if (value === selected) {
						button.addStyleClass("sizedTimePickerItemSelected");
					}

					return button;
				}),
			}).addStyleClass("sizedTimePickerColumn");

		const columns = new HBox({
			renderType: FlexRendertype.Bare,
			items: [
				createColumn(hours, picked.getHours(), (hour) => {
					this.pick(hour, this.getPickedTime().getMinutes());
				}),
				createColumn(
					minutes,
					// with a step the picked minute may sit between two entries
					Math.round(picked.getMinutes() / step) * step,
					(minute) => {
						this.pick(this.getPickedTime().getHours(), minute);
					},
				),
			],
		}).addStyleClass("sizedTimePickerColumns");

		return new VBox({
			renderType: FlexRendertype.Bare,
			items: [
				new HBox({
					renderType: FlexRendertype.Bare,
					items: [
						new Text({ text: "Hours", size: size }).addStyleClass(
							"sizedTimePickerHeader",
						),
						new Text({ text: "Minutes", size: size }).addStyleClass(
							"sizedTimePickerHeader",
						),
					],
				}).addStyleClass("sizedTimePickerHeaders"),
				columns,
			],
		}).addStyleClass("sizedTimePickerClock");
	}

	/**
	 * Takes over the picked hour and minute. The columns are rebuilt so the
	 * selection follows, the change event waits for the popover to close.
	 */
	private pick(hours: number, minutes: number): void {
		const date = this.getPickedTime();
		date.setHours(hours, minutes, 0, 0);

		this.setDateValue(date);
		this.renderColumns();
		this.scrollToSelection();
	}

	/** brings the selected entry of both columns into view */
	private scrollToSelection(): void {
		for (const column of document.querySelectorAll<HTMLElement>(
			`#${this.getId()}-popover .sizedTimePickerColumn`,
		)) {
			const selected = column.querySelector<HTMLElement>(
				".sizedTimePickerItemSelected",
			);

			if (selected) {
				column.scrollTop =
					selected.offsetTop -
					column.clientHeight / 2 +
					selected.offsetHeight / 2;
			}
		}
	}

	private getPopover(): Popover {
		let popover = this.getAggregation("_popover") as Popover | null;

		if (!popover) {
			popover = new Popover(this.getId() + "-popover", {
				showHeader: false,
				showArrow: false,
				placement: PlacementType.VerticalPreferredBottom,
				afterOpen: () => {
					this.scrollToSelection();
				},
				afterClose: () => {
					this.onPopoverClosed();
				},
			});
			popover.addStyleClass("sizedTimePickerPopover");
			this.setAggregation("_popover", popover, true);
		}

		return popover;
	}

	private onPopoverClosed(): void {
		this.expanded = false;

		const dom = this.getDomRef();
		dom?.setAttribute("aria-expanded", "false");
		dom?.classList.remove("sizedTimePickerExpanded");

		if (this.getValue() !== this.valueOnOpen) {
			this.fireChange({
				value: this.getValue(),
				dateValue: this.getDateValue(),
				valid: true,
			});
		}
	}

	static renderer = {
		apiVersion: 2,
		render(rm: RenderManager, control: TimePicker) {
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
			rm.class("sizedTimePicker");

			if (!enabled) {
				rm.class("sizedTimePickerDisabled");
			} else if (!editable) {
				rm.class("sizedTimePickerReadonly");
			}
			if (valueState !== ValueState.None && interactive) {
				rm.class("sizedTimePickerState");
				rm.class(`sizedTimePicker${valueState}`);
			}

			rm.style("height", height);
			rm.style("min-width", `calc(${height} * 3)`);
			if (control.getWidth()) {
				rm.style("width", control.getWidth());
			}

			rm.attr("role", "combobox");
			rm.attr("aria-haspopup", "listbox");
			rm.attr("aria-expanded", "false");
			rm.openEnd();

			rm.voidStart("input", control.getId() + "-inner");
			rm.class("sizedTimePickerInner");
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
				rm.class("sizedTimePickerIcon");
				rm.style("width", height);
				rm.style("font-size", iconSize);
				rm.openEnd();
				rm.close("span");
			}

			rm.close("div");
		},
	};
}
