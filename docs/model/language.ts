import Localization from "sap/base/i18n/Localization";

/**
 * The languages the demo is translated into. Has to stay in sync with the
 * i18n_*.properties files, the supportedLocales in manifest.json and the
 * items of the language select in App.view.xml.
 */
export const supportedLanguages = ["en", "de", "hi", "ru", "tr", "uk"];

/**
 * Returns the key of the language select that matches the language UI5 is
 * currently running in.
 *
 * The browser reports region variants such as <code>de-DE</code> or
 * <code>en-US</code>, and anything the demo is not translated into falls back
 * to the first entry, which is also the fallback of the resource bundle.
 */
export function getLanguageKey(): string {
	const language = Localization.getLanguage().toLowerCase().split("-")[0];

	return supportedLanguages.includes(language)
		? language
		: supportedLanguages[0];
}
