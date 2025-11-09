import { Player } from "./_Entity/EntityPlayer";

/**
 * GameScreenModel - Manages game state
 */
export class AmongUsGameScreenModel {
	private score = 0;
	private isComplete = false;
	private index = 0;
	private size = 3;
	private puzzles: Puzzle[] = [];

	private player: Player;

	constructor() {
		this.player = new Player();
		this.puzzleGenerator();
	}

	getPlayer(): Player {
		return this.player;
	}

	puzzleGenerator() : void {
		this.puzzles = [
			{
				indexPuzzle: 1,
				indexOption: 1,
				puzzle: "Balance the mechanism: 1 + 1 = ?",
				options: [2, 3, 4],

			},
			{
				indexPuzzle: 2,
				indexOption: 1,
				puzzle: "Adjust the gears: 2 x 5 = ?",
				options: [10, 11, 12],
			},
			{
				indexPuzzle: 3,
				indexOption: 1,
				puzzle: "Release the lock: 10 - 5 = ?",
				options: [5, 6, 7],
			},
		];
	}

	puzzleEvaluator(option : number) : boolean {
		let current = this.getPuzzle();
		let isCorrect = option === current.options[current.indexOption];
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
	getPuzzle() : Puzzle {
		return this.puzzles[this.index];
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

interface Puzzle {
	indexPuzzle: number;
	indexOption: number;
	puzzle: string;
	options: number[];
}
