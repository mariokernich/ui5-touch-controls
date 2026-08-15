/*!
 * ${copyright}
 */

import Lib from "sap/ui/core/Lib";
import IconPool from "sap/ui/core/IconPool";

// library dependencies must also be imported here
import "sap/ui/core/library";

import {
	ICON_FONT_COLLECTION,
	ICON_FONT_FAMILY,
	iconFontMetadata,
} from "./iconFont";

/**
 * Initialization Code and shared classes of library ui5.touch.controls.
 */

/**
 * Available modes for the Button control.
 *
 * @enum {string}
 * @namespace ui5.touch.controls
 */
export enum SizeMode {
	S = "S",
	M = "M",
	L = "L",
	XL = "XL",
	"2XL" = "2XL",
	"3XL" = "3XL",
	"4XL" = "4XL",
	"5XL" = "5XL",
	"6XL" = "6XL",
}

/**
 * The arrangement of the letters of a {@link ui5.touch.controls.Keyboard} -
 * the keyboard of a country, by the language it is used for.
 */
export enum KeyboardMode {
	/** the English arrangement, QWERTY */
	English = "English",
	/** the German arrangement, QWERTZ: Z and Y are swapped against English */
	German = "German",
	/** the French arrangement, AZERTY */
	French = "French",
	/** the Spanish arrangement: QWERTY with an Ñ next to the L */
	Spanish = "Spanish",
	/** the Italian arrangement: QWERTY with the accented vowels on the right */
	Italian = "Italian",
	/**
	 * the Portuguese arrangement: QWERTY with a Ç next to the L. Brazil
	 * writes the letters the same way, so this is the arrangement of both.
	 * The accented vowels sit on a set of their own - on a keyboard of keys
	 * they are written with a dead key, which a key that is tapped once
	 * cannot be.
	 */
	Portuguese = "Portuguese",
	/**
	 * the Swedish arrangement: QWERTY with Å, Ä and Ö on the right. Finland
	 * uses the same keyboard, so this is the arrangement of both. Denmark and
	 * Norway differ - they have Æ and Ø where this has Ä and Ö.
	 */
	Swedish = "Swedish",
	/**
	 * the Turkish arrangement, Q: the dotless I sits where QWERTY has its I,
	 * and the dotted one moved down beside the L. The two are letters of
	 * their own, and {@link ui5.touch.controls.LetterCase} treats them the
	 * Turkish way - i becomes İ, and I becomes ı.
	 */
	Turkish = "Turkish",
	/**
	 * the Romanian arrangement, the standard one: Ă, Î, Ș, Ț and Â sit on
	 * keys of their own, with the comma-below Ș and Ț the standard asks for
	 * rather than the cedilla ones.
	 */
	Romanian = "Romanian",
	/** the Ukrainian arrangement, ЙЦУКЕН, with І, Ї and Є */
	Ukrainian = "Ukrainian",
	/** the Russian arrangement, ЙЦУКЕН, with Ы, Э and Ъ */
	Russian = "Russian",
	/**
	 * Devanagari in the InScript arrangement, the Indian standard. The
	 * consonants that are not on the first set are one shift away, which is
	 * a set of its own rather than upper case - Devanagari has no case, and
	 * {@link ui5.touch.controls.LetterCase} is therefore not looked at.
	 */
	Hindi = "Hindi",
}

/**
 * Whether a {@link ui5.touch.controls.Keyboard} shows digits, and how.
 */
export enum NumberKeys {
	/** no digits, and no way to them */
	Never = "Never",
	/** a row of digits over the letters, the way a keyboard of keys has it */
	Always = "Always",
	/**
	 * letters only, with the digits behind a key of their own - the way a
	 * phone does it, where a row of digits would make every key narrow
	 */
	Toggle = "Toggle",
	/**
	 * <code>Always</code> on a computer and a tablet, <code>Toggle</code> on
	 * a phone. Which of the two it is is decided once, by the device the page
	 * was opened on.
	 */
	ToggleOnMobile = "ToggleOnMobile",
}

/**
 * The case a {@link ui5.touch.controls.Keyboard} writes its letters in.
 *
 * A field that has a case of its own - a material number, a licence plate, a
 * batch - gets a keyboard that writes it, and no key that would change it.
 */
export enum LetterCase {
	/** lower case, with a shift key and a caps lock to write capitals */
	Mixed = "Mixed",
	/** capitals only, and no key to switch the case */
	Upper = "Upper",
	/** lower case only, and no key to switch the case */
	Lower = "Lower",
}

/**
 * The digit block of a {@link ui5.touch.controls.NumberPad}.
 */
export enum NumberPadMode {
	/** the pad of a computer: 7 8 9 on top, and a zero under it */
	Simple = "Simple",
	/** the pad of a telephone: 1 2 3 on top, with * and # beside the zero */
	Phone = "Phone",
	/** the pad of a computer with the four basic operations and an equals */
	Calculator = "Calculator",
}

