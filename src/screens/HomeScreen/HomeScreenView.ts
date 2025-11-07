import Konva from "konva";
import type { View } from "../../types";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants";

export class HomeScreenView implements View {
	private group: Konva.Group;

	private homeStartButton: Konva.Group;
	private homeSettingsButton: Konva.Group;

	private gameTitle: Konva.Text;

	constructor() {
		this.group = new Konva.Group({ visible: true });

		/** 
		 * Homescreen Background Video 
		 */

		const video = document.createElement("video");
		video.src = "/homescreen/video/homescreen_video.mp4";
		video.load(); //
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
		 * Homescreen Background Video Animation
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
		this.group.add(this.gameTitle);
		this.gameTitle.opacity(0);
		
		requestAnimationFrame(() => {
		  this.gameTitle.to({
			opacity: 1,
			duration: 3,
		  });
		});

		/** 
		 * Buttons (Start, Settings)
		 */

		this.homeStartButton = this.createTextButton(
			"Start Game",
			STAGE_WIDTH / 2 - 225,
			300,
			48
		);

		this.homeSettingsButton = this.createTextButton(
			"Settings",
			STAGE_WIDTH / 2 - 190,
			400,
			48
		);

		this.group.add(this.homeStartButton, this.homeSettingsButton);	
	}

	/**
	 * Helper Funtion — Creating text button (transparent background)
	 */
	private createTextButton(
		text: string,
		x: number,
		y: number,
		fontSize: number = 36,
		fontFamily: string = "HomeScreenFont",
		fill: string = "white"
	): Konva.Group {
		const buttonText = new Konva.Text({
			text,
			x,
			y,
			fontSize,
			fontFamily,
			fill,
		});

		// Invisible Button Area
		const invisibleRect = new Konva.Rect({
			x: buttonText.x() - buttonText.width() / 2,
			y: buttonText.y(),
			width: buttonText.width(),
			height: buttonText.height(),
			fill: "rgba(0,0,0,0)",
		});

		const buttonGroup = new Konva.Group();
		buttonGroup.add(invisibleRect, buttonText);

		/**
		 * Button Animation
		 */

		buttonGroup.on("mouseover", () => {
			buttonText.fill("#ffd700");
			document.body.style.cursor = "pointer";
		});
		buttonGroup.on("mouseout", () => {
			buttonText.fill(fill);
			document.body.style.cursor = "default";
		});

		// Fade-In effect
		this.group.add(buttonGroup);
		buttonGroup.opacity(0);
		
		requestAnimationFrame(() => {
		  buttonGroup.to({
			opacity: 1,
			duration: 3,
		  });
		});

		this.group.add(buttonGroup);
		return buttonGroup;
	}


	/**
	 * Getters
	 */
	getStartButton(): Konva.Group {
		return this.homeStartButton;
	}

	getSettingsButton(): Konva.Group {
		return this.homeSettingsButton;
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