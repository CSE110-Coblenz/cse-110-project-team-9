// src/screens/MathScreen/MathScreenController.ts
import { MathScreenModel } from "./MathScreenModel";
import { MathScreenView } from "./MathScreenView";

type Phase = "factored" | "solutions";

export class MathScreenController {
  private model: MathScreenModel;
  private view: MathScreenView;
  private inputEl: HTMLInputElement;
  private buttonEl: HTMLButtonElement;
  private phase: Phase = "factored";

  // we keep a simple fallback in case the model can't load from the dictionary
  private fallbackQuestion = {
    equation: "x² - 7x + 10",
    factored: "(x-2)(x-5)",
    solutions: ["2", "5"],
  };

  constructor(
    model: MathScreenModel,
    view: MathScreenView,
    inputEl: HTMLInputElement,
    buttonEl: HTMLButtonElement
  ) {
    this.model = model;
    this.view = view;
    this.inputEl = inputEl;
    this.buttonEl = buttonEl;

    // listen for button
    this.buttonEl.addEventListener("click", () => {
      this.handleSubmit();
    });

    // enter key
    this.inputEl.addEventListener("keyup", (evt) => {
      if (evt.key === "Enter") {
        this.handleSubmit();
      }
    });
  }

  init() {
    // try to load from model (dictionary)
    const q = this.model.loadNextQuestion();
    if (q) {
      // dictionary worked
      this.view.showEquation(`Factor this: ${q.equation}`);
      this.view.showEnterFactored();
      this.phase = "factored";
      this.inputEl.value = "";
    } else {
      // dictionary failed → use fallback so UI isn't stuck on "Loading question..."
      this.view.showEquation(`Factor this: ${this.fallbackQuestion.equation}`);
      this.view.showEnterFactored();
      this.phase = "factored";
      this.inputEl.value = "";
    }
  }

  private handleSubmit() {
    const userText = this.inputEl.value.trim();
    if (userText.length === 0) {
      this.view.showFeedback("Please type an answer first.", false);
      return;
    }

    if (this.phase === "factored") {
      this.handleFactored(userText);
    } else {
      this.handleSolutions(userText);
    }
  }

  private handleFactored(userText: string) {
    // try model first
    const okFromModel = this.model.checkFactoredAnswer(userText);
    // if model has no current question, it will return false
    // so we also check against the fallback
    const ok =
      okFromModel ||
      userText.replace(/\s+/g, "").toLowerCase() ===
        this.fallbackQuestion.factored.replace(/\s+/g, "").toLowerCase();

    if (ok) {
      this.view.showFeedback("✅ Correct factored form!", true);
      this.view.showEnterSolutions();
      this.phase = "solutions";
      this.inputEl.value = "";
    } else {
      this.view.showFeedback(
        "❌ Not quite. Make sure parentheses and signs match.",
        false
      );
    }
  }

  private handleSolutions(userText: string) {
    // try model first
    const okFromModel = this.model.checkSolutionsAnswer(userText);

    // fallback check: order-insensitive "2, 5"
    const userParts = userText
      .split(/[,\s]+/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
    const fallbackParts = this.fallbackQuestion.solutions;
    const sameLength = userParts.length === fallbackParts.length;
    const allFound =
      sameLength &&
      userParts.every((p) => fallbackParts.includes(p));

    const ok = okFromModel || allFound;

    if (ok) {
      const score = this.model.getScore();
      this.view.showFeedback(`✅ Correct! Score: ${score}`, true);

      // try to load another model question
      const next = this.model.loadNextQuestion();
      if (next) {
        this.view.showEquation(`Factor this: ${next.equation}`);
        this.view.showEnterFactored();
        this.phase = "factored";
        this.inputEl.value = "";
      } else {
        // no more questions → at least show fallback again
        this.view.showEquation(
          `Factor this: ${this.fallbackQuestion.equation}`
        );
        this.view.showEnterFactored();
        this.phase = "factored";
        this.inputEl.value = "";
      }
    } else {
      this.view.showFeedback(
        "❌ Solutions don't match. Try format like: 2, 5",
        false
      );
    }
  }
}
