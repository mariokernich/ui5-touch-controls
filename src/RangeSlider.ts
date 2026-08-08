import RenderManager from "sap/ui/core/RenderManager";
import { MetadataOptions } from "sap/ui/core/Element";
import Slider from "./Slider";

/**
 * A simplified variant of <code>sap.m.RangeSlider</code> for touch devices.
 *
 * The {@link ui5.touch.controls.Slider} with two handles: everything between
 * them is the selected range. Handles, track and the row around them scale
 * with the library's central <code>size</code> property, so both ends can be
 * dragged with a finger.
 *
 * The handle that is closer to where the user touches down is the one that
 * moves, and the two values swap as soon as they cross, so a range never ends
 * up inverted.
 *
 * Compared to <code>sap.m.RangeSlider</code> the following simplifications
 * apply:
 * <ul>
 * <li>the range is addressed through <code>value</code> and
 * <code>value2</code>; there is no <code>range</code> property</li>
 * <li>there is no scale aggregation and no input next to the slider</li>
 * </ul>
 *
 * @namespace ui5.touch.controls
 */
export default class RangeSlider extends Slider {
	/** the handle the current drag belongs to */
	private activeHandle: "start" | "end" = "start";

	static readonly metadata: MetadataOptions = {
		properties: {
			/**
			 * The second value of the range. The first one is
			 * <code>value</code>.
			 */
			value2: { type: "float", group: "Data", defaultValue: 100 },
		},
		events: {
			/**
			 * Fired when the user lets go of a handle.
			 */
			change: {
				parameters: {
					/**
					 * The lower value of the range.
					 */
					value: { type: "float" },
					/**
					 * The upper value of the range.
					 */
					value2: { type: "float" },
				},
			},
			/**
			 * Fired while a handle is dragged.
			 */
			liveChange: {
				parameters: {
					/**
					 * The lower value of the range.
					 */
					value: { type: "float" },
					/**
					 * The upper value of the range.
					 */
					value2: { type: "float" },
				},
			},
		},
	};

	constructor(idOrSettings?: string | $RangeSliderSettings);
	constructor(id?: string, settings?: $RangeSliderSettings);
	constructor(id?: string, settings?: $RangeSliderSettings) {
		super(id, settings);
	}

	setValue2(value: number): this {
		this.setProperty(
			"value2",
			Slider.snap(value, this.getMin(), this.getMax(), this.getStep()),
			true,
		);
		this.applyValue();

		return this;
	}

	setValue(value: number): this {
		this.setProperty(
			"value",
			Slider.snap(value, this.getMin(), this.getMax(), this.getStep()),
			true,
		);
		this.applyValue();

		return this;
	}

	/**
	 * Moves both handles and the bar between them without a re-rendering.
	 */
	protected applyValue(): void {
		const dom = this.getDomRef() as HTMLElement | null;

		if (!dom) {
			return;
		}

		const min = this.getMin();
		const max = this.getMax();
		const start = Math.min(this.getValue(), this.getValue2());
		const end = Math.max(this.getValue(), this.getValue2());

		dom.style.setProperty(
			"--sized-slider-start",
			`${Slider.toPercent(start, min, max)}%`,
		);
		dom.style.setProperty(
			"--sized-slider-end",
			`${Slider.toPercent(end, min, max)}%`,
		);

		const tooltips = dom.querySelectorAll(".sizedSliderTooltip");
		if (tooltips.length === 2) {
			tooltips[0].textContent = this.formatValue(start);
			tooltips[1].textContent = this.formatValue(end);
		}
	}

	/** the handle that is closer to where the user touched down */
	protected onPointerDown(event: PointerEvent, dom: HTMLElement): void {
		const track = this.getTrack();

		if (track) {
			const touched = Slider.valueAt(
				event,
				track,
				this.getMin(),
				this.getMax(),
				this.getStep(),
			);
			this.activeHandle =
				Math.abs(touched - this.getValue()) <=
				Math.abs(touched - this.getValue2())
					? "start"
					: "end";
		}

		super.onPointerDown(event, dom);
	}

	protected onPointerUp(event: PointerEvent, dom: HTMLElement): void {
		if (!dom.hasPointerCapture(event.pointerId)) {
			return;
		}

		dom.releasePointerCapture(event.pointerId);
		dom.classList.remove("sizedSliderTouched");
		this.fireChange({ value: this.getValue(), value2: this.getValue2() });
	}

	/**
	 * The dragged handle takes the new value; the other one stays where it is,
	 * so the two simply swap roles when they cross.
	 */
	protected applyPointerValue(value: number): void {
		if (this.activeHandle === "start") {
			if (value === this.getValue()) {
				return;
			}
			this.setValue(value);
		} else {
			if (value === this.getValue2()) {
				return;
			}
			this.setValue2(value);
		}

		this.fireLiveChange({ value: this.getValue(), value2: this.getValue2() });
	}

	// the arrows move the handle that was touched last
	private moveActiveBy(delta: number): void {
		if (!this.getEnabled()) {
			return;
		}

		const current =
			this.activeHandle === "start" ? this.getValue() : this.getValue2();
		const next = Slider.snap(
			current + delta,
			this.getMin(),
			this.getMax(),
			this.getStep(),
		);

		if (next === current) {
			return;
		}

		if (this.activeHandle === "start") {
			this.setValue(next);
		} else {
			this.setValue2(next);
		}

		this.fireLiveChange({ value: this.getValue(), value2: this.getValue2() });
		this.fireChange({ value: this.getValue(), value2: this.getValue2() });
	}

	onsapincrease(): void {
		this.moveActiveBy(this.getStep());
	}

	onsapdecrease(): void {
		this.moveActiveBy(-this.getStep());
	}

	onsaphome(): void {
		this.moveActiveBy(this.getMin() - this.getMax());
	}

	onsapend(): void {
		this.moveActiveBy(this.getMax() - this.getMin());
	}

	static renderer = {
		apiVersion: 2,
		render(rm: RenderManager, control: RangeSlider) {
			const min = control.getMin();
			const max = control.getMax();
			const start = Math.min(control.getValue(), control.getValue2());
			const end = Math.max(control.getValue(), control.getValue2());

			Slider.renderStart(
				rm,
				control,
				Slider.toPercent(start, min, max),
				Slider.toPercent(end, min, max),
				"sizedSliderRange",
			);

			Slider.renderHandle(
				rm,
				control,
				control.getId() + "-handle-start",
				"--sized-slider-start",
				control.formatValue(start),
			);
			Slider.renderHandle(
				rm,
				control,
				control.getId() + "-handle-end",
				"--sized-slider-end",
				control.formatValue(end),
			);

			Slider.renderEnd(rm);
		},
	};
}
