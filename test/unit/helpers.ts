import type Control from "sap/ui/core/Control";
import type EventProvider from "sap/ui/base/EventProvider";
import Core from "sap/ui/core/Core";
import { getLanguage } from "ui5/touch/controls/compat";

/**
 * What the unit tests have in common: putting a control on the page and
 * taking it off again, and the events a user causes.
 *
 * The events are real DOM events, dispatched where the user would cause them,
 * so they go through the event handling of UI5 like a real tap or key does -
 * a test that calls the handler of a control directly would not notice when
 * the handler is no longer reached.
 */

/** the element QUnit empties after every test */
const FIXTURE = "qunit-fixture";

/** what the tests have placed, so it can be destroyed after each of them */
const placed: Control[] = [];

/**
 * Renders what is pending, right away.
 *
 * sap/ui/test/utils/nextUIUpdate is the way to wait for a rendering from UI5
 * 1.127 on; the oldest release the library supports does not have it, and
 * applyChanges works on all of them.
 */
export function render(): void {
	sap.ui.getCore().applyChanges();
}

/**
 * Places a control into the fixture and renders it. It is destroyed by
 * {@link cleanUp}.
 */
export function place<T extends Control>(control: T): T {
	placed.push(control);
	control.placeAt(FIXTURE);
	render();

	return control;
}

/**
 * Destroys what the test placed and puts the language back. Every module
 * calls it after each test.
 */
export function cleanUp(): void {
	placed.splice(0).forEach((control) => {
		control.destroy();
	});

	if (getLanguage() !== "en") {
		setLanguage("en");
	}
}

/**
 * Switches the language of the page. sap/base/i18n/Localization does this
 * from UI5 1.116 on; on older releases the configuration of the Core does.
 */
export function setLanguage(language: string): void {
	const localization = sap.ui.require("sap/base/i18n/Localization") as
		| { setLanguage(language: string): void }
		| undefined;

	if (localization) {
		localization.setLanguage(language);
	} else {
		(
			Core as unknown as {
				getConfiguration(): { setLanguage(language: string): void };
			}
		)
			.getConfiguration()
			.setLanguage(language);
	}
}

/** Waits for the given number of milliseconds. */
export function wait(ms = 0): Promise<void> {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

/**
 * Waits until the condition holds - for a popover to open or close - and
 * fails once the timeout has passed.
 */
export async function waitFor(
	condition: () => boolean,
	message = "the condition was never met",
	timeout = 5000,
): Promise<void> {
	const end = Date.now() + timeout;

	while (!condition()) {
		if (Date.now() > end) {
			throw new Error(message);
		}
		await wait(20);
	}
}

/**
 * A tap, the way UI5 recognises one: a mouse button that goes down and up on
 * the same element, and the click that follows.
 */
export function tap(target: Element): void {
	const init: MouseEventInit = {
		bubbles: true,
		cancelable: true,
		view: window,
		button: 0,
		detail: 1,
	};

	target.dispatchEvent(new MouseEvent("mousedown", init));
	target.dispatchEvent(new MouseEvent("mouseup", init));
	target.dispatchEvent(new MouseEvent("click", init));
}

/** the key codes UI5 derives its pseudo events from, by key */
const KEY_CODES: Record<string, number> = {
	Backspace: 8,
	Tab: 9,
	Enter: 13,
	Escape: 27,
	" ": 32,
	ArrowUp: 38,
	ArrowDown: 40,
	F4: 115,
};

function keyInit(key: string, init?: KeyboardEventInit): KeyboardEventInit {
	const keyCode = KEY_CODES[key] ?? key.toUpperCase().charCodeAt(0);

	// keyCode and which are what UI5 recognises sapenter, sapspace and the
	// others by; the typings no longer list them
	return {
		key: key,
		bubbles: true,
		cancelable: true,
		keyCode: keyCode,
		which: keyCode,
		...init,
	};
}

/** A key that goes down, e.g. <code>keydown(dom, "Enter")</code>. */
export function keydown(target: Element, key: string, init?: KeyboardEventInit): KeyboardEvent {
	const event = new KeyboardEvent("keydown", keyInit(key, init));
	target.dispatchEvent(event);

	return event;
}

/** A key that comes up again. */
export function keyup(target: Element, key: string, init?: KeyboardEventInit): KeyboardEvent {
	const event = new KeyboardEvent("keyup", keyInit(key, init));
	target.dispatchEvent(event);

	return event;
}

/** A key that is pressed and released. */
export function press(target: Element, key: string, init?: KeyboardEventInit): void {
	keydown(target, key, init);
	keyup(target, key, init);
}

/**
 * Types into a native field the way the browser reports it: the new value,
 * then an <code>input</code> event.
 */
export function type(field: HTMLInputElement | HTMLTextAreaElement, value: string): void {
	field.value = value;
	field.dispatchEvent(new Event("input", { bubbles: true }));
}

/** The <code>change</code> event the browser fires when a field is committed. */
export function commit(field: HTMLInputElement | HTMLTextAreaElement): void {
	field.dispatchEvent(new Event("change", { bubbles: true }));
}

/** A pointer event, by default the one of the primary mouse button. */
export function pointer(
	target: Element,
	type: "pointerdown" | "pointerup" | "pointermove" | "pointerleave" | "pointercancel",
	init?: PointerEventInit,
): void {
	target.dispatchEvent(
		new PointerEvent(type, {
			bubbles: type !== "pointerleave",
			cancelable: true,
			pointerId: 1,
			pointerType: "mouse",
			isPrimary: true,
			button: 0,
			...init,
		}),
	);
}

/**
 * Collects the events of a control, so a test can say which were fired, how
 * often and with what.
 */
export class EventLog {
	readonly entries: { name: string; parameters: Record<string, unknown> }[] = [];

	/**
	 * Starts listening to the events of the given names.
	 *
	 * @returns this, to be written in one line with the constructor
	 */
	listen(control: EventProvider, ...names: string[]): this {
		for (const name of names) {
			control.attachEvent(name, (event: { getParameters(): Record<string, unknown> }) => {
				// UI5 adds the id of the control to the parameters of every
				// event; what the control itself reported is what is compared
				const { id, ...parameters } = event.getParameters();
				void id;
				this.entries.push({ name: name, parameters: parameters });
			});
		}

		return this;
	}

	/** the names of the events, in the order they were fired */
	names(): string[] {
		return this.entries.map((entry) => entry.name);
	}

	/** how often the event was fired */
	count(name: string): number {
		return this.entries.filter((entry) => entry.name === name).length;
	}

	/** the parameters of the last event of that name */
	last(name: string): Record<string, unknown> | undefined {
		return this.entries.filter((entry) => entry.name === name).pop()?.parameters;
	}

	clear(): void {
		this.entries.length = 0;
	}
}
