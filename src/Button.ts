import { ButtonType } from "sap/m/library";
import { MetadataOptions } from "sap/ui/core/Element";
import IconPool from "sap/ui/core/IconPool";
import Icon from "sap/ui/core/Icon";
import RenderManager from "sap/ui/core/RenderManager";
import Parameters from "sap/ui/core/theming/Parameters";
import Image from "sap/m/Image";
import Control from "sap/ui/core/Control";
import { ISized, SizeMode } from "./library";

/**
 * @namespace ui5.touch.controls
 */
export default class Button extends Control implements ISized {
	private pressListener: (() => void) | null = null;
	private releaseListener: (() => void) | null = null;
	private cancelListener: (() => void) | null = null;

	static readonly metadata: MetadataOptions = {
		interfaces: ["ui5.touch.controls.ISized"],
		properties: {
			text: { type: "string", group: "Misc", defaultValue: "" },
			type: {
				type: "sap.m.ButtonType",
				group: "Appearance",
				defaultValue: ButtonType.Default,
			},
			enabled: { type: "boolean", group: "Behavior", defaultValue: true },
			icon: { type: "sap.ui.core.URI", group: "Appearance", defaultValue: "" },
			iconFirst: { type: "boolean", group: "Appearance", defaultValue: true },
			sidePadding: {
				type: "sap.ui.core.CSSSize",
				group: "Appearance",
				defaultValue: "20px",
			},
			width: {
				type: "sap.ui.core.CSSSize",
				group: "Appearance",
				defaultValue: null,
			},
			size: {
				type: "ui5.touch.controls.SizeMode",
				group: "Appearance",
				defaultValue: SizeMode.M,
			},
		},
		events: {
			/**
			 * Fired when the user clicks or taps on the control.
			 */
			press: {},
		},
	};

	constructor(idOrSettings?: string | $ButtonSettings);
	constructor(id?: string, settings?: $ButtonSettings);
	constructor(id?: string, settings?: $ButtonSettings) {
		super(id, settings);
	}

	static renderer = {
		apiVersion: 2,
		render(rm: RenderManager, control: Button) {
			const id = control.getId();
			const text = control.getText();
			const enabled = control.getEnabled();
			const type = control.getType();
			const icon = control.getIcon();

			let fontSize, iconSize, sidePadding, height;

			switch (control.getSize()) {
				case SizeMode.S:
					fontSize = "0.75rem";
					iconSize = "0.875rem";
					sidePadding = "16px";
					height = "2rem";
					break;
				case SizeMode.M:
					fontSize = "0.875rem";
					iconSize = "1rem";
					sidePadding = "10px";
					height = "2.3rem";
					break;
				case SizeMode.L:
					fontSize = "1rem";
					iconSize = "1.25rem";
					sidePadding = "24px";
					height = "3rem";
					break;
				case SizeMode.XL:
					fontSize = "1.125rem";
					iconSize = "1.5rem";
					sidePadding = "28px";
					height = "3.5rem";
					break;
				case SizeMode["2XL"]:
					fontSize = "1.25rem";
					iconSize = "1.55rem";
					sidePadding = "32px";
					height = "4rem";
					break;
				case SizeMode["3XL"]:
					fontSize = "1.5rem";
					iconSize = "1.65rem";
					sidePadding = "36px";
					height = "4.5rem";
					break;
				case SizeMode["4XL"]:
					fontSize = "1.75rem";
					iconSize = "1.85rem";
					sidePadding = "40px";
					height = "5rem";
					break;
				case SizeMode["5XL"]:
					fontSize = "2rem";
					iconSize = "2.05rem";
					sidePadding = "44px";
					height = "5.5rem";
					break;
				case SizeMode["6XL"]:
					fontSize = "2.25rem";
					iconSize = "2.25rem";
					sidePadding = "48px";
					height = "6rem";
					break;
			}
			// START: BUTTON
			rm.openStart("button", control);
			rm.class(`sizedButton`);
			rm.class(`sizedButton${type}`);
			rm.style("padding-left", sidePadding);
			rm.style("padding-right", sidePadding);
			rm.style("height", height);

			if (!control.getEnabled()) {
				rm.attr("disabled", "disabled");
				rm.class("sapMBtnDisabled");
			}

			if (control.getWidth()) {
				rm.style("width", control.getWidth());
			}

			//rm.style("background-color", control.getButtonColor(type));

			const iconControl = IconPool.createControlByURI(
				{
					src: icon,
				},
				Image,
			);

			if (iconSize && iconControl) {
				if (iconControl instanceof Icon) {
					iconControl.setSize(iconSize);
				} else if (iconControl instanceof Image) {
					iconControl.setWidth(iconSize);
					iconControl.setHeight(iconSize);
				}
			}

			if (!enabled) {
				rm.attr("disabled", "disabled");
			}

			rm.openEnd();

			// START: SPAN-INNER
			rm.openStart("span", id + "-inner");

			if (enabled) {
				rm.class("sapMFocusable");
			}
			rm.class("sizedButtonInner");

			// close inner button tag
			rm.openEnd();

			if (icon && control.getIconFirst() === true) {
				// START: SPAN-IMG
				rm.openStart("span", id + "-img");
				rm.class("sizedButtonIcon");

				if (control.getText()) {
					rm.class("sizedButtonIconLeft");
				}

				rm.openEnd();
				rm.renderControl(iconControl);

				// END: SPAN-IMG
				rm.close("span");
			}

			// START: SPAN-CONTENT
			rm.openStart("span", id + "-content");
			rm.class("sizedButtonContent");
			rm.style("font-size", fontSize);
			rm.openEnd();
			rm.text(text);

			// END: SPAN-CONTENT
			rm.close("span");

			if (icon && control.getIconFirst() === false) {
				rm.openStart("span", id + "-img");
				rm.class("sizedButtonIcon");

				if (control.getText()) {
					rm.class("sizedButtonIconRight");
				}

				rm.openEnd();
				rm.renderControl(iconControl);
				rm.close("span");
			}

			// END: SPAN-INNER
			rm.close("span");

			// END: BUTTON
			rm.close("button");
		},
	};

