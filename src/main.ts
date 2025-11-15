import Konva from "konva";
import type { ScreenSwitcher, Screen, LayerScreen } from "./types";
import { HomeScreenController } from "./screens/HomeScreen/HomeScreenController";
import { SettingsScreenController } from "./screens/SettingsScreen/SettingsScreenController";
import { MainGameScreenController } from "./screens/MainGameScreen/MainGameScreenController";
import { STAGE_WIDTH, STAGE_HEIGHT } from "./constants";
import { AudioController } from "./audios/AudioController";


class App implements ScreenSwitcher {
	private stage: Konva.Stage;
	private layer: Konva.Layer;

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
		this.homeController = new HomeScreenController(this, this.audio);
		this.settingsController = new SettingsScreenController(this, this.audio);
		this.mainGameController = new MainGameScreenController(this, this.audio);

		// Add all screen groups to the layer
		this.layer.add(this.homeController.getView().getGroup());
		this.layer.add(this.settingsController.getView().getGroup());
		this.layer.add(this.mainGameController.getView().getGroup());

		// Draw the layer
		this.layer.draw();

		// Start with home screen visible
		this.switchToScreen({ type: "home" });
	}

	switchToScreen(screen: Screen): void {
		switch (screen.type) {
			case "home":
				this.homeController.show();
				// Hide settings screen (Need for settings close button)
				this.settingsController.hide();
				break;

			case "mainGame":
				this.homeController.hide();
				this.settingsController.hide();
				this.mainGameController.show();
				break;
		}
	}

	layerOnScreen(screen: LayerScreen): void {
		switch (screen.type) {
			case "settings":
				this.settingsController.setReturnTo(screen.returnTo);
				this.settingsController.show();
				break;
		}
	}

}

// Initialize the application
new App("container");
