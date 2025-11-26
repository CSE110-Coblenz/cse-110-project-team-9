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
		Konva.Image.fromURL(`${import.meta.env.BASE_URL}AmongUsMiniGame/Background/background.webp`, (background) => {
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
			fillLinearGradientColorStops: [0, "rgba(89, 89, 89, 0.85)", 1, "rgba(75, 75, 75, 0.85)"],
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
			height: 400,
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
			"• Wizard, you’ve stepped onto volatile ground.",
			"• The enchanted spell mines pulse with unstable magic.",
			"• Move — Use your W / A / S / D keys to glide across the terrain.",
			"• Each puzzle shows quadratic equations on the LEFT",
			"• Interact — When standing close to a spell mine, press E to begin disarment.",
			"• To neutralize a mine:",
			"• Click a runic equation on the left panel.",
			"• Then click its matching set of roots on the right panel",
			"• If your pairing is correct, the sigil dims and the mine stabilizes.",
			"• If incorrect, the energies will flare—losing precious time!",
			"• Defuse all mines before the countdown ends."
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