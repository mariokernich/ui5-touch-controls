import { ButtonType } from "sap/m/library";
import { MetadataOptions } from "sap/ui/core/Element";
import IconPool from "sap/ui/core/IconPool";
import Icon from "sap/ui/core/Icon";
import RenderManager from "sap/ui/core/RenderManager";
import Parameters from "sap/ui/core/theming/Parameters";
import Image from "sap/m/Image";
import Control from "sap/ui/core/Control";
import { SizeMode } from "./library";

/**
 * @namespace ui5.touch.controls
 */
export default class Button extends Control {
	private pressListener: (() => void) | null = null;
	private releaseListener: (() => void) | null = null;

	static readonly metadata: MetadataOptions = {
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
				case SizeMode.XXL:
					fontSize = "1.25rem";
					iconSize = "1.55rem";
					sidePadding = "32px";
					height = "4rem";
					break;
				case SizeMode.XXXL:
					fontSize = "1.5rem";
					iconSize = "1.65rem";
					sidePadding = "36px";
					height = "4.5rem";
					break;
			}
			// START: BUTTON
			rm.openStart("button", control);
			rm.class(`sizedButton`);
			rm.class(`sizedButton${type}`);
			rm.style("padding-left", sidePadding);
			rm.style("padding-right", sidePadding);
			rm.style("height", height);

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
			this.pressListener = () => {
				dom.classList.add("sizedButtonActive");
			};
			this.releaseListener = () => {
				dom.classList.remove("sizedButtonActive");
				this.firePress();
			};

			dom.addEventListener("mousedown", this.pressListener);
			dom.addEventListener("mouseup", this.releaseListener);
			dom.addEventListener("mouseleave", () =>
				dom.classList.remove("sizedButtonActive"),
			);
			dom.addEventListener("touchstart", this.pressListener);
			dom.addEventListener("touchend", this.releaseListener);
			dom.addEventListener("touchcancel", () =>
				dom.classList.remove("sizedButtonActive"),
			);
		}
	}

	onBeforeRendering() {}

	exit(): void | undefined {
		const dom = this.getDomRef();
		if (dom) {
			if (this.pressListener) {
				dom.removeEventListener("mousedown", this.pressListener);
				dom.removeEventListener("touchstart", this.pressListener);
			}
			if (this.releaseListener) {
				dom.removeEventListener("mouseup", this.releaseListener);
				dom.removeEventListener("touchend", this.releaseListener);
			}
			this.pressListener = null;
			this.releaseListener = null;
		}
	}
}
