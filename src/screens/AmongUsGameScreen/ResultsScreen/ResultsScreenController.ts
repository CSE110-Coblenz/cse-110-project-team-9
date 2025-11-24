import { ScreenController } from "../../../types";
import type { ScreenSwitcher } from "../../../types";
import { AmongUsResultsScreenModel } from "./ResultsScreenModel";
import { AmongUsResultsScreenView } from "./ResultsScreenView";

/**
 * ResultsScreenController - Handles results screen logic
 */
export class AmongUsResultsScreenController extends ScreenController {
	private model: AmongUsResultsScreenModel;
	private view: AmongUsResultsScreenView;
	private screenSwitcher: ScreenSwitcher;

	constructor(screenSwitcher: ScreenSwitcher) {
		super();
		this.screenSwitcher = screenSwitcher;

		this.model = new AmongUsResultsScreenModel();
		this.view = new AmongUsResultsScreenView(
			() => this.handlePlayAgain(),
			() => this.handleReturnToMainGame()
		);
	}

	/**
	 * Show results screen with the final score
	 */
	showResults(score: number): void {
		this.model.setFinalScore(score);
		this.view.displayResults(score);
		this.view.show();
	}

	/**
	 * Handle "Play Again" button click
	 */
	private handlePlayAgain(): void {
		// Restart the Among Us minigame
		this.screenSwitcher.switchToScreen({ type: "amongUsGame" });
	}

	/**
	 * Handle "Return to Main Game" button click
	 */
	private handleReturnToMainGame(): void {
		// Return to the main game board
		// Note: You might want to pass the score back to MainGameController here
		this.screenSwitcher.switchToScreen({ type: "mainGame" });
	}

	/**
	 * Get the view
	 */
	getView(): AmongUsResultsScreenView {
		return this.view;
	}
}