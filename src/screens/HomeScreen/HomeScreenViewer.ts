import Konva from "konva";
import type { View } from "../../types";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants";

export class HomeScreenView implements View {
	private group: Konva.Group;

	private startButtonImage: Konva.Image;
	private settingsButtonImage: Konva.Image;

	constructor() {
		this.group = new Konva.Group({ visible: true });

		/** Home Background */
		const homebackground_img = new Image();
		homebackground_img.src = "/home.png"; // TODO : NEED BACKGROUND IMAGE

		/** Buttons */
		this.startButtonImage = this.createImageButton(
			"/placeholder.svg", // NEED BUTTON IMAGE
			(STAGE_WIDTH - 200) / 2,
			300,
			200,
			60
		);


		this.settingsButtonImage = this.createImageButton(
			"/placeholder.svg", // NEED BUTTON IMAGE
			(STAGE_WIDTH - 200) / 2,
		    400,
			200,
			60
		);

        homebackground_img.onload = () => {
			const background = new Konva.Image({
				image: homebackground_img,
				x: 0,
				y: 0,
				width: STAGE_WIDTH,
				height: STAGE_HEIGHT,
			});
			this.group.add(background);
            this.group.add(this.startButtonImage,this.settingsButtonImage);
		};
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