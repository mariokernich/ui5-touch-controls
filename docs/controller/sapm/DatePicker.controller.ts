import type StandardDatePicker from "sap/m/DatePicker";
import JSONModel from "sap/ui/model/json/JSONModel";
import type SizedDatePicker from "ui5/touch/controls/DatePicker";
import type { DatePicker$ChangeEvent } from "ui5/touch/controls/DatePicker";
import { SizeMode } from "ui5/touch/controls/library";
import BaseController from "../BaseController";

/** how far minDate / maxDate reach around today when the limits are on */
const RANGE_IN_DAYS = 10;

/**
 * Controller of the DatePicker page.
 *
 * @namespace ui5.touch.controls.demo.controller.sapm
 */
export default class DatePicker extends BaseController {
	private model!: JSONModel;

	public onInit(): void {
		this.setControlIntro("DatePicker");

		this.model = new JSONModel(
			{
				value: "2026-08-14",
				displayFormat: "medium",
				size: SizeMode.L,
				enabled: true,
				editable: true,
				limited: false,
				valueState: "None",
				lastEvent: "-",
			},
			true,
		);
		this.getView()?.setModel(this.model, "json");

		// minDate / maxDate are plain Date objects, so they are switched from
		// the controller instead of through a binding
		this.model.attachPropertyChange(() => {
			this.applyLimits();
		});

		this.setExample(`
<mvc:View
	xmlns:mvc="sap.ui.core.mvc"
	xmlns:tc="ui5.touch.controls">
	<tc:DatePicker
		value="{/deliveryDate}"
		valueFormat="yyyy-MM-dd"
		displayFormat="medium"
		size="XL"
		width="18rem"
		change=".onDeliveryDateChange" />
</mvc:View>
`);
	}

	/**
	 * Restricts both pickers to a range of +/- 10 days around today, or lifts
	 * the restriction again.
	 */
	private applyLimits(): void {
		const limited = this.model.getProperty("/limited") as boolean;
		const today = new Date();
		const at = (offset: number) =>
			new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset);

		const sized = this.byId("sizedPicker") as SizedDatePicker;
		sized.setMinDate(limited ? at(-RANGE_IN_DAYS) : null);
		sized.setMaxDate(limited ? at(RANGE_IN_DAYS) : null);

		// the typed setter of sap.m does not take null, but the property does
		const standard = this.byId("standardPicker") as StandardDatePicker;
		standard.setProperty("minDate", limited ? at(-RANGE_IN_DAYS) : null);
		standard.setProperty("maxDate", limited ? at(RANGE_IN_DAYS) : null);
	}

	public onChange(event: DatePicker$ChangeEvent): void {
		this.model.setProperty(
			"/lastEvent",
			`change: value="${event.getParameter("value")}", valid=${event.getParameter("valid")}`,
		);
	}
}
