import { PuzzleModel } from "./_Puzzle/PuzzleModel.ts";

/**
 * GameScreenModel - Manages game state
 */
export class AmongUsGameScreenModel {
	private score = 0;
	private isComplete = false;
	private index = 0;
	private size = 3;
	private puzzles: PuzzleModel[] = [];
	
	constructor() {
		this.puzzleGenerator();
	}
	puzzleGenerator() : void {
		this.puzzles = [
			new PuzzleModel({ id: 1, question: "Balance the mechanism: 1 + 1 = ?", options: [2, 3, 4], correctIndex: 0 }),
			new PuzzleModel({ id: 2, question: "Adjust the gears: 2 x 5 = ?", options: [10, 11, 12], correctIndex: 0 }),
			new PuzzleModel({ id: 3, question: "Release the lock: 10 - 5 = ?", options: [5, 6, 7], correctIndex: 0 }),
		];
	}
	puzzleEvaluator(option : number) : boolean {
		const current = this.getPuzzle();
		const isCorrect = current.evaluate(option);
		if(isCorrect) {
			this.incrementScore();
			this.incrementIndex();
			if(this.index >= this.size) {
				this.isComplete = true;
			}
		}
		return isCorrect;
	}
	/**
	 * Get the current puzzle
	 */
	getPuzzle(): PuzzleModel {
		return this.puzzles[this.index];
	}

	/**
	 * Return the full puzzles array
	 */
	getPuzzles(): PuzzleModel[] {
		return this.puzzles;
	}

	/**
	 * Increment index when correct
	 */
	incrementIndex() : void {
		this.index++;
	}

	/**
	 * Increment score when lemon is clicked
	 */
	incrementScore() : void {
		this.score++;
	}
	
	/**
	 * Get current score
	 */
	getScore() : number {
		return this.score;
	}

	/**
	 * Is the game finished?
	 */
	getIsComplete() : boolean {
		return this.isComplete;
	}

	/**
	 * Reset game state for a new game
	 */
	reset() : void {
		this.score = 0;
		this.isComplete = false;
		this.index = 0;
		this.size = 3;
		this.puzzleGenerator();
	}
}


