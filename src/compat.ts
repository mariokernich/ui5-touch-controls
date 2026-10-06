import type ResourceBundle from "sap/base/i18n/ResourceBundle";
import Core from "sap/ui/core/Core";

/*
 * What lets the library run on UI5 releases older than the APIs it would
 * rather use.
 *
 * sap/base/i18n/Localization (1.116) and sap/ui/core/Lib (1.118) are not
 * imported: a module that is not there fails the whole library on a release
 * without it. They are looked up instead - UI5 loads both itself while it
 * boots, on every release that has them - and the Core stands in where they
 * are missing. The Core methods are deprecated from 1.118/1.120 on, which is
 * why they are only the fallback: on a current release, and on UI5 2.x, the
 * modern API is what runs.
 */

/** the parts of sap/base/i18n/Localization the library uses */
interface LocalizationApi {
	getLanguage(): string;
	attachChange(listener: () => void): void;
}

/** the parts of sap/ui/core/Lib the library uses */
interface LibApi {
	init(settings: object): { [key: string]: unknown };
	getResourceBundleFor(name: string): ResourceBundle | undefined;
}

/** the parts of the Core of UI5 1.108 that stand in for the two above */
interface LegacyCore {
	getConfiguration(): { getLanguage(): string };
	attachLocalizationChanged(listener: () => void): void;
	initLibrary(settings: object): { [key: string]: unknown };
	getLibraryResourceBundle(name: string): ResourceBundle | undefined;
}

const legacyCore = Core as unknown as LegacyCore;

/** the module of that name if UI5 has loaded it, without loading it */
function loaded<T>(name: string): T | undefined {
	return sap.ui.require(name) as T | undefined;
}

/** the language the application runs in */
export function getLanguage(): string {
	const localization = loaded<LocalizationApi>("sap/base/i18n/Localization");

	return localization
		? localization.getLanguage()
		: legacyCore.getConfiguration().getLanguage();
}

/** says when the language the application runs in changed */
export function attachLanguageChange(listener: () => void): void {
	const localization = loaded<LocalizationApi>("sap/base/i18n/Localization");

	if (localization) {
		localization.attachChange(listener);
	} else {
		legacyCore.attachLocalizationChanged(listener);
	}
}

/**
 * Registers a library with UI5.
 *
 * @returns the namespace of the library - the Core hands it back from 1.101
 *          on, so on every release this library supports
 */
export function initLibrary(settings: object): { [key: string]: unknown } {
	const lib = loaded<LibApi>("sap/ui/core/Lib");

	return lib ? lib.init(settings) : legacyCore.initLibrary(settings);
}

/** the resource bundle of a library, in the language that is set */
export function getLibraryResourceBundle(name: string): ResourceBundle | undefined {
	const lib = loaded<LibApi>("sap/ui/core/Lib");

	return lib
		? lib.getResourceBundleFor(name)
		: legacyCore.getLibraryResourceBundle(name);
}

/**
 * Whether sap.m.Dialog has its footer aggregation, which it has from UI5
 * 1.110 on.
 */
export function dialogHasFooter(dialog: object): boolean {
	return typeof (dialog as { setFooter?: unknown }).setFooter === "function";
}
