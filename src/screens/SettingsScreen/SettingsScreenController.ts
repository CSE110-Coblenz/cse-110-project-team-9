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
			this.audio.play("click_sfx");
			this.hide()
		});

		this.view.setVolumeChangeHandler((ratio, type) => {
			if (type === "bgm") this.audio.bgmVolume = ratio;
			else if (type === "sfx") this.audio.sfxVolume = ratio;
		});
	}

	hide(): void {
		// this.audio.stopAll();
		this.view.hide();    
	}

    /**
     * Get the view
     */
	getView(): SettingsScreenView {
		return this.view;
	}
}