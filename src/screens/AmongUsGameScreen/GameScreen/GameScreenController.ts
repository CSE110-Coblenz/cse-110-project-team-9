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
	}

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
			const currentPuzzle = this.model.getPuzzle();
			this.view.renderPuzzle(currentPuzzle);
		}, 500);

	}

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
