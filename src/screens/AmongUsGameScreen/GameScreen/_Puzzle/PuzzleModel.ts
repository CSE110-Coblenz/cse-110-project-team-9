export interface PuzzleData {
    id: number;
    question: string;
    options: string[] | number[];
    correctIndex: number;
}

/**
 * PuzzleModel - Encapsulates all puzzle-specific logic and state
 * Responsible for: question data, answer evaluation, solved state
 */
export class PuzzleModel {
    private puzzle: PuzzleData;
    private solved = false;

    constructor(puzzleData: PuzzleData) {
        this.puzzle = puzzleData;
    }

    getId(): number {
        return this.puzzle.id;
    }

    getQuestion(): string {
        return this.puzzle.question;
    }

    getOptions(): (string | number)[] {
        return this.puzzle.options;
    }

    getCorrectIndex(): number {
        return this.puzzle.correctIndex;
    }

    isSolved(): boolean {
        return this.solved;
    }

    /**
     * Evaluate the player's answer
     * @param selectedIndex - the index of the option the player selected
     * @returns true if correct, false otherwise; marks puzzle as solved if correct
     */
    evaluate(selectedIndex: number): boolean {
        // Bounds check
        if (selectedIndex < 0 || selectedIndex >= this.puzzle.options.length) {
            console.warn(`Invalid option index ${selectedIndex} for puzzle ${this.puzzle.id}`);
            return false;
        }

        const correct = selectedIndex === this.puzzle.correctIndex;
        if (correct) {
            this.solved = true;
        }
        return correct;
    }

    getPuzzleData(): PuzzleData {
        return this.puzzle;
    }

    /**
     * Reset the puzzle state (e.g., for re-attempting or testing)
     */
    reset(): void {
        this.solved = false;
    }

    /**
     * Create the default puzzle sequence used by the game.
     * Keeps puzzle construction logic close to the PuzzleModel.
     */
    static createDefaultPuzzles(): PuzzleModel[] {
        return [
            new PuzzleModel({ id: 1, question: "Balance the mechanism: 1 + 1 = ?", options: [2, 3, 4], correctIndex: 0 }),
            new PuzzleModel({ id: 2, question: "Adjust the gears: 2 x 5 = ?", options: [10, 11, 12], correctIndex: 0 }),
            new PuzzleModel({ id: 3, question: "Release the lock: 10 - 5 = ?", options: [5, 6, 7], correctIndex: 0 }),
        ];
    }
}
