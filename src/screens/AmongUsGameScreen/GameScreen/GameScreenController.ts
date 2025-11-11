import { ScreenController } from "../../../types.ts";
import type { ScreenSwitcher } from "../../../types.ts";
import { AmongUsGameScreenModel } from "./GameScreenModel.ts";
import { AmongUsGameScreenView } from "./GameScreenView.ts";
import { PuzzleModel } from "./_Puzzle/PuzzleModel.ts";
import { GAME_DURATION, STAGE_WIDTH, STAGE_HEIGHT } from "../../../constants.ts";

/**
 * GameScreenController - Coordinates game logic between Model and View
 */
export class AmongUsGameScreenController extends ScreenController {
	private model: AmongUsGameScreenModel;
	private view: AmongUsGameScreenView;
	private screenSwitcher: ScreenSwitcher;
	private gameTimer: number | null = null;

	private backgroundSound: HTMLAudioElement;
	private timerSound: HTMLAudioElement;
	private correctSound: HTMLAudioElement;
	private wrongSound: HTMLAudioElement;
	private	clickSound: HTMLAudioElement;

	private keysDown = new Set<string>();
	private rafId: number | null = null;
	private lastFrameTime = 0;

	private static readonly PLAYER_SPEED = 45;

	constructor(screenSwitcher: ScreenSwitcher) {
		super();
		this.screenSwitcher = screenSwitcher;

		this.model = new AmongUsGameScreenModel();
	this.view = new AmongUsGameScreenView((option: number) => this.handleClick(option), (puzzle) => this.handleObstacleClick(puzzle));

		this.backgroundSound = new Audio("AmongUsMiniGame/Audio/background-music.mp3");
		this.timerSound = new Audio("AmongUsMiniGame/Audio/timer-beep.mp3");
		this.correctSound = new Audio("AmongUsMiniGame/Audio/correct-answer.mp3");
		this.wrongSound = new Audio("AmongUsMiniGame/Audio/wrong-answer.mp3");
		this.clickSound = new Audio("AmongUsMiniGame/Audio/click-sound.mp3");
	}

	/**
	 * Start the game
	 */
	startGame(): void {
		// Reset model state
		this.model.reset();
		
		// Update view
		this.view.updateScore(this.model.getScore());
		this.view.updateTimer(GAME_DURATION);
		this.view.show();

		// Create obstacles for each puzzle so clicking them opens the puzzle
		const puzzles = this.model.getPuzzles();
		puzzles.forEach((p, idx) => {
			const x = STAGE_WIDTH / 2 - 200 + idx * 200;
			const y = STAGE_HEIGHT / 2;
			this.view.addObstacle(idx + 1, x, y, p);
		});

		this.startTimer();

		this.backgroundSound.loop = true;
		this.backgroundSound.play();

		window.addEventListener("keydown", this.onKeyDown);
		window.addEventListener("keyup", this.onKeyUp);
		this.lastFrameTime = performance.now();
		this.rafId = requestAnimationFrame(this.gameLoop);
	}

	/**
	 * Start the countdown timer
	 */
	private startTimer(): void {
		let timeRemaining = GAME_DURATION;
		let timerId = setInterval(() => {
			timeRemaining = timeRemaining - 1;
			this.view.updateTimer(timeRemaining);		
			if(timeRemaining <= 0) {
				this.endGame();
			}
		}, 1000);
		this.gameTimer = timerId;
		this.timerSound.loop = true;
		this.timerSound.play();
	}

	private stopGameInput(): void {
		window.removeEventListener("keydown", this.onKeyDown);
		window.removeEventListener("keyup", this.onKeyUp);
		if (this.rafId !== null) cancelAnimationFrame(this.rafId);
		this.rafId = null;
	}

	private gameLoop = (now: number) => {
		const dt = (now - this.lastFrameTime) / 1000; // seconds
		this.lastFrameTime = now;

		// calculate movement vector
		let dx = 0, dy = 0;
		if (this.keysDown.has("w")) dy -= 1;
		if (this.keysDown.has("s")) dy += 1;
		if (this.keysDown.has("a")) dx -= 1;
		if (this.keysDown.has("d")) dx += 1;

		if (dx !== 0 || dy !== 0) {
			// normalize diagonal movement
			const len = Math.hypot(dx, dy) || 1;
			dx = dx / len;
			dy = dy / len;

			const deltaX = dx * AmongUsGameScreenController.PLAYER_SPEED * dt;
			const deltaY = dy * AmongUsGameScreenController.PLAYER_SPEED * dt;

			this.view.moveRogueBy(deltaX, deltaY);
		} else {
			this.view.setRogueMoving(false);
		}

		// continue loop
		this.rafId = requestAnimationFrame(this.gameLoop);
	};

	private handleClick(option: number): void {
		// Evaluate the current puzzle using PuzzleModel
		const currentPuzzle = this.model.getPuzzle();
		const isCorrect = currentPuzzle.evaluate(option);
		this.clickSound.play();
		
		const feedbackMessage = isCorrect ? "Correct!" : "Wrong!";
		this.view.hidePuzzle(feedbackMessage);
		
		if(isCorrect) {
			this.correctSound.play();
			this.correctSound.currentTime = 0;
			// Update game progression on correct answer
			this.model.incrementScore();
			this.model.incrementIndex();
			this.view.updateScore(this.model.getScore());
		} else {
			this.wrongSound.play();
			this.wrongSound.currentTime = 0;
		}

		if(this.model.getIsComplete()) {
			setTimeout(() => this.endGame(), 1500);
			return;
		} 
		// Wait before showing next puzzle so user sees feedback
		setTimeout(() => {
			const nextPuzzle = this.model.getPuzzle();
			this.view.renderPuzzle({ 
				question: nextPuzzle.getQuestion(), 
				options: nextPuzzle.getOptions().map(o => String(o)) 
			});
		}, 1500);

	}

	private handleObstacleClick(puzzle: PuzzleModel | null): void {
		if (!puzzle) return;
		const question = puzzle.getQuestion();
		const options = puzzle.getOptions().map(o => String(o));
		this.view.renderPuzzle({ question, options });
	}

	private onKeyDown = (e: KeyboardEvent) => {
		const key = e.key.toLowerCase();
		if (["w","a","s","d"].includes(key)) {
			e.preventDefault();
			this.keysDown.add(key);
		}
	};

	private onKeyUp = (e: KeyboardEvent) => {
		const key = e.key.toLowerCase();
		if (["w","a","s","d"].includes(key)) {
			this.keysDown.delete(key);
		}
	};

	/**
	 * Stop the timer
	 */
	private stopTimer(): void {
		if(!(this.gameTimer == null)) {
			clearInterval(this.gameTimer);
			this.gameTimer = null;
		}
		
		this.backgroundSound.pause();
		this.timerSound.pause();
	}

	/**
	 * End the game
	 */
	private endGame(): void {
		this.stopTimer();
		this.stopGameInput();

		// Switch to results screen with final score
		this.screenSwitcher.switchToScreen({
			type: "result",
			score: this.model.getScore(),
		});
	}

	/**
	 * Get final score
	 */
	getFinalScore(): number {
		return this.model.getScore();
	}

	/**
	 * Get the view group
	 */
	getView(): AmongUsGameScreenView {
		return this.view;
	}
}