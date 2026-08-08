import Control from "sap/ui/core/Control";
import RenderManager from "sap/ui/core/RenderManager";
import { MetadataOptions } from "sap/ui/core/Element";
import { ISized, SizeMode } from "./library";

/**
 * A simplified variant of <code>sap.m.Slider</code> for touch devices.
 *
 * The handle of <code>sap.m.Slider</code> is 1.25rem across - a target made
 * for a mouse pointer. Here handle, track and the row around them grow with
 * the library's central <code>size</code> property, so the slider can be
 * dragged with a finger or with a glove.
 *
 * Compared to <code>sap.m.Slider</code> the following simplifications apply:
 * <ul>
 * <li><code>progress</code> is always shown, and there is neither an input
 * next to the slider (<code>inputsAsTooltips</code>) nor a scale
 * (<code>scale</code> aggregation)</li>
 * <li>the tooltip is a plain bubble above the handle, shown while the slider
 * is touched; <code>showAdvancedTooltip</code> and
 * <code>showHandleTooltip</code> are replaced by one
 * <code>showTooltip</code></li>
 * </ul>
 *
 * @namespace ui5.touch.controls
 */
export default class Slider extends Control implements ISized {
	private pointerListeners: {
		down: (event: PointerEvent) => void;
		move: (event: PointerEvent) => void;
		up: (event: PointerEvent) => void;
	} | null = null;

	static readonly metadata: MetadataOptions = {
		interfaces: ["ui5.touch.controls.ISized"],
		properties: {
			/**
			 * The current value.
			 */
			value: { type: "float", group: "Data", defaultValue: 0 },
			/**
			 * Smallest value that can be selected.
			 */
			min: { type: "float", group: "Data", defaultValue: 0 },
			/**
			 * Largest value that can be selected.
			 */
			max: { type: "float", group: "Data", defaultValue: 100 },
			/**
			 * Distance between two selectable values.
			 */
			step: { type: "float", group: "Data", defaultValue: 1 },
			/**
			 * Shows the current value in a bubble above the handle while the
			 * slider is touched.
			 */
			showTooltip: { type: "boolean", group: "Appearance", defaultValue: true },
			/**
			 * Draws a tick for every step. Ignored when the steps would end up
			 * closer together than two pixels.
			 */
			enableTickmarks: {
				type: "boolean",
				group: "Appearance",
				defaultValue: false,
			},
			/**
			 * Indicates whether the user can interact with the control.
			 */
			enabled: { type: "boolean", group: "Behavior", defaultValue: true },
			/**
			 * Width of the control.
			 */
			width: {
				type: "sap.ui.core.CSSSize",
				group: "Dimension",
				defaultValue: "100%",
			},
			/**
			 * Touch size: it scales handle, track and the row around them.
			 */
			size: {
				type: "ui5.touch.controls.SizeMode",
				group: "Appearance",
				defaultValue: SizeMode.M,
			},
		},
		events: {
			/**
			 * Fired when the user lets go of the handle.
			 */
			change: {
				parameters: {
					/**
					 * The new value.
					 */
					value: { type: "float" },
				},
			},
			/**
			 * Fired while the handle is dragged.
			 */
			liveChange: {
				parameters: {
					/**
					 * The current value.
					 */
					value: { type: "float" },
				},
			},
		},
	};

	constructor(idOrSettings?: string | $SliderSettings);
	constructor(id?: string, settings?: $SliderSettings);
	constructor(id?: string, settings?: $SliderSettings) {
		super(id, settings);
	}

	// -----------------------------------------------------------------------
	// shared math, also used by the RangeSlider
	// -----------------------------------------------------------------------

	/** the value rounded to the step and kept inside min and max */
	static snap(value: number, min: number, max: number, step: number): number {
		const clamped = Math.min(Math.max(value, min), max);

		if (step <= 0) {
			return clamped;
		}

		const snapped = min + Math.round((clamped - min) / step) * step;

		// a step like 0.1 would otherwise show up as 0.30000000000000004
		return Number(Math.min(Math.max(snapped, min), max).toFixed(10));
	}

	/** position of a value on the track, in percent */
	static toPercent(value: number, min: number, max: number): number {
		return max === min ? 0 : ((value - min) / (max - min)) * 100;
	}

	/** the value the given pointer position points at */
	static valueAt(
		event: PointerEvent,
		track: HTMLElement,
		min: number,
		max: number,
		step: number,
	): number {
		const rect = track.getBoundingClientRect();
		const ratio = rect.width === 0 ? 0 : (event.clientX - rect.left) / rect.width;

		return Slider.snap(min + ratio * (max - min), min, max, step);
	}

	/**
	 * The number of decimals the step brings, so the tooltip does not show
	 * 0.30000000000000004 for a step of 0.1.
	 */
	protected getDecimals(): number {
		const step = `${this.getStep()}`;
		const dot = step.indexOf(".");

		return dot === -1 ? 0 : step.length - dot - 1;
	}

