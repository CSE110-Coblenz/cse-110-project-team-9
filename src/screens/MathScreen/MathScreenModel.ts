import {
  generateRandomEntry,
  getEquationFromEntry,
  getFactoredFromEntry,
  getSolutionsFromEntry,
  pointPerQuestion,
  type mathDictEntry,
} from "../../class/MathEquations/dictionaryMethods";

export type MathQuestion = {
  equation: string;
  factored: string;
  solutions: string[];
  points: number;
};

export class MathScreenModel {
  private currentQuestion: MathQuestion | null = null;
  private score = 0;
  private entries: mathDictEntry[];

  constructor(entries: mathDictEntry[]) {
    this.entries = entries;
  }

  loadNextQuestion(): MathQuestion | null {
    const entryInfo = generateRandomEntry(this.entries);
    if (!entryInfo) {
      this.currentQuestion = null;
      return null;
    }

    const { entry } = entryInfo;

    const equation = getEquationFromEntry(entry);
    const factored = getFactoredFromEntry(entry);
    const solutions = getSolutionsFromEntry(entry).map((s: string) => s.trim());

    const pointsStr = pointPerQuestion(entry);
    const pointsNum = Number(pointsStr);
    const points = Number.isNaN(pointsNum) ? 1 : pointsNum;

    this.currentQuestion = {
      equation,
      factored,
      solutions,
      points,
    };

    return this.currentQuestion;
  }

  getCurrentQuestion(): MathQuestion | null {
    return this.currentQuestion;
  }

  addPoints(points: number): void {
    this.score += points;
  }

  getScore(): number {
    return this.score;
  }
}
