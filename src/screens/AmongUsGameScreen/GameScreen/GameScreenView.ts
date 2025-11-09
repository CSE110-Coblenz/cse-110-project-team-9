import Konva from "konva";
import type { View } from "../../../types.ts";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../../constants.ts";

/**
 * GameScreenView - Renders the game UI using Konva
 */
export class AmongUsGameScreenView implements View {
	private group: Konva.Group;
	private scoreText: Konva.Text;
	private timerText: Konva.Text;
	private questionText: Konva.Text;
	private optionButtons: Konva.Group[] = [];
	private onOptionClick: (optionIndex: number) => void;
	private rogueImage?: Konva.Image;

	/**
	 * Helper to load an image and create a Konva.Sprite with provided animations.
	 * options: scaleX, scaleY, frameRate, offsetX, offsetY
	 */
	private createAnimatedSprite(imagePath: string, animations: Record<string, number[]>,
	x: number, y: number, options?: { scaleX?: number; scaleY?: number; frameRate?: number; offsetX?: number; offsetY?: number }) {
		const img = new Image();
		img.onload = () => {
			const sprite = new Konva.Sprite({
				x,
				y,
				scaleX: options?.scaleX ?? 1,
				scaleY: options?.scaleY ?? 1,
				image: img,
				animation: Object.keys(animations)[0] ?? 'default',
				animations,
				frameRate: options?.frameRate ?? 12,
				frameIndex: 0,
			});

			// Apply offsets if provided (useful to center the sprite)
			if (options?.offsetX !== undefined) sprite.offsetX(options.offsetX);
			if (options?.offsetY !== undefined) sprite.offsetY(options.offsetY);

			this.group.add(sprite);
			sprite.start();
			this.group.getLayer()?.draw();
		};
		img.src = imagePath;
		return img; // return img in case caller wants to keep reference
	}

