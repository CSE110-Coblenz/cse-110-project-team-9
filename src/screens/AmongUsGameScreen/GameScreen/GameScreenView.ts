import Konva from "konva";
import type { View } from "../../../types.ts";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../../constants.ts";
import { Obstacle } from "./_Entity/EntityObstacle.ts";
import { PuzzleModel } from "./_Puzzle/PuzzleModel.ts";
import { PlayerSprite } from "./_Entity/EntityPlayer.ts";

/**
 * GameScreenView - Renders the game UI using Konva
 */
export class AmongUsGameScreenView implements View {
	private group: Konva.Group;
	private scoreText: Konva.Text;
	private timerText: Konva.Text;
	private questionText: Konva.Text;
	private feedbackText: Konva.Text;
	private optionButtons: Konva.Group[] = [];
	private onOptionClick: (optionIndex: number) => void;
	private onObstacleClick?: (p: PuzzleModel | null) => void;
	private player?: PlayerSprite;
	private obstacles: Obstacle[] = [];


	constructor(onOptionClick: (optionIndex: number) => void, onObstacleClick?: (p: PuzzleModel | null) => void) {
		this.group = new Konva.Group({ visible: false });
		this.onOptionClick = onOptionClick;
		this.onObstacleClick = onObstacleClick;

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



		// Obstacles are created by the controller via addObstacle()

		this.scoreText = new Konva.Text({
			x: 20,
			y: 20,
			text: "Score: 0",
			fontSize: 32,
			fontFamily: "Serif",
			fill: "white",
		});
		this.group.add(this.scoreText);

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

		this.feedbackText = new Konva.Text({
			x: STAGE_WIDTH / 2,
			y: STAGE_HEIGHT / 2,
			text: "",
			fontSize: 48,
			fontFamily: "Serif",
			fill: "white",
			align: "center",
			visible: false,
		});
		this.feedbackText.offsetX(this.feedbackText.width() / 2);
		this.group.add(this.feedbackText);
		this.feedbackText.moveToTop();

		// create player sprite and attach when ready
		this.player = new PlayerSprite(this.group, STAGE_WIDTH / 2, STAGE_HEIGHT / 2, { scale: 2, frameRate: 8, onReady: () => {
			this.group.getLayer()?.draw();
		}});
	}

	/**
	 * Create an obstacle and add it to the view. Returns the created Obstacle.
	 */
	addObstacle(id: number, x: number, y: number, puzzle: PuzzleModel | null): import("./_Entity/EntityObstacle.ts").Obstacle {
		const ob = new Obstacle(id, x, y, puzzle, this.group, (p) => {
			if (this.onObstacleClick) this.onObstacleClick(p);
		});
		this.obstacles.push(ob);
		// Bring player to front so it renders above obstacles
		if (this.player) {
			this.player.moveToTop();
		}
		return ob;
	}

	setRoguePosition(x: number, y: number): void {
		if (!this.player) return;
		this.player.setPosition(x, y);
	}

	moveRogueBy(dx: number, dy: number): void {
		if (!this.player) return;
		this.player.moveBy(dx, dy);
		// set animation state
		this.player.setMoving(dx !== 0 || dy !== 0);
		if (dx !== 0) this.player.setDirection(dx < 0);
	}

	getRoguePosition(): { x: number; y: number } | null {
		if (!this.player) return null;
		return this.player.getPosition();
	}

	setRogueMoving(isMoving: boolean): void {
		if (!this.player) return;
		this.player.setMoving(isMoving);
	}

	setRogueDirection(facingLeft: boolean): void {
		if (!this.player) return;
		this.player.setDirection(facingLeft);
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

	/**
	 * Get the Konva group
	 */
	getGroup(): Konva.Group {
		return this.group;
	}

	/**
	 * Hide the puzzle and show feedback
	 */
	hidePuzzle(feedback: string): void {
		// Hide question and options
		this.questionText.visible(false);
		this.optionButtons.forEach((btn) => btn.visible(false));

		// Show feedback
		this.feedbackText.text(feedback);
		this.feedbackText.offsetX(this.feedbackText.width() / 2);
		this.feedbackText.moveToTop();
		this.feedbackText.visible(true);

		this.group.getLayer()?.draw();

		// Auto-hide feedback after 1.5 seconds
		setTimeout(() => {
			this.feedbackText.visible(false);
			this.questionText.visible(true);
			this.optionButtons.forEach((btn) => btn.visible(true));
			this.group.getLayer()?.draw();
		}, 1500);
	}
}