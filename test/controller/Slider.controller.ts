import JSONModel from "sap/ui/model/json/JSONModel";
import { SizeMode } from "ui5/touch/controls/library";
import type { RangeSlider$ChangeEvent } from "ui5/touch/controls/RangeSlider";
import type { Slider$ChangeEvent } from "ui5/touch/controls/Slider";
import BaseController from "./BaseController";

/**
 * Controller of the Slider page.
 *
 * @namespace ui5.touch.controls.demo.controller
 */
export default class Slider extends BaseController {
	private model!: JSONModel;

	public onInit(): void {
		this.model = new JSONModel(
			{
				value: 40,
				rangeStart: 20,
				rangeEnd: 70,
				// sap.m.RangeSlider keeps both ends in one array property
				standardRange: [20, 70],
				min: 0,
				max: 100,
				step: 5,
				showTooltip: true,
				enableTickmarks: true,
				size: SizeMode.L,
				enabled: true,
				lastEvent: "-",
			},
			true,
		);
		this.getView()?.setModel(this.model, "json");

		this.setExample(`
<mvc:View
	xmlns:mvc="sap.ui.core.mvc"
	xmlns:tc="ui5.touch.controls">
	<tc:Slider
		value="{/quantity}"
		min="0"
		max="100"
		step="5"
		size="XL"
		enableTickmarks="true"
		change=".onQuantityChange" />
	<tc:RangeSlider
		value="{/from}"
		value2="{/to}"
		min="0"
		max="100"
		step="5"
		size="XL"
		change=".onRangeChange" />
</mvc:View>
`);
	}

	public onSliderChange(event: Slider$ChangeEvent): void {
		this.model.setProperty(
			"/lastEvent",
			`change: value=${event.getParameter("value")}`,
		);
	}

	public onRangeChange(event: RangeSlider$ChangeEvent): void {
		this.model.setProperty(
			"/lastEvent",
			`change: range=${event.getParameter("value")}–${event.getParameter("value2")}`,
		);
	}
}
