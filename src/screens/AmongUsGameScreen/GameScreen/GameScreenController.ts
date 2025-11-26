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
	private timeRemaining: number = GAME_DURATION;

	// The puzzle currently opened by the player (via clicking an obstacle)
	private currentOpenPuzzle: PuzzleModel | null = null;

	// Track the nearest unsolved obstacle for E-key interaction
	private nearbyObstacle: PuzzleModel | null = null;
	private static readonly INTERACTION_DISTANCE = 100;
	private static readonly TIME_PENALTY_WRONG = 10;

	private keysDown = new Set<string>();
	private rafId: number | null = null;
	private lastFrameTime = 0;

	private static readonly PLAYER_SPEED = 45;

	constructor(screenSwitcher: ScreenSwitcher, audio: AudioController) {
		super();
		this.screenSwitcher = screenSwitcher;

		this.model = new AmongUsGameScreenModel();
		// Updated: pass handleMatchingSubmit callback
		this.view = new AmongUsGameScreenView(
			(matches: Map<number, number>) => this.handleMatchingSubmit(matches)
		);

		this.audio = audio;

		audio.registerSound("background_music", `${import.meta.env.BASE_URL}AmongUsMiniGame/Audio/background-music.mp3`);
		audio.registerSound("timer_beep", `${import.meta.env.BASE_URL}AmongUsMiniGame/Audio/timer-beep.wav`);
		audio.registerSound("correct_answer", `${import.meta.env.BASE_URL}AmongUsMiniGame/Audio/correct-answer.mp3`);
		audio.registerSound("wrong_answer", `${import.meta.env.BASE_URL}AmongUsMiniGame/Audio/wrong-answer.mp3`);
		audio.registerSound("click_sound", `${import.meta.env.BASE_URL}AmongUsMiniGame/Audio/click-sound.wav`);
	}

	/**
	 * Start the game
	 */
	startGame(): void {
		this.model.reset();
		this.timeRemaining = GAME_DURATION;
		
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
			const y = STAGE_HEIGHT / 1.25;
			this.view.addObstacle(idx + 1, x, y, p);
		});

		this.startTimer();

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
		let timerId = setInterval(() => {
			this.timeRemaining = this.timeRemaining - 1;
			this.view.updateTimer(this.timeRemaining);		
			if(this.timeRemaining <= 0) {
				this.endGame();
			}
		}, 1000);
		this.gameTimer = timerId;

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

		// Check for nearby obstacles
		const playerPos = this.view.getRoguePosition();
		if (playerPos) {
			this.updateNearbyObstacle(playerPos);
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
		
		// Step 1: Play attack animation for 1 second
		this.view.playPlayerAttack();
		
		// Step 2: After 1 second, show feedback
		setTimeout(() => {
			const feedbackMessage = isCorrect ? "Correct!" : "Wrong!";
			this.view.hidePuzzle(feedbackMessage);

			if (isCorrect) {
				this.audio.play("correct_answer");
				this.view.markObstacleSolved(puzzle);
				this.model.incrementScore();

				this.view.setObstaclesInteractive(false);
				setTimeout(() => {
					this.view.resetPlayerToIdle();
					this.view.setObstaclesInteractive(true);
					this.currentOpenPuzzle = null; // Clear after feedback
				}, 1500);
			} else {
				// Play hurt and explode animations simultaneously
				this.view.playPlayerHurt();
				this.view.playObstacleExplode(puzzle);
				this.audio.play("wrong_answer");

				// Apply time penalty for wrong answer
				this.timeRemaining -= AmongUsGameScreenController.TIME_PENALTY_WRONG;
				if (this.timeRemaining < 0) {
					this.timeRemaining = 0;
				}
				this.view.updateTimer(this.timeRemaining);

				this.view.setObstaclesInteractive(false);
				setTimeout(() => {
					this.view.setObstaclesInteractive(true);
				}, 1500);	

				// Re-open the same puzzle after feedback
				setTimeout(() => {
					if (this.currentOpenPuzzle) {
						this.view.resetPlayerToIdle();
						const question = this.currentOpenPuzzle.getQuestion();
						const options = this.currentOpenPuzzle.getOptions().map(o => String(o));
						this.view.renderPuzzle({ question, options });
					}
				}, 1500);
			}

			if (this.model.getIsComplete()) {
				setTimeout(() => this.endGame(), 1500);
			}
		}, 1000);
	}

	private onKeyDown = (e: KeyboardEvent) => {
		const key = e.key.toLowerCase();
		if (["w","a","s","d"].includes(key)) {
			e.preventDefault();
			this.keysDown.add(key);
		}
		if (key === "e") {
			e.preventDefault();
			this.handleEKeyPressed();
		}
	};

	/**
	 * Handle E key press to interact with nearby obstacle
	 */
	private handleEKeyPressed(): void {
		if (!this.nearbyObstacle) return;
		
		// Allow switching to a different puzzle even if one is already open
		// Only prevent if trying to open the same puzzle again
		if (this.currentOpenPuzzle === this.nearbyObstacle) return;
		
		this.audio.play("click_sound");
		this.currentOpenPuzzle = this.nearbyObstacle;
		
		// Play access animation first
		this.view.playPlayerAccess();
		
		// After access animation completes (16 frames at 12 fps ≈ 1333ms), show the puzzle
		setTimeout(() => {
			const question = this.nearbyObstacle!.getQuestion();
			const options = this.nearbyObstacle!.getOptions().map(o => String(o));
			this.view.renderPuzzle({ question, options });
			this.view.resetPlayerToIdle();
		}, 1500);
	}

	/**
	 * Update which obstacle the player is near (if any)
	 */
	private updateNearbyObstacle(playerPos: { x: number; y: number }): void {
		this.nearbyObstacle = this.view.getNearestNearbyObstacle(playerPos, AmongUsGameScreenController.INTERACTION_DISTANCE);
		this.view.setNearbyObstacleHint(this.nearbyObstacle !== null);
	}

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