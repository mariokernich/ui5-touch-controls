import Localization from "sap/base/i18n/Localization";
import Properties from "sap/base/util/Properties";
import DataType from "sap/ui/base/DataType";
import { attachTextChange, getText } from "ui5/touch/controls/i18n";
import {
	KeyboardMode,
	LetterCase,
	NumberKeys,
	NumberPadMode,
	SizeMode,
	sizeClass,
} from "ui5/touch/controls/library";
import { cleanUp } from "./helpers";

QUnit.module("library", {
	afterEach: cleanUp,
});

QUnit.test("sizeClass names the class that carries the size ladder", (assert) => {
	assert.strictEqual(sizeClass(SizeMode.M), "sizedSizeM");
	assert.strictEqual(sizeClass(SizeMode["6XL"]), "sizedSize6XL");
});

QUnit.test("the enumerations are known to UI5 as types", (assert) => {
	const types: [string, Record<string, string>][] = [
		["ui5.touch.controls.SizeMode", SizeMode],
		["ui5.touch.controls.KeyboardMode", KeyboardMode],
		["ui5.touch.controls.NumberKeys", NumberKeys],
		["ui5.touch.controls.LetterCase", LetterCase],
		["ui5.touch.controls.NumberPadMode", NumberPadMode],
	];

	for (const [name, values] of types) {
		const type = DataType.getType(name);

		assert.ok(type, `${name} is a type`);
		for (const value of Object.values(values)) {
			assert.ok(type?.isValid(value), `${value} is a valid ${name}`);
		}
		assert.notOk(type?.isValid("NoSuchValue"), `${name} rejects what it does not know`);
	}
});

QUnit.module("i18n", {
	afterEach: cleanUp,
});

QUnit.test("getText reads the bundle of the library", (assert) => {
	assert.strictEqual(getText("SWITCH_ON"), "ON");
	assert.strictEqual(getText("QUICKDIALOG_SHOW_DETAILS"), "Show details");
});

QUnit.test("getText hands a key back that the bundle does not have", (assert) => {
	assert.strictEqual(getText("NO_SUCH_KEY"), "NO_SUCH_KEY");
});

QUnit.test("every text the library uses is in the bundle", (assert) => {
	const keys = [
		"QUICKDIALOG_ABORT",
		"QUICKDIALOG_CANCEL",
		"QUICKDIALOG_CLOSE",
		"QUICKDIALOG_DELETE",
		"QUICKDIALOG_IGNORE",
		"QUICKDIALOG_NO",
		"QUICKDIALOG_OK",
		"QUICKDIALOG_RETRY",
		"QUICKDIALOG_YES",
		"QUICKDIALOG_SHOW_DETAILS",
		"COMBOBOX_NO_MATCHING_ENTRY",
		"SIGNATUREPAD_PLACEHOLDER",
		"SWITCH_ON",
		"SWITCH_OFF",
		"PICKER_TITLE",
		"SELECT_CANCEL",
		"COMBOBOX_OK",
		"TIMEPICKER_HOURS",
		"TIMEPICKER_MINUTES",
		"KEYBOARD_SPACE",
		"OVERFLOWTOOLBAR_MORE",
		"STEPINPUT_DECREASE",
		"STEPINPUT_INCREASE",
		"DATEPICKER_PREVIOUS",
		"DATEPICKER_NEXT",
		"SIGNATUREPAD_CLEAR",
	];

	for (const key of keys) {
		assert.notStrictEqual(getText(key), key, `${key} has a text`);
	}
});

QUnit.test("every language of the bundle has every text, and no text of its own", async (assert) => {
	const languages = ["", "de", "en", "es", "fr", "hi", "it", "ja", "nl", "pl", "pt", "ru", "tr", "uk", "zh"];

	/** the keys of one file, read as it stands - without the fallback of a bundle */
	const keysOf = async (language: string): Promise<string[]> => {
		const file = language ? `messagebundle_${language}` : "messagebundle";
		const properties = (await Properties.create({
			url: sap.ui.require.toUrl(`ui5/touch/controls/${file}.properties`),
			async: true,
		})) as { getKeys(): string[] };

		return properties.getKeys().sort();
	};

	const base = await keysOf("");
	assert.ok(base.length > 20, "the base file has the texts");

	for (const language of languages.slice(1)) {
		assert.deepEqual(await keysOf(language), base, `messagebundle_${language} matches`);
	}
});

QUnit.test("the texts follow the language, and the listeners hear of it", (assert) => {
	let calls = 0;
	const detach = attachTextChange(() => {
		calls++;
	});

	Localization.setLanguage("de");

	assert.strictEqual(calls, 1, "the listener was called");
	assert.strictEqual(getText("SWITCH_ON"), "AN", "the text is German now");

	detach();
	Localization.setLanguage("en");

	assert.strictEqual(calls, 1, "a detached listener is not called again");
	assert.strictEqual(getText("SWITCH_ON"), "ON", "and English again");
});
