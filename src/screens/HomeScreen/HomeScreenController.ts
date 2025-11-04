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

		this.view.getStartButton().on("click", () => {
			alert("Game Started!");
		});
	}

	getView(): HomeScreenView {
		return this.view;
	}
}