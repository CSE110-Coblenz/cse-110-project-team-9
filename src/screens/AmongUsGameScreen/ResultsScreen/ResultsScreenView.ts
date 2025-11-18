import Konva from "konva";
import type { View } from "../../../types";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../../constants";

/**
 * ResultsScreenView - Renders the results screen UI
 */
export class AmongUsResultsScreenView implements View {
	private group: Konva.Group;
	private scoreText: Konva.Text;
	private messageText: Konva.Text;

	constructor(
		onPlayAgain: () => void,
		onReturnToMainGame: () => void
	) {
		this.group = new Konva.Group({ visible: false });

		// Background
		const background = new Konva.Rect({
			x: 0,
			y: 0,
			width: STAGE_WIDTH,
			height: STAGE_HEIGHT,
			fill: "#1e272e",
		});
		this.group.add(background);

		// Congratulations text
		this.messageText = new Konva.Text({
			x: 0,
			y: 150,
			width: STAGE_WIDTH,
			text: "Mission Complete!",
			fontSize: 48,
			fontFamily: "Arial",
			fill: "#00d2d3",
			align: "center",
		});
		this.group.add(this.messageText);

		// Score text
		this.scoreText = new Konva.Text({
			x: 0,
			y: 250,
			width: STAGE_WIDTH,
			text: "",
			fontSize: 36,
			fontFamily: "Arial",
			fill: "white",
			align: "center",
		});
		this.group.add(this.scoreText);

		// Play Again Button
		const playAgainButton = new Konva.Group({ x: STAGE_WIDTH / 2 - 120, y: 350 });
		const playAgainRect = new Konva.Rect({
			x: 0,
			y: 0,
			width: 200,
			height: 60,
			fill: "#4cd137",
			cornerRadius: 10,
			shadowBlur: 10,
		});
		const playAgainText = new Konva.Text({
			x: 0,
			y: 15,
			width: 200,
			text: "Play Again",
			fontSize: 24,
			fontFamily: "Arial",
			fill: "white",
			align: "center",
		});
		playAgainButton.add(playAgainRect, playAgainText);
		playAgainButton.on("click tap", onPlayAgain);
		this.group.add(playAgainButton);

		// Return to Main Game Button
		const returnButton = new Konva.Group({ x: STAGE_WIDTH / 2 - 120, y: 450 });
		const returnRect = new Konva.Rect({
			x: 0,
			y: 0,
			width: 200,
			height: 60,
			fill: "#7f8fa6",
			cornerRadius: 10,
			shadowBlur: 10,
		});
		const returnText = new Konva.Text({
			x: 0,
			y: 15,
			width: 200,
			text: "Return to Game",
			fontSize: 24,
			fontFamily: "Arial",
			fill: "white",
			align: "center",
		});
		returnButton.add(returnRect, returnText);
		returnButton.on("click tap", onReturnToMainGame);
		this.group.add(returnButton);

		// Add hover effects
		[playAgainButton, returnButton].forEach(button => {
			const rect = button.findOne('Rect');
			button.on("mouseenter", () => {
				rect?.opacity(0.8);
				document.body.style.cursor = "pointer";
				this.group.getLayer()?.draw();
			});
			button.on("mouseleave", () => {
				rect?.opacity(1);
				document.body.style.cursor = "default";
				this.group.getLayer()?.draw();
			});
		});
	}

	/**
	 * Display the final score
	 */
	displayResults(score: number): void {
		this.scoreText.text(`Final Score: ${score}`);
		
		// Update message based on score
		if (score >= 3) {
			this.messageText.text("Excellent Work!");
		} else if (score >= 2) {
			this.messageText.text("Mission Complete!");
		} else {
			this.messageText.text("Try Again!");
		}
	}

	/**
	 * Show the screen
	 */
	show(): void {
		this.group.visible(true);
		this.group.getLayer()?.draw();
	}

	/**
	 * Hide the screen
	 */
	hide(): void {
		this.group.visible(false);
		this.group.getLayer()?.draw();
	}

	/**
	 * Get the Konva group
	 */
	getGroup(): Konva.Group {
		return this.group;
	}
}