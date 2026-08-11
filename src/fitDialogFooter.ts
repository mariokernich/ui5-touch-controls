import type Control from "sap/ui/core/Control";

/**
 * Makes a <code>sap.m.Dialog</code> reserve the room a touch toolbar in its
 * footer actually needs.
 *
 * A dialog keeps its header and its footer out of the flow: both are placed
 * against its padding box, and the padding - 2.75rem at each end - is all the
 * room they get. That is the height of a toolbar of <code>sap.m</code>. A
 * toolbar of this library is taller, so its buttons reach past the lower edge
 * of the dialog, and the dialog cuts them off there: it clips what sticks out.
 *
 * Handing the dialog the height the toolbar has puts the buttons back inside,
 * and because only the padding grows, the content above the footer keeps the
 * height it was given.
 *
 * Nothing happens when the toolbar is anywhere else; a toolbar on a page or in
 * a card lives in the flow and is free to be as tall as it likes.
 *
 * @param toolbar the toolbar that has just been rendered
 */
export function fitDialogFooter(toolbar: Control): void {
	const dom = toolbar.getDomRef();
	const footer = dom?.parentElement;

	if (!dom || !footer?.classList.contains("sapMDialogFooter")) {
		return;
	}

	const dialog = footer.parentElement;
	const height = dom.getBoundingClientRect().height;

	// no height to go by while the dialog is still hidden - the next rendering
	// after it opens comes with one
	if (!dialog || height === 0) {
		return;
	}

	footer.style.height = "auto";
	dialog.style.paddingBottom = `${height}px`;
}
