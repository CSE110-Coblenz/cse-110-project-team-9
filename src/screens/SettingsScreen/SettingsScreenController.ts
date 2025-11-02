import { SettingsScreenView } from "./SettingsScreenView";
import { SettingsScreenModel } from "./SettingsScreenModel";
import { ScreenController, ScreenSwitcher } from "../../types";

export class SettingsScreenController extends ScreenController {
	private view: SettingsScreenView;
	private model: SettingsScreenModel;
	private screenSwitcher: ScreenSwitcher;

	constructor(screenSwitcher: ScreenSwitcher) {
		super();
		this.screenSwitcher = screenSwitcher;
		this.model = new SettingsScreenModel();
		this.view = new SettingsScreenView();

		this.view.getCloseButton().on("click", () => {
			this.screenSwitcher.switchToScreen({ type: "home" });
		});

		const bar = this.view.getbackground_VolumeBar();
	}

    /**
     * Get the view
     */

	getView(): SettingsScreenView {
		return this.view;
	}
}