	getButtonColor(type: ButtonType) {
		return Parameters.get(`sapButton_${type}_Background`) as string;
	}

	onAfterRendering(): void {
		const dom = this.getDomRef() as HTMLButtonElement | null;

		if (dom) {
			// With renderer apiVersion 2 the DOM element is patched and reused
			// on re-rendering, so previously attached listeners must be removed
			// first - otherwise they accumulate and press fires multiple times.
			this.detachDomListeners(dom);

			this.pressListener = () => {
				dom.classList.add("sizedButtonActive");
			};
			this.releaseListener = () => {
				dom.classList.remove("sizedButtonActive");
				this.firePress();
			};
			this.cancelListener = () => {
				dom.classList.remove("sizedButtonActive");
			};

			// Pointer events unify mouse, touch and pen input, so each
			// tap/click produces exactly one pointerdown/pointerup pair.
			// Using mouse + touch listeners in parallel would fire press
			// twice on mobile (touchend followed by the synthesized
			// compatibility mouseup).
			dom.addEventListener("pointerdown", this.pressListener);
			dom.addEventListener("pointerup", this.releaseListener);
			dom.addEventListener("pointerleave", this.cancelListener);
			dom.addEventListener("pointercancel", this.cancelListener);
		}
	}

	private detachDomListeners(dom: HTMLElement): void {
		if (this.pressListener) {
			dom.removeEventListener("pointerdown", this.pressListener);
		}
		if (this.releaseListener) {
			dom.removeEventListener("pointerup", this.releaseListener);
		}
		if (this.cancelListener) {
			dom.removeEventListener("pointerleave", this.cancelListener);
			dom.removeEventListener("pointercancel", this.cancelListener);
		}
		this.pressListener = null;
		this.releaseListener = null;
		this.cancelListener = null;
	}

	onBeforeRendering() {}

	exit(): void | undefined {
		const dom = this.getDomRef();
		if (dom) {
			this.detachDomListeners(dom as HTMLElement);
		}
		this.pressListener = null;
		this.releaseListener = null;
		this.cancelListener = null;
	}
}