/**
 * The CSS class that carries the size ladder for a size mode.
 *
 * A control renders it on its root element and then takes what it needs from
 * the custom properties the class defines - <code>--sized-font-size</code>,
 * <code>--sized-height</code> and so on. The values themselves live in
 * <code>themes/base/Sizing.less</code>, which is the only place they are
 * written down.
 *
 * @param size the size mode of the control
 * @returns the class name, e.g. <code>sizedSizeXL</code>
 */
export function sizeClass(size: SizeMode): string {
	return `sizedSize${size}`;
}

/**
 * Interface for controls that provide the library's central
 * <code>size</code> property ({@link ui5.touch.controls.SizeMode}).
 *
 * Allows generic handling of sized controls, e.g.
 * <code>control.isA("ui5.touch.controls.ISized")</code> at runtime or
 * typed access to <code>getSize</code> / <code>setSize</code> in
 * TypeScript.
 *
 * @interface
 * @name ui5.touch.controls.ISized
 * @public
 */
export interface ISized {
	/**
	 * Returns the current size of the control.
	 */
	getSize(): SizeMode;

	/**
	 * Sets the size of the control.
	 */
	setSize(size: SizeMode): this;
}

// delegate further initialization of this library to the Core
const thisLib: { [key: string]: unknown } = Lib.init({
	name: "ui5.touch.controls",
	version: "${version}",
	dependencies: [
		// keep in sync with the ui5.yaml and .library files
		"sap.ui.core",
	],
	types: [
		"ui5.touch.controls.SizeMode",
		"ui5.touch.controls.KeyboardMode",
		"ui5.touch.controls.NumberKeys",
		"ui5.touch.controls.LetterCase",
		"ui5.touch.controls.NumberPadMode",
	],
	interfaces: ["ui5.touch.controls.ISized"],
	controls: [
		"ui5.touch.controls.BarcodeInput",
		"ui5.touch.controls.Button",
		"ui5.touch.controls.CheckBox",
		"ui5.touch.controls.ComboBox",
		"ui5.touch.controls.CustomKeyboard",
		"ui5.touch.controls.DatePicker",
		"ui5.touch.controls.Input",
		"ui5.touch.controls.Keyboard",
		"ui5.touch.controls.KeyboardBase",
		"ui5.touch.controls.Link",
		"ui5.touch.controls.NumberPad",
		"ui5.touch.controls.OverflowToolbar",
		"ui5.touch.controls.RadioButton",
		"ui5.touch.controls.RadioButtonGroup",
		"ui5.touch.controls.SegmentedButton",
		"ui5.touch.controls.Select",
		"ui5.touch.controls.SignaturePad",
		"ui5.touch.controls.StepInput",
		"ui5.touch.controls.Switch",
		"ui5.touch.controls.Text",
		"ui5.touch.controls.TextArea",
		"ui5.touch.controls.TimePicker",
		"ui5.touch.controls.Toolbar",
	],
	elements: [
		"ui5.touch.controls.KeyboardKey",
		"ui5.touch.controls.KeyboardLayout",
		"ui5.touch.controls.SegmentedButtonItem",
	],
	noLibraryCSS: false, // if no CSS is provided, you can disable the library.css load here
}) as { [key: string]: unknown };

thisLib.SizeMode = SizeMode;
thisLib.KeyboardMode = KeyboardMode;
thisLib.NumberKeys = NumberKeys;
thisLib.LetterCase = LetterCase;
thisLib.NumberPadMode = NumberPadMode;

// Register the library's own icon font so its SVG-based icons (backspace,
// enter) render as real font glyphs and therefore inherit the current text
// color (currentColor) - unlike an <img> which stays a fixed color. The font
// and its metadata are generated by scripts/build-icon-font.mjs.
//
// The metadata is handed over inline. IconPool would otherwise fetch it, and
// an icon rendered before that answer arrives is rendered empty and stays
// empty - nothing renders it again once the metadata turns up.
//
// The empty metadataURI is what makes IconPool take the inline metadata: as
// long as there is a URI to read the metadata from it reads it from there,
// and it makes one up from the fontURI if it is not told otherwise.
IconPool.registerFont({
	collectionName: ICON_FONT_COLLECTION,
	fontFamily: ICON_FONT_FAMILY,
	fontURI: sap.ui.require.toUrl("ui5/touch/controls/themes/base/fonts"),
	metadata: iconFontMetadata(),
	// the typings say object, the implementation reads a URI string - the API
	// documentation of registerFont calls it "an URI to a file"
	metadataURI: "" as unknown as object,
	lazy: false,
});

// export the library namespace
export default thisLib;
