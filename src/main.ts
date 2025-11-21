import Konva from "konva";
import type { ScreenSwitcher, Screen } from "./types";
import { StartingScreenController } from "./screens/StartingScreen/StartingScreenController";
import { HomeScreenController } from "./screens/HomeScreen/HomeScreenController";
import { SettingsScreenController } from "./screens/SettingsScreen/SettingsScreenController";
import { MainGameScreenController } from "./screens/MainGameScreen/MainGameScreenController";
import { AmongUsMenuScreenController } from "./screens/AmongUsGameScreen/MenuScreen/MenuScreenController";
import { AmongUsGameScreenController } from "./screens/AmongUsGameScreen/GameScreen/GameScreenController";
import { AmongUsResultsScreenController } from "./screens/AmongUsGameScreen/ResultsScreen/ResultsScreenController";
import { MathScreenController } from "./screens/MathScreen/MathScreenController";
import { STAGE_WIDTH, STAGE_HEIGHT } from "./constants";
import { AudioController } from "./audios/AudioController";

import { MathScreenView } from "./screens/MathScreen/MathScreenView"; 
import { MathScreenModel } from "./screens/MathScreen/MathScreenModel"; 
import { QuadraticEquationsHelper } from "./class/MathEquations/QuadraticEquationsHelper"; 

/**
 * Main Application - Coordinates all screens including minigames
 */
class App implements ScreenSwitcher {
	private stage: Konva.Stage;
	private layer: Konva.Layer;
	private _lastScreen: Screen;

	// Main game screens
	private startingController: StartingScreenController;
	private homeController: HomeScreenController;
	private settingsController: SettingsScreenController;
	private mainGameController: MainGameScreenController;
	private mathScreenController: MathScreenController;

	private mathScreenView: MathScreenView; 
	private mathScreenModel: MathScreenModel; 
	private mathHelper: QuadraticEquationsHelper; 

	// Among Us minigame screens
	private amongUsMenuController: AmongUsMenuScreenController;
	private amongUsGameController: AmongUsGameScreenController;
	private amongUsResultsController: AmongUsResultsScreenController;

	private audio: AudioController;

	constructor(container: string) {
		// Initialize Konva stage
		this.stage = new Konva.Stage({
			container,
			width: STAGE_WIDTH,
			height: STAGE_HEIGHT,
		});

		this.layer = new Konva.Layer();
		this.stage.add(this.layer);

		// Initialize AudioController
		this.audio = new AudioController();

		// Initialize main game screens
		this.startingController = new StartingScreenController(this);
		this.homeController = new HomeScreenController(this, this.audio);
		this.settingsController = new SettingsScreenController(this, this.audio);
		this.mainGameController = new MainGameScreenController(this, this.audio);

		this.mathScreenModel = new MathScreenModel([]); 
		this.mathHelper = new QuadraticEquationsHelper(); 
		this.mathScreenView = new MathScreenView(); 

		this.mathScreenController = new MathScreenController(
			this.mathScreenView,
			this.mathScreenModel,
			this.mathHelper
		); 

		// Initialize Among Us minigame screens
		this.amongUsMenuController = new AmongUsMenuScreenController(this);
		this.amongUsGameController = new AmongUsGameScreenController(this, this.audio);
		this.amongUsResultsController = new AmongUsResultsScreenController(this);

		// Add all screen groups to the layer
		this.layer.add(this.startingController.getView().getGroup());
		this.layer.add(this.homeController.getView().getGroup());
		this.layer.add(this.settingsController.getView().getGroup());
		this.layer.add(this.mainGameController.getView().getGroup());

		this.layer.add(this.mathScreenController.getView().getGroup()); 

		this.layer.add(this.amongUsMenuController.getView().getGroup());
		this.layer.add(this.amongUsGameController.getView().getGroup());
		this.layer.add(this.amongUsResultsController.getView().getGroup());

		this.layer.draw();

		this._lastScreen = { type: "starting" };

		// Start with starting screen visible
		this.switchToScreen({ type: "starting" });
	}

	/**
	 * Switch to a different screen
	 */
	switchToScreen(screen: Screen): void {
		// Hide all main game screens
		this.startingController.hide();
		this.homeController.hide();
		this.settingsController.hide();
		this.mainGameController.hide();
		this.mathScreenController.hide(); 

		// Hide all minigame screens
		this.amongUsMenuController.hide();
		this.amongUsGameController.hide();
		this.amongUsResultsController.hide();

		this._lastScreen = screen;

		// Show the requested screen
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

			case "settings":
				this.settingsController.show();
				break;

			// Quadratic Math Screen
			case "math":
				this.mathScreenController.show();
				break;

			// Among Us minigame screens
			case "amongUsMenu":
				this.amongUsMenuController.show();
				break;

			case "amongUsGame":
				this.amongUsGameController.startGame();
				break;

			case "amongUsResult":
				this.amongUsResultsController.showResults(screen.score);
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

	get lastScreen() {
		return this._lastScreen;
	}
}

// Initialize the application
new App("container");
