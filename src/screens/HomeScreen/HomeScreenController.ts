import { HomeScreenView } from "./HomeScreenView";
import { ScreenController, ScreenSwitcher } from "../../types";

export class HomeScreenController extends ScreenController {
	private view: HomeScreenView;
	private screenSwitcher: ScreenSwitcher;

	constructor(screenSwitcher: ScreenSwitcher) {
		super();
		this.screenSwitcher = screenSwitcher;

        this.view = new HomeScreenView();

		this.view.getSettingsButton().on("click", () => {
			this.screenSwitcher.switchToScreen({ type: "settings" });
		});

		this.view.getSettingsButton().on("mouseenter", () => {
			this.audio.playSFX("click");
		});

		this.view.getStartButton().on("click", () => {
			this.audio.playSFX("sfx");
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