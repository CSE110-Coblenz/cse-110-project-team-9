import { SettingsScreenView } from "./SettingsScreenView";
import { ScreenController, ScreenSwitcher, Screen } from "../../types";
import { AudioController } from "../../audios/AudioController";

export class SettingsScreenController extends ScreenController {
	private view: SettingsScreenView;
	private screenSwitcher: ScreenSwitcher;
	private audio: AudioController;
	private returnTo: Screen | null = null;

	constructor(screenSwitcher: ScreenSwitcher, audio: AudioController) {
		super();
		this.screenSwitcher = screenSwitcher;
		this.view = new SettingsScreenView();
		this.audio = audio;

		/**
		 * Button Event Listeners
		 */

		this.view.getSaveButton().on("click", () => {
			localStorage.setItem("bgm_volume", this.audio.getVolume("bgm").toString());
			localStorage.setItem("sfx_volume", this.audio.getVolume("sfx").toString());
			
			if (this.returnTo) {
				this.screenSwitcher.switchToScreen(this.returnTo);
			}
		});

		this.view.setVolumeChangeHandler((ratio, type) => {
			this.audio.changeVolume(ratio, type);
		});
	}

    /**
     * Get the view
     */

	setReturnTo(screen: Screen): void {
		this.returnTo = screen;
	}

	getView(): SettingsScreenView {
		return this.view;
	}
}
