import Konva from "konva";
import type { View } from "../../types";
import { STAGE_WIDTH } from "../../constants";

export class HomeScreenView implements View {
	private group: Konva.Group;

	constructor() {
		this.group = new Konva.Group({ visible: true });

		// Title

        // Navbar
	}

	/**
	 * Show the screen
	 */
	show(): void {
		this.group.visible(true);
		this.group.getLayer()?.draw();
	}

	/**
	 * Hide the screen
	 */
	hide(): void {
		this.group.visible(false);
		this.group.getLayer()?.draw();
	}

	getGroup(): Konva.Group {
		return this.group;
	}
}