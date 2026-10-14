import type Control from "sap/ui/core/Control";

/**
 * Makes a <code>sap.m.Page</code> reserve the room the touch toolbars in its
 * bars actually need.
 *
 * A page keeps its header and its sub header in the flow, but its content
 * section is placed absolutely: the theme starts it a fixed distance below the
 * top and ends it a fixed distance above the bottom - the height of a toolbar
 * of <code>sap.m</code>. A toolbar of this library is taller, so the header
 * reaches into the content and covers its first line, and the footer covers
 * the last one.
 *
 * Starting the section below the bars as they are actually rendered, and
 * ending it above the footer, puts the content back between them.
 *
 * Nothing happens unless the control sits in a bar of the page - a toolbar
 * inside the content of a page leaves the page alone.
 *
 * @param control a toolbar that has just been rendered
 */
export function fitPageBars(control: Control): void {
	const dom = control.getDomRef();
	const page = dom?.closest(".sapMPage");

	// no height to go by while the toolbar is still hidden - the next
	// rendering after it is shown comes with one. The page itself is no
	// measure: an app gives it its height only after it has been rendered.
	if (!dom || !page || dom.getBoundingClientRect().height === 0) {
		return;
	}

	// the bars are the elements around the header, the sub header and the
	// footer of the page - the page puts the same classes on a custom header
	// as well, so only its direct children are looked at
	const child = (selector: string): HTMLElement | null =>
		page.querySelector(`:scope > ${selector}`);
	const section = child("section");
	const header = child(".sapMPageHeader");
	const subHeader = child(".sapMPageSubHeader");
	const footer = child(".sapMPageFooter");

	if (
		!section ||
		![header, subHeader, footer].some((bar) => bar?.contains(dom))
	) {
		return;
	}

	// header and sub header stand in the flow, one below the other - where
	// the last of them ends is where the content starts
	const top = [header, subHeader].reduce(
		(bottom, element) =>
			element
				? Math.max(
						bottom,
						element.getBoundingClientRect().bottom -
							page.getBoundingClientRect().top,
					)
				: bottom,
		0,
	);

	section.style.top = `${top}px`;

	// a floating footer lies on top of the content on purpose, and a hidden
	// one takes no room at all
	if (
		footer &&
		!footer.classList.contains("sapMPageFloatingFooter") &&
		!footer.classList.contains("sapUiHidden")
	) {
		section.style.bottom = `${footer.getBoundingClientRect().height}px`;
	}
}
