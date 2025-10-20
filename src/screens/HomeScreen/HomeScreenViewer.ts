import Konva from "konva";
import type { View } from "../../types";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants";

export class HomeScreenView implements View {
	private group: Konva.Group;
	private titleText: Konva.Text;

	private startButtonImage: Konva.Image | null = null;
	private settingsButtonImage: Konva.Image | null = null;
	private singleButtonImage: Konva.Image | null = null;
	private multiButtonImage: Konva.Image | null = null;

	constructor() {
		this.group = new Konva.Group({ visible: true });

		/** Home Background */
		const homebackground_img = new Image();
		homebackground_img.src = "#"; // TODO : NEED BACKGROUND IMAGE

		homebackground_img.onload = () => {
			const background = new Konva.Image({
				image: homebackground_img,
				x: 0,
				y: 0,
				width: STAGE_WIDTH,
				height: STAGE_HEIGHT,
			});
			this.group.add(background);
		};

		/** Title */
		this.titleText = new Konva.Text({
			x: STAGE_WIDTH / 2,
			y: 100,
			text: "Math Magic",
			fontSize: 48,
			fontFamily: "Arial",
			fill: "white",
			stroke: "black",
			strokeWidth: 2,
		});
		this.titleText.offsetX(this.titleText.width() / 2);
		this.group.add(this.titleText);

		/** Buttons */
		this.startButtonImage = this.createImageButton(
			"", // NEED BUTTON IMAGE
			(STAGE_WIDTH - 200) / 2,
			300,
			200,
			60
		);


		this.settingsButtonImage = this.createImageButton(
			"#", // NEED BUTTON IMAGE
			(STAGE_WIDTH - 200) / 2,
			400,
			200,
			60
		);

		this.singleButtonImage = this.createImageButton(
			"#", // NEED BUTTON IMAGE
			(STAGE_WIDTH - 200) / 2,
			520,
			200,
			60,
			false // initially hidden
		);

		this.multiButtonImage = this.createImageButton(
			"#", // NEED BUTTON IMAGE
			(STAGE_WIDTH - 200) / 2,
			600,
			200,
			60,
			false // initially hidden
		);
	}

	/**
	 * Helper — Creating image button
	 */
	private createImageButton(src: string, x: number, y: number, width: number, height: number, visible: boolean = true ): Konva.Image {
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

            button.on('mouseover', function (e) {
                e.target.getStage()!.container().style.cursor = 'pointer';
            });
            button.on('mouseout', function (e) {
                e.target.getStage()!.container().style.cursor = 'default';
            });
		};

		return button;
	}

	/**
	 * Getters
	 */
	getStartButton(): Konva.Image | null {
		return this.startButtonImage;
	}

	getSettingsButton(): Konva.Image | null {
		return this.settingsButtonImage;
	}

	getSingleButton(): Konva.Image | null {
		return this.singleButtonImage;
	}

	getMultiButton(): Konva.Image | null {
		return this.multiButtonImage;
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