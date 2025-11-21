import { HomeScreenView } from "./HomeScreenView";
import { ScreenController, ScreenSwitcher } from "../../types";
import { AudioController } from "../../audios/AudioController";

export class HomeScreenController extends ScreenController {
	private view: HomeScreenView;
	private screenSwitcher: ScreenSwitcher;
	private audio: AudioController;

	constructor(screenSwitcher: ScreenSwitcher, audio: AudioController) {
		super();
		this.screenSwitcher = screenSwitcher;
        this.view = new HomeScreenView();
		this.audio = audio;

		//register audio
		audio.registerSound("home_bgm", "/homescreen/audio/medieval.mp3");
        audio.registerSound("click_sfx", "/homescreen/audio/click.mp3");
		
		/**
		 * Button Event Listeners
		 */
		this.view.getSettingsButton().on("click", () => {
			this.audio.play("click_sfx");
			this.screenSwitcher.layerOnScreen({ type: "settings" });
		});

		this.view.getStartButton().on("click", () => {
			this.audio.play("click_sfx");
			this.screenSwitcher.switchToScreen({ type: "wizardminigame" });
			// this.screenSwitcher.switchToScreen({ type: "mainGame" });
		});
	}

	hide(): void {
		this.audio.stopAll();
		this.view.hide();
	}

	getView(): HomeScreenView {
		this.audio.play("home_bgm", true);
		return this.view;
	}
}