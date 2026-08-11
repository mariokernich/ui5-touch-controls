import Element, { MetadataOptions } from "sap/ui/core/Element";

/**
 * One set of keys of a {@link ui5.touch.controls.VirtualKeyboard}.
 *
 * A keyboard of keys has more on it than fits under ten fingers at once: the
 * letters, the digits, the symbols. A keyboard on a screen solves that the way
 * the one of a phone does - it shows one set at a time and swaps it for
 * another when a key says so.
 *
 * A set has a {@link #getName name} and its {@link #getRows rows}. Any key
 * written as <code>{name}</code> of a set that is there switches the keyboard
 * to it, so the keys that do the switching are part of the layout itself and
 * need no code around them:
 *
 * <pre>
 * &lt;tc:VirtualKeyboard mode="Custom"&gt;
 *     &lt;tc:layouts&gt;
 *         &lt;tc:KeyboardLayout
 *             name="default"
 *             text="ABC"
 *             rows="q w e r t y u i o p,
 *                   a s d f g h j k l,
 *                   {shift} z x c v b n m {bksp},
 *                   {numbers} {space} {enter}" /&gt;
 *         &lt;tc:KeyboardLayout
 *             name="numbers"
 *             text="123"
 *             rows="1 2 3, 4 5 6, 7 8 9, {default} 0 {bksp}" /&gt;
 *     &lt;/tc:layouts&gt;
 * &lt;/tc:VirtualKeyboard&gt;
 * </pre>
 *
 * The keyboard starts with the set named <code>default</code>, or with the
 * first one when there is none by that name.
 *
 * @namespace ui5.touch.controls
 */
export default class KeyboardLayout extends Element {
	static readonly metadata: MetadataOptions = {
		properties: {
			/**
			 * The name of the set, and the key that switches to it: a set
			 * called <code>numbers</code> is reached by a
			 * <code>{numbers}</code> key.
			 *
			 * <code>default</code> is the set the keyboard starts with.
			 */
			name: { type: "string", group: "Misc", defaultValue: "" },
			/**
			 * What the key that switches to this set says.
			 *
			 * Without it the key carries the name of the set, which is rarely
			 * what belongs on a key: a set called <code>numbers</code> is
			 * usually reached by a key that says <code>123</code>, and the way
			 * back by one that says <code>ABC</code>.
			 */
			text: { type: "string", group: "Appearance", defaultValue: "" },
			/**
			 * The rows of the set. Each entry is one row, keys are separated by
			 * spaces, and a key in curly braces is a special one - the keys of
			 * {@link ui5.touch.controls.VirtualKeyboard} plus the name of any
			 * other set of this keyboard.
			 */
			rows: { type: "string[]", group: "Appearance", defaultValue: [] },
		},
	};

	constructor(idOrSettings?: string | $KeyboardLayoutSettings);
	constructor(id?: string, settings?: $KeyboardLayoutSettings);
	constructor(id?: string, settings?: $KeyboardLayoutSettings) {
		super(id, settings);
	}
}
