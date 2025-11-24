import {
  readMathDictionary,
  getEquationFromEntry,
  getFactoredFromEntry,
  getSolutionsFromEntry,
  pointPerQuestion,
  entryParseLine,
  type mathDictEntry,
  getDifficultyFromEntry,
  type DifficultyLevel,
  generateRandomEntryByDifficulty,
} from "./dictionaryMethods";

// stores the last chosen difficulty (board sets this)
export let currentDifficulty: DifficultyLevel = "easy";

export function setCurrentDifficulty(d: DifficultyLevel): void {
  currentDifficulty = d;
}

export function getCurrentDifficulty(): DifficultyLevel {
  return currentDifficulty;
}

export type QuadraticQuestion = {
  equation: string;
  factored: string;
  solutions: string[];
  points: number;
  difficulty: DifficultyLevel;
};

//converts the string to lowercase and removes spaces for comparison
function normalizeFactored(str: string): string {
  return str.toLowerCase().replace(/\s+/g, "");
}

//removes spaces for comparison
function normalizeSolution(str: string): string {
  return str.trim();
}

export class QuadraticEquationsHelper {
  private entries: mathDictEntry[] = []; // empty until loaded
  private currentQuestion: QuadraticQuestion | null = null;
  private loadedDictionary = false;

  /*
   * Loads and parses the mathDictionary.txt file once.
   */
  async ensureLoaded(): Promise<void> {
    if (this.loadedDictionary) return;

    const lines = await readMathDictionary();
    const parsed: mathDictEntry[] = [];

    for (const line of lines) {
      const parts = entryParseLine(line);
      if (parts.length === 4) {
        const [equation, factored, solutions, points] = parts;
        parsed.push({ equation, factored, solutions, points });
      }
    }

    this.entries = parsed;
    this.loadedDictionary = true;
  }

  getNextQuestion(difficulty: DifficultyLevel): QuadraticQuestion | null {
    if (!this.loadedDictionary || this.entries.length === 0) {
      return null;
    }

    const entryInfo = generateRandomEntryByDifficulty(this.entries, difficulty);
    if (!entryInfo) {
      return null;
    }

    const entry = entryInfo.entry;

    const equation = getEquationFromEntry(entry);
    const factored = getFactoredFromEntry(entry);
    const solutions = getSolutionsFromEntry(entry).map((s) => s.trim());
    const pointsStr = pointPerQuestion(entry);
    const points = Number(pointsStr) || 1;
    const level = getDifficultyFromEntry(entry);

    const question: QuadraticQuestion = {
      equation,
      factored,
      solutions,
      points,
      difficulty: level,
    };

    this.currentQuestion = question;
    return question;
  }

  // Accepts factored form even if factors are flipped, ex: (x-1)(x-2) vs (x-2)(x-1)
  checkFactored(userInput: string): boolean {
    if (!this.currentQuestion) return false;

    const correct = normalizeFactored(this.currentQuestion.factored);
    const given = normalizeFactored(userInput);

    // Quick equality check first
    if (correct === given) return true;

    // Extract each "(...)" group from both strings
    const correctParts = correct.match(/\(.*?\)/g) || [];
    const givenParts = given.match(/\(.*?\)/g) || [];

    if (correctParts.length === 0 || correctParts.length !== givenParts.length) {
      return false;
    }

    // Sort each list, then compare so order doesn't matter
    correctParts.sort();
    givenParts.sort();

    return correctParts.join("") === givenParts.join("");
  }

  /*
   * Checks if the user's numeric solutions match the correct ones (order-independent).
   */
  checkSolutions(userInput: string): boolean {
    if (!this.currentQuestion) return false;

    const correctList = this.currentQuestion.solutions.map(normalizeSolution);

    const separators = /[,\s]+/;
    const rawParts = userInput.split(separators);
    const trimmedParts = rawParts.map((part) => part.trim());
    const userParts = trimmedParts.filter((part) => part !== "");

    const EXPECTED_SOLUTIONS = 2;
    if (userParts.length !== EXPECTED_SOLUTIONS) return false;

    const correctSet = new Set(correctList);
    for (const part of userParts) {
      if (!correctSet.has(normalizeSolution(part))) {
        return false;
      }
    }

    return true;
  }
}