	constructor(onOptionClick: (optionIndex: number) => void) {
		this.group = new Konva.Group({ visible: false });
		this.onOptionClick = onOptionClick;

		// Background
		Konva.Image.fromURL("AmongUsMiniGame/Background/1/terrace.png", (background) => {
			background.width(STAGE_WIDTH);
			background.height(STAGE_HEIGHT);
			background.x(0);
			background.y(0);
			this.group.add(background);
			background.moveToBottom();
			this.group.getLayer()?.draw();
		});

		const bladeAnimations = {
			idle: [
				0, 0, 48, 48,
				0, 48, 48, 48,
				0, 96, 48, 48,
				0, 144, 48, 48,
			],
		};

		const monsterAnimations = {
			idle: [
				0, 0, 36, 64,
				0, 64, 36, 64,
				0, 128, 36, 64,
				0, 192, 36, 64,
				0, 256, 36, 64,
				0, 320, 36, 64,
			],
		};

		const scullAnimations = {
			idle: [
				0, 0, 48, 48,
				0, 48, 48, 48,
				0, 96, 48, 48,
			],
		};
		
		const rogueAnimations = {
			idle: [
				0, 0, 128, 128,
				128, 0, 128, 128,
				256, 0, 128, 128,
				384, 0, 128, 128,
				512, 0, 128, 128,
				640, 0, 128, 128,
				768, 0, 128, 128,
				896, 0, 128, 128,
				1024, 0, 128, 128,
				1152, 0, 128, 128,
				1280, 0, 128, 128,
				1408, 0, 128, 128,
				1536, 0, 128, 128,
				1664, 0, 128, 128,
				1792, 0, 128, 128,
				1920, 0, 128, 128,
				2048, 0, 128, 128,
			]
		};

		// Create the sprites using the helper to avoid repeating identical logic
		this.createAnimatedSprite(
			"AmongUsMiniGame/Objects/Rotating_blades.png",
			bladeAnimations,
			STAGE_WIDTH / 2 - 200,
			STAGE_HEIGHT / 2,
			{ scaleX: 3, scaleY: 3, frameRate: 12, offsetX: 0, offsetY: 0 }
		);

		this.createAnimatedSprite(
			"AmongUsMiniGame/Objects/Flasks_monsters.png",
			monsterAnimations,
			STAGE_WIDTH / 2,
			STAGE_HEIGHT / 2,
			{ scaleX: 3, scaleY: 3, frameRate: 12, offsetX: 0, offsetY: 0 }
		);

		this.createAnimatedSprite(
			"AmongUsMiniGame/Objects/scull.png",
			scullAnimations,
			STAGE_WIDTH / 2 + 200,
			STAGE_HEIGHT / 2,
			{ scaleX: 3, scaleY: 3, frameRate: 12, offsetX: 0, offsetY: 0 }
		);

		this.createAnimatedSprite(
			"AmongUsMiniGame/Sprites/Rogue/Idle/spritesheet.png",
			rogueAnimations,
			STAGE_WIDTH / 2 - 50,
			STAGE_HEIGHT / 2 + 50,
			{ scaleX: 2, scaleY: 2, frameRate: 8, offsetX: 64, offsetY: 64 }
		);

		this.scoreText = new Konva.Text({
			x: 20,
			y: 20,
			text: "Score: 0",
			fontSize: 32,
			fontFamily: "Serif",
			fill: "white",
		});
		this.group.add(this.scoreText);

		this.timerText = new Konva.Text({
			x: STAGE_WIDTH - 150,
			y: 20,
			text: "Time: 60",
			fontSize: 32,
			fontFamily: "Serif",
			fill: "red",
		});
		this.group.add(this.timerText);

		this.questionText = new Konva.Text({
			x: 0,
			y: STAGE_HEIGHT / 1.1,
			text: "		x + y = ?",
			fontSize: 32,
			fontFamily: "Serif",
			fill: "red",
			align: "left",
			width: STAGE_WIDTH,
		});
		this.group.add(this.questionText);

		Konva.Image.fromURL("AmongUsMiniGame/Sprites/Rogue/Idle/idle1.png", (image) => {
			image.x(STAGE_WIDTH / 2);
			image.y(STAGE_HEIGHT / 2);
			this.rogueImage = image;
			this.group.add(this.rogueImage);
			this.group.getLayer()?.draw();
		});
	}

	setRoguePosition(x: number, y: number): void {
		if (!this.rogueImage) return;
		this.rogueImage.x(x);
		this.rogueImage.y(y);
		this.group.getLayer()?.batchDraw();
	}

	moveRogueBy(dx: number, dy: number): void {
		if (!this.rogueImage) return;
		this.rogueImage.x(this.rogueImage.x() + dx);
		this.rogueImage.y(this.rogueImage.y() + dy);
		this.group.getLayer()?.batchDraw();
	}

	getRoguePosition(): { x: number; y: number } | null {
		if (!this.rogueImage) return null;
		return { x: this.rogueImage.x(), y: this.rogueImage.y() };
	}

	/**
	 * Render a puzzle question and options
	 */
	renderPuzzle(puzzle: { question: string; options: string[] }): void {
		// Update question
		this.questionText.text(puzzle.question);

		// Clear old options
		this.optionButtons.forEach((btn) => btn.destroy());
		this.optionButtons = [];

		const startY = 300;
		const buttonSpacing = 80;

		// Create option buttons
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

			this.group.add(buttonGroup);
			this.optionButtons.push(buttonGroup);
		});

		this.group.getLayer()?.draw();
	}

	/**
	 * Update score display
	 */
	updateScore(score: number): void {
		this.scoreText.text(`Score: ${score}`);
		this.group.getLayer()?.draw();
	}

	/**
	 * Update timer display
	 */
	updateTimer(timeRemaining: number): void {
		this.timerText.text(`Time: ${timeRemaining}`);
		this.group.getLayer()?.draw();
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
