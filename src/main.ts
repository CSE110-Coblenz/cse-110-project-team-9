import Konva from "konva";
import type { ScreenSwitcher, Screen } from "./types";
//import { HomeScreenController } from "./screens/HomeScreen/HomeScreenController";
import  { WizardGameScreenController } from "./screens/WizardGameScreen/WizardGameScreenController";
import { STAGE_WIDTH, STAGE_HEIGHT } from "./constants";

class App implements ScreenSwitcher {
	private stage: Konva.Stage;
	private layer: Konva.Layer;

	// private homeController: HomeScreenController;

	private WizardGameController : WizardGameScreenController;

	constructor(container: string) {
		this.stage = new Konva.Stage({
			container,
			width: STAGE_WIDTH,
			height: STAGE_HEIGHT,
		});

		// Create a layer
		this.layer = new Konva.Layer();
		this.stage.add(this.layer);

		// Initialize all screen controllers
		// this.homeController = new HomeScreenController(this);
		this.WizardGameController = new WizardGameScreenController(this);

		// Add all screen groups to the layer
		// this.layer.add(this.homeController.getView().getGroup());
		this.layer.add(this.WizardGameController.getView().getGroup());

		// Draw the layer
		this.layer.draw();

		// Start with home screen visible
		// this.homeController.getView().show();
		this.switchToScreen({ type: "WizardGame" });
	}

	switchToScreen(screen: Screen): void {

		switch (screen.type) {
			case "WizardGame":
				this.WizardGameController.startGame();
				//TODO: return value wizard Game Exit();
				break;

			// case "home":
			// 	this.homeController.show();
			// 	break;
			
			// case "char_select":
            //     this.charSelectController.show();
            //     break;
		}
	}
}

// Initialize the application
new App("container");