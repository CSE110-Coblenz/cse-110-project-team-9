import { StartingScreenView } from "./StartingScreenView";
import { ScreenController, ScreenSwitcher } from "../../types";

export class StartingScreenController extends ScreenController {
	private _view: StartingScreenView;
	private screenSwitcher: ScreenSwitcher;

	constructor(screenSwitcher: ScreenSwitcher) {
		super();

		this.screenSwitcher = screenSwitcher;
		this._view = new StartingScreenView();

		/**
		 * Click anywhere to go to HomeScreen and start BGM
		 */
		this._view.getGroup().on("click", () => {
			this.screenSwitcher.switchToScreen({ type: "home" });
		});
	}

	getView(): StartingScreenView {
		return this._view;
	}

	get view() { return this._view; }
}

