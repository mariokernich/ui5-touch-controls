import { ButtonType } from "sap/m/library";
import { MetadataOptions } from "sap/ui/core/Element";
import IconPool from "sap/ui/core/IconPool";
import RenderManager from "sap/ui/core/RenderManager";
import Parameters from "sap/ui/core/theming/Parameters";
import Image from "sap/m/Image";
import Control from "sap/ui/core/Control";
import { ISized, SizeMode, sizeClass } from "./library";

/** a control that shows an image or an icon font glyph - an Icon or an Image */
type IconControl = Control & { getSrc(): string };

/**
 * A button for touch devices, and the one every other control of this library
 * is built from.
 *
 * Its height, font and icon follow the library's central <code>size</code>
 * property. It fires <code>press</code> the moment the finger comes off the
 * screen, for every pointer on its own - so two thumbs typing on a keyboard of
 * these buttons lose no key - and it can be pressed with <kbd>Enter</kbd> and
 * <kbd>Space</kbd> like any native button.
 *
 * @namespace ui5.touch.controls
 */
export default class Button extends Control implements ISized {
	/**
	 * The DOM element the pointer listeners are attached to. The element is
	 * patched and kept across renderings, so the listeners only move when the
	 * element itself was replaced.
	 */
	private listenedDom: HTMLElement | null = null;

	/**
	 * The pointers that went down on this button and have not come up yet. A
	 * release only presses the button if it belongs to one of them - a pointer
	 * that went down elsewhere and was released over the button did not press
	 * it.
	 */
	private readonly downPointers = new Set<number>();

	static readonly metadata: MetadataOptions = {
		interfaces: ["ui5.touch.controls.ISized"],
		properties: {
			/**
			 * The text of the button.
			 */
			text: { type: "string", group: "Misc", defaultValue: "" },
			/**
			 * The type of the button, as in <code>sap.m.Button</code>.
			 */
			type: {
				type: "sap.m.ButtonType",
				group: "Appearance",
				defaultValue: ButtonType.Default,
			},
			/**
			 * Indicates whether the user can press the button.
			 */
			enabled: { type: "boolean", group: "Behavior", defaultValue: true },
			/**
			 * The icon of the button: an icon font URI such as
			 * <code>sap-icon://add</code>, or the URL of an image.
			 */
			icon: { type: "sap.ui.core.URI", group: "Appearance", defaultValue: "" },
			/**
			 * Whether the icon stands before the text or after it.
			 */
			iconFirst: { type: "boolean", group: "Appearance", defaultValue: true },
			/**
			 * Has no effect: the padding of the button follows its
			 * <code>size</code>.
			 *
			 * @deprecated As of version 1.3.2 - the padding comes from the size
			 * ladder of the stylesheet and cannot be set per button.
			 */
			sidePadding: {
				type: "sap.ui.core.CSSSize",
				group: "Appearance",
				defaultValue: "20px",
				deprecated: true,
			},
			/**
			 * Width of the button. Without it the button is as wide as its
			 * content.
			 */
			width: {
				type: "sap.ui.core.CSSSize",
				group: "Appearance",
				defaultValue: null,
			},
			/**
			 * Touch size of the button.
			 */
			size: {
				type: "ui5.touch.controls.SizeMode",
				group: "Appearance",
				defaultValue: SizeMode.M,
			},
		},
		aggregations: {
			/**
			 * The control that draws the icon. It is made once per icon and
			 * kept here, so it is destroyed together with the button.
			 */
			_icon: {
				type: "sap.ui.core.Control",
				multiple: false,
				visibility: "hidden",
			},
		},
		events: {
			/**
			 * Fired when the user clicks or taps on the control, or presses it
			 * with <kbd>Enter</kbd> or <kbd>Space</kbd>.
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
			const icon = control.getAggregation("_icon") as Control | null;
			const tooltip = control.getTooltip_AsString();

			rm.openStart("button", control);
			// not a submit button, should the button end up inside a form
			rm.attr("type", "button");
			rm.class("sizedButton");
			rm.class(`sizedButton${control.getType()}`);
			rm.class(sizeClass(control.getSize()));

			if (!enabled) {
				rm.attr("disabled", "disabled");
				rm.class("sapMBtnDisabled");
			}
			if (control.getWidth()) {
				rm.style("width", control.getWidth());
			}
			if (tooltip) {
				rm.attr("title", tooltip);
				// a button that shows nothing but an icon is named by its
				// tooltip, or it has no name at all
				if (!text) {
					rm.attr("aria-label", tooltip);
				}
			}
			rm.openEnd();

			rm.openStart("span", id + "-inner");
			if (enabled) {
				rm.class("sapMFocusable");
			}
			rm.class("sizedButtonInner");
			rm.openEnd();

			/** the icon, on the side of the text it was asked for */
			const renderIcon = (side: "Left" | "Right") => {
				rm.openStart("span", id + "-img");
				rm.class("sizedButtonIcon");
				if (text) {
					rm.class(`sizedButtonIcon${side}`);
				}
				rm.openEnd();
				rm.renderControl(icon as Control);
				rm.close("span");
			};

			if (icon && control.getIconFirst()) {
				renderIcon("Left");
			}

			rm.openStart("span", id + "-content");
			rm.class("sizedButtonContent");
			rm.openEnd();
			rm.text(text);
			rm.close("span");

			if (icon && !control.getIconFirst()) {
				renderIcon("Right");
			}

			rm.close("span");
			rm.close("button");
		},
	};

