import Konva from "konva";
import { STAGE_WIDTH, STAGE_HEIGHT, SETTINGS_WIDTH, SETTINGS_HEIGHT } from "../../constants";
import type { View } from "../../types";

export class SettingsScreenView implements View {
	private group: Konva.Group;
	private closeButton: Konva.Image;
	private volumeBar: Konva.Rect;

	constructor() {
		this.group = new Konva.Group({ visible: false });

		// Overlay
		const overlay = new Konva.Rect({
			x: 0,
			y: 0,
			width: STAGE_WIDTH,
			height: STAGE_HEIGHT,
			fill: "rgba(0,0,0,0.5)",
		});
		this.group.add(overlay);

		/**
         * Settings Panel
         */
        
		const settingsPanel = new Konva.Rect({
			x: (STAGE_WIDTH - SETTINGS_WIDTH) / 2,
			y: (STAGE_HEIGHT - SETTINGS_HEIGHT) / 2,
			width: SETTINGS_WIDTH,
			height: SETTINGS_HEIGHT,
			fill: "lightgray",
			stroke: "black",
			strokeWidth: 2,
			cornerRadius: 10,
		});

        const settingsPanel_title = new Konva.Text({
            x: (STAGE_WIDTH - SETTINGS_WIDTH) / 2 + 20,
            y: (STAGE_HEIGHT - SETTINGS_HEIGHT) / 2 + 20,
            text: "Settings",
            fontSize: 24,
            fontFamily: "Arial",
            fill: "black",
        });

		this.group.add(settingsPanel, settingsPanel_title);

        /**
         * Volume Slider
         */

		this.volumeBar = new Konva.Rect({
			x: (STAGE_WIDTH - SETTINGS_WIDTH) / 2 + 80,
			y: (STAGE_HEIGHT - SETTINGS_HEIGHT) / 2 + 140,
			width: 200,
			height: 10,
			fill: "gray",
			cornerRadius: 5,
		});

		this.group.add(this.volumeBar);

        /**
         *  Close Button
         */

        const closeButtonImg = new Image();
        closeButtonImg.src = "images/closebutton.svg";

        this.closeButton = new Konva.Image({
            x: (STAGE_WIDTH + SETTINGS_WIDTH) / 2 - 30,
            y: (STAGE_HEIGHT - SETTINGS_HEIGHT) / 2 + 10,
            width: 20,
            height: 20,
            listening: true,
            image: undefined,
        });

        closeButtonImg.onload = () => {
            this.closeButton.image(closeButtonImg);
            
            this.closeButton.on('mouseover', function (e) {
                e.target.getStage()!.container().style.cursor = 'pointer';
            });
            
            this.closeButton.on('mouseout', function (e) {
                e.target.getStage()!.container().style.cursor = 'default';
            });

            this.group.add(this.closeButton);
            this.closeButton.moveToTop();
        };
	}

    /*
    * Getters
    */

	getCloseButton(): Konva.Image {
		return this.closeButton;
	}

	getVolumeBar(): Konva.Rect {
		return this.volumeBar;
	}

	getGroup(): Konva.Group {
		return this.group;
	}

	/**
	 * Show / Hide
	 */

	show(): void {
		this.group.visible(true);
		this.group.moveToTop();
	}

	hide(): void {
		this.group.visible(false);
	}
}