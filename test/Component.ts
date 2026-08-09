import Lib from "sap/ui/core/Lib";
import Theming from "sap/ui/core/Theming";
import UIComponent from "sap/ui/core/UIComponent";
import Device from "sap/ui/Device";
import JSONModel from "sap/ui/model/json/JSONModel";
import {
	additionalPages,
	allPages,
	introPages,
	portedPages,
} from "./model/pages";
import { getLanguageKey } from "./model/language";
import { getLogoMarkUrl, getLogoUrl } from "./model/theme";

/**
 * Component of the demo application.
 *
 * The application shows every control of the library on its own page. The
 * pages are wired together by the router, the page list lives in
 * {@link module:ui5/touch/controls/demo/model/pages}.
 *
 * @namespace ui5.touch.controls.demo
 */
export default class Component extends UIComponent {
	public static readonly metadata = {
		manifest: "json",
		interfaces: ["sap.ui.core.IAsyncContentCreation"],
	};

	public init(): void {
		super.init();

		// state of the shell: theme, language, version and where the
		// previous/next buttons lead to. The pages read the logo from here too.
		const app = new JSONModel({
			currentKey: allPages[0].key,
			previousKey: "",
			previousText: "",
			nextKey: "",
			nextText: "",
			theme: Theming.getTheme(),
			logo: getLogoUrl(Theming.getTheme()),
			logoMark: getLogoMarkUrl(),
			language: getLanguageKey(),
			version: this.getLibraryVersion(),
		});
		this.setModel(app, "app");

		// the theme can also change from outside, e.g. through a URL parameter
		Theming.attachApplied(() => {
			const theme = Theming.getTheme();
			app.setProperty("/theme", theme);
			app.setProperty("/logo", getLogoUrl(theme));
		});

		// drives the side navigation
		this.setModel(
			new JSONModel({
				intro: introPages,
				ported: portedPages,
				additional: additionalPages,
			}),
			"pages",
		);

		// used to collapse the side navigation on phones and tablets
		const device = new JSONModel(Device);
		device.setDefaultBindingMode("OneWay");
		this.setModel(device, "device");

		this.getRouter().initialize();
	}

	/**
	 * Returns the version of the library, for the header.
	 *
	 * The library fills its version from the ${version} placeholder that only
	 * the build replaces - on the dev server it is still the raw placeholder,
	 * and the version of the demo itself is shown instead.
	 */
	private getLibraryVersion(): string {
		// Lib.all() is missing from the type definitions, but it is the only
		// way to read the version of a loaded library synchronously
		const libraries = (
			Lib as unknown as {
				all: () => Record<string, { version?: string } | undefined>;
			}
		).all();
		const version = libraries["ui5.touch.controls"]?.version;

		if (version && !version.includes("$")) {
			return `v${version}`;
		}

		return `v${
			this.getManifestEntry("/sap.app/applicationVersion/version") as string
		}`;
	}
}
