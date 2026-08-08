import { SwitchType } from "sap/m/library";
import Control from "sap/ui/core/Control";
import RenderManager from "sap/ui/core/RenderManager";
import { MetadataOptions } from "sap/ui/core/Element";
import { ISized, SizeMode } from "./library";

/**
 * The event UI5 hands to the event handlers, narrowed to what is used here.
 * <code>setMarked</code> is added by the framework so that an enclosing
 * control can tell that the event has already been handled.
 */
interface MarkableEvent extends Event {
	setMarked(prefix?: string): void;
}

/**
 * A simplified variant of <code>sap.m.Switch</code> for touch devices.
 *
 * Track, handle and label scale with the library's central <code>size</code>
 * property. <code>sap.m.Switch</code> is fixed at 4rem x 2rem, which is small
 * for a thumb - here the whole control grows, and at size <code>M</code> it has
 * exactly the geometry of the original.
 *
 * Compared to <code>sap.m.Switch</code> the following simplifications apply:
 * <ul>
 * <li><code>name</code> is not supported, and there is no hidden native
 * <code>&lt;input&gt;</code>: the control carries <code>role="switch"</code>
 * and <code>aria-checked</code> itself</li>
 * <li>the handle moves without the animation of sap.m when the state is
 * changed from the outside; a tap is animated</li>
 * <li>the layout follows Horizon in every theme: the label rides in the
 * handle, and with type <code>AcceptReject</code> the icon does too, where
 * sap.m puts it into the track</li>
 * </ul>
 *
 * @namespace ui5.touch.controls
 */
export default class Switch extends Control implements ISized {
	static readonly metadata: MetadataOptions = {
		interfaces: ["ui5.touch.controls.ISized"],
		properties: {
			/**
			 * Whether the switch is on.
			 */
			state: { type: "boolean", group: "Misc", defaultValue: false },
			/**
			 * Label of the on state. Defaults to "ON"; with type
			 * <code>AcceptReject</code> a check mark is shown instead.
			 */
			customTextOn: { type: "string", group: "Misc", defaultValue: "" },
			/**
			 * Label of the off state. Defaults to "OFF"; with type
			 * <code>AcceptReject</code> a cross is shown instead.
			 */
			customTextOff: { type: "string", group: "Misc", defaultValue: "" },
			/**
			 * Type of the switch: <code>Default</code> shows the labels,
			 * <code>AcceptReject</code> a green check mark and a red cross.
			 */
			type: {
				type: "sap.m.SwitchType",
				group: "Appearance",
				defaultValue: SwitchType.Default,
			},
			/**
			 * Indicates whether the user can interact with the control.
			 */
			enabled: { type: "boolean", group: "Behavior", defaultValue: true },
			/**
			 * Touch size of the control.
			 */
			size: {
				type: "ui5.touch.controls.SizeMode",
				group: "Appearance",
				defaultValue: SizeMode.M,
			},
		},
		events: {
			/**
			 * Fired when the user flips the switch.
			 */
			change: {
				parameters: {
					/**
					 * The new state.
					 */
					state: { type: "boolean" },
				},
			},
		},
	};

	constructor(idOrSettings?: string | $SwitchSettings);
	constructor(id?: string, settings?: $SwitchSettings);
	constructor(id?: string, settings?: $SwitchSettings) {
		super(id, settings);
	}

	ontap(event?: MarkableEvent): void {
		if (this.toggle()) {
			// tell an enclosing control (e.g. a list item) that the tap has
			// already been handled here
			event?.setMarked();
		}
	}

	/**
	 * SPACE would scroll the page, so the default is suppressed on key down and
	 * the switch is flipped on key up - like sap.m.Switch.
	 */
	onsapspace(event: KeyboardEvent): void {
		event.preventDefault();
	}

	onkeyup(event: KeyboardEvent): void {
		if (event.key === " " && !event.shiftKey) {
			event.preventDefault();
			this.toggle();
		}
	}

