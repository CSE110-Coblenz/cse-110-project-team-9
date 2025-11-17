import { StartingScreenView } from "./StartingScreenView";
import { ScreenController, ScreenSwitcher } from "../../types";
import { AudioController } from "../../audios/AudioController";

export class StartingScreenController extends ScreenController {
	private view: StartingScreenView;
	private screenSwitcher: ScreenSwitcher;
	private audio: AudioController;

	constructor(screenSwitcher: ScreenSwitcher, audio: AudioController) {
		super();

		this.screenSwitcher = screenSwitcher;
		this.view = new StartingScreenView();
		this.audio = audio;

		/**
		 * Click anywhere to go to HomeScreen and start BGM
		 */
		this.view.getGroup().on("click", () => {
			this.audio.playBGM("home_bgm");
			this.screenSwitcher.switchToScreen({ type: "home" });
		});
	}

	getView(): StartingScreenView {
		return this.view;
	}
}

