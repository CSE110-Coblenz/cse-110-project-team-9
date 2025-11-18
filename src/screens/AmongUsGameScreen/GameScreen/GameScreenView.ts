import Konva from "konva";
import type { View } from "../../../types";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../../constants";
import { Obstacle } from "./_Entity/EntityObstacle";
import { PuzzleModel } from "./_Puzzle/PuzzleModel";
import { PuzzleView } from "./_Puzzle/PuzzleView";
import { PlayerSprite } from "./_Entity/EntityPlayer";

/**
 * GameScreenView - Renders the game UI using Konva
 */
export class AmongUsGameScreenView implements View {
	private group: Konva.Group;
	private scoreText: Konva.Text;
	private timerText: Konva.Text;
	private puzzleView: PuzzleView;
	private onMatchingSubmit: (matches: Map<number, number>) => void;
	private onObstacleClick?: (p: PuzzleModel | null) => void;
	private player?: PlayerSprite;
	private obstacles: Obstacle[] = [];

	constructor(
		onMatchingSubmit: (matches: Map<number, number>) => void, 
		onObstacleClick?: (p: PuzzleModel | null) => void
	) {
		this.group = new Konva.Group({ visible: false });
		this.onMatchingSubmit = onMatchingSubmit;
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

		// Updated: Pass matching submit callback
		this.puzzleView = new PuzzleView(this.group, this.onMatchingSubmit);

		this.player = new PlayerSprite(this.group, STAGE_WIDTH / 2, STAGE_HEIGHT / 2, { 
			scale: 2, 
			frameRate: 8, 
			onReady: () => {
				this.group.getLayer()?.draw();
			}
		});
	}

	/**
	 * Create an obstacle and add it to the view
	 */
	addObstacle(id: number, x: number, y: number, puzzle: PuzzleModel | null): Obstacle {
		const ob = new Obstacle(id, x, y, puzzle, this.group, (p) => {
			if (this.onObstacleClick) this.onObstacleClick(p);
		});
		this.obstacles.push(ob);
		if (this.player) {
			this.player.moveToTop();
		}
		return ob;
	}

	/**
	 * Mark the obstacle as solved
	 */
	markObstacleSolved(puzzle: PuzzleModel): void {
		const ob = this.obstacles.find(o => o.puzzle === puzzle);
		if (!ob) return;
		ob.markSolved();
	}

	setRoguePosition(x: number, y: number): void {
		if (!this.player) return;
		this.player.setPosition(x, y);
	}

	moveRogueBy(dx: number, dy: number): void {
		if (!this.player) return;
		this.player.moveBy(dx, dy);
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
	 * Render the matching puzzle
	 */
	renderPuzzle(puzzle: { question: string; options: string[] }): void {
		this.puzzleView.render(puzzle);
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
		this.puzzleView.hide(feedback);
	}
}