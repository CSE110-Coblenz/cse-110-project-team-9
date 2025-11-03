import Konva from "konva";
import { STAGE_WIDTH, STAGE_HEIGHT, SETTINGS_WIDTH, SETTINGS_HEIGHT } from "../../constants";
import type { View } from "../../types";

export class SettingsScreenView implements View {
	private group: Konva.Group;

	private saveButton: Konva.Group;
	private closeButton: Konva.Image;
	private volumeBar: Konva.Rect;

	constructor() {
		this.group = new Konva.Group({ visible: false });

		/* 
		 * Overlay
		 */

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
            x: STAGE_WIDTH / 2 - 50,
            y: (STAGE_HEIGHT - SETTINGS_HEIGHT) / 2 + 20,
            text: "Settings",
            fontSize: 30,
            fontFamily: "HomeScreenFont",
            fill: "black",
        });

		this.group.add(settingsPanel, settingsPanel_title);

        /**
         * Volume Slider (Background Music & Sound Effects)
         */

		this.volumeBar = new Konva.Rect({
			x: (STAGE_WIDTH - SETTINGS_WIDTH) / 2 + 80,
			y: (STAGE_HEIGHT - SETTINGS_HEIGHT) / 2 + 120,
			width: 240,
			height: 10,
			fill: "gray",
			cornerRadius: 5,
		});

		this.group.add(this.volumeBar);

        /**
         *  Save Button
         */

        this.saveButton = this.createTextButton(
			"Save",
			STAGE_WIDTH / 2 - 30,
			(STAGE_HEIGHT + SETTINGS_HEIGHT) / 2 - 60,
			30,
			"HomeScreenFont",
			"black"
		);

		/**
         *  Close Button (X)
         */

        const closeButtonImg = new Image();
        closeButtonImg.src = "homescreen/images/closebutton.svg";

        this.closeButton = new Konva.Image({
            x: (STAGE_WIDTH + SETTINGS_WIDTH) / 2 - 40,
            y: (STAGE_HEIGHT - SETTINGS_HEIGHT) / 2 + 10,
            width: 30,
            height: 30,
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

		this.group.add(buttonGroup);
		return buttonGroup;
	}

    /*
    * Getters
    */

	getCloseButton(): Konva.Image {
		return this.closeButton;
	}

	getSaveButton(): Konva.Group {
		return this.saveButton;
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