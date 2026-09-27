import Link from "ui5/touch/controls/Link";
import Text from "ui5/touch/controls/Text";
import { SizeMode } from "ui5/touch/controls/library";
import { cleanUp, EventLog, keydown, place, tap } from "./helpers";

function anchor(link: Link): HTMLAnchorElement {
	return link.getDomRef() as HTMLAnchorElement;
}

QUnit.module("Link", {
	afterEach: cleanUp,
});

QUnit.test("renders an anchor that opens a new window safely", (assert) => {
	const link = place(
		new Link({ text: "Docs", href: "https://example.com", target: "_blank", size: SizeMode.L }),
	);

	assert.strictEqual(anchor(link).getAttribute("href"), "https://example.com");
	assert.strictEqual(anchor(link).getAttribute("target"), "_blank");
	assert.strictEqual(anchor(link).getAttribute("rel"), "noopener noreferrer");
	assert.strictEqual(anchor(link).textContent, "Docs");
	assert.ok(anchor(link).classList.contains("sizedSizeL"));
});

QUnit.test("a disabled link can be neither followed nor focused", (assert) => {
	const link = place(new Link({ text: "Docs", href: "https://example.com", enabled: false }));

	assert.strictEqual(anchor(link).getAttribute("href"), null);
	assert.strictEqual(anchor(link).getAttribute("tabindex"), "-1");
	assert.strictEqual(anchor(link).getAttribute("aria-disabled"), "true");
});

QUnit.test("a tap presses it, unless it is disabled", (assert) => {
	const enabled = place(new Link({ text: "a" }));
	const disabled = place(new Link({ text: "b", enabled: false }));
	const log = new EventLog().listen(enabled, "press");
	const none = new EventLog().listen(disabled, "press");

	tap(anchor(enabled));
	tap(anchor(disabled));

	assert.strictEqual(log.count("press"), 1);
	assert.strictEqual(none.count("press"), 0);
});

QUnit.test("Enter presses it, with an href as well as without one", (assert) => {
	const plain = place(new Link({ text: "a" }));
	// an href that goes nowhere, so the test page stays where it is
	const withHref = place(new Link({ text: "b", href: "#" }));
	const plainLog = new EventLog().listen(plain, "press");
	const hrefLog = new EventLog().listen(withHref, "press");

	// the browser would follow the href on its own afterwards
	anchor(withHref).addEventListener("click", (event) => {
		event.preventDefault();
	});

	keydown(anchor(plain), "Enter");
	keydown(anchor(withHref), "Enter");

	assert.strictEqual(plainLog.count("press"), 1);
	assert.strictEqual(hrefLog.count("press"), 1);
});

QUnit.module("Text", {
	afterEach: cleanUp,
});

QUnit.test("renders its text in its size and color, and can be tapped", (assert) => {
	const text = place(new Text({ text: "Hello", color: "#c00", size: SizeMode.XL }));
	const element = text.getDomRef() as HTMLElement;
	const log = new EventLog().listen(text, "press");

	assert.strictEqual(element.textContent, "Hello");
	assert.ok(element.classList.contains("sizedSizeXL"));
	assert.strictEqual(element.style.color, "rgb(204, 0, 0)");

	tap(element);
	assert.strictEqual(log.count("press"), 1);
});
