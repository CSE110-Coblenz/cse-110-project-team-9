import Konva from "konva";
import type { ScreenSwitcher, Screen } from "./types";
import { STAGE_WIDTH, STAGE_HEIGHT } from "./constants";

import { HomeScreenController } from "./screens/HomeScreen/HomeScreenController";
import { SettingsScreenController } from "./screens/SettingsScreen/SettingsScreenController";
import { WizardGameScreenController } from "./screens/WizardGameScreen/WizardGameScreenController";

import { AudioController } from "./audio/AudioController";


class App implements ScreenSwitcher {
	private stage: Konva.Stage;
	private layer: Konva.Layer;

	private homeController: HomeScreenController;
	private settingsController: SettingsScreenController;
	private WizardGameController : WizardGameScreenController;

	private audio: AudioController;

	constructor(container: string) {
		this.stage = new Konva.Stage({
			container,
			width: STAGE_WIDTH,
			height: STAGE_HEIGHT,
		});

		// Create a layer
		this.layer = new Konva.Layer();
		this.stage.add(this.layer);

		// Initialize AudioController
		this.audio = new AudioController();

		// Initialize all screen controllers
		this.homeController = new HomeScreenController(this);
		this.settingsController = new SettingsScreenController(this);
		this.WizardGameController = new WizardGameScreenController(this);

		// Add all screen groups to the layer
		this.layer.add(this.homeController.getView().getGroup());
		this.layer.add(this.settingsController.getView().getGroup());
		this.layer.add(this.WizardGameController.getView().getGroup());

		// Draw the layer
		this.layer.draw();

		//initial start
		this.switchToScreen({ type: "home" });
	}

	switchToScreen(screen: Screen): void {

		this.homeController.hide();
		this.settingsController.hide();
		this.WizardGameController.hide();

		//TODO: figure out why we are doing this
		if (screen.type === "settings") {
			this.audio.stopBGM();
		}

		switch (screen.type) {
			case "home":
				this.homeController.show();
				//TODO: I wanna move this
				this.audio.playBGM("home_bgm");
				this.audio.replaceBGM("home_bgm", "/homescreen/audio/medieval.mp3");
				break;

			case "settings":
				this.settingsController.show();
				break;

			case "wizardminigame":
				this.WizardGameController.startGame();
				break;
		}
	}

	layerOnScreen(screen: Screen): void {
		switch (screen.type) {
			case "settings":
				this.settingsController.show();
				break;
		}
	}
}

// Initialize the application
new App("container");