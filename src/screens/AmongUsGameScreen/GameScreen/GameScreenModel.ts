import { PuzzleModel } from "./_Puzzle/PuzzleModel.ts";

/**
 * AmongUsGameScreenModel - Manages game-level state only
 * Responsible for: game progression (score, puzzle index, completion)
 * NOT responsible for: puzzle evaluation (that's PuzzleModel's job)
 */
export class AmongUsGameScreenModel {
	private score = 0;
	private index = 0;
	private puzzles: PuzzleModel[] = [];
	
	constructor() {
		this.puzzles = PuzzleModel.createDefaultPuzzles();
	}

	/**
	 * Get the current puzzle
	 * @throws Error if index is out of bounds
	 */
	getPuzzle(): PuzzleModel {
		if (this.index < 0 || this.index >= this.puzzles.length) {
			throw new Error(`Puzzle index ${this.index} out of bounds (puzzles: ${this.puzzles.length})`);
		}
		return this.puzzles[this.index];
	}

	/**
	 * Return the full puzzles array
	 */
	getPuzzles(): PuzzleModel[] {
		return this.puzzles;
	}

	/**
	 * Move to the next puzzle
	 */
	incrementIndex(): void {
		this.index++;
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
		this.index = 0;
		this.puzzles = PuzzleModel.createDefaultPuzzles();
		// Reset all puzzles
		this.puzzles.forEach(p => p.reset());
	}
}


