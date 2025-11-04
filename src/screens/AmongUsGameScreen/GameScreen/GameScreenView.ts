import Konva from "konva";
import type { View } from "../../../types.ts";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../../constants.ts";

/**
 * GameScreenView - Renders the game UI using Konva
 */
export class AmongUsGameScreenView implements View {
	private group: Konva.Group;
	private Image: Konva.Image | Konva.Circle | null = null;
	private scoreText: Konva.Text;
	private timerText: Konva.Text;
	private questionText: Konva.Text;
	private optionButtons: Konva.Group[] = [];
	private onOptionClick: (optionIndex: number) => void;

	constructor(onOptionClick: (optionIndex: number) => void) {
		this.group = new Konva.Group({ visible: false });
		this.onOptionClick = onOptionClick;

		// Background
		Konva.Image.fromURL("AmongUsMiniGame/Background/1/terrace.png", (background) => {
			background.width(STAGE_WIDTH);
			background.height(STAGE_HEIGHT);
			background.x(0);
			background.y(0);
			this.group.add(background);
			background.moveToBottom();
			this.group.getLayer()?.draw();
		});

		// Score display (top-left)
		this.scoreText = new Konva.Text({
			x: 20,
			y: 20,
			text: "Score: 0",
			fontSize: 32,
			fontFamily: "Serif",
			fill: "white",
		});
		this.group.add(this.scoreText);

		// Timer display (top-right)
		this.timerText = new Konva.Text({
			x: STAGE_WIDTH - 150,
			y: 20,
			text: "Time: 60",
			fontSize: 32,
			fontFamily: "Serif",
			fill: "red",
		});
		this.group.add(this.timerText);

		this.questionText = new Konva.Text({
			x: 0,
			y: STAGE_HEIGHT / 1.1,
			text: "		x + y = ?",
			fontSize: 32,
			fontFamily: "Serif",
			fill: "red",
			align: "left",
			width: STAGE_WIDTH,
		});
		this.group.add(this.questionText);

		Konva.Image.fromURL("AmongUsMiniGame/Sprites/Rogue/Idle/idle1.png", (image) => {
			image.x(STAGE_WIDTH / 2 + 50);
			image.y(STAGE_HEIGHT / 2);
			this.Image = image;
			this.group.add(this.Image);
			this.group.getLayer()?.draw();
		});

		Konva.Image.fromURL("AmongUsMiniGame/Sprites/Knight/Idle/idle1.png", (image) => {
			image.x(STAGE_WIDTH / 2 - 50);
			image.y(STAGE_HEIGHT / 2);

			this.Image = image;
			this.group.add(this.Image);
			this.group.getLayer()?.draw();
		});
	}

	/**
	 * Render a puzzle question and options
	 */
	renderPuzzle(puzzle: { question: string; options: string[] }): void {
		// Update question
		this.questionText.text(puzzle.question);

		// Clear old options
		this.optionButtons.forEach((btn) => btn.destroy());
		this.optionButtons = [];

		const startY = 300;
		const buttonSpacing = 80;

		// Create option buttons
		puzzle.options.forEach((optionText, index) => {
			const buttonGroup = new Konva.Group();

			const buttonRect = new Konva.Rect({
				x: STAGE_WIDTH / 2 - 150,
				y: startY + index * buttonSpacing,
				width: 300,
				height: 50,
				fill: "black",
				stroke: "purple",
				strokeWidth: 2,
				cornerRadius: 10,
			});

			const buttonLabel = new Konva.Text({
				x: STAGE_WIDTH / 2,
				y: startY + index * buttonSpacing + 12,
				text: optionText,
				fontSize: 20,
				fontFamily: "Serif",
				fill: "white",
				align: "center",
			});
			buttonLabel.offsetX(buttonLabel.width() / 2);

			buttonGroup.add(buttonRect);
			buttonGroup.add(buttonLabel);
			buttonGroup.on("click", () => this.onOptionClick(index));

			this.group.add(buttonGroup);
			this.optionButtons.push(buttonGroup);
		});

		this.group.getLayer()?.draw();
	}

	/**
	 * Update score display
	 */
	updateScore(score: number): void {
		this.scoreText.text(`Score: ${score}`);
		this.group.getLayer()?.draw();
	}

	/**
	 * Update timer display
	 */
	updateTimer(timeRemaining: number): void {
		this.timerText.text(`Time: ${timeRemaining}`);
		this.group.getLayer()?.draw();
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
