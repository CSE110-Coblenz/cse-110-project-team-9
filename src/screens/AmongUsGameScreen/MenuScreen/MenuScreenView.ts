import Konva from "konva";
import type { View } from "../../../types.ts";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../../constants.ts";

/**
 * MenuScreenView - Renders the menu screen
 */
export class AmongUsMenuScreenView implements View {
	private group: Konva.Group;

	constructor(onStartClick: () => void) {
		this.group = new Konva.Group({ visible: true });

		//Background Image
		Konva.Image.fromURL("AmongUsMiniGame/Background/1/terrace.png", (background) => {
			background.width(STAGE_WIDTH);
			background.height(STAGE_HEIGHT);
			background.x(0);
			background.y(0);
			this.group.add(background);
			background.moveToBottom();
			this.group.getLayer()?.draw();
		});

		const overlay = new Konva.Rect({
			x: 0,
			y: 0,
			width: STAGE_WIDTH,
			height: STAGE_HEIGHT,
			fillLinearGradientStartPoint: { 
				x: 0, y: 0 
			},
			fillLinearGradientEndPoint: { 
				x: 0, y: STAGE_HEIGHT 
			},
			fillLinearGradientColorStops: [0, "rgba(0,155,255,0.7)", 1, "rgba(100,0,100,0.5)"],
		});
		this.group.add(overlay);
		overlay.moveToTop();

		// Title text
		const title = new Konva.Text({
			x: STAGE_WIDTH / 2,
			y: 175,
			text: "The Mechanism",
			fontSize: 48,
			fontFamily: "Serif",
			fill: "white",
			stroke: "purple",
			strokeWidth: 1,
			align: "center",
		});
		// Center the text using offsetX
		title.offsetX(title.width() / 2);
		this.group.add(title);

		const startButtonGroup = new Konva.Group();
		const startButton = new Konva.Rect({
			x: STAGE_WIDTH / 2 - 100,
			y: 300,
			width: 200,
			height: 60,
			fill: "black",
			cornerRadius: 10,
			stroke: "purple",
			strokeWidth: 3,
		});
		const startText = new Konva.Text({
			x: STAGE_WIDTH / 2,
			y: 315,
			text: "START",
			fontSize: 24,
			fontFamily: "Serif",
			fill: "purple",
			align: "center",
		});
		startText.offsetX(startText.width() / 2);
		startButtonGroup.add(startButton);
		startButtonGroup.add(startText);
		startButtonGroup.on("click", onStartClick);
		this.group.add(startButtonGroup);
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
