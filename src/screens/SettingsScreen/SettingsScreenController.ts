import { SettingsScreenView } from "./SettingsScreenView";
import { ScreenController, ScreenSwitcher } from "../../types";
import { AudioController } from "../../audios/AudioController";

export class SettingsScreenController extends ScreenController {
	private view: SettingsScreenView;
	private screenSwitcher: ScreenSwitcher;
	private audio: AudioController;
	private currentBgmVolume: number;
	private currentSfxVolume: number;

	constructor(screenSwitcher: ScreenSwitcher, audio: AudioController) {
		super();
		this.screenSwitcher = screenSwitcher;
		this.view = new SettingsScreenView();
		this.audio = audio;
		this.currentBgmVolume = this.audio.bgmVolume;
		this.currentSfxVolume = this.audio.sfxVolume;

		/**
		 * Button Event Listeners
		 */
		this.view.getSaveButton().on("click", () => {
			this.screenSwitcher.switchToScreen(this.screenSwitcher.lastScreen);
		});

		this.view.setVolumeChangeHandler((ratio, type) => {
			if (type === "bgm") {
				this.audio.setBgmVolume(ratio);
			} else if (type === "sfx") {
				this.audio.setSfxVolume(ratio);
			}
		});
	}

	public onBgmVolumeChange(newVolume: number): void {
        this.audio.setBgmVolume(newVolume);
    }

	public onSfxVolumeChange(newVolume: number): void {
		this.audio.setSfxVolume(newVolume);
	}

    public getCurrentBgmVolume(): number {
        return this.currentBgmVolume;
    }

	public getCurrentSfxVolume(): number {
		return this.currentSfxVolume;
	}

    /**
     * Get the view
     */
	getView(): SettingsScreenView {
		return this.view;
	}
}