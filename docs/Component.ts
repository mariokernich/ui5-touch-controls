import IconPool from "sap/ui/core/IconPool";
import Lib from "sap/ui/core/Lib";
import Theming from "sap/ui/core/Theming";
import UIComponent from "sap/ui/core/UIComponent";
import Device from "sap/ui/Device";
import JSONModel from "sap/ui/model/json/JSONModel";
import {
	additionalPages,
	allPages,
	classPages,
	introPages,
	portedPages,
} from "./model/pages";
import {
	ICON_FONT_COLLECTION,
	ICON_FONT_FAMILY,
	iconFontMetadata,
} from "./model/iconFont";
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

		// The icons of the side navigation: one per control, drawn for this
		// demo, so that a page is recognised by its shape rather than by the
		// nearest thing the standard icon font happens to have. Registered
		// before the router runs, because the navigation is built with the
		// first screen.
		//
		// The metadata is handed over inline and the metadataURI left empty:
		// as long as there is a URI to read the metadata from, IconPool reads
		// it from there, and an icon rendered before that answer arrives stays
		// empty for good.
		IconPool.registerFont({
			collectionName: ICON_FONT_COLLECTION,
			fontFamily: ICON_FONT_FAMILY,
			fontURI: sap.ui.require.toUrl("ui5/touch/controls/demo/fonts"),
			metadata: iconFontMetadata(),
			// the typings say object, the implementation reads a URI string
			metadataURI: "" as unknown as object,
			lazy: false,
		});

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
			// set from the viewport width by the App controller
			sideExpanded: false,
			language: getLanguageKey(),
			version: this.getLibraryVersion(),
			isPhone: Device.system.phone,
			isTablet: Device.system.tablet,
			isMobile: Device.system.phone || Device.system.tablet,
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
				classes: classPages,
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
