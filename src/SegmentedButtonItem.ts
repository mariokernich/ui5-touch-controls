import Item from "sap/ui/core/Item";
import { MetadataOptions } from "sap/ui/core/Element";

/**
 * An item of a {@link ui5.touch.controls.SegmentedButton}.
 *
 * Describes one segment. The <code>key</code>, <code>text</code> and
 * <code>enabled</code> properties are inherited from
 * <code>sap.ui.core.Item</code>.
 *
 * @namespace ui5.touch.controls
 */
export default class SegmentedButtonItem extends Item {
	static readonly metadata: MetadataOptions = {
		properties: {
			/**
			 * The icon of the segment. This can be a URI to an image or an icon
			 * font URI.
			 */
			icon: { type: "sap.ui.core.URI", group: "Appearance", defaultValue: "" },
			/**
			 * Indicates whether the segment is shown.
			 */
			visible: { type: "boolean", group: "Appearance", defaultValue: true },
			/**
			 * Width of this single segment. Without it the segment is as wide as
			 * its content.
			 */
			width: {
				type: "sap.ui.core.CSSSize",
				group: "Dimension",
				defaultValue: null,
			},
		},
		events: {
			/**
			 * Fired when the user selects this segment.
			 */
			press: {},
		},
	};

	constructor(idOrSettings?: string | $SegmentedButtonItemSettings);
	constructor(id?: string, settings?: $SegmentedButtonItemSettings);
	constructor(id?: string, settings?: $SegmentedButtonItemSettings) {
		super(id, settings);
	}
}
