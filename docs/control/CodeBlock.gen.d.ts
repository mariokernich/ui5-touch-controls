import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { $ControlSettings } from "sap/ui/core/Control";

declare module "./CodeBlock" {
	/**
	 * Interface defining the settings object used in constructor calls
	 */
	interface $CodeBlockSettings extends $ControlSettings {
		text?: string | PropertyBindingInfo;
		language?: string | PropertyBindingInfo;
		showCopyButton?: boolean | PropertyBindingInfo | `{${string}}`;
	}

	export default interface CodeBlock {
		// property: text
		getText(): string;
		setText(text: string): this;

		// property: language
		getLanguage(): string;
		setLanguage(language: string): this;

		// property: showCopyButton
		getShowCopyButton(): boolean;
		setShowCopyButton(showCopyButton: boolean): this;
	}
}
