export interface PuzzleData {
    id: number;
    question: string;
    options: string[] | number[];
    correctIndex: number;
}

/**
 * Generate a random integer between min and max (inclusive)
 */
function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Format a quadratic equation nicely
 */
function formatQuadratic(a: number, b: number, c: number): string {
    let equation = "";
    
    // ax^2 term
    if (a === 1) {
        equation = "x²";
    } else if (a === -1) {
        equation = "-x²";
    } else {
        equation = `${a}x²`;
    }
    
    // bx term
    if (b > 0) {
        equation += b === 1 ? " + x" : ` + ${b}x`;
    } else if (b < 0) {
        equation += b === -1 ? " - x" : ` - ${Math.abs(b)}x`;
    }
    
    // c term
    if (c > 0) {
        equation += ` + ${c}`;
    } else if (c < 0) {
        equation += ` - ${Math.abs(c)}`;
    }
    
    return equation + " = 0";
}

/**
 * Format roots as a string
 */
function formatRoots(r1: number, r2: number): string {
    if (r1 === r2) {
        return `x = ${r1}`;
    }
    // Sort roots for consistent display
    const [smaller, larger] = r1 < r2 ? [r1, r2] : [r2, r1];
    return `x = ${smaller}, ${larger}`;
}

/**
 * Generate a quadratic equation from roots
 * Given roots r1 and r2, the equation is: a(x - r1)(x - r2) = 0
 * Expanding: a(x² - (r1+r2)x + r1*r2) = 0
 * So: ax² - a(r1+r2)x + a*r1*r2 = 0
 */
function generateQuadraticFromRoots(r1: number, r2: number, a: number): { a: number; b: number; c: number } {
    const b = -a * (r1 + r2);
    const c = a * r1 * r2;
    return { a, b, c };
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
        
        this.puzzle.options.forEach((opt, idx) => {
            const optStr = String(opt);
            if (optStr.includes(":")) {
                // For matching format, correct pair is index -> index (same position)
                correctPairs.set(idx, idx);
            } else {
                // Fallback for non-matching format
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
     * Generate a random quadratic matching puzzle
     */
    static generateQuadraticPuzzle(id: number, numEquations: number = 3): PuzzleModel {
        const usedRootPairs = new Set<string>();
        const options: string[] = [];
        
        for (let i = 0; i < numEquations; i++) {
            let r1: number, r2: number, pairKey: string;
            
            // Generate unique root pairs
            do {
                r1 = randomInt(-10, 10);
                r2 = randomInt(-10, 10);
                // Create a sorted key to avoid duplicate pairs like (2,3) and (3,2)
                pairKey = [r1, r2].sort((a, b) => a - b).join(",");
            } while (usedRootPairs.has(pairKey));
            
            usedRootPairs.add(pairKey);
            
            // Generate random coefficient a (non-zero)
            let a: number;
            do {
                a = randomInt(-5, 5);
            } while (a === 0);
            
            const { a: coeffA, b: coeffB, c: coeffC } = generateQuadraticFromRoots(r1, r2, a);
            
            const equation = formatQuadratic(coeffA, coeffB, coeffC);
            const roots = formatRoots(r1, r2);
            
            options.push(`${equation}:${roots}`);
        }
        
        return new PuzzleModel({
            id,
            question: "Solve for the roots of each equation",
            options,
            correctIndex: 0
        });
    }

    /**
     * Create default puzzles - now using quadratic equations
     */
    static createDefaultPuzzles(): PuzzleModel[] {
        return [
            PuzzleModel.generateQuadraticPuzzle(1, 3),
            PuzzleModel.generateQuadraticPuzzle(2, 3),
            PuzzleModel.generateQuadraticPuzzle(3, 3),
        ];
    }
}