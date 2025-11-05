import Konva from "konva";
import { SettingsScreenView } from "./SettingsScreenView";
import { ScreenController, ScreenSwitcher } from "../../types";
import { AudioController } from "../../audios/AudioController";

export class SettingsScreenController extends ScreenController {
	private view: SettingsScreenView;
	private screenSwitcher: ScreenSwitcher;
	private audio: AudioController;
	private currentVolume: number;

	constructor(screenSwitcher: ScreenSwitcher) {
		super();
		this.screenSwitcher = screenSwitcher;
		this.view = new SettingsScreenView();
		this.audio = new AudioController();
		this.currentVolume = this.audio.getVolume();

		/**
		 * Button Event Listeners
		 */

		this.view.getCloseButton().on("click", () => {
			this.screenSwitcher.switchToScreen({ type: "home" });
		});

		this.view.setVolumeChangeHandler((ratio, type) => {
			if (type === "bgm") {
				this.audio.changeVolume(ratio);
			}
		});
	}

	public onVolumeChange(newVolume: number): void {
        this.audio.changeVolume(newVolume);
    }

    public onSaveButtonClick(): void {
        this.audio.play("click");
    }

    public getCurrentVolume(): number {
        return this.currentVolume;
    }

    /**
     * Get the view
     */

	getView(): SettingsScreenView {
		return this.view;
	}
}
