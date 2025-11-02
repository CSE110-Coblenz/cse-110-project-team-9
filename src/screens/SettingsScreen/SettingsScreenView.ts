import Konva from "konva";
import { STAGE_WIDTH, STAGE_HEIGHT, SETTINGS_WIDTH, SETTINGS_HEIGHT } from "../../constants";
import type { View } from "../../types";

export class SettingsScreenView implements View {
	private group: Konva.Group;
	private closeButton: Konva.Image;
	private background_volumeBar: Konva.Rect;
	private soundeffect_volumeBar: Konva.Rect;

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
            fontSize: 30,
            fontFamily: "Jacquard 12",
            fill: "black",
        });

		this.group.add(settingsPanel, settingsPanel_title);

        /**
         * Volume Slider (Background Music & Sound Effects)
         */

		this.background_volumeBar = new Konva.Rect({
			x: (STAGE_WIDTH - SETTINGS_WIDTH) / 2 + 80,
			y: (STAGE_HEIGHT - SETTINGS_HEIGHT) / 2 + 120,
			width: 240,
			height: 10,
			fill: "gray",
			cornerRadius: 5,
		});

		this.soundeffect_volumeBar = new Konva.Rect({
			x: (STAGE_WIDTH - SETTINGS_WIDTH) / 2 + 80,
			y: (STAGE_HEIGHT - SETTINGS_HEIGHT) / 2 + 190,
			width: 240,
			height: 10,
			fill: "gray",
			cornerRadius: 5,
		});

		this.group.add(this.background_volumeBar);
		this.group.add(this.soundeffect_volumeBar);

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

	getbackground_VolumeBar(): Konva.Rect {
		return this.background_volumeBar;
	}

	getsoundeffect_VolumeBar(): Konva.Rect {
		return this.soundeffect_volumeBar;
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