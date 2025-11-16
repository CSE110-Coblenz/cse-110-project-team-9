export interface PuzzleData {
    id: number;
    question: string;
    options: string[] | number[];
    correctIndex: number;
}

/**
 * PuzzleModel - Encapsulates all puzzle-specific logic and state
 * Supports both multiple choice and matching-style puzzles
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
     * Evaluate a multiple-choice answer (legacy support)
     */
    evaluate(selectedIndex: number): boolean {
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

    /**
     * Evaluate matching puzzle answers
     * @param userMatches - Map of left index -> right index from user
     * @returns true if all matches are correct
     */
    evaluateMatching(userMatches: Map<number, number>): boolean {
        // Parse the options to get correct pairs
        // Options should be in format "question:answer"
        const correctPairs = new Map<number, number>();
        const answers: string[] = [];
        
        // Build correct answer mapping
        this.puzzle.options.forEach((opt, idx) => {
            const optStr = String(opt);
            if (optStr.includes(":")) {
                const [_, answer] = optStr.split(":");
                answers.push(answer.trim());
            } else {
                // Fallback for non-matching format
                answers.push(optStr);
            }
        });

        // Create shuffled answers list to find correct indices
        // In a real implementation, this should match the shuffle in PuzzleView
        // For now, we'll check if the user matched each question to its correct answer
        this.puzzle.options.forEach((opt, idx) => {
            const optStr = String(opt);
            if (optStr.includes(":")) {
                const [_, answer] = optStr.split(":");
                const answerTrimmed = answer.trim();
                // Find the index of this answer in the answers array
                const rightIdx = answers.indexOf(answerTrimmed);
                correctPairs.set(idx, rightIdx);
            } else {
                // For non-matching format, just map to same index
                correctPairs.set(idx, idx);
            }
        });

        // Check if user made enough connections
        if (userMatches.size !== correctPairs.size) {
            return false;
        }

        // Check if all connections are correct
        for (const [leftIdx, rightIdx] of correctPairs.entries()) {
            if (userMatches.get(leftIdx) !== rightIdx) {
                return false;
            }
        }

        this.solved = true;
        return true;
    }

    getPuzzleData(): PuzzleData {
        return this.puzzle;
    }

    reset(): void {
        this.solved = false;
    }

    /**
     * Create default puzzles - now using matching format
     * Format: "question:answer"
     */
    static createDefaultPuzzles(): PuzzleModel[] {
        return [
            new PuzzleModel({ 
                id: 1, 
                question: "Match the operation to its result", 
                options: ["1 + 1:2", "2 x 5:10", "10 - 5:5"], 
                correctIndex: 0 
            }),
            new PuzzleModel({ 
                id: 2, 
                question: "Match the color to its hex code", 
                options: ["Red:#FF0000", "Blue:#0000FF", "Green:#00FF00"], 
                correctIndex: 0 
            }),
            new PuzzleModel({ 
                id: 3, 
                question: "Match the planet to its position", 
                options: ["Mercury:1st", "Venus:2nd", "Earth:3rd"], 
                correctIndex: 0 
            }),
        ];
    }
}