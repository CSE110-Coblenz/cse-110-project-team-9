import { HomeScreenView } from "./HomeScreenView";
import { ScreenController, ScreenSwitcher } from "../../types";
import { AudioController } from "../../audios/AudioController";

export class HomeScreenController extends ScreenController {
	private view: HomeScreenView;
	private screenSwitcher: ScreenSwitcher;
	private audio: AudioController;

	constructor(screenSwitcher: ScreenSwitcher) {
		
		super();

		this.screenSwitcher = screenSwitcher;
        this.view = new HomeScreenView();
		this.audio = new AudioController();

		/**
		 * Button Event Listeners
		 */
		this.view.getSettingsButton().on("click", () => {
			this.screenSwitcher.switchToScreen({ type: "settings" });
		});

		this.view.getStartButton().on("click", () => {
			console.log("Click detected, playing BGM...");
			alert("Game Started!");
		});	

		this.view.getGroup().on("click", () => {
			this.audio.playBGM();
			this.view.getGroup().off("click"); // 한 번만 실행되게
		});

		/**
		 * Play background music
		 */
	}

	getView(): HomeScreenView {
		return this.view;
	}
}