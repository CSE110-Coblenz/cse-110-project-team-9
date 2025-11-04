import { ScreenController } from "../../../types.ts";
import type { ScreenSwitcher } from "../../../types.ts";
import { AmongUsMenuScreenView } from "./MenuScreenView.ts";

/**
 * MenuScreenController - Handles menu interactions
 */
export class AmongUsMenuScreenController extends ScreenController {
	private view: AmongUsMenuScreenView;
	private screenSwitcher: ScreenSwitcher;

	constructor(screenSwitcher: ScreenSwitcher) {
		super();
		this.screenSwitcher = screenSwitcher;
		this.view = new AmongUsMenuScreenView(() => this.handleStartClick());
	}

	/**
	 * Handle start button click
	 */
	private handleStartClick(): void {
		// TODO: Task 1 - Implement screen transition from menu to game
		this.screenSwitcher.switchToScreen({type : "game"});
	}

	/**
	 * Get the view
	 */
	getView(): AmongUsMenuScreenView {
		return this.view;
	}
}
