export interface PuzzleData {
    id: number;
    question: string;
    options: string[] | number[];
    correctIndex: number;
}

export class PuzzleModel {
    private puzzle: PuzzleData;
    private solved = false;

    constructor(puzzleData: PuzzleData) {
        this.puzzle = puzzleData;
    }

    getQuestion(): string {
        return this.puzzle.question;
    }

    getOptions(): (string | number)[] {
        return this.puzzle.options;
    }

    isSolved(): boolean {
        return this.solved;
    }

    /**
     * Evaluate the player's answer
     * @param selectedIndex - the index of the option the player selected
     * @returns true if correct, false otherwise
     */
    evaluate(selectedIndex: number): boolean {
        const correct = selectedIndex === this.puzzle.correctIndex;
        if (correct) {
        this.solved = true;
        }
        return correct;
    }

    getPuzzleData(): PuzzleData {
        return this.puzzle;
    }

    reset(): void {
        this.solved = false;
    }
}
