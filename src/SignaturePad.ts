import Control from "sap/ui/core/Control";
import RenderManager from "sap/ui/core/RenderManager";
import { getText } from "./i18n";
import ResizeHandler from "sap/ui/core/ResizeHandler";
import { MetadataOptions } from "sap/ui/core/Element";
import { ValueState } from "sap/ui/core/library";
import Button from "./Button";
import { ISized, SizeMode, sizeClass } from "./library";

/**
 * A field to sign in with a finger or a stylus.
 *
 * There is no <code>sap.m</code> equivalent. Handing over goods, confirming a
 * repair or acknowledging a safety briefing all end with a signature, and on a
 * tablet the natural place for it is the screen. The control draws on a canvas
 * and hands the result over as a PNG data URL in <code>value</code>, so it can
 * be bound to a model and sent to the backend like any other value.
 *
 * The stroke width, the placeholder and the clear button follow the library's
 * central <code>size</code> property, so the pad matches the rest of the form.
 *
 * @namespace ui5.touch.controls
 */
export default class SignaturePad extends Control implements ISized {
	/** the signature as it is drawn, so a resize can restore it */
	private strokes: { x: number; y: number }[][] = [];
	private currentStroke: { x: number; y: number }[] | null = null;
	private resizeRegistration: string | null = null;
	private pointerListeners: {
		down: (event: PointerEvent) => void;
		move: (event: PointerEvent) => void;
		up: (event: PointerEvent) => void;
	} | null = null;

	static readonly metadata: MetadataOptions = {
		interfaces: ["ui5.touch.controls.ISized"],
		properties: {
			/**
			 * The signature as a PNG data URL, empty while nothing is drawn.
			 * Setting it from outside is only meaningful to clear the pad -
			 * pass an empty string.
			 */
			value: { type: "string", group: "Data", defaultValue: "" },
			/**
			 * Hint shown on the baseline while the pad is empty.
			 *
			 * A pad is built with the hint of the library, in the language the
			 * application runs in. An empty string leaves the baseline bare.
			 */
			placeholder: {
				type: "string",
				group: "Misc",
				defaultValue: "",
			},
			/**
			 * Height of the pad.
			 */
			height: {
				type: "sap.ui.core.CSSSize",
				group: "Dimension",
				defaultValue: "10rem",
			},
			/**
			 * Width of the pad.
			 */
			width: {
				type: "sap.ui.core.CSSSize",
				group: "Dimension",
				defaultValue: "100%",
			},
			/**
			 * Shows the button that clears the pad.
			 */
			showClearButton: {
				type: "boolean",
				group: "Appearance",
				defaultValue: true,
			},
			/**
			 * Indicates whether the user can sign.
			 */
			enabled: { type: "boolean", group: "Behavior", defaultValue: true },
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
			 * Touch size: it scales the stroke, the placeholder and the clear
			 * button.
			 */
			size: {
				type: "ui5.touch.controls.SizeMode",
				group: "Appearance",
				defaultValue: SizeMode.M,
			},
		},
		aggregations: {
			/**
			 * The button that clears the pad.
			 */
			_clearButton: {
				type: "ui5.touch.controls.Button",
				multiple: false,
				visibility: "hidden",
			},
		},
		events: {
			/**
			 * Fired when a stroke is finished and when the pad is cleared.
			 */
			change: {
				parameters: {
					/**
					 * The signature as a PNG data URL, empty when the pad was
					 * cleared.
					 */
					value: { type: "string" },
					/**
					 * Whether anything is drawn on the pad.
					 */
					signed: { type: "boolean" },
				},
			},
		},
	};

	constructor(idOrSettings?: string | $SignaturePadSettings);
	constructor(id?: string, settings?: $SignaturePadSettings);
	constructor(id?: string, settings?: $SignaturePadSettings) {
		super(id, settings);
	}

	/**
	 * Puts the hint of the library on the pad.
	 *
	 * It is written into the property rather than filled in while rendering,
	 * so that an application can still take it away: init runs before the
	 * settings of the constructor are applied, so a placeholder that was
	 * given - an empty one included - is what stays.
	 */
	init(): void {
		this.setProperty("placeholder", getText("SIGNATUREPAD_PLACEHOLDER"), true);
	}

