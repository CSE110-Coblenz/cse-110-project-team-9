import Konva from "konva";
import type { ScreenSwitcher, Screen, LayerScreen } from "./types";
import { StartingScreenController } from "./screens/StartingScreen/StartingScreenController";
import { HomeScreenController } from "./screens/HomeScreen/HomeScreenController";
import { SettingsScreenController } from "./screens/SettingsScreen/SettingsScreenController";
import { MainGameScreenController } from "./screens/MainGameScreen/MainGameScreenController";
import { STAGE_WIDTH, STAGE_HEIGHT } from "./constants";
import { AudioController } from "./audios/AudioController";


class App implements ScreenSwitcher {
	private stage: Konva.Stage;
	private layer: Konva.Layer;
	private _lastScreen: Screen;

	private startingController: StartingScreenController;
	private homeController: HomeScreenController;
	private settingsController: SettingsScreenController;
	private mainGameController: MainGameScreenController;

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
		this.startingController = new StartingScreenController(this, this.audio);
		this.homeController = new HomeScreenController(this, this.audio);
		this.settingsController = new SettingsScreenController(this, this.audio);
		this.mainGameController = new MainGameScreenController(this, this.audio);

		// Add all screen groups to the layer
		this.layer.add(this.startingController.getView().getGroup());
		this.layer.add(this.homeController.getView().getGroup());
		this.layer.add(this.settingsController.getView().getGroup());
		this.layer.add(this.mainGameController.getView().getGroup());

		// Draw the layer
		this.layer.draw();

		this._lastScreen = {type: "starting"};

		// Start with starting screen visible
		this.switchToScreen({ type: "starting" });
	}

	switchToScreen(screen: Screen): void {

		this._lastScreen = screen;

		this.startingController.hide();
		this.homeController.hide();
		this.settingsController.hide();
		this.mainGameController.hide();

		switch (screen.type) {
			case "starting":
				this.startingController.show();
				break;

			case "home":
				this.homeController.show();
				break;

			case "mainGame":
				this.mainGameController.show();
				break;
		}
	}

	layerOnScreen(screen: LayerScreen): void {
		switch (screen.type) {
			case "settings":
				this.settingsController.show();
				break;
		}
	}

	get lastScreen() { return this._lastScreen; }
}

// Initialize the application
new App("container");
