import Konva from "konva";
import type { View } from "../../../types";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../../constants";

/**
 * MenuScreenView - Renders the menu/instruction screen
 */
export class AmongUsMenuScreenView implements View {
	private group: Konva.Group;

	constructor(onStartClick: () => void) {
		this.group = new Konva.Group({ visible: true });

		// Background Image
		Konva.Image.fromURL(`${import.meta.env.BASE_URL}AmongUsMiniGame/Background/terrace.png`, (background) => {
			background.width(STAGE_WIDTH);
			background.height(STAGE_HEIGHT);
			background.x(0);
			background.y(0);
			this.group.add(background);
			background.moveToBottom();
			this.group.getLayer()?.draw();
		});

		// Semi-transparent overlay for readability
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
			fillLinearGradientColorStops: [0, "rgba(0,20,40,0.85)", 1, "rgba(40,0,40,0.85)"],
		});
		this.group.add(overlay);

		// Title text
		const title = new Konva.Text({
			x: STAGE_WIDTH / 2,
			y: 40,
			text: "The Mechanism",
			fontSize: 42,
			fontFamily: "HomeScreenFont",
			fill: "#ffffff",
			stroke: "black",
			strokeWidth: 1,
			align: "center",
		});
		title.offsetX(title.width() / 2);
		this.group.add(title);

		// Subtitle
		const subtitle = new Konva.Text({
			x: STAGE_WIDTH / 2,
			y: 95,
			text: "Quadratic Equation Matching",
			fontSize: 20,
			fontFamily: "HomeScreenFont",
			fill: "white",
			align: "center",
		});
		subtitle.offsetX(subtitle.width() / 2);
		this.group.add(subtitle);

		// Instructions panel background
		const instructionBox = new Konva.Rect({
			x: STAGE_WIDTH / 2 - 300,
			y: 135,
			width: 600,
			height: 320,
			fill: "rgba(255, 255, 255, 1)",
			cornerRadius: 15,
			stroke: "black",
			strokeWidth: 1,
		});
		this.group.add(instructionBox);

		// Instructions title
		const instructionsTitle = new Konva.Text({
			x: STAGE_WIDTH / 2,
			y: 155,
			text: "HOW TO PLAY",
			fontSize: 24,
			fontFamily: "HomeScreenFont",
			fontStyle: "bold",
			fill: "black",
			align: "center",
		});
		instructionsTitle.offsetX(instructionsTitle.width() / 2);
		this.group.add(instructionsTitle);

		// Instructions content
		const instructions = [
			"• Use WASD keys to move your character around the map",
			"• Click on rotating obstacles to open puzzle challenges",
			"• Each puzzle shows quadratic equations on the LEFT",
			"• Match each equation to its correct roots on the RIGHT",
			"• Click a left point, then a right point to draw a line",
			"• Click points again to change your connections",
			"• Submit when all equations are matched correctly",
			"• Solve all 3 puzzles before time runs out!"
		];

		instructions.forEach((text, index) => {
			const line = new Konva.Text({
				x: STAGE_WIDTH / 2 - 280,
				y: 195 + index * 30,
				text: text,
				fontSize: 16,
				fontFamily: "HomeScreenFont",
				fill: "black",
				lineHeight: 1.4,
			});
			this.group.add(line);
		});

		// Start button group
		const startButtonGroup = new Konva.Group({
			x: STAGE_WIDTH / 2,
			y: STAGE_HEIGHT - 55,
		});

		// Rectangle
		const startButton = new Konva.Rect({
			x: 0,
			y: 0,
			width: 200,
			height: 40,
			fill: "white",
			cornerRadius: 12,
			shadowBlur: 10,
			shadowColor: "rgba(0, 0, 255, 0.5)",
		});

		// Center the rect by offset
		startButton.offsetX(startButton.width() / 2);

		// Button text
		const startText = new Konva.Text({
			x: 0,
			y: startButton.height() / 2,
			text: "START",
			fontSize: 20,
			fontFamily: "HomeScreenFont",
			fontStyle: "bold",
			fill: "black",
		});

		// Center the text horizontally
		startText.offsetX(startText.width() / 2 + 5);

		// Center the text vertically
		startText.offsetY(startText.height() / 2);

		// Add to group
		startButtonGroup.add(startButton);
		startButtonGroup.add(startText);

		startButtonGroup.on("click tap", onStartClick);
		
		// Hover effect
		startButtonGroup.on("mouseenter", () => {
			startButton.fill("#5de147");
			startButton.shadowBlur(15);
			document.body.style.cursor = "pointer";
			this.group.getLayer()?.draw();
		});
		startButtonGroup.on("mouseleave", () => {
			startButton.fill("#4cd137");
			startButton.shadowBlur(10);
			document.body.style.cursor = "default";
			this.group.getLayer()?.draw();
		});
		
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