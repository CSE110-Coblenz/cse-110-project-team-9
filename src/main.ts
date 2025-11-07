import Konva from "konva";
import type { ScreenSwitcher, Screen } from "./types";
import { HomeScreenController } from "./screens/HomeScreen/HomeScreenController";
import { SettingsScreenController } from "./screens/SettingsScreen/SettingsScreenController";
import { WizardGameScreenController } from "./screens/WizardGameScreen/WizardGameScreenController";
import { STAGE_WIDTH, STAGE_HEIGHT } from "./constants";
import { AudioController } from "./audios/AudioController";


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

		// Start with home screen visible
		this.homeController.getView().show();

		// Play home BGM
		this.audio.playBGM("home_bgm");
	}

	switchToScreen(screen: Screen): void {

		//TODO: figure out why we are doing this
		if (screen.type === "settings") {
			this.audio.stopBGM();
		}

		switch (screen.type) {
			case "home":
				this.homeController.show();
				// Hide settings screen (Need for settings close button)
				this.settingsController.hide();
				this.audio.replaceBGM("home_bgm", "/homescreen/audio/medieval.mp3");
				break;
			case "settings":
				this.homeController.show();
				this.settingsController.show();
				break;
			case "WizardGame":
				this.WizardGameController.startGame();
				//TODO: return point value wizard Game Exit();
				break;
		}
	}
}

// Initialize the application
new App("container");