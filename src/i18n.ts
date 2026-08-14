import Localization from "sap/base/i18n/Localization";
import type ResourceBundle from "sap/base/i18n/ResourceBundle";
import Lib from "sap/ui/core/Lib";

/** the name of this library, which is where its bundle is looked for */
const LIBRARY = "ui5.touch.controls";

/**
 * The bundle of the language that is set, or nothing while it has not been
 * asked for yet.
 */
let bundle: ResourceBundle | undefined;

// A language change makes the bundle the wrong one, so it is dropped and read
// again on the next text that is asked for - which is during the rendering
// UI5 sets off for such a change anyway.
Localization.attachChange(() => {
	bundle = undefined;
});

/**
 * The text of the library in the language the application runs in.
 *
 * This is what a control says of its own accord - the label of a ready-made
 * dialog action, the hint on an empty signature pad, the two states of a
 * switch. Everything a control is handed by the application stays as the
 * application wrote it.
 *
 * The bundle comes from the library rather than from a file of its own, so a
 * built library serves it out of its preload instead of fetching it. The
 * method for that is documented as being there from UI5 1.118 on; measured
 * against 1.116, the oldest release this library supports, it is there too.
 *
 * Where there is no text for a key, the key is what comes back - that is what
 * a resource bundle does, and it means a control never renders nothing.
 *
 * @param key key in messagebundle.properties
 * @param args values for the placeholders of the text
 */
export function getText(key: string, args?: (string | number)[]): string {
	bundle ??= Lib.getResourceBundleFor(LIBRARY);

	return bundle?.getText(key, args) ?? key;
}
