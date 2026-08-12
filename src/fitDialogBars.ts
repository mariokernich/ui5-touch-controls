import type Control from "sap/ui/core/Control";

/**
 * Makes a <code>sap.m.Dialog</code> reserve the room the touch toolbars in its
 * bars actually need.
 *
 * A dialog keeps its header, its sub header and its footer out of the flow:
 * all three are placed against its padding box, and the padding - 2.75rem at
 * each end - is all the room they get. That is the height of a toolbar of
 * <code>sap.m</code>. A toolbar of this library is taller, so its buttons
 * reach past the edge of the dialog, and the dialog cuts them off there: it
 * clips what sticks out.
 *
 * Handing the dialog the height its bars have puts the buttons back inside,
 * and because only the padding grows, the content between them keeps the
 * height it was given. A sub header additionally has to be moved down to below
 * the header, which is where it sits by a fixed distance of its own.
 *
 * Nothing happens outside a dialog; a toolbar on a page or in a card lives in
 * the flow and is free to be as tall as it likes.
 *
 * @param control a control inside the dialog - a toolbar that has just been
 * rendered, or the dialog itself
 */
export function fitDialogBars(control: Control): void {
	const dom = control.getDomRef();
	const dialog = dom?.closest(".sapMDialog") as HTMLElement | null;

	// no height to go by while the dialog is still hidden - the next rendering
	// after it opens comes with one
	if (!dom || !dialog || dialog.getBoundingClientRect().height === 0) {
		return;
	}

	const bar = (selector: string): HTMLElement | null =>
		dialog.querySelector(selector);

	// the title group is what carries the header bar - the element around it
	// has no height of its own
	const header = bar(".sapMDialogTitleGroup");
	const subHeader = bar(".sapMDialogSubHeader");
	const footer = bar(".sapMDialogFooter");
	let top = 0;

	if (header) {
		header.style.height = "auto";
		top += header.getBoundingClientRect().height;
	}
	if (subHeader) {
		subHeader.style.height = "auto";
		subHeader.style.top = `${top}px`;
		top += subHeader.getBoundingClientRect().height;
	}
	if (top > 0) {
		dialog.style.paddingTop = `${top}px`;
	}

	if (footer) {
		footer.style.height = "auto";
		dialog.style.paddingBottom = `${footer.getBoundingClientRect().height}px`;
	}
}
