import { SettingsScreenView } from "./SettingsScreenView";
import { SettingsScreenModel } from "./SettingsScreenModel";
import { ScreenController, ScreenSwitcher } from "../../types";

export class SettingsScreenController extends ScreenController {
	private view: SettingsScreenView;
	private model: SettingsScreenModel;
	private screenSwitcher: ScreenSwitcher;
	private audio: AudioController;
	private currentBgmVolume: number;
	private currentSfxVolume: number;

	constructor(screenSwitcher: ScreenSwitcher) {
		super();
		this.screenSwitcher = screenSwitcher;
		this.model = new SettingsScreenModel();
		this.view = new SettingsScreenView();
		this.audio = new AudioController();
		this.currentBgmVolume = this.audio.getBgmVolume();
		this.currentSfxVolume = this.audio.getSfxVolume();

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

	public onBgmVolumeChange(newVolume: number): void {
        this.audio.changeBgmVolume(newVolume);
    }

	public onSfxVolumeChange(newVolume: number): void {
		this.audio.changeSfxVolume(newVolume);
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