	onsapenter(): void {
		this.toggle();
	}

	/**
	 * Flips the switch if the user is allowed to, and returns whether that
	 * happened.
	 */
	private toggle(): boolean {
		if (!this.getEnabled()) {
			return false;
		}

		const state = !this.getState();

		// the handle is moved by a CSS transition, so the DOM is updated
		// instead of re-rendering the control
		this.setProperty("state", state, true);
		this.applyState();
		this.fireChange({ state });

		return true;
	}

	private applyState(): void {
		const dom = this.getDomRef();

		if (!dom) {
			return;
		}

		const state = this.getState();
		dom.classList.toggle("sizedSwitchOn", state);
		dom.classList.toggle("sizedSwitchOff", !state);
		dom.setAttribute("aria-checked", `${state}`);
	}

	setState(state: boolean): this {
		this.setProperty("state", state, true);
		this.applyState();

		return this;
	}

	static renderer = {
		apiVersion: 2,
		render(rm: RenderManager, control: Switch) {
			const enabled = control.getEnabled();
			const state = control.getState();
			const acceptReject = control.getType() === SwitchType.AcceptReject;

			let height;

			switch (control.getSize()) {
				case SizeMode.S:
					height = "1.5rem";
					break;
				default:
				case SizeMode.M:
					height = "2rem";
					break;
				case SizeMode.L:
					height = "2.25rem";
					break;
				case SizeMode.XL:
					height = "2.75rem";
					break;
				case SizeMode["2XL"]:
					height = "3rem";
					break;
				case SizeMode["3XL"]:
					height = "3.5rem";
					break;
				case SizeMode["4XL"]:
					height = "4rem";
					break;
				case SizeMode["5XL"]:
					height = "4.5rem";
					break;
				case SizeMode["6XL"]:
					height = "5rem";
					break;
			}

			rm.openStart("div", control);
			rm.class("sizedSwitch");
			rm.class(state ? "sizedSwitchOn" : "sizedSwitchOff");
			if (acceptReject) {
				rm.class("sizedSwitchAcceptReject");
			}
			if (!enabled) {
				rm.class("sizedSwitchDisabled");
			}

			// everything is derived from the height, so one value per size mode
			// is enough: the track is twice as wide, the handle three quarters
			// as high as the track, as in sap.m
			rm.style("height", height);
			rm.style("width", `calc(${height} * 2)`);
			rm.style("font-size", `calc(${height} * 0.375)`);
			rm.style("--sized-switch-handle", `calc(${height} * 0.75)`);
			rm.style("--sized-switch-handle-width", `calc(${height} * 1.15)`);
			rm.style("--sized-switch-inset", `calc(${height} * 0.125)`);

			rm.attr("role", "switch");
			rm.attr("aria-checked", `${state}`);
			if (!enabled) {
				rm.attr("aria-disabled", "true");
			}
			rm.attr("tabindex", enabled ? "0" : "-1");
			rm.openEnd();

			// the label rides in the handle, as in Horizon. Both states are
			// rendered and only one of them is shown, so the handle keeps its
			// width while it travels
			rm.openStart("span", control.getId() + "-handle");
			rm.class("sizedSwitchHandle");
			rm.openEnd();

			rm.openStart("span", control.getId() + "-on");
			rm.class("sizedSwitchLabel");
			rm.class("sizedSwitchLabelOn");
			rm.openEnd();
			if (!acceptReject) {
				rm.text(control.getCustomTextOn() || "ON");
			}
			rm.close("span");

			rm.openStart("span", control.getId() + "-off");
			rm.class("sizedSwitchLabel");
			rm.class("sizedSwitchLabelOff");
			rm.openEnd();
			if (!acceptReject) {
				rm.text(control.getCustomTextOff() || "OFF");
			}
			rm.close("span");

			rm.close("span");

			rm.close("div");
		},
	};
}
