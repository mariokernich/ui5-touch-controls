import Localization from "sap/base/i18n/Localization";
import Control from "sap/ui/core/Control";
import type RenderManager from "sap/ui/core/RenderManager";
import type Button from "ui5/touch/controls/Button";
import SignaturePad from "ui5/touch/controls/SignaturePad";
import { cleanUp, EventLog, place, pointer, render } from "./helpers";

/**
 * A container with a renderer of the old, string-based kind - the kind that
 * puts what its children render into the page as HTML.
 */
const StringContainer = Control.extend("ui5.touch.controls.test.StringContainer", {
	metadata: {
		aggregations: {
			content: { type: "sap.ui.core.Control", multiple: true },
		},
	},
	renderer: function (rm: RenderManager, control: Control) {
		const legacy = rm as unknown as {
			write(html: string): void;
			writeControlData(control: Control): void;
		};

		legacy.write("<div");
		legacy.writeControlData(control);
		legacy.write(">");
		(control.getAggregation("content") as Control[]).forEach((child) => {
			rm.renderControl(child);
		});
		legacy.write("</div>");
	},
}) as unknown as new (settings: { content: Control[] }) => Control;

function canvasOf(pad: SignaturePad): HTMLCanvasElement {
	return pad.getDomRef("canvas") as HTMLCanvasElement;
}

/** draws a line across the pad */
function stroke(pad: SignaturePad, init?: PointerEventInit): void {
	const canvas = canvasOf(pad);
	const box = canvas.getBoundingClientRect();
	const at = (x: number, y: number): PointerEventInit => ({
		clientX: box.left + x,
		clientY: box.top + y,
		...init,
	});

	pointer(canvas, "pointerdown", at(10, 10));
	pointer(canvas, "pointermove", at(40, 30));
	pointer(canvas, "pointermove", at(80, 20));
	pointer(canvas, "pointerup", at(80, 20));
}

QUnit.module("SignaturePad", {
	afterEach: cleanUp,
});

QUnit.test("the line, the hint and the clear button stand beside the canvas, not inside it", (assert) => {
	const pad = new SignaturePad({ width: "300px", height: "120px" });
	place(new StringContainer({ content: [pad] }));

	assert.strictEqual(canvasOf(pad).children.length, 0, "the canvas holds nothing");
	assert.deepEqual(
		[...(pad.getDomRef()?.children ?? [])].map((child) => child.tagName),
		["CANVAS", "SPAN", "SPAN", "BUTTON"],
	);
});

QUnit.test("a stroke signs the pad and hands the picture over", (assert) => {
	const pad = place(new SignaturePad({ width: "300px", height: "120px" }));
	const log = new EventLog().listen(pad, "change");

	assert.notOk(pad.isSigned());

	stroke(pad);

	assert.ok(pad.isSigned());
	assert.ok(pad.getValue().startsWith("data:image/png"), "a PNG data URL");
	assert.deepEqual(log.last("change"), { value: pad.getValue(), signed: true });
	assert.ok(pad.getDomRef()?.classList.contains("sizedSignaturePadSigned"), "the hint is gone");
});

QUnit.test("a tap without a movement is no stroke", (assert) => {
	const pad = place(new SignaturePad({ width: "300px", height: "120px" }));
	const log = new EventLog().listen(pad, "change");
	const canvas = canvasOf(pad);

	pointer(canvas, "pointerdown", { clientX: 20, clientY: 20 });
	pointer(canvas, "pointerup", { clientX: 20, clientY: 20 });

	assert.notOk(pad.isSigned());
	assert.strictEqual(log.count("change"), 0);
});

QUnit.test("the secondary mouse button does not draw", (assert) => {
	const pad = place(new SignaturePad({ width: "300px", height: "120px" }));

	stroke(pad, { button: 2 });

	assert.notOk(pad.isSigned());
});

QUnit.test("a disabled pad takes no strokes", (assert) => {
	const pad = place(new SignaturePad({ width: "300px", height: "120px", enabled: false }));

	stroke(pad);

	assert.notOk(pad.isSigned());
});

QUnit.test("the clear button and an empty value empty the pad", (assert) => {
	const pad = place(new SignaturePad({ width: "300px", height: "120px" }));
	const log = new EventLog().listen(pad, "change");
	const clear = pad.getAggregation("_clearButton") as Button;

	stroke(pad);
	clear.firePress();

	assert.notOk(pad.isSigned());
	assert.deepEqual(log.last("change"), { value: "", signed: false });

	stroke(pad);
	pad.setValue("");

	assert.notOk(pad.isSigned());
	assert.strictEqual(pad.getValue(), "");
});

QUnit.test("the hint and the tooltip of the clear button are the library's, in the language of the app", (assert) => {
	const pad = place(new SignaturePad());
	const hint = () => pad.getDomRef("placeholder")?.textContent;
	const clear = pad.getAggregation("_clearButton") as Button;

	assert.strictEqual(hint(), "Sign here");
	assert.strictEqual(clear.getTooltip_AsString(), "Clear");

	Localization.setLanguage("de");
	render();

	assert.strictEqual(hint(), "Hier unterschreiben");
	assert.strictEqual(clear.getTooltip_AsString(), "Löschen");
});

QUnit.test("a hint of the application stays as it was written", (assert) => {
	const custom = place(new SignaturePad({ placeholder: "Driver" }));
	const none = place(new SignaturePad({ placeholder: "" }));

	Localization.setLanguage("de");
	render();

	assert.strictEqual(custom.getDomRef("placeholder")?.textContent, "Driver");
	assert.strictEqual(none.getDomRef("placeholder"), null, "an empty hint leaves the line bare");
});
