import { ScreenController } from "../../../types.ts";
import type { ScreenSwitcher } from "../../../types.ts";
import { AmongUsGameScreenModel } from "./GameScreenModel.ts";
import { AmongUsGameScreenView } from "./GameScreenView.ts";
import { GAME_DURATION } from "../../../constants.ts";

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

	constructor(screenSwitcher: ScreenSwitcher) {
		super();
		this.screenSwitcher = screenSwitcher;

		this.model = new AmongUsGameScreenModel();
		this.view = new AmongUsGameScreenView((option: number) => this.handleClick(option));

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

		this.startTimer();

		this.backgroundSound.loop = true;
		this.backgroundSound.play();

		window.addEventListener("keydown", this.onKeyDown);
		window.addEventListener("keyup", this.onKeyUp);
		this.lastFrameTime = performance.now();
		this.rafId = requestAnimationFrame(this.gameLoop);
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

			const speed = this.model.getPlayerSpeed(); // pixels/sec
			const deltaX = dx * speed * dt;
			const deltaY = dy * speed * dt;

			// update model and view
			this.model.movePlayerBy(deltaX, deltaY);
			const pos = this.model.getPlayerPosition();
			this.view.setRoguePosition(pos.x, pos.y);
		}

		// continue loop
		this.rafId = requestAnimationFrame(this.gameLoop);
	};

	/**
	 * Start the countdown timer
	 */
	private startTimer(): void {
		// TODO: Task 3 - Implement countdown timer using setInterval
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

	/**
	 * Stop the timer
	 */
	private stopTimer(): void {
		// TODO: Task 3 - Stop the timer using clearInterval
		if(!(this.gameTimer == null)) {
			clearInterval(this.gameTimer);
			this.gameTimer = null;
		}
		
		this.backgroundSound.pause();
		this.timerSound.pause();
	}

	/**
	 * Handle click event
	 */
	private handleClick(option: number): void {
		let isCorrect = this.model.puzzleEvaluator(option);
		this.clickSound.play();
		if(isCorrect) {
			this.correctSound.play();
			this.correctSound.currentTime = 0;
			this.model.incrementScore();
			this.view.updateScore(this.model.getScore());

		} else {
			this.wrongSound.play();
			this.wrongSound.currentTime = 0;
		}
		if(this.model.getIsComplete()) {
			this.endGame();
			return;
		} 
		setTimeout(() => {
			this.model.incrementIndex();
			//const currentPuzzle = this.model.getPuzzle();
			//this.view.renderPuzzle(currentPuzzle);
		}, 500);

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
	 * End the game
	 */
	private endGame(): void {
		this.stopTimer();

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
