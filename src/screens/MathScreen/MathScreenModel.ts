import type { QuadraticQuestion } from "../../class/MathEquations/QuadraticEquationsHelper";

export class MathScreenModel {
  private currentQuestion: QuadraticQuestion | null = null;
  private score = 0;

  constructor() {}

  loadNextQuestion(question: QuadraticQuestion | null): QuadraticQuestion | null {
    this.currentQuestion = question;
    return this.currentQuestion;
  }

  getCurrentQuestion(): QuadraticQuestion | null {
    return this.currentQuestion;
  }

  addPoints(points: number): void {
    this.score += points;
  }

  getScore(): number {
    return this.score;
  }
}
