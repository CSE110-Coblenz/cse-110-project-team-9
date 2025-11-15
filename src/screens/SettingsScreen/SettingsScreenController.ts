import { SettingsScreenView } from "./SettingsScreenView";
import { ScreenController, ScreenSwitcher } from "../../types";
import { AudioController } from "../../audios/AudioController";

export class SettingsScreenController extends ScreenController {
	private view: SettingsScreenView;
	private screenSwitcher: ScreenSwitcher;
	private audio: AudioController;

	constructor(screenSwitcher: ScreenSwitcher, audio: AudioController) {
		super();
		this.screenSwitcher = screenSwitcher;
		this.view = new SettingsScreenView();
		this.audio = audio;

		/**
		 * Button Event Listeners
		 */

		this.view.getSaveButton().on("click", () => {
			localStorage.setItem("bgm_volume", this.audio.getBgmVolume().toString());
			localStorage.setItem("sfx_volume", this.audio.getSfxVolume().toString());
			alert("Settings saved!");
			this.screenSwitcher.switchToScreen({ type: "home" });
		});

		this.view.setVolumeChangeHandler((ratio, type) => {
			if (type === "bgm") {
				this.audio.changeBgmVolume(ratio);
			} else if (type === "sfx") {
				this.audio.changeSfxVolume(ratio);
			}
		});
	}

    /**
     * Get the view
     */

	getView(): SettingsScreenView {
		return this.view;
	}
}