	/**
	 * Whether anything is drawn on the pad.
	 */
	isSigned(): boolean {
		return this.strokes.length > 0;
	}

	/**
	 * Empties the pad and fires <code>change</code>.
	 */
	clear(): this {
		this.strokes = [];
		this.currentStroke = null;
		this.redraw();
		this.setProperty("value", "", true);
		this.updateEmptyState();
		this.fireChange({ value: "", signed: false });

		return this;
	}

	/**
	 * Only an empty value is meaningful from outside: it clears the pad. A data
	 * URL is not drawn back onto the canvas, because the pad keeps its own
	 * strokes so it can follow a resize.
	 */
	setValue(value: string): this {
		if (!value && this.strokes.length > 0) {
			return this.clear();
		}

		this.setProperty("value", value, true);

		return this;
	}

	/**
	 * Stroke width in CSS pixels for the current size mode.
	 *
	 * This is the one ladder that cannot live in
	 * <code>themes/base/Sizing.less</code> with the others: it is not a style
	 * of an element but a number handed to the 2D context of the canvas, and
	 * CSS does not reach in there.
	 */
	private getLineWidth(): number {
		switch (this.getSize()) {
			case SizeMode.S:
				return 1.5;
			default:
			case SizeMode.M:
				return 2;
			case SizeMode.L:
				return 2.5;
			case SizeMode.XL:
				return 3;
			case SizeMode["2XL"]:
				return 3.5;
			case SizeMode["3XL"]:
				return 4;
			case SizeMode["4XL"]:
				return 4.5;
			case SizeMode["5XL"]:
				return 5;
			case SizeMode["6XL"]:
				return 5.5;
		}
	}

	private getCanvas(): HTMLCanvasElement | null {
		return this.getDomRef()?.querySelector("canvas") ?? null;
	}

	private getClearButton(): Button {
		let button = this.getAggregation("_clearButton") as Button | null;

		if (!button) {
			button = new Button(this.getId() + "-clear", {
				icon: "sap-icon://eraser",
				press: () => {
					this.clear();
				},
			});
			button.addStyleClass("sizedSignaturePadClear");
			this.setAggregation("_clearButton", button, true);
		}

		button.setSize(this.getSize());
		button.setEnabled(this.getEnabled());

		return button;
	}

	onAfterRendering(): void {
		const canvas = this.getCanvas();

		if (!canvas) {
			return;
		}

		this.detachPointerListeners(canvas);

		if (this.getEnabled()) {
			this.pointerListeners = {
				down: (event: PointerEvent) => {
					this.onPointerDown(event, canvas);
				},
				move: (event: PointerEvent) => {
					this.onPointerMove(event, canvas);
				},
				up: () => {
					this.onPointerUp();
				},
			};

			canvas.addEventListener("pointerdown", this.pointerListeners.down);
			canvas.addEventListener("pointermove", this.pointerListeners.move);
			canvas.addEventListener("pointerup", this.pointerListeners.up);
			canvas.addEventListener("pointercancel", this.pointerListeners.up);
		}

		if (this.resizeRegistration) {
			ResizeHandler.deregister(this.resizeRegistration);
		}
		this.resizeRegistration = ResizeHandler.register(this, () => {
			this.redraw();
		});

		this.redraw();
		this.updateEmptyState();
	}

	exit(): void {
		const canvas = this.getCanvas();

		if (canvas) {
			this.detachPointerListeners(canvas);
		}
		if (this.resizeRegistration) {
			ResizeHandler.deregister(this.resizeRegistration);
			this.resizeRegistration = null;
		}
	}

	private detachPointerListeners(canvas: HTMLCanvasElement): void {
		if (this.pointerListeners) {
			canvas.removeEventListener("pointerdown", this.pointerListeners.down);
			canvas.removeEventListener("pointermove", this.pointerListeners.move);
			canvas.removeEventListener("pointerup", this.pointerListeners.up);
			canvas.removeEventListener("pointercancel", this.pointerListeners.up);
		}
		this.pointerListeners = null;
	}

	private getPoint(
		event: PointerEvent,
		canvas: HTMLCanvasElement,
	): { x: number; y: number } {
		const rect = canvas.getBoundingClientRect();

		return { x: event.clientX - rect.left, y: event.clientY - rect.top };
	}

