import { ButtonType } from "sap/m/library";
import { MetadataOptions } from "sap/ui/core/Element";
import IconPool from "sap/ui/core/IconPool";
import RenderManager from "sap/ui/core/RenderManager";
import Parameters from "sap/ui/core/theming/Parameters";
import Image from "sap/m/Image";
import Control from "sap/ui/core/Control";

/**
 * @namespace ui5.sized.controls
 */
export default class SizedButton extends Control {
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
			height: {
				type: "sap.ui.core.CSSSize",
				group: "Appearance",
				defaultValue: "50px",
			},
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
			iconSize: {
				type: "sap.ui.core.CSSSize",
				group: "Appearance",
				defaultValue: "50px",
			},
		},
		events: {
			/**
			 * Fired when the user clicks or taps on the control.
			 */
			press: {},
		},
	};

	constructor(idOrSettings?: string | $SizedButtonSettings);
	constructor(id?: string, settings?: $SizedButtonSettings);
	constructor(id?: string, settings?: $SizedButtonSettings) {
		super(id, settings);
	}

	static renderer = {
		apiVersion: 2,
		render(rm: RenderManager, control: SizedButton) {
			const id = control.getId();
			const text = control.getText();
			const enabled = control.getEnabled();
			const type = control.getType();
			const icon = control.getIcon();

			// START: BUTTON
			rm.openStart("button", control);
			rm.class(`sizedButton`);
			rm.class(`sizedButton${type}`);
			rm.style("height", control.getHeight());
			rm.style("padding-left", control.getSidePadding());
			rm.style("padding-right", control.getSidePadding());

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
			//(iconControl as unknown as Image).setWidth("30px");

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
			rm.openEnd();
			rm.text(text);

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

			// END: SPAN-CONTENT
			rm.close("span");

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
