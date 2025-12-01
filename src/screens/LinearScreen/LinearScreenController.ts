import { ScreenController, ScreenSwitcher } from "../../types";
import { LinearScreenView } from "./LinearScreenView";
import { WizardGameScreenController } from "../WizardGameScreen/WizardGameScreenController";

export class LinearScreenController extends ScreenController{
	private view: LinearScreenView;

	constructor(
		private screenswitcher: ScreenSwitcher, 
		private parentGameController: WizardGameScreenController
	) {
		super(); //to get screen controller parent class features
		this.view = new LinearScreenView();
		this.screenswitcher = screenswitcher;

		this.view.setOnSubmit((isCorrect) => {
			if (!isCorrect) {
				return;
			}

			this.view.hide();
			this.parentGameController.handleMathQuestionAnswered(true);
		});
	}

	getView(): LinearScreenView {
		return this.view;
	}

	hide(): void {
		this.view.hide();    
	}
}