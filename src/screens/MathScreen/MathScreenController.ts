import { MathScreenModel } from "./MathScreenModel";
import { MathScreenView } from "./MathScreenView";
import {
  QuadraticEquationsHelper,
  getCurrentDifficulty,
} from "../../class/MathEquations/QuadraticEquationsHelper";
import { ScreenController, type ScreenSwitcher } from "../../types";

export class MathScreenController extends ScreenController {
  private view: MathScreenView;
  private model: MathScreenModel;
  private helper: QuadraticEquationsHelper;
  private screenSwitcher: ScreenSwitcher;
  private phase: "factored" | "solutions" = "factored";

  constructor(screenSwitcher: ScreenSwitcher) {
    super();
    this.view = new MathScreenView();
    this.model = new MathScreenModel();
    this.helper = new QuadraticEquationsHelper();
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
        "❌ Incorrect.",
        false
      );
      setTimeout(() => {
        this.hide();
      }, 800);
    }
  }

  private handleSolutions(userInput: string): void {
    const isCorrect = this.helper.checkSolutions(userInput);

    if (isCorrect) {
      this.view.showFeedback("✅ Correct!", true);
    } else {
      this.view.showFeedback(
        "❌ Incorrect.",
        false
      );
    }

    setTimeout(() => {
      this.hide();
    }, 800);
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