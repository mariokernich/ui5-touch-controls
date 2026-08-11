import Element, { MetadataOptions } from "sap/ui/core/Element";

/**
 * What one key of a {@link ui5.touch.controls.VirtualKeyboard} says.
 *
 * The keyboard has a sign for every key it knows - an arrow for
 * <code>{shift}</code>, an icon for <code>{bksp}</code> - and shows the plain
 * name of a key it does not know. That is enough for most keyboards; where it
 * is not, an entry of this kind puts a text of its own on a key:
 *
 * <pre>
 * &lt;tc:display&gt;
 *     &lt;tc:KeyboardKey key="numbers" text="123" /&gt;
 *     &lt;tc:KeyboardKey key="abc" text="ABC" /&gt;
 *     &lt;tc:KeyboardKey key="ent" text="return" /&gt;
 * &lt;/tc:display&gt;
 * </pre>
 *
 * It is the <code>display</code> option of simple-keyboard, and it works on
 * any key - a special one, a letter, a digit.
 *
 * @namespace ui5.touch.controls
 */
export default class KeyboardKey extends Element {
	static readonly metadata: MetadataOptions = {
		properties: {
			/**
			 * The key this text belongs to: <code>numbers</code>,
			 * <code>ent</code>, <code>a</code>.
			 *
			 * The braces of a special key may be left out, and are better left
			 * out in a view: UI5 reads a string that begins with a brace as a
			 * binding, so <code>key="{numbers}"</code> would have to be
			 * escaped to be read as a text. Both spellings mean the same key,
			 * as do the names of simple-keyboard - <code>ent</code> and
			 * <code>enter</code> are one key.
			 */
			key: { type: "string", group: "Misc", defaultValue: "" },
			/**
			 * What the key says. An empty text leaves the key with what the
			 * keyboard would have shown by itself.
			 */
			text: { type: "string", group: "Appearance", defaultValue: "" },
		},
	};

	constructor(idOrSettings?: string | $KeyboardKeySettings);
	constructor(id?: string, settings?: $KeyboardKeySettings);
	constructor(id?: string, settings?: $KeyboardKeySettings) {
		super(id, settings);
	}
}
