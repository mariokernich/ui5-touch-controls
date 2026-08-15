import JSONModel from "sap/ui/model/json/JSONModel";
import type {
	BarcodeInput$ChangeEvent,
	BarcodeInput$ScanEvent,
} from "ui5/touch/controls/BarcodeInput";
import { SizeMode } from "ui5/touch/controls/library";
import BaseController from "../BaseController";

/** one row of the event table */
interface LogEntry {
	kind: string;
	value: string;
	time: string;
}

/** how many events are kept in the table */
const LOG_LENGTH = 12;

/**
 * Controller of the BarcodeInput page.
 *
 * @namespace ui5.touch.controls.demo.controller.new
 */
export default class BarcodeInput extends BaseController {
	private model!: JSONModel;

	public onInit(): void {
		this.setControlIntro("BarcodeInput");
		this.setApi("BarcodeInput");

		this.model = new JSONModel(
			{
				value: "",
				scanTimeout: 40,
				minLength: 3,
				prefix: "",
				suffix: "",
				clearOnScan: true,
				size: SizeMode.L,
				enabled: true,
				editable: true,
				valueState: "None",
				log: [] as LogEntry[],
			},
			true,
		);
		this.getView()?.setModel(this.model, "json");

		this.setSnippets({
			main: [
				{
					code: `
<mvc:View
	xmlns:mvc="sap.ui.core.mvc"
	xmlns:tc="ui5.touch.controls">
	<tc:BarcodeInput
		value="{/code}"
		placeholder="Scan a pallet..."
		size="XL"
		width="24rem"
		prefix=""
		suffix=""
		clearOnScan="true"
		scan=".onScan"
		change=".onManualEntry" />
</mvc:View>
`,
				},
				{
					language: "typescript",
					code: `
onScan(event: BarcodeInput$ScanEvent): void {
	const code = event.getParameter("value");

	// a scan is a complete code, so it can go straight to the backend
	this.getModel().callFunction("/bookPallet", { urlParameters: { code } });
}

onManualEntry(event: BarcodeInput$ChangeEvent): void {
	// typed by hand - worth a confirmation before it is booked
	QuickDialog.confirm({ text: \`Book \${event.getParameter("value")}?\`, size: SizeMode.XL });
}
`,
				},
			],
		});
	}

	public onScan(event: BarcodeInput$ScanEvent): void {
		this.log("scan", event.getParameter("value") ?? "");
	}

	public onChange(event: BarcodeInput$ChangeEvent): void {
		this.log("change", event.getParameter("value") ?? "");
	}

	/**
	 * Adds an entry at the top of the event table.
	 */
	private log(kind: string, value: string): void {
		const entries = this.model.getProperty("/log") as LogEntry[];
		entries.unshift({
			kind: kind,
			value: value,
			time: new Date().toLocaleTimeString(),
		});
		this.model.setProperty("/log", entries.slice(0, LOG_LENGTH));
	}
}
