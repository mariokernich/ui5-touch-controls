import { allPages } from "../../model/pages";
import BaseController from "../BaseController";

/**
 * Controller of the page shown for an unknown hash.
 *
 * @namespace ui5.touch.controls.demo.controller.general
 */
export default class NotFound extends BaseController {
	public onHomePress(): void {
		this.getRouter().navTo(allPages[0].key);
	}
}
