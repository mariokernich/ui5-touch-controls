import Control from "sap/ui/core/Control";
import RenderManager from "sap/ui/core/RenderManager";
import { MetadataOptions } from "sap/ui/core/Element";
import { ISized, SizeMode, sizeClass } from "./library";

/**
 * A simplified variant of <code>sap.m.Link</code> for touch devices.
 *
 * Renders an anchor that carries the library's central <code>size</code>
 * property (<code>S</code>-<code>6XL</code>), so the label - and with it the
 * area that can be hit with a finger - scales together with the rest of the
 * controls.
 *
 * Compared to <code>sap.m.Link</code> the following simplifications apply:
 * <ul>
 * <li><code>textAlign</code>, <code>textDirection</code> and
 * <code>accessibleRole</code> are not supported</li>
 * <li><code>rel</code> is not a property: a link with
 * <code>target="_blank"</code> always gets
 * <code>rel="noopener noreferrer"</code></li>
 * <li>a disabled link is rendered without <code>href</code>, so it can neither
 * be followed nor focused</li>
 * </ul>
 *
 * @namespace ui5.touch.controls
 */
export default class Link extends Control implements ISized {
	static readonly metadata: MetadataOptions = {
		interfaces: ["ui5.touch.controls.ISized"],
		properties: {
			/**
			 * The text of the link.
			 */
			text: { type: "string", group: "Data", defaultValue: "" },
			/**
			 * The URL the link points to. Without it the link only fires
			 * <code>press</code>.
			 */
			href: { type: "sap.ui.core.URI", group: "Data", defaultValue: null },
			/**
			 * Where to open the URL, e.g. <code>_blank</code>.
			 */
			target: { type: "string", group: "Behavior", defaultValue: null },
			/**
			 * Indicates whether the user can interact with the link.
			 */
			enabled: { type: "boolean", group: "Behavior", defaultValue: true },
			/**
			 * Defines whether the text wraps. Without it a long text is
			 * truncated with an ellipsis.
			 */
			wrapping: { type: "boolean", group: "Appearance", defaultValue: false },
			/**
			 * Renders the link in a subtle color, for links of minor
			 * importance.
			 */
			subtle: { type: "boolean", group: "Appearance", defaultValue: false },
			/**
			 * Renders the link in bold, for links of major importance.
			 */
			emphasized: { type: "boolean", group: "Appearance", defaultValue: false },
			/**
			 * Width of the link.
			 */
			width: {
				type: "sap.ui.core.CSSSize",
				group: "Dimension",
				defaultValue: null,
			},
			/**
			 * Touch size of the link.
			 */
			size: {
				type: "ui5.touch.controls.SizeMode",
				group: "Appearance",
				defaultValue: SizeMode.M,
			},
		},
		events: {
			/**
			 * Fired when the user clicks or taps on the link. A link with an
			 * <code>href</code> is followed by the browser afterwards.
			 */
			press: {},
		},
	};

	constructor(idOrSettings?: string | $LinkSettings);
	constructor(id?: string, settings?: $LinkSettings);
	constructor(id?: string, settings?: $LinkSettings) {
		super(id, settings);
	}

	ontap(): void {
		if (this.getEnabled()) {
			this.firePress();
		}
	}

	/**
	 * A link without an <code>href</code> is not activated by the browser on
	 * Enter, so the key is handled here.
	 */
	onsapenter(): void {
		if (this.getEnabled() && !this.getHref()) {
			this.firePress();
		}
	}

	static renderer = {
		apiVersion: 2,
		render(rm: RenderManager, control: Link) {
			const enabled = control.getEnabled();
			const href = control.getHref();
			const target = control.getTarget();
			const width = control.getWidth();

			rm.openStart("a", control);
			rm.class("sizedLink");
			rm.class(sizeClass(control.getSize()));
			if (control.getWrapping()) {
				rm.class("sizedLinkWrapping");
			}
			if (control.getSubtle()) {
				rm.class("sizedLinkSubtle");
			}
			if (control.getEmphasized()) {
				rm.class("sizedLinkEmphasized");
			}
			if (!enabled) {
				rm.class("sizedLinkDisabled");
			}

			if (width) {
				rm.style("width", width);
			}

			if (enabled && href) {
				rm.attr("href", href);
				if (target) {
					rm.attr("target", target);
					if (target === "_blank") {
						// a new window must not get access to this one
						rm.attr("rel", "noopener noreferrer");
					}
				}
			}

			if (enabled) {
				rm.attr("tabindex", "0");
			} else {
				rm.attr("tabindex", "-1");
				rm.attr("aria-disabled", "true");
			}

			rm.openEnd();
			rm.text(control.getText());
			rm.close("a");
		},
	};
}
