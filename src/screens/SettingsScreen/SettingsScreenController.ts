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

		const settings_bgmslider = this.view.getBgmSlider();
		const settings_soundeffectslider = this.view.getSoundEffectSlider();

	}

    /**
     * Get the view
     */

	getView(): SettingsScreenView {
		return this.view;
	}
}
