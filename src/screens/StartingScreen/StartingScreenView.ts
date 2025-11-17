import Konva from "konva";
import type { View } from "../../types";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants";

export class StartingScreenView implements View {
	private group: Konva.Group;
	private background: Konva.Rect;
	private clickText: Konva.Text;

	constructor() {
		this.group = new Konva.Group({ visible: true });

		/**
		 * Background - Cloud-like gradient
		 */
		this.background = new Konva.Rect({
			x: 0,
			y: 0,
			width: STAGE_WIDTH,
			height: STAGE_HEIGHT,
			fillLinearGradientStartPoint: { x: 0, y: 0 },
			fillLinearGradientEndPoint: { x: 0, y: STAGE_HEIGHT },
			fillLinearGradientColorStops: [
				0,
				"#87CEEB", // Sky blue
				0.5,
				"#B0E0E6", // Powder blue
				1,
				"#E0F6FF", // Light blue
			],
		});

		this.group.add(this.background);

		/**
		 * Click to Start Text
		 */
		this.clickText = new Konva.Text({
			x: STAGE_WIDTH / 2,
			y: STAGE_HEIGHT / 2,
			text: "Click to Start",
			fontSize: 48,
			fontFamily: "Arial",
			fill: "white",
			align: "center",
			shadowColor: "rgba(0, 0, 0, 0.5)",
			shadowBlur: 10,
			shadowOffset: { x: 2, y: 2 },
		});

		// Center the text
		this.clickText.offsetX(this.clickText.width() / 2);
		this.clickText.offsetY(this.clickText.height() / 2);

		this.group.add(this.clickText);

		/**
		 * Fade-in animation
		 */
		this.clickText.opacity(0);
		requestAnimationFrame(() => {
			this.clickText.to({
				opacity: 1,
				duration: 1.5,
			});
		});

		/**
		 * Pulsing animation
		 */
		const pulseAnimation = new Konva.Animation(() => {
			const scale = 1 + Math.sin(Date.now() / 500) * 0.1;
			this.clickText.scale({ x: scale, y: scale });
		});

		pulseAnimation.start();
	}

	/**
	 * Get the group for click detection
	 */
	getGroup(): Konva.Group {
		return this.group;
	}

	/**
	 * Show / Hide
	 */
	show(): void {
		this.group.visible(true);
		this.group.getLayer()?.draw();
	}

	hide(): void {
		this.group.visible(false);
		this.group.getLayer()?.draw();
	}
}

