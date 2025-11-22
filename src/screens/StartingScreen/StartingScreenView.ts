import Konva from "konva";
import type { View } from "../../types";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants";

export class StartingScreenView implements View {
	private group: Konva.Group;
	private clickText: Konva.Text;

	constructor() {
		this.group = new Konva.Group({ visible: true });

		/** 
		 * StartingScreen Background Video 
		 */
		const video = document.createElement("video");
		video.src = `${import.meta.env.BASE_URL}startingscreen/video/Startingscreen.mp4`;
		video.load();
		video.style.display = "none";
		video.muted = true;

		const videoBackground = new Konva.Image({
			image: video,
			x: 0,
			y: 0,
			width: STAGE_WIDTH,
			height: STAGE_HEIGHT,
		});

		this.group.add(videoBackground);

		/**
		 * StartingScreen Background Video Animation
		 */
		// Play video when loaded
		video.addEventListener("loadeddata", () => {
			video.play().catch((err) => {
				console.error("Video playback failed:", err);
			});
		});

		// Animation to update video frames
		const anim = new Konva.Animation(() => {
			videoBackground.getLayer()?.batchDraw();
		});

		// Start the animation
		anim.start();

		// Loop video
		video.addEventListener("ended", () => {
			video.currentTime = 0;
			video.play();
		});

		/**
		 * Click to Start Text
		 */
		this.clickText = new Konva.Text({
			x: STAGE_WIDTH / 2,
			y: STAGE_HEIGHT / 2,
			text: "Click to Start",
			fontSize: 48,
			fontFamily: "HomeScreenFont",
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