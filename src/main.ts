import Konva from "konva";
import type { ScreenSwitcher, Screen } from "./types";
import { StartingScreenController } from "./screens/StartingScreen/StartingScreenController";
import { HomeScreenController } from "./screens/HomeScreen/HomeScreenController";
import { SettingsScreenController } from "./screens/SettingsScreen/SettingsScreenController";
import { MainGameScreenController } from "./screens/MainGameScreen/MainGameScreenController";
import { WizardGameScreenController } from "./screens/WizardGameScreen/WizardGameScreenController";
import { GuideScreenController } from "./screens/WizardGameScreen/GuideScreen/GuideScreenController";
import { AmongUsMenuScreenController } from "./screens/AmongUsGameScreen/MenuScreen/MenuScreenController";
import { AmongUsGameScreenController } from "./screens/AmongUsGameScreen/GameScreen/GameScreenController";
import { AmongUsResultsScreenController } from "./screens/AmongUsGameScreen/ResultsScreen/ResultsScreenController";
import { STAGE_WIDTH, STAGE_HEIGHT } from "./constants";
import { AudioController } from "./audios/AudioController";
import {LinearScreenController} from "./screens/LinearScreen/LinearScreenController";

import { Player } from "./class/MainGameScreenClasses/Player";

/**
 * Main Application - Coordinates all screens including minigames
 */
class App implements ScreenSwitcher {
	private stage: Konva.Stage;
	private layer: Konva.Layer;
	private _lastScreen: Screen;
	private player: Player;

	// Main game screens
	private startingController: StartingScreenController;
	private homeController: HomeScreenController;
	private settingsController: SettingsScreenController;
	private mainGameController: MainGameScreenController;

	// Wizard minigame screens
	private WizardGameController: WizardGameScreenController;
	private WizardGuideController: GuideScreenController;

	// Among Us minigame screens
	private amongUsMenuController: AmongUsMenuScreenController;
	private amongUsGameController: AmongUsGameScreenController;
	private amongUsResultsController: AmongUsResultsScreenController;


	private linearScreenController: LinearScreenController;

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

		// Initialize all screen controllers
		this.startingController = new StartingScreenController(this);
		this.homeController = new HomeScreenController(this, this.audio);
		this.settingsController = new SettingsScreenController(this, this.audio);
		this.mainGameController = new MainGameScreenController(this, this.audio);


		// initalize Wizard minigame screens
		this.WizardGameController = new WizardGameScreenController(this, this.audio);
		this.WizardGuideController = new GuideScreenController(this, this.audio, this.WizardGameController);

		// Initialize Among Us minigame screens
		this.amongUsMenuController = new AmongUsMenuScreenController(this);
		this.amongUsGameController = new AmongUsGameScreenController(this, this.audio);
		this.amongUsResultsController = new AmongUsResultsScreenController(this);

		//lienar screen controller
		this.linearScreenController = new LinearScreenController(this, this.WizardGameController);

		// Add all screen groups to the layer
		this.layer.add(this.startingController.getView().getGroup());
		this.layer.add(this.homeController.getView().getGroup());
		this.layer.add(this.settingsController.getView().getGroup());
		this.layer.add(this.mainGameController.getView().getGroup());
		this.layer.add(this.amongUsMenuController.getView().getGroup());
		this.layer.add(this.amongUsGameController.getView().getGroup());
		this.layer.add(this.amongUsResultsController.getView().getGroup());

		//Wizard game layers
		this.layer.add(this.WizardGameController.getView().getGroup());
		const ctx = this.layer.getContext();
		//need as pixel art becomes blurry
		ctx.imageSmoothingEnabled = false;
		this.layer.add(this.WizardGuideController.getView().getGroup());

		this.layer.add(this.linearScreenController.getView().getGroup());

		// Start with starting screen visible
		this._lastScreen = {type: "starting"};
		this.switchToScreen({ type: "starting" });
	}

	/**
	 * Switch to a different screen
	 */
	switchToScreen(screen: Screen): void {

		this._lastScreen = screen;

		// Hide all main game screens
		this.startingController.hide();
		this.homeController.hide();
		this.settingsController.hide();
		this.mainGameController.hide();
		this.WizardGameController.hide();

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
			
			// Wizard minigame screens
			case "wizardminigame":
				this.WizardGameController.startGame();
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
			case "wizardguide":
				this.WizardGuideController.show();
				break;
			case "linear_screen":
				this.linearScreenController.show();
				break;
		}
	}

	get lastScreen() { return this._lastScreen; }
}

// Initialize the application
new App("container");
