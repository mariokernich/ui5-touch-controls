import Popover from "sap/m/Popover";
import { PlacementType } from "sap/m/library";
import type Control from "sap/ui/core/Control";
import { centerKeyboardPopover } from "./centerKeyboardPopover";
import type KeyboardBase from "./KeyboardBase";

/**
 * What a field has to offer to carry a keyboard: the
 * {@link ui5.touch.controls.Input} and the
 * {@link ui5.touch.controls.TextArea}.
 *
 * The field declares a <code>keyboard</code> aggregation that is forwarded to
 * the <code>content</code> of the popover this class makes, and a hidden
 * <code>_popover</code> aggregation the popover is kept in.
 */
export interface KeyboardField extends Control {
	getKeyboard(): KeyboardBase | null;
	getShowKeyboard(): boolean;
	getEnabled(): boolean;
	getEditable(): boolean;
	getValue(): string;
	getMaxLength(): number;
}

/** what the field does with what is typed on the keyboard */
export interface KeyboardHandlers {
	/** a key changed the value of the keyboard */
	change(value: string): void;
	/** the Enter key of the keyboard was pressed */
	enter(keyboard: KeyboardBase): void;
}

/**
 * The popover a field shows its on-screen keyboard in, and everything that
 * goes with it: opening it below the field, keeping the focus in the field
 * while a key is pressed, and connecting the keys to the field.
 *
 * The field stays in charge of when this happens - it opens the keyboard when
 * it gets the focus and closes it when the focus leaves - and of what a key
 * means to it.
 *
 * @private
 */
export default class FieldKeyboard {
	/** the field the keyboard types into */
	private readonly field: KeyboardField;

	/** what the field does with the keys */
	private readonly handlers: KeyboardHandlers;

	/** the keyboards whose events are already connected to the field */
	private readonly wired = new WeakSet<KeyboardBase>();

	/**
	 * Whether the popover is being closed because the focus left the field,
	 * see closeForFocusLoss.
	 */
	private closingForFocusLoss = false;

	constructor(field: KeyboardField, handlers: KeyboardHandlers) {
		this.field = field;
		this.handlers = handlers;
	}

	/**
	 * The popover carrying the keyboard, made on first use.
	 *
	 * This is where the <code>keyboard</code> aggregation of the field is
	 * forwarded to, so it is also asked for while the settings of the
	 * constructor of the field are applied.
	 */
	getPopover(): Popover {
		let popover = this.field.getAggregation("_popover") as Popover | null;

		if (!popover) {
			popover = new Popover(this.field.getId() + "-keyboardPopover", {
				showHeader: false,
				showArrow: false,
				placement: PlacementType.VerticalPreferredBottom,
				// the field keeps the focus while the keyboard is open, so the
				// popover must not pull it onto one of the keys
				initialFocus: this.field,
				afterOpen: () => {
					this.getDomRef()?.addEventListener("mousedown", this.keepFocus);
					// a docked keyboard is placed by the stylesheet, so it is
					// left alone here
					if (!this.field.getKeyboard()?.getDocked()) {
						centerKeyboardPopover(this.field, this.getPopover());
					}
				},
				beforeClose: () => {
					this.getDomRef()?.removeEventListener("mousedown", this.keepFocus);
				},
			});
			popover.addStyleClass("sizedKeyboardPopover");
			this.field.setAggregation("_popover", popover, true);
		}

		return popover;
	}

	/**
	 * Whether the node is part of the popover - the focus moving there, by
	 * tabbing onto a key, is not the focus leaving the field.
	 */
	contains(node: Node | null): boolean {
		return Boolean(node && this.getDomRef()?.contains(node));
	}

	/**
	 * Whether there is a keyboard to show and the field is in a state in which
	 * the user can type at all.
	 */
	canShow(): boolean {
		return (
			this.field.getShowKeyboard() &&
			this.field.getEnabled() &&
			this.field.getEditable() &&
			this.field.getKeyboard() !== null
		);
	}

	/**
	 * Opens the keyboard below the field, if there is one to show.
	 */
	open(): void {
		const keyboard = this.field.getKeyboard();

		if (!keyboard || !this.canShow()) {
			return;
		}

		const popover = this.getPopover();

		if (popover.isOpen()) {
			return;
		}

		this.wire(keyboard);
		// the keyboard types into the field, so it starts from its value and
		// respects its limit
		keyboard.setValue(this.field.getValue());
		keyboard.setMaxLength(this.field.getMaxLength());
		// a docked keyboard belongs at the bottom edge of the screen rather
		// than at the field, and the popover is the element UI5 places - so it
		// is the one that carries the docking. Asked every time, because the
		// property can change between two openings.
		popover.toggleStyleClass("sizedKeyboardPopoverDocked", keyboard.getDocked());

		popover.openBy(this.field);
	}

	close(): void {
		const popover = this.field.getAggregation("_popover") as Popover | null;

		if (popover?.isOpen()) {
			popover.close();
		}
	}

	/**
	 * Closes the keyboard because the focus has left the field.
	 *
	 * A popover that is closed puts the focus back where it was when it
	 * opened, which is the field. Here that would pull the focus back from
	 * wherever the user has just put it - another field, a button - and bring
	 * the keyboard up again with it. So the field is asked to decline the
	 * focus while the popover closes, see isClosingForFocusLoss.
	 */
	closeForFocusLoss(): void {
		this.closingForFocusLoss = true;

		try {
			this.close();
		} finally {
			this.closingForFocusLoss = false;
		}
	}

	/**
	 * Whether the popover is closing because the focus left the field - the
	 * field does not take the focus back then, see closeForFocusLoss.
	 */
	isClosingForFocusLoss(): boolean {
		return this.closingForFocusLoss;
	}

	private getDomRef(): HTMLElement | null {
		const popover = this.field.getAggregation("_popover") as Popover | null;

		return (popover?.getDomRef() as HTMLElement | null) ?? null;
	}

	/**
	 * Pressing a key must not take the focus away from the field - otherwise
	 * the popover would close on the very first key.
	 */
	private readonly keepFocus = (event: MouseEvent): void => {
		event.preventDefault();
	};

	/**
	 * Connects a keyboard to the field. Every keyboard is only connected once,
	 * however often the popover is opened.
	 */
	private wire(keyboard: KeyboardBase): void {
		if (this.wired.has(keyboard)) {
			return;
		}
		this.wired.add(keyboard);

		keyboard.attachChange((event) => {
			// a keyboard that was taken out of the field again types nowhere
			if (this.field.getKeyboard() === keyboard) {
				this.handlers.change(event.getParameter("value") ?? "");
			}
		});
		keyboard.attachEnter(() => {
			if (this.field.getKeyboard() === keyboard) {
				this.handlers.enter(keyboard);
			}
		});
	}
}
