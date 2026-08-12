import Element, { MetadataOptions } from "sap/ui/core/Element";

/**
 * One set of keys of a {@link ui5.touch.controls.CustomKeyboard}.
 *
 * A keyboard of keys has more on it than fits under ten fingers at once: the
 * letters, the digits, the symbols. A keyboard on a screen solves that the way
 * the one of a phone does - it shows one set at a time and swaps it for
 * another when a key says so.
 *
 * A set has a {@link #getName name} and its {@link #getRows rows}, and that is
 * all: every set stands on its own and says in full what is on it. Upper case
 * is not a state of the keyboard but a set of its own, written out as the
 * letters it shows.
 *
 * Any key written as <code>{name}</code> of a set that is there switches to
 * it, so the keys that do the switching are part of the layout and need no
 * code around them:
 *
 * <pre>
 * &lt;tc:CustomKeyboard&gt;
 *     &lt;tc:layouts&gt;
 *         &lt;tc:KeyboardLayout
 *             name="default"
 *             rows="q w e r t y u i o p,
 *                   a s d f g h j k l,
 *                   {shift} z x c v b n m {backspace},
 *                   {numbers} {space} {ent}" /&gt;
 *         &lt;tc:KeyboardLayout
 *             name="shift"
 *             rows="Q W E R T Y U I O P,
 *                   A S D F G H J K L,
 *                   {shift} Z X C V B N M {backspace},
 *                   {numbers} {space} {ent}" /&gt;
 *         &lt;tc:KeyboardLayout
 *             name="numbers"
 *             rows="1 2 3, 4 5 6, 7 8 9, {abc} 0 {backspace}" /&gt;
 *     &lt;/tc:layouts&gt;
 * &lt;/tc:CustomKeyboard&gt;
 * </pre>
 *
 * The keyboard starts with the set named <code>default</code>, or with the
 * first one when there is none by that name. <code>{abc}</code> leads back to
 * <code>default</code> unless a set of that name exists, and the key names of
 * simple-keyboard are understood as they are written there:
 * <code>{backspace}</code> and <code>{ent}</code> mean the same as
 * <code>{bksp}</code> and <code>{enter}</code>.
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
			 * The rows of the set. Each entry is one row, keys are separated by
			 * spaces, and a key in curly braces is a special one - the keys of
			 * {@link ui5.touch.controls.CustomKeyboard} plus the name of any
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
