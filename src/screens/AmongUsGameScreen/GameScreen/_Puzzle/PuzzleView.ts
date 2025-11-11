import Konva from "konva";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../../../constants.ts";

/**
 * PuzzleView - Handles rendering of puzzle UI (question + option buttons)
 * Pure rendering component with no business logic.
 * Emits events through callbacks.
 */
export class PuzzleView {
	private group: Konva.Group;
	private questionText: Konva.Text;
	private feedbackText: Konva.Text;
	private optionButtons: Konva.Group[] = [];
	private onAnswer: ((optionIndex: number) => void) | null = null;
	private isEnabled = true;

	constructor(parentGroup: Konva.Group) {
		this.group = new Konva.Group({ visible: false });
		parentGroup.add(this.group);

		// Question text
		this.questionText = new Konva.Text({
			x: 0,
			y: STAGE_HEIGHT / 1.1,
			text: "",
			fontSize: 32,
			fontFamily: "Serif",
			fill: "red",
			align: "left",
			width: STAGE_WIDTH,
			visible: false,
		});
		this.group.add(this.questionText);

		// Feedback text (shown after answer)
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
		this.group.add(this.feedbackText);
		this.feedbackText.moveToTop();
	}

	/**
	 * Register a callback for when the user answers the puzzle
	 */
	setOnAnswer(callback: (optionIndex: number) => void): void {
		this.onAnswer = callback;
	}

	/**
	 * Show the puzzle with question and options
	 */
	show(question: string, options: string[]): void {
		this.questionText.text(question);
		this.questionText.visible(true);

		// Clear old buttons
		this.optionButtons.forEach((btn) => btn.destroy());
		this.optionButtons = [];

		const startY = 300;
		const buttonSpacing = 80;

		// Create option buttons
		options.forEach((optionText, index) => {
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
			buttonGroup.on("click", () => {
				if (this.isEnabled && this.onAnswer) {
					this.isEnabled = false; // Disable until feedback is shown
					this.onAnswer(index);
				}
			});

			this.group.add(buttonGroup);
			this.optionButtons.push(buttonGroup);
		});

		this.isEnabled = true;
		this.group.getLayer()?.draw();
	}

	/**
	 * Hide the puzzle and show feedback
	 */
	showFeedback(message: string, duration: number = 1500): void {
		// Hide question and options
		this.questionText.visible(false);
		this.optionButtons.forEach((btn) => btn.visible(false));

		// Show feedback
		this.feedbackText.text(message);
		this.feedbackText.offsetX(this.feedbackText.width() / 2);
		this.feedbackText.moveToTop();
		this.feedbackText.visible(true);

		this.group.getLayer()?.draw();

		// Auto-hide feedback
		setTimeout(() => {
			this.feedbackText.visible(false);
			this.questionText.visible(true);
			this.optionButtons.forEach((btn) => btn.visible(true));
			this.isEnabled = true;
			this.group.getLayer()?.draw();
		}, duration);
	}

	/**
	 * Hide the puzzle completely
	 */
	hide(): void {
		this.questionText.visible(false);
		this.optionButtons.forEach((btn) => btn.visible(false));
		this.feedbackText.visible(false);
		this.group.getLayer()?.draw();
	}

	/**
	 * Get the underlying Konva group
	 */
	getGroup(): Konva.Group {
		return this.group;
	}

	/**
	 * Set whether buttons are clickable
	 */
	setEnabled(enabled: boolean): void {
		this.isEnabled = enabled;
	}

	/**
	 * Check if buttons are currently enabled
	 */
	isClickable(): boolean {
		return this.isEnabled;
	}
}
