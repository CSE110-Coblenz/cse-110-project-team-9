import { ScreenController } from "../../../types";
import type { ScreenSwitcher } from "../../../types";
import { AmongUsGameScreenModel } from "./GameScreenModel";
import { AmongUsGameScreenView } from "./GameScreenView";
import { PuzzleModel } from "./_Puzzle/PuzzleModel";
import { GAME_DURATION, STAGE_WIDTH, STAGE_HEIGHT } from "../../../constants";
import { AudioController } from "../../../audios/AudioController";

/**
 * GameScreenController - Coordinates game logic between Model and View
 */
export class AmongUsGameScreenController extends ScreenController {
	private model: AmongUsGameScreenModel;
	private view: AmongUsGameScreenView;
	private screenSwitcher: ScreenSwitcher;
	private gameTimer: number | null = null;
	private audio: AudioController;

	// The puzzle currently opened by the player (via clicking an obstacle)
	private currentOpenPuzzle: PuzzleModel | null = null;

	// private backgroundSound: HTMLAudioElement;
	// private timerSound: HTMLAudioElement;
	// private correctSound: HTMLAudioElement;
	// private wrongSound: HTMLAudioElement;
	// private	clickSound: HTMLAudioElement;

	private keysDown = new Set<string>();
	private rafId: number | null = null;
	private lastFrameTime = 0;

	private static readonly PLAYER_SPEED = 45;

	constructor(screenSwitcher: ScreenSwitcher, audio: AudioController) {
		super();
		this.screenSwitcher = screenSwitcher;

		this.model = new AmongUsGameScreenModel();
		// Updated: pass handleMatchingSubmit instead of handleClick
		this.view = new AmongUsGameScreenView(
			(matches: Map<number, number>) => this.handleMatchingSubmit(matches), 
			(puzzle) => this.handleObstacleClick(puzzle)
		);

		this.audio = audio;

		audio.registerSound("background_music", "/AmongUsMiniGame/Audio/background-music.mp3");
		audio.registerSound("timer_beep", "/AmongUsMiniGame/Audio/timer-beep.mp3");
		audio.registerSound("correct_answer", "/AmongUsMiniGame/Audio/correct-answer.mp3");
		audio.registerSound("wrong_answer", "/AmongUsMiniGame/Audio/wrong-answer.mp3");
		audio.registerSound("click_sound", "/AmongUsMiniGame/Audio/click-sound.mp3");

		// this.backgroundSound = new Audio("AmongUsMiniGame/Audio/background-music.mp3");
		// this.timerSound = new Audio("AmongUsMiniGame/Audio/timer-beep.mp3");
		// this.correctSound = new Audio("AmongUsMiniGame/Audio/correct-answer.mp3");
		// this.wrongSound = new Audio("AmongUsMiniGame/Audio/wrong-answer.mp3");
		// this.clickSound = new Audio("AmongUsMiniGame/Audio/click-sound.mp3");
	}

	/**
	 * Start the game
	 */
	startGame(): void {
		this.model.reset();
		
		// Clear any existing obstacles from previous games
		this.view.clearObstacles();
		
		// Reset puzzle view to clear any open puzzles or feedback
		this.view.resetPuzzleView();
		
		// Reset the currently open puzzle
		this.currentOpenPuzzle = null;
		
		this.view.updateScore(this.model.getScore());
		this.view.updateTimer(GAME_DURATION);
		this.view.show();

		const puzzles = this.model.getPuzzles();
		puzzles.forEach((p, idx) => {
			const x = STAGE_WIDTH / 2 - 200 + idx * 200;
			const y = STAGE_HEIGHT / 2;
			this.view.addObstacle(idx + 1, x, y, p);
		});

		this.startTimer();

		// this.backgroundSound.loop = true;
		// this.backgroundSound.play();

		this.audio.play("background_music", true);

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

		// this.timerSound.loop = true;
		// this.timerSound.play();

		this.audio.play("timer_beep", true);
	}

	private stopGameInput(): void {
		window.removeEventListener("keydown", this.onKeyDown);
		window.removeEventListener("keyup", this.onKeyUp);
		if (this.rafId !== null) cancelAnimationFrame(this.rafId);
		this.rafId = null;
	}

	private gameLoop = (now: number) => {
		const dt = (now - this.lastFrameTime) / 1000;
		this.lastFrameTime = now;

		let dx = 0, dy = 0;
		if (this.keysDown.has("w")) dy -= 1;
		if (this.keysDown.has("s")) dy += 1;
		if (this.keysDown.has("a")) dx -= 1;
		if (this.keysDown.has("d")) dx += 1;

		if (dx !== 0 || dy !== 0) {
			const len = Math.hypot(dx, dy) || 1;
			dx = dx / len;
			dy = dy / len;

			const deltaX = dx * AmongUsGameScreenController.PLAYER_SPEED * dt;
			const deltaY = dy * AmongUsGameScreenController.PLAYER_SPEED * dt;

			this.view.moveRogueBy(deltaX, deltaY);
		} else {
			this.view.setRogueMoving(false);
		}

		this.rafId = requestAnimationFrame(this.gameLoop);
	};

	/**
	 * Handle matching puzzle submission
	 * @param matches - Map of left index to right index (user's matches)
	 */
	private handleMatchingSubmit(matches: Map<number, number>): void {
		if (!this.currentOpenPuzzle) return;

		const puzzle = this.currentOpenPuzzle;
		const isCorrect = puzzle.evaluateMatching(matches);

		this.audio.play("click_sound");
		// this.clickSound.play();

		const feedbackMessage = isCorrect ? "Correct!" : "Wrong!";
		this.view.hidePuzzle(feedbackMessage);

		if (isCorrect) {
			// this.correctSound.play();
			// this.correctSound.currentTime = 0;
			this.audio.play("correct_answer");

			this.view.markObstacleSolved(puzzle);
			this.model.incrementScore();
			this.view.updateScore(this.model.getScore());
		} else {
			// this.wrongSound.play();
			// this.wrongSound.currentTime = 0;
			this.audio.play("wrong_answer");

			// Re-open the same puzzle after feedback (1.5s delay matches feedback timeout)
			setTimeout(() => {
				if (this.currentOpenPuzzle) {
					const question = this.currentOpenPuzzle.getQuestion();
					const options = this.currentOpenPuzzle.getOptions().map(o => String(o));
					this.view.renderPuzzle({ question, options });
				}
			}, 1500);
		}

		if (this.model.getIsComplete()) {
			setTimeout(() => this.endGame(), 1500);
		}
	}

	private handleObstacleClick(puzzle: PuzzleModel | null): void {
		if (!puzzle) return;
		this.currentOpenPuzzle = puzzle;
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
		
		// this.backgroundSound.pause();
		// this.timerSound.pause();
		this.audio.stop("background_music");
		this.audio.stop("timer_beep");
	}

	/**
	 * End the game
	 */
	private endGame(): void {
		this.stopTimer();
		this.stopGameInput();

		this.screenSwitcher.switchToScreen({
			type: "amongUsResult",
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