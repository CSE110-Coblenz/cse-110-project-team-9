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
			alert("Game Started!");
		});	

		/**
		 * Play background music (BGM) on first user interaction
		 */

		this.view.getGroup().on("click", () => {
			this.audio.playBGM();
			this.view.getGroup().off("click");
			console.log("Click detected, playing BGM...");
		});
	}

	getView(): HomeScreenView {
		return this.view;
	}
}