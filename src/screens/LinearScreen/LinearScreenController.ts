import { ScreenController, ScreenSwitcher } from "../../types";
import { LinearScreenView } from "./LinearScreenView";


export class LinearScreenController extends ScreenController{
	private view: LinearScreenView;
	private screenswitcher: ScreenSwitcher;

	constructor(screenswitcher: ScreenSwitcher) {
		super(); //to get screen controller parent class features
		this.view = new LinearScreenView();
		this.screenswitcher = screenswitcher;
	}

	getView(): LinearScreenView {
		return this.view;
	}


}