	private onPointerDown(event: PointerEvent, canvas: HTMLCanvasElement): void {
		// the pointer keeps sending to the canvas even when it leaves it, and
		// the browser must not scroll the page while a signature is drawn
		canvas.setPointerCapture(event.pointerId);
		event.preventDefault();

		this.currentStroke = [this.getPoint(event, canvas)];
		this.strokes.push(this.currentStroke);
		this.updateEmptyState();
	}

	private onPointerMove(event: PointerEvent, canvas: HTMLCanvasElement): void {
		if (!this.currentStroke) {
			return;
		}

		event.preventDefault();
		this.currentStroke.push(this.getPoint(event, canvas));
		this.redraw();
	}

	private onPointerUp(): void {
		if (!this.currentStroke) {
			return;
		}

		// a tap without a movement is not a stroke
		if (this.currentStroke.length < 2) {
			this.strokes.pop();
			this.currentStroke = null;
			this.redraw();
			this.updateEmptyState();
			return;
		}

		this.currentStroke = null;

		const canvas = this.getCanvas();
		const value = canvas ? canvas.toDataURL("image/png") : "";

		this.setProperty("value", value, true);
		this.fireChange({ value, signed: true });
	}

	/**
	 * Paints all strokes. The canvas is re-sized to its box first, because a
	 * canvas scales its content when the element is stretched.
	 */
	private redraw(): void {
		const canvas = this.getCanvas();
		const context = canvas?.getContext("2d");

		if (!canvas || !context) {
			return;
		}

		const ratio = window.devicePixelRatio || 1;
		const width = canvas.clientWidth;
		const height = canvas.clientHeight;

		if (canvas.width !== width * ratio || canvas.height !== height * ratio) {
			canvas.width = width * ratio;
			canvas.height = height * ratio;
		}

		context.setTransform(ratio, 0, 0, ratio, 0, 0);
		context.clearRect(0, 0, width, height);

		context.lineWidth = this.getLineWidth();
		context.lineCap = "round";
		context.lineJoin = "round";
		context.strokeStyle = getComputedStyle(canvas).color;

		for (const stroke of this.strokes) {
			if (stroke.length < 2) {
				continue;
			}

			context.beginPath();
			context.moveTo(stroke[0].x, stroke[0].y);
			for (const point of stroke.slice(1)) {
				context.lineTo(point.x, point.y);
			}
			context.stroke();
		}
	}

	/**
	 * Shows or hides the placeholder without a re-rendering, so a stroke is
	 * never interrupted.
	 */
	private updateEmptyState(): void {
		this.getDomRef()?.classList.toggle("sizedSignaturePadSigned", this.isSigned());
	}

	static renderer = {
		apiVersion: 2,
		render(rm: RenderManager, control: SignaturePad) {
			const enabled = control.getEnabled();
			const valueState = control.getValueState();

			rm.openStart("div", control);
			rm.class("sizedSignaturePad");
			rm.class(sizeClass(control.getSize()));

			if (!enabled) {
				rm.class("sizedSignaturePadDisabled");
			}
			if (valueState !== ValueState.None && enabled) {
				rm.class("sizedSignaturePadState");
				rm.class(`sizedSignaturePad${valueState}`);
			}
			if (control.isSigned()) {
				rm.class("sizedSignaturePadSigned");
			}

			rm.style("height", control.getHeight());
			rm.style("width", control.getWidth());
			rm.openEnd();

			rm.voidStart("canvas", control.getId() + "-canvas");
			rm.class("sizedSignaturePadCanvas");
			rm.voidEnd();

			// baseline and hint, both only decoration above the canvas
			rm.openStart("span", control.getId() + "-line");
			rm.class("sizedSignaturePadLine");
			rm.openEnd();
			rm.close("span");

			if (control.getPlaceholder()) {
				rm.openStart("span", control.getId() + "-placeholder");
				rm.class("sizedSignaturePadPlaceholder");
				rm.openEnd();
				rm.text(control.getPlaceholder());
				rm.close("span");
			}

			if (control.getShowClearButton()) {
				rm.renderControl(control.getClearButton());
			}

			rm.close("div");
		},
	};
}
