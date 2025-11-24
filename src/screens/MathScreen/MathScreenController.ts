import { MathScreenModel } from "./MathScreenModel";
import { MathScreenView } from "./MathScreenView";
import {
  QuadraticEquationsHelper,
  getCurrentDifficulty,
} from "../../class/MathEquations/QuadraticEquationsHelper";
import type { ScreenSwitcher } from "../../types";

export class MathScreenController {
  private view: MathScreenView;
  private model: MathScreenModel;
  private helper: QuadraticEquationsHelper;
  private screenSwitcher: ScreenSwitcher;
  private phase: "factored" | "solutions" = "factored";

  constructor(
    view: MathScreenView,
    model: MathScreenModel,
    helper: QuadraticEquationsHelper,
    screenSwitcher: ScreenSwitcher
  ) {
    this.view = view;
    this.model = model;
    this.helper = helper;
    this.screenSwitcher = screenSwitcher;

    this.view.setOnCheck((answer) => this.handleCheck(answer));
  }

  async init(): Promise<void> {
    await this.helper.ensureLoaded();

    const difficulty = getCurrentDifficulty();
    const next = this.helper.getNextQuestion(difficulty);

    if (next) {
      this.model.loadNextQuestion(next);
      this.view.showEquation(`Factor this: ${next.equation}`);
      this.view.showEnterFactored();
      this.phase = "factored";
    } else {
      this.view.showFeedback("No questions found in dictionary.", false);
    }
  }

  private handleCheck(answer: string): void {
    if (this.phase === "factored") {
      this.handleFactored(answer);
    } else if (this.phase === "solutions") {
      this.handleSolutions(answer);
    }
  }

  private handleFactored(userInput: string): void {
    const isCorrect = this.helper.checkFactored(userInput);

    if (isCorrect) {
      this.view.showFeedback("✅ Correct! Now enter the solutions.", true);
      this.view.showEnterSolutions();
      this.phase = "solutions";
      this.view.clearAnswer();
    } else {
      this.view.showFeedback(
        "❌ Try again. Make sure parentheses and signs match.",
        false
      );
    }
  }

  private handleSolutions(userInput: string): void {
    const isCorrect = this.helper.checkSolutions(userInput);

    if (isCorrect) {
      const question = this.model.getCurrentQuestion();
      if (question) {
        this.model.addPoints(question.points);
      }

      const score = this.model.getScore();
      this.view.showFeedback(`✅ Correct! Score: ${score}`, true);

      // After finishing ONE full question (factored + solutions),
      // go back to the main board screen.
      setTimeout(() => {
        this.screenSwitcher.switchToScreen({ type: "mainGame" });
      }, 800);
    } else {
      this.view.showFeedback(
        "❌ Incorrect solutions. Try again (e.g., 2, 5).",
        false
      );
    }
  }

  show(): void {
    this.view.show();
  }

  hide(): void {
    this.view.hide();
  }

  getView(): MathScreenView {
    return this.view;
  }
}
