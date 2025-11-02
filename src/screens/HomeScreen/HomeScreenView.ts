import Konva from "konva";
import type { View } from "../../types";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants";

export class HomeScreenView implements View {
	private group: Konva.Group;

	private startButtonImage: Konva.Image;
	private settingsButtonImage: Konva.Image;

	private gameTitle: Konva.Text;

	constructor() {
		this.group = new Konva.Group({ visible: true });

		const layer = new Konva.Layer();
		layer.add(this.group);

		/** 
		 * Homescreen Background Video 
		 */

		const video = document.createElement("video");
		video.src = "/homescreen/video/homescreen_video.mp4";
		video.load(); //
		video.style.display = "none";
		
		video.muted = true;
		video.setAttribute("muted", "true");

		const videoBackground = new Konva.Image({
			image: video,
			x: 0,
			y: 0,
			width: STAGE_WIDTH,
			height: STAGE_HEIGHT,
		});

		this.group.add(videoBackground);

		/**
		 * Homescreen Background Video Animation
		 */

		// Play video when loaded
		video.addEventListener("loadeddata", () => {
			video.play().catch((err) => {
			console.error("Video playback failed:", err);
			});
		});

		// Animation to update video frames
		const anim = new Konva.Animation(function () {
			videoBackground.getLayer()?.batchDraw();
		}, layer);
		
		// Start the animation
		anim.start();

		// Loop video from 4s to end
		video.addEventListener("ended", () => {
			video.currentTime = 4.0;
			video.play();
		});

		/** 
		 * Game Title 
		 */

		this.gameTitle = new Konva.Text({
			x: STAGE_WIDTH / 2 - 350,
			y: 120,
			text: "Math Magic",
			fontSize: 96,
			fontFamily: "HomeScreenFont",
			fill: "white",
		});

		this.group.add(this.gameTitle);

		/**
		 * Game Title Animation
		 */

		// Fade-In effect
		this.gameTitle.opacity(0);
		this.gameTitle.to({
			opacity: 1,
			duration: 3,
		});

		/** 
		 * Buttons (Start, Settings)
		 */

		this.startButtonImage = this.createImageButton(
			"homescreen/images/placeholder.svg",
			(STAGE_WIDTH - 200) / 2,
			300,
			200,
			60
		);

		this.settingsButtonImage = this.createImageButton(
			"homescreen/images/placeholder.svg",
			(STAGE_WIDTH - 200) / 2,
			400,
			200,
			60
		);

		this.group.add(this.startButtonImage, this.settingsButtonImage);
	}

	/**
	 * Helper — Creating image button
	 */
	private createImageButton(
		src: string,
		x: number,
		y: number,
		width: number,
		height: number,
		visible: boolean = true
	): Konva.Image {
		const img = new Image();
		const button = new Konva.Image({
			x,
			y,
			width,
			height,
			visible,
			image: undefined,
		});

		img.src = src;

		img.onload = () => {
			button.image(img);
			this.group.add(button);

			button.on("mouseover", function (e) {
				e.target.getStage()!.container().style.cursor = "pointer";
			});
			button.on("mouseout", function (e) {
				e.target.getStage()!.container().style.cursor = "default";
			});
		};

		return button;
	}

	/**
	 * Getters
	 */
	getStartButton(): Konva.Image {
		return this.startButtonImage;
	}

	getSettingsButton(): Konva.Image {
		return this.settingsButtonImage;
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

	getGroup(): Konva.Group {
		return this.group;
	}
}