	protected formatValue(value: number): string {
		return value.toFixed(this.getDecimals());
	}

	protected getTrack(): HTMLElement | null {
		return this.getDomRef()?.querySelector(".sizedSliderTrack") ?? null;
	}

	// -----------------------------------------------------------------------
	// interaction
	// -----------------------------------------------------------------------

	onAfterRendering(): void {
		const dom = this.getDomRef() as HTMLElement | null;

		if (!dom) {
			return;
		}

		this.detachPointerListeners(dom);

		if (!this.getEnabled()) {
			return;
		}

		this.pointerListeners = {
			down: (event: PointerEvent) => {
				this.onPointerDown(event, dom);
			},
			move: (event: PointerEvent) => {
				this.onPointerMove(event);
			},
			up: (event: PointerEvent) => {
				this.onPointerUp(event, dom);
			},
		};

		dom.addEventListener("pointerdown", this.pointerListeners.down);
		dom.addEventListener("pointermove", this.pointerListeners.move);
		dom.addEventListener("pointerup", this.pointerListeners.up);
		dom.addEventListener("pointercancel", this.pointerListeners.up);
	}

	exit(): void {
		const dom = this.getDomRef() as HTMLElement | null;

		if (dom) {
			this.detachPointerListeners(dom);
		}
	}

	private detachPointerListeners(dom: HTMLElement): void {
		if (this.pointerListeners) {
			dom.removeEventListener("pointerdown", this.pointerListeners.down);
			dom.removeEventListener("pointermove", this.pointerListeners.move);
			dom.removeEventListener("pointerup", this.pointerListeners.up);
			dom.removeEventListener("pointercancel", this.pointerListeners.up);
		}
		this.pointerListeners = null;
	}

	protected onPointerDown(event: PointerEvent, dom: HTMLElement): void {
		// the pointer keeps reporting to the slider even when it leaves it, and
		// the browser must not scroll the page while the handle is dragged
		dom.setPointerCapture(event.pointerId);
		event.preventDefault();
		dom.classList.add("sizedSliderTouched");
		dom.focus();

		this.applyPointer(event);
	}

	protected onPointerMove(event: PointerEvent): void {
		const dom = this.getDomRef() as HTMLElement | null;

		if (!dom?.hasPointerCapture(event.pointerId)) {
			return;
		}

		event.preventDefault();
		this.applyPointer(event);
	}

	protected onPointerUp(event: PointerEvent, dom: HTMLElement): void {
		if (!dom.hasPointerCapture(event.pointerId)) {
			return;
		}

		dom.releasePointerCapture(event.pointerId);
		dom.classList.remove("sizedSliderTouched");
		this.fireChange({ value: this.getValue() });
	}

	private applyPointer(event: PointerEvent): void {
		const track = this.getTrack();

		if (!track) {
			return;
		}

		this.applyPointerValue(
			Slider.valueAt(
				event,
				track,
				this.getMin(),
				this.getMax(),
				this.getStep(),
			),
		);
	}

	/**
	 * Takes over the value the pointer points at. The range slider overrides
	 * this to feed the handle that is being dragged.
	 */
	protected applyPointerValue(value: number): void {
		if (value === this.getValue()) {
			return;
		}

		this.setValue(value);
		this.fireLiveChange({ value });
	}

	/**
	 * Moves the handle without a re-rendering, so dragging stays smooth.
	 */
	setValue(value: number): this {
		const snapped = Slider.snap(
			value,
			this.getMin(),
			this.getMax(),
			this.getStep(),
		);

		this.setProperty("value", snapped, true);
		this.applyValue();

		return this;
	}

	protected applyValue(): void {
		const dom = this.getDomRef() as HTMLElement | null;

		if (!dom) {
			return;
		}

		const percent = Slider.toPercent(
			this.getValue(),
			this.getMin(),
			this.getMax(),
		);

		dom.style.setProperty("--sized-slider-start", "0%");
		dom.style.setProperty("--sized-slider-end", `${percent}%`);
		dom.setAttribute("aria-valuenow", `${this.getValue()}`);

		const tooltip = dom.querySelector(".sizedSliderTooltip");
		if (tooltip) {
			tooltip.textContent = this.formatValue(this.getValue());
		}
	}

	// keyboard: the arrows move by one step, Home and End jump to the ends
	onsapincrease(): void {
		this.moveBy(this.getStep());
	}

	onsapdecrease(): void {
		this.moveBy(-this.getStep());
	}

	onsaphome(): void {
		this.moveTo(this.getMin());
	}

	onsapend(): void {
		this.moveTo(this.getMax());
	}

	private moveBy(delta: number): void {
		this.moveTo(this.getValue() + delta);
	}

