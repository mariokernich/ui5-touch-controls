import { MetadataOptions } from "sap/ui/core/Element";
import RenderManager from "sap/ui/core/RenderManager";
import Locale from "sap/ui/core/Locale";
import LocaleData from "sap/ui/core/LocaleData";
import Localization from "sap/base/i18n/Localization";
import KeyboardBase, { LayoutSet } from "./KeyboardBase";
import { buildNumberPadSets } from "./keyboardLayouts";
import { NumberPadMode } from "./library";

/**
 * An on-screen pad of digits, said in one line.
 *
 * A quantity, a count, a code, a price - the fields of a terminal are digits
 * more often than they are letters, and a pad of three columns is what a thumb
 * finds without looking.
 *
 * <pre>
 * &lt;tc:NumberPad value="{/quantity}" size="XL" showDecimalSeparator="true" /&gt;
 * </pre>
 *
 * {@link #getMode mode} picks the block of digits - the pad of a computer, the
 * pad of a telephone, or a calculator with the four basic operations. The
 * block keeps its shape whatever else is switched on: a minus and a decimal
 * separator go into the row of the zero, everything else into the row of
 * function keys under it. Where neither of the two was asked for, the
 * backspace and the enter come into the row of the zero instead, and the pad
 * is the four rows of a plain number pad.
 *
 * @namespace ui5.touch.controls
 */
export default class NumberPad extends KeyboardBase {
	static readonly metadata: MetadataOptions = {
		properties: {
			/**
			 * The block of digits.
			 *
			 * <code>Simple</code> is the pad of a computer, 7 8 9 on top.
			 * <code>Phone</code> is the pad of a telephone, 1 2 3 on top with
			 * a star and a hash beside the zero. <code>Calculator</code> adds
			 * the four basic operations and an equals sign.
			 */
			mode: {
				type: "ui5.touch.controls.NumberPadMode",
				group: "Appearance",
				defaultValue: NumberPadMode.Simple,
			},
			/**
			 * Whether a set of signs is reachable from the pad - the one a
			 * password is made of, and the punctuation of a note.
			 */
			showSpecialCharacters: {
				type: "boolean",
				group: "Appearance",
				defaultValue: false,
			},
			/**
			 * Whether the pad has a key for the decimal separator.
			 *
			 * Only looked at in <code>Simple</code>: the other two blocks have
			 * their fourth row taken, by the star and the hash of a telephone
			 * and by the operations of a calculator.
			 */
			showDecimalSeparator: {
				type: "boolean",
				group: "Appearance",
				defaultValue: false,
			},
			/**
			 * The sign the decimal key writes. Empty takes the one of the
			 * current language - a comma in German, a point in English.
			 */
			decimalSeparator: {
				type: "string",
				group: "Appearance",
				defaultValue: "",
			},
			/**
			 * Whether the pad has a minus key, for a value that may be
			 * negative. Only looked at in <code>Simple</code>, see
			 * {@link #getShowDecimalSeparator showDecimalSeparator}.
			 */
			showSign: { type: "boolean", group: "Appearance", defaultValue: false },
			/**
			 * Whether the pad has an <code>{esc}</code> key.
			 *
			 * It goes into the row of function keys rather than into the top
			 * left corner, where a keyboard of keys has it: the block of digits
			 * is three columns wide and keeps its shape.
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
			 */
			enterText: { type: "string", group: "Appearance", defaultValue: "" },
		},
	};

	constructor(idOrSettings?: string | $NumberPadSettings);
	constructor(id?: string, settings?: $NumberPadSettings);
	constructor(id?: string, settings?: $NumberPadSettings) {
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
	 * The sign the decimal key writes: the one that was asked for, or the one
	 * of the language the page is running in.
	 */
	private getSeparator(): string {
		if (!this.getShowDecimalSeparator()) {
			return "";
		}

		return (
			this.getDecimalSeparator() ||
			LocaleData.getInstance(
				new Locale(Localization.getLanguage()),
			).getNumberSymbol("decimal")
		);
	}

	protected getKeySets(): LayoutSet[] {
		return buildNumberPadSets({
			mode: this.getMode(),
			specialCharacters: this.getShowSpecialCharacters(),
			sign: this.getShowSign(),
			decimalSeparator: this.getSeparator(),
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
	 * The rows a pad of this mode shows, for a table of what the library
	 * brings along.
	 *
	 * @param mode the mode to look up
	 * @returns the rows of its digit block, with the defaults of the control
	 */
	public static getLayoutForMode(mode: NumberPadMode): string[] {
		return [
			...buildNumberPadSets({
				mode: mode,
				specialCharacters: false,
				sign: false,
				decimalSeparator: "",
				escape: false,
			})[0].rows,
		];
	}
}
