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
		
		/**
		 * Button Event Listeners
		 */
		
		this.view.getSettingsButton().on("click", () => {
			this.audio.playSFX("click_sfx");
			this.screenSwitcher.switchToScreen({ type: "settings", returnTo: { type: "home" } });
		});

		this.view.getStartButton().on("click", () => {
			this.audio.playSFX("click_sfx");
			this.screenSwitcher.switchToScreen({ type: "mainGame" });
		});
		

		/**
		 * Play background music (BGM) on first user interaction
		 */

		this.view.getGroup().on("click", () => {
			this.audio.playBGM("home_bgm");
			this.view.getGroup().off("click");
			console.log("Click detected, playing home BGM...");
		});
	}

	hide(): void {
		this.audio.stopBGM();
		this.view.hide();
	}

	getView(): HomeScreenView {
		return this.view;
	}
}