	private moveTo(value: number): void {
		if (!this.getEnabled()) {
			return;
		}

		const snapped = Slider.snap(
			value,
			this.getMin(),
			this.getMax(),
			this.getStep(),
		);

		if (snapped !== this.getValue()) {
			this.setValue(snapped);
			this.fireLiveChange({ value: snapped });
			this.fireChange({ value: snapped });
		}
	}

	// -----------------------------------------------------------------------
	// rendering
	// -----------------------------------------------------------------------

	/**
	 * Diameter of the handle for the current size mode. The rest of the
	 * geometry is derived from it in the style sheet.
	 */
	static getHandleSize(size: SizeMode): string {
		switch (size) {
			case SizeMode.S:
				return "1.25rem";
			default:
			case SizeMode.M:
				return "1.5rem";
			case SizeMode.L:
				return "1.75rem";
			case SizeMode.XL:
				return "2rem";
			case SizeMode["2XL"]:
				return "2.25rem";
			case SizeMode["3XL"]:
				return "2.5rem";
			case SizeMode["4XL"]:
				return "2.75rem";
			case SizeMode["5XL"]:
				return "3rem";
			case SizeMode["6XL"]:
				return "3.25rem";
		}
	}

	/**
	 * Writes the parts every slider shares: the root element with its custom
	 * properties, the track, the progress and the tickmarks. The handles are
	 * added by the caller.
	 */
	static renderStart(
		rm: RenderManager,
		control: Slider,
		start: number,
		end: number,
		extraClass?: string,
	): void {
		const enabled = control.getEnabled();
		const handle = Slider.getHandleSize(control.getSize());

		rm.openStart("div", control);
		rm.class("sizedSlider");
		if (extraClass) {
			rm.class(extraClass);
		}
		if (!enabled) {
			rm.class("sizedSliderDisabled");
		}

		rm.style("--sized-slider-handle", handle);
		rm.style("--sized-slider-font", `calc(${handle} * 0.55)`);
		rm.style("width", control.getWidth());
		// the positions of the handles live on the root, so they can be moved
		// while dragging without a re-rendering
		rm.style("--sized-slider-start", `${start}%`);
		rm.style("--sized-slider-end", `${end}%`);

		rm.attr("tabindex", enabled ? "0" : "-1");
		rm.attr("aria-valuemin", `${control.getMin()}`);
		rm.attr("aria-valuemax", `${control.getMax()}`);
		if (!enabled) {
			rm.attr("aria-disabled", "true");
		}
		rm.openEnd();

		rm.openStart("div", control.getId() + "-track");
		rm.class("sizedSliderTrack");
		rm.openEnd();

		if (control.getEnableTickmarks()) {
			Slider.renderTickmarks(rm, control);
		}

		rm.openStart("div", control.getId() + "-progress");
		rm.class("sizedSliderProgress");
		rm.openEnd();
		rm.close("div");
	}

	/**
	 * One tick per step, as long as they stay far enough apart to be of any
	 * use - 100 ticks on a 300px track would just be a grey bar.
	 */
	private static renderTickmarks(rm: RenderManager, control: Slider): void {
		const steps = Math.round(
			(control.getMax() - control.getMin()) / Math.max(control.getStep(), 1e-9),
		);

		if (!Number.isFinite(steps) || steps < 1 || steps > 50) {
			return;
		}

		rm.openStart("div", control.getId() + "-ticks");
		rm.class("sizedSliderTickmarks");
		rm.openEnd();

		for (let index = 0; index <= steps; index++) {
			rm.openStart("span");
			rm.class("sizedSliderTick");
			rm.style("left", `${(index / steps) * 100}%`);
			rm.openEnd();
			rm.close("span");
		}

		rm.close("div");
	}

	/**
	 * A handle, optionally with the tooltip bubble above it.
	 */
	static renderHandle(
		rm: RenderManager,
		control: Slider,
		id: string,
		positionProperty: string,
		label: string,
	): void {
		rm.openStart("div", id);
		rm.class("sizedSliderHandle");
		rm.style("left", `var(${positionProperty})`);
		rm.openEnd();

		if (control.getShowTooltip()) {
			rm.openStart("span", id + "-tooltip");
			rm.class("sizedSliderTooltip");
			rm.openEnd();
			rm.text(label);
			rm.close("span");
		}

		rm.close("div");
	}

	static renderEnd(rm: RenderManager): void {
		// track
		rm.close("div");
		// root
		rm.close("div");
	}

	static renderer = {
		apiVersion: 2,
		render(rm: RenderManager, control: Slider) {
			const percent = Slider.toPercent(
				control.getValue(),
				control.getMin(),
				control.getMax(),
			);

			Slider.renderStart(rm, control, 0, percent);

			Slider.renderHandle(
				rm,
				control,
				control.getId() + "-handle",
				"--sized-slider-end",
				control.formatValue(control.getValue()),
			);

			Slider.renderEnd(rm);
		},
	};
}
