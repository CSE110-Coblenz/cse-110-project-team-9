import {
  generateRandomEntry,
  getEquationFromEntry,
  getFactoredFromEntry,
  getSolutionsFromEntry,
  pointPerQuestion,
} from "../../class/Math Equations/dictionaryMethods";

export type MathQuestion = {
  equation: string;     // e.g. "x² - 7x + 10"
  factored: string;     // e.g. "(x - 2)(x - 5)"
  solutions: string[];  // e.g. ["2", "5"]
  points: number;       // e.g. 1
};

/**
 * remove spaces, lowercase, so "(x - 2)(x - 5)" === "(x-2)(x-5)"
 */
function normalizeFactored(str: string): string {
  return str.toLowerCase().replace(/\s+/g, "");
}

/**
 * clean up a solution value like " 2 " -> "2"
 */
function normalizeSolution(str: string): string {
  return str.trim();
}

export class MathScreenModel {
  private currentQuestion: MathQuestion | null = null;
  private score: number = 0;

  constructor() {}

  /**
   * Pull a random line from the math dictionary and turn it into a question
   */
  loadNextQuestion(): MathQuestion | null {
    const entryInfo = generateRandomEntry();
    if (!entryInfo) {
      this.currentQuestion = null;
      return null;
    }

    const { entry } = entryInfo;

    const equation = getEquationFromEntry(entry);
    const factored = getFactoredFromEntry(entry);
    const solutions = getSolutionsFromEntry(entry).map((s: string) => s.trim());
    const points = pointPerQuestion(entry);

    this.currentQuestion = {
      equation,
      factored,
      solutions,
      points,
    };

    return this.currentQuestion;
  }

  /**
   * Controller can ask what the current question is
   */
  getCurrentQuestion(): MathQuestion | null {
    return this.currentQuestion;
  }

  /**
   * First step: user types the FACTORED FORM.
   * We compare normalized versions so small spacing differences don't matter.
   */
  checkFactoredAnswer(userInput: string): boolean {
    if (!this.currentQuestion) return false;

    const correct = normalizeFactored(this.currentQuestion.factored);
    const given = normalizeFactored(userInput);

    return correct === given;
  }

  /**
   * Second step: user types the SOLUTION(S).
   * We allow "2, 5" or "2 5" and we ignore order.
   */
  checkSolutionsAnswer(userInput: string): boolean {
    if (!this.currentQuestion) return false;

    const correctList = this.currentQuestion.solutions.map(normalizeSolution);

    // split user input by comma or whitespace
    const userParts = userInput
      .split(/[,\s]+/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    // must have same number of answers
    if (userParts.length !== correctList.length) {
      return false;
    }

    // compare as sets (order doesn't matter)
    const correctSet = new Set(correctList);
    for (const part of userParts) {
      if (!correctSet.has(normalizeSolution(part))) {
        return false;
      }
    }

    // if we got here, they matched → give points
    this.score += this.currentQuestion.points;
    return true;
  }

  /**
   * For score display
   */
  getScore(): number {
    return this.score;
  }
}