	/**
	 * The background color of a button type in the current theme.
	 *
	 * @deprecated As of version 1.3.2 - the colors of a button come from its
	 * stylesheet, and this reads the theme parameter synchronously.
	 */
	getButtonColor(type: ButtonType) {
		return Parameters.get(`sapButton_${type}_Background`) as string;
	}

	onBeforeRendering(): void {
		this.updateIconControl();
	}

	/**
	 * Brings the control that draws the icon in line with the icon property.
	 * It is only made anew when the icon changes, not on every rendering.
	 */
	private updateIconControl(): void {
		const src = this.getIcon();
		const current = this.getAggregation("_icon") as IconControl | null;

		if (current && current.getSrc() === src) {
			return;
		}

		this.destroyAggregation("_icon", true);

		if (!src) {
			return;
		}

		// an icon font URI becomes a sap.ui.core.Icon, anything else an Image.
		// The typings only know the src of the settings; the id is taken over
		// as well, the way sap.m.Button hands one in.
		const created = IconPool.createControlByURI(
			{ id: `${this.getId()}-icon`, src: src } as { src: string },
			Image,
		) as Control | undefined;

		if (created) {
			this.setAggregation("_icon", created, true);
		}
	}

	onAfterRendering(): void {
		const dom = this.getDomRef() as HTMLElement | null;

		if (dom === this.listenedDom) {
			return;
		}

		this.detachPointerListeners();

		if (dom) {
			// Pointer events unify mouse, touch and pen input and come once per
			// finger, which is what a keyboard of these buttons needs: a second
			// thumb that comes down before the first one is up still types
			dom.addEventListener("pointerdown", this.onPointerDown);
			dom.addEventListener("pointerup", this.onPointerUp);
			dom.addEventListener("pointerleave", this.onPointerCancel);
			dom.addEventListener("pointercancel", this.onPointerCancel);
			this.listenedDom = dom;
		}
	}

	exit(): void {
		this.detachPointerListeners();
	}

	private detachPointerListeners(): void {
		const dom = this.listenedDom;

		if (dom) {
			dom.removeEventListener("pointerdown", this.onPointerDown);
			dom.removeEventListener("pointerup", this.onPointerUp);
			dom.removeEventListener("pointerleave", this.onPointerCancel);
			dom.removeEventListener("pointercancel", this.onPointerCancel);
		}
		this.listenedDom = null;
		this.downPointers.clear();
	}

	private readonly onPointerDown = (event: PointerEvent): void => {
		// the secondary mouse buttons open menus, they do not press
		if (!this.getEnabled() || (event.pointerType === "mouse" && event.button !== 0)) {
			return;
		}

		this.downPointers.add(event.pointerId);
		this.listenedDom?.classList.add("sizedButtonActive");
	};

	private readonly onPointerUp = (event: PointerEvent): void => {
		if (!this.downPointers.delete(event.pointerId)) {
			return;
		}

		if (this.downPointers.size === 0) {
			this.listenedDom?.classList.remove("sizedButtonActive");
		}
		if (this.getEnabled()) {
			this.firePress();
		}
	};

	private readonly onPointerCancel = (event: PointerEvent): void => {
		this.downPointers.delete(event.pointerId);

		if (this.downPointers.size === 0) {
			this.listenedDom?.classList.remove("sizedButtonActive");
		}
	};

	/**
	 * A native button turns <kbd>Enter</kbd> and <kbd>Space</kbd> into a
	 * click of its own, with the timing a user of a keyboard expects - so the
	 * keyboard is served from here. Such a click has no pointer behind it and
	 * says so with a <code>detail</code> of 0; a click that follows a pointer
	 * has already pressed the button on the way up.
	 */
	onclick(event: MouseEvent): void {
		if (!event.detail && this.getEnabled()) {
			this.firePress();
		}
	}
}
