import { StartingScreenView } from "./StartingScreenView";
import { ScreenController, ScreenSwitcher } from "../../types";

export class StartingScreenController extends ScreenController {
	private view: StartingScreenView;
	private screenSwitcher: ScreenSwitcher;

	constructor(screenSwitcher: ScreenSwitcher) {
		super();

		this.screenSwitcher = screenSwitcher;
		this.view = new StartingScreenView();

		/**
		 * Click anywhere to go to HomeScreen
		 */
		this.view.getGroup().on("click", () => {
			this.screenSwitcher.switchToScreen({ type: "home" });
		});
	}	

	getView(): StartingScreenView {
		return this.view;
	}
}