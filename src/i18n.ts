import type ResourceBundle from "sap/base/i18n/ResourceBundle";
import { attachLanguageChange, getLibraryResourceBundle } from "./compat";

/** the name of this library, which is where its bundle is looked for */
const LIBRARY = "ui5.touch.controls";

/**
 * The bundle of the language that is set, or nothing while it has not been
 * asked for yet.
 */
let bundle: ResourceBundle | undefined;

/** what wants to hear about a language change */
const listeners = new Set<() => void>();

// A language change makes the bundle the wrong one, so it is dropped and read
// again on the next text that is asked for. Whoever asked for a text before
// that is told, because UI5 does not render a control again just because the
// language changed - it renders what a binding tells it to, and a text of the
// library is not bound to anything.
attachLanguageChange(() => {
	bundle = undefined;
	listeners.forEach((listener) => {
		listener();
	});
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
 * method for that is sap/ui/core/Lib where UI5 has it, and the Core where it
 * does not (see ./compat).
 *
 * Where there is no text for a key, the key is what comes back - that is what
 * a resource bundle does, and it means a control never renders nothing.
 *
 * @param key key in messagebundle.properties
 * @param args values for the placeholders of the text
 */
export function getText(key: string, args?: (string | number)[]): string {
	bundle ??= getLibraryResourceBundle(LIBRARY);

	return bundle?.getText(key, args) ?? key;
}

/**
 * Says when the language changed, for a control that put a text of the
 * library on the screen and has to put it there again.
 *
 * A text that comes out of {@link getText} is read once, while the control
 * renders; nothing binds it to the language, so nothing brings the control
 * back when the language changes. A control that renders such a text asks for
 * this in its <code>init</code> and renders itself again from the callback.
 *
 * The callback runs after the bundle was dropped, so the text it reads is the
 * one of the new language.
 *
 * @param listener what to do when the language changed
 * @returns the function that ends it again, to be called from
 *          <code>exit</code> - a control that is gone must not be held on to
 */
export function attachTextChange(listener: () => void): () => void {
	listeners.add(listener);

	return () => {
		listeners.delete(listener);
	};
}
