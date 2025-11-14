import Konva from "konva";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../../../constants.ts";

/**
 * PuzzleView - encapsulates puzzle-related rendering and UI interactions.
 * Responsible for: question text, option buttons, feedback display and animations.
 */
export class PuzzleView {
    private parent: Konva.Group;
    private questionText: Konva.Text;
    private feedbackText: Konva.Text;
    private optionButtons: Konva.Group[] = [];
    private onOptionClick: (index: number) => void;

    constructor(parent: Konva.Group, onOptionClick: (index: number) => void) {
        this.parent = parent;
        this.onOptionClick = onOptionClick;

        this.questionText = new Konva.Text({
            x: 0,
            y: STAGE_HEIGHT / 1.1,
            text: "",
            fontSize: 32,
            fontFamily: "Serif",
            fill: "red",
            align: "left",
            width: STAGE_WIDTH,
        });
        this.parent.add(this.questionText);

        this.feedbackText = new Konva.Text({
            x: STAGE_WIDTH / 2,
            y: STAGE_HEIGHT / 2,
            text: "",
            fontSize: 48,
            fontFamily: "Serif",
            fill: "white",
            align: "center",
            visible: false,
        });
        this.feedbackText.offsetX(this.feedbackText.width() / 2);
        this.parent.add(this.feedbackText);
        this.feedbackText.moveToTop();
    }

    render(puzzle: { question: string; options: string[] }) {
        // Update question
        this.questionText.visible(true);
        this.questionText.text(puzzle.question);


        // Clear old options
        this.optionButtons.forEach((btn) => btn.destroy());
        this.optionButtons = [];

        const startY = 300;
        const buttonSpacing = 80;

        puzzle.options.forEach((optionText, index) => {
            const buttonGroup = new Konva.Group();

            const buttonRect = new Konva.Rect({
                x: STAGE_WIDTH / 2 - 150,
                y: startY + index * buttonSpacing,
                width: 300,
                height: 50,
                fill: "black",
                stroke: "purple",
                strokeWidth: 2,
                cornerRadius: 10,
            });

            const buttonLabel = new Konva.Text({
                x: STAGE_WIDTH / 2,
                y: startY + index * buttonSpacing + 12,
                text: optionText,
                fontSize: 20,
                fontFamily: "Serif",
                fill: "white",
                align: "center",
            });
            buttonLabel.offsetX(buttonLabel.width() / 2);

            buttonGroup.add(buttonRect);
            buttonGroup.add(buttonLabel);
            buttonGroup.on("click", () => this.onOptionClick(index));

            this.parent.add(buttonGroup);
            this.optionButtons.push(buttonGroup);
        });

        this.parent.getLayer()?.draw();
    }

    hide(feedback: string) {
        // Hide question and options
        this.questionText.visible(false);
        this.optionButtons.forEach((btn) => btn.visible(false));

        // Show feedback
        this.feedbackText.text(feedback);
        this.feedbackText.offsetX(this.feedbackText.width() / 2);
        this.feedbackText.moveToTop();
        this.feedbackText.visible(true);

        this.parent.getLayer()?.draw();

        // Auto-hide feedback after 1.5 seconds
        setTimeout(() => {
            // Hide feedback and fully clear the puzzle UI so it is not interactive
            // (puzzle will be re-rendered only when the user clicks an obstacle)
            this.feedbackText.visible(false);
            // destroy option button nodes and clear question text
            this.reset();
            this.parent.getLayer()?.draw();
        }, 1500);
    }

    reset() {
        this.optionButtons.forEach((btn) => btn.destroy());
        this.optionButtons = [];
        this.questionText.text("");
        this.feedbackText.text("");
        this.feedbackText.visible(false);
        this.parent.getLayer()?.draw();
    }
}
