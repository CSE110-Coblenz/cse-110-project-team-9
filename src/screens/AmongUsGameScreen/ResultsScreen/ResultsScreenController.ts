import { ScreenController } from "../../../types.ts";
import type { ScreenSwitcher } from "../../../types.ts";
import {
	AmongUsResultsScreenModel,
	type LeaderboardEntry,
} from "./ResultsScreenModel.ts";
import { AmongUsResultsScreenView } from "./ResultsScreenView.ts";

const LEADERBOARD_KEY = "lemonClickerLeaderboard";
const MAX_LEADERBOARD_ENTRIES = 5;

/**
 * ResultsScreenController - Handles results screen interactions
 */
export class AmongUsResultsScreenController extends ScreenController {
	private model: AmongUsResultsScreenModel;
	private view: AmongUsResultsScreenView;
	private screenSwitcher: ScreenSwitcher;

	private gameOverSound: HTMLAudioElement;

	constructor(screenSwitcher: ScreenSwitcher) {
		super();
		this.screenSwitcher = screenSwitcher;
		this.model = new AmongUsResultsScreenModel();
		this.view = new AmongUsResultsScreenView(() => this.handlePlayAgainClick());

		// TODO: Task 4 - Initialize game over sound audio
		this.gameOverSound = new Audio("AmongUsMiniGame/Audio/gameover.mp3"); // Placeholder
	}

	/**
	 * Show results screen with final score
	 */
	showResults(finalScore: number): void {
		this.model.setFinalScore(finalScore);
		this.view.updateFinalScore(finalScore);

		// Load and update leaderboard
		const entries = this.loadLeaderboard();
		entries.push({
			score: finalScore,
			timestamp: new Date().toLocaleString(),
		});
		entries.sort((a, b) => b.score - a.score); // Sort descending
		const top5 = entries.slice(0, MAX_LEADERBOARD_ENTRIES); // Keep top 5
		this.saveLeaderboard(top5);
		this.model.setLeaderboard(top5);
		this.view.updateLeaderboard(top5);

		this.view.show();

		// TODO: Task 4 - Play the game over sound
		this.gameOverSound.play();
		this.gameOverSound.currentTime = 0;
	}

	/**
	 * Load leaderboard from localStorage
	 */
	private loadLeaderboard(): LeaderboardEntry[] {
		// TODO: Task 5 - Load leaderboard from localStorage
		let leaderboard = localStorage.getItem(LEADERBOARD_KEY);
		if(leaderboard === null) {
			return [];
		}
		let sLeaderBoard = JSON.parse(leaderboard) as LeaderboardEntry[];
		return sLeaderBoard;
	}

	/**
	 * Save leaderboard to localStorage
	 */
	private saveLeaderboard(entries: LeaderboardEntry[]): void {
		// TODO: Task 5 - Save leaderboard to localStorage
		let jsonString = JSON.stringify(entries);
		localStorage.setItem(LEADERBOARD_KEY, jsonString);
	}

	/**
	 * Handle play again button click
	 */
	private handlePlayAgainClick(): void {
		this.screenSwitcher.switchToScreen({ type: "menu" });
	}

	/**
	 * Get the view
	 */
	getView(): AmongUsResultsScreenView {
		return this.view;
	}
}
