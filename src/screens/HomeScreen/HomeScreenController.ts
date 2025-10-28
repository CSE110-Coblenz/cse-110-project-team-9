import { HomeScreenView } from "./HomeScreenViewer";
import { ScreenController, ScreenSwitcher } from "../../types";

export class HomeScreenController extends ScreenController {
	private view: HomeScreenView;
	private screenSwitcher: ScreenSwitcher;

	constructor(screenSwitcher: ScreenSwitcher) {
		super();
		this.screenSwitcher = screenSwitcher;

        this.view = new HomeScreenView();
	}

	getView(): HomeScreenView {
		return this.view;
	}
}