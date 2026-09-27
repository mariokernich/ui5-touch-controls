/**
 * Themes that render on a dark background and therefore need the logo
 * variant with the light wordmark.
 */
export function isDarkTheme(theme: string): boolean {
	return theme.endsWith("_dark") || theme.endsWith("_hcb");
}

/**
 * Returns the logo matching the given theme. The URL is built from the
 * resource root of the demo, so it keeps working whatever the current hash is.
 *
 * The logo stands on the background of a page, which is light in Fiori 3 as
 * well - only its shell bar is dark, and that one shows the icon tile alone.
 */
export function getLogoUrl(theme: string): string {
	return sap.ui.require.toUrl(
		`ui5/touch/controls/demo/img/logo${isDarkTheme(theme) ? "-dark" : ""}.svg`,
	);
}

/**
 * Returns the icon tile of the logo, without the wordmark. The tile looks the
 * same in every theme, so unlike {@link getLogoUrl} it takes no theme.
 */
export function getLogoMarkUrl(): string {
	return sap.ui.require.toUrl("ui5/touch/controls/demo/img/logo-mark.svg");
}
