import { PuzzleModel } from "./_Puzzle/PuzzleModel";

/**
 * AmongUsGameScreenModel - Manages game-level state only
 * Responsible for: game progression (score, puzzle index, completion)
 * NOT responsible for: puzzle evaluation (that's PuzzleModel's job)
 */
export class AmongUsGameScreenModel {
	private score = 0;
	private puzzles: PuzzleModel[] = [];
	
	constructor() {
		this.puzzles = PuzzleModel.createDefaultPuzzles();
	}

	/**
	 * Return the full puzzles array
	 */
	getPuzzles(): PuzzleModel[] {
		return this.puzzles;
	}

	/**
	 * Increment score when a puzzle is solved
	 */
	incrementScore(): void {
		this.score++;
	}
	
	/**
	 * Get current score
	 */
	getScore(): number {
		return this.score;
	}

	/**
	 * Is the game finished?
	 */
	getIsComplete(): boolean {
		// Consider the game complete when all puzzles are solved.
		return this.puzzles.length > 0 && this.puzzles.every(p => p.isSolved());
	}

	/**
	 * Reset game state for a new game
	 */
	reset(): void {
		this.score = 0;
		this.puzzles = PuzzleModel.createDefaultPuzzles();
		// Reset all puzzles
		this.puzzles.forEach(p => p.reset());
	}
}


