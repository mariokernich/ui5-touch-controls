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
 */
export function getLogoUrl(theme: string): string {
	return sap.ui.require.toUrl(
		`ui5/touch/controls/demo/logo${isDarkTheme(theme) || theme === "sap_fiori_3" ? "-dark" : ""}.svg`,
	);
}
