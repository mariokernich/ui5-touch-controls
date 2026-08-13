import JSONModel from "sap/ui/model/json/JSONModel";
import { releases } from "../../model/changelog";
import BaseController from "../BaseController";

/**
 * Controller of the release history.
 *
 * @namespace ui5.touch.controls.demo.controller.general
 */
export default class Changelog extends BaseController {
	public onInit(): void {
		this.getView()?.setModel(new JSONModel({ releases: releases }), "changelog");
	}
}
