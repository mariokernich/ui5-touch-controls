import Device from "sap/ui/Device";
import { MetadataOptions } from "sap/ui/core/Element";
import RenderManager from "sap/ui/core/RenderManager";
import KeyboardBase, { LayoutSet } from "./KeyboardBase";
import { buildKeyboardSets } from "./keyboardLayouts";
import { KeyboardMode, LetterCase, NumberKeys } from "./library";

/**
 * An on-screen keyboard of letters, said in one line.
 *
 * The keys come from the arrangement of a country and a handful of switches;
 * there is no layout to write out. What it shows is the keyboard of that
 * country as a device draws it, with the digits and the special characters
 * where they were asked for.
 *
 * <pre>
 * &lt;tc:Keyboard mode="German" size="XL" value="{/text}" /&gt;
 * </pre>
 *
 * {@link #getDisplayNumbers displayNumbers} decides what becomes of the
 * digits: a row of their own over the letters, a key that leads to them, or
 * nothing. {@link #getShowSpecialCharacters showSpecialCharacters} adds a set
 * of brackets, signs and currencies behind a key of its own, and
 * {@link #getLetterCase letterCase} pins the keyboard to capitals or to lower
 * case for a field that has a case of its own.
 *
 * For anything this does not cover there is
 * {@link ui5.touch.controls.CustomKeyboard}, which is handed its keys row by
 * row, and {@link ui5.touch.controls.NumberPad} for a field of digits.
 *
 * @namespace ui5.touch.controls
 */
export default class Keyboard extends KeyboardBase {
	static readonly metadata: MetadataOptions = {
		properties: {
			/**
			 * The arrangement of the letters - the keyboard of a country, by
			 * the language it is used for.
			 */
			mode: {
				type: "ui5.touch.controls.KeyboardMode",
				group: "Appearance",
				defaultValue: KeyboardMode.English,
			},
			/**
			 * Whether the keyboard shows digits, and how.
			 *
			 * <code>Always</code> puts a row of them over the letters, the way
			 * a keyboard of keys has it. <code>Toggle</code> leaves the
			 * letters to themselves and puts the digits behind a key, the way
			 * a phone does it - a row of digits there would make every key
			 * narrow. <code>ToggleOnMobile</code>, the default, is the first
			 * on a computer and a tablet and the second on a phone.
			 */
			displayNumbers: {
				type: "ui5.touch.controls.NumberKeys",
				group: "Appearance",
				defaultValue: NumberKeys.ToggleOnMobile,
			},
			/**
			 * Whether a set of brackets, signs and currencies is reachable
			 * from the keyboard.
			 *
			 * Where the digits are behind a key of their own, the set sits
			 * behind them - the way of a phone, which goes from its letters to
			 * its digits to its symbols and back. Otherwise a key of its own
			 * leads there.
			 */
			showSpecialCharacters: {
				type: "boolean",
				group: "Appearance",
				defaultValue: false,
			},
			/**
			 * Whether the keyboard has a caps lock next to its shift key.
			 *
			 * Shift falls away after one letter, the lock stays on until it is
			 * pressed again - and shift while the lock is on writes lower case,
			 * the way it does on a keyboard of keys. A keyboard that writes one
			 * case only has neither, see {@link #getLetterCase letterCase}.
			 */
			showCapsLock: {
				type: "boolean",
				group: "Appearance",
				defaultValue: false,
			},
			/**
			 * The case the keyboard writes its letters in.
			 *
			 * <code>Upper</code> and <code>Lower</code> pin it to one case and
			 * leave the shift key and the caps lock off - there is nothing to
			 * switch. That is what a field with a case of its own wants: a
			 * material number, a licence plate, a batch.
			 *
			 * Not looked at for a script without case; Devanagari has a second
			 * set of letters instead of capitals.
			 */
			letterCase: {
				type: "ui5.touch.controls.LetterCase",
				group: "Appearance",
				defaultValue: LetterCase.Mixed,
			},
			/**
			 * Whether the keyboard has an <code>{esc}</code> key.
			 *
			 * The key fires {@link #event:escape escape} and does nothing else;
			 * what it should mean is left to the application.
			 */
			showEscape: {
				type: "boolean",
				group: "Appearance",
				defaultValue: false,
			},
			/**
			 * What the Enter key says. Empty leaves it the arrow it is.
			 *
			 * A keyboard that ends a search says Search on it, one that leads
			 * on says Next. This is the one key a keyboard of this kind has
			 * reason to rename; everything further is a
			 * {@link ui5.touch.controls.CustomKeyboard} with its
			 * <code>display</code> aggregation.
			 */
			enterText: { type: "string", group: "Appearance", defaultValue: "" },
		},
	};

	constructor(idOrSettings?: string | $KeyboardSettings);
	constructor(id?: string, settings?: $KeyboardSettings);
	constructor(id?: string, settings?: $KeyboardSettings) {
		super(id, settings);
	}

	// every keyboard of this library draws the same way; without a renderer of
	// its own UI5 would go looking for a module named after this control
	static renderer = {
		apiVersion: 2,
		render(rm: RenderManager, control: KeyboardBase) {
			KeyboardBase.renderKeyboard(rm, control);
		},
	};

	/**
	 * What <code>displayNumbers</code> comes down to on this device.
	 *
	 * <code>ToggleOnMobile</code> is the only value that has to be decided,
	 * and a phone is a phone for as long as the page is open - the answer does
	 * not change under the keyboard.
	 */
	private getNumberKeys(): NumberKeys.Never | NumberKeys.Always | NumberKeys.Toggle {
		const numbers = this.getDisplayNumbers();

		if (numbers !== NumberKeys.ToggleOnMobile) {
			return numbers;
		}

		return Device.system.phone ? NumberKeys.Toggle : NumberKeys.Always;
	}

	protected getKeySets(): LayoutSet[] {
		return buildKeyboardSets({
			mode: this.getMode(),
			numbers: this.getNumberKeys(),
			specialCharacters: this.getShowSpecialCharacters(),
			capsLock: this.getShowCapsLock(),
			letterCase: this.getLetterCase(),
			escape: this.getShowEscape(),
		});
	}

	protected getKeyText(key: string): string {
		return this.plainKeyName(key) === "enter" ? this.getEnterText() : "";
	}

	protected getKeySignature(): string {
		return this.getEnterText();
	}

	/**
	 * The rows a keyboard of this arrangement shows, for a table of what the
	 * library brings along.
	 *
	 * @param mode the arrangement to look up
	 * @returns the rows of its first set, with the defaults of the control
	 */
	public static getLayoutForMode(mode: KeyboardMode): string[] {
		return [
			...buildKeyboardSets({
				mode: mode,
				numbers: NumberKeys.Always,
				specialCharacters: false,
				capsLock: false,
				letterCase: LetterCase.Mixed,
				escape: false,
			})[0].rows,
		];
	}
}
