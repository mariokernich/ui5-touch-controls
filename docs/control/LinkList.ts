import type Link from "sap/m/Link";
import Control from "sap/ui/core/Control";
import type { MetadataOptions } from "sap/ui/core/Element";
// rm.icon() reads the icon font through the pool, and it has to be there
// before the first rendering - importing it is what puts it there
import "sap/ui/core/IconPool";
import type RenderManager from "sap/ui/core/RenderManager";

/** what marks a link that leaves the page */
const EXTERNAL_ICON = "sap-icon://action";

/** what stands between two links */
const SEPARATOR = ", ";

/**
 * A row of links, written the way an enumeration is written: one after the
 * other, separated by a comma and the space behind it. A single link is the
 * same row with nothing to separate.
 *
 * It is a control rather than a box of links because a comma is not a gap
 * between two boxes: it belongs to the line the links are on. A flex box
 * would have to be talked out of being one - the space after the comma sits
 * at the end of an item, and at the end of a flex item it is collapsed away.
 *
 * With <code>external</code> every link is followed by the icon that says it
 * leaves the page. The icon is decorative and hidden from a screen reader:
 * what it says is said again by the link it belongs to.
 *
 * @namespace ui5.touch.controls.demo.control
 */
export default class LinkList extends Control {
	static readonly metadata: MetadataOptions = {
		properties: {
			/** whether the links lead away from this page */
			external: { type: "boolean", defaultValue: false },
		},
		defaultAggregation: "links",
		aggregations: {
			/** the links of the row, in the order they are written */
			links: { type: "sap.m.Link", multiple: true, singularName: "link" },
		},
	};

	constructor(idOrSettings?: string | $LinkListSettings);
	constructor(id?: string, settings?: $LinkListSettings);
	constructor(id?: string, settings?: $LinkListSettings) {
		super(id, settings);
	}

	static renderer = {
		apiVersion: 2,
		render(rm: RenderManager, control: LinkList) {
			const links = control.getLinks();
			const external = control.getExternal();

			// a span, not a div: the row is a piece of a line of text, and it is
			// the text flow that puts the space after a comma there
			rm.openStart("span", control);
			rm.class("ui5tcLinkList");
			rm.openEnd();

			links.forEach((link: Link, index: number) => {
				// a link and its mark belong together, so a line never breaks
				// between the two
				rm.openStart("span");
				rm.class("ui5tcLinkListEntry");
				rm.openEnd();
				rm.renderControl(link);

				if (external) {
					rm.icon(EXTERNAL_ICON, ["ui5tcLinkListIcon"], {
						title: null,
						"aria-hidden": true,
					});
				}

				rm.close("span");

				// the separator sits outside the link: a comma is not part of the
				// name of what is linked, and must not be underlined or clicked
				// along with it
				if (index < links.length - 1) {
					rm.text(SEPARATOR);
				}
			});

			rm.close("span");
		},
	};
}
