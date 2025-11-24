import Konva from "konva";
import { STAGE_WIDTH, STAGE_HEIGHT, SETTINGS_WIDTH, SETTINGS_HEIGHT } from "../../constants";
import type { View } from "../../types";

export class SettingsScreenView implements View {
	private group: Konva.Group;

	private saveButton: Konva.Group;
	private closeButton: Konva.Image;
	private bgmslider: Konva.Group;
	private soundeffectslider: Konva.Group;

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
            x: 350,
            y: 170,
            text: "Settings",
            fontSize: 30,
            fontFamily: "HomeScreenFont",
            fill: "black",
        });

		this.group.add(settingsPanel, settingsPanel_title);

        /**
         * Volume Slider (Background Music & Sound Effects)
         */

		this.bgmslider = this.createVolumeSlider("Background", 230, 250);
		this.soundeffectslider = this.createVolumeSlider("Sound Effect", 230, 320);

        /**
         *  Save Button
         */

        this.saveButton = this.createTextButton(
			"Save",
			370,
			390,
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
            x: 560,
            y: 160,
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

	/**
	 * Helper Funtion — Creating Volume Slider
	 */

	private createVolumeSlider(label: string, x: number, y: number) {
		const volumeSliderGroup = new Konva.Group({ x, y });
	
		// Label
		const text = new Konva.Text({
			text: label,
			fontFamily: "HomeScreenFont",
			fontSize: 18,
			fill: "black",
		});
	
		// Slider bar
		const bar = new Konva.Rect({
			x: 100,
			y: 10,
			width: 200,
			height: 4,
			fill: "grey",
			cornerRadius: 2,
		});
	
		// Filled area
		const fill = new Konva.Rect({
			x: bar.x(),
			y: bar.y(),
			width: bar.width() / 2, // default 50%
			height: bar.height(),
			fill: "black",
			cornerRadius: 2,
		});
	
		// Knob
		const knob = new Konva.Circle({
			x: bar.x() + bar.width() / 2,
			y: bar.y() + bar.height() / 2,
			radius: 8,
			fill: "grey",
			draggable: true,
			dragBoundFunc: pos => {

				const groupAbs = volumeSliderGroup.getAbsolutePosition();
				const minX = bar.x() + groupAbs.x;
				const maxX = bar.x() + bar.width() + groupAbs.x;
				const fixedY = bar.y() + bar.height() / 2 + groupAbs.y;
	
				return {
					x: Math.max(minX, Math.min(maxX, pos.x)),
					y: fixedY,
				};
			},
		});
	
		// Percentage text
		const percent = new Konva.Text({
			x: 330, // bar.x() + bar.width() + 10,
			y: 5, // bar.y() - 5,
			text: "50%",
			fontFamily: "HomeScreenFont",
			fontSize: 12,
			fill: "black",
		});
	
		volumeSliderGroup.add(text, bar, fill, knob, percent);
		this.group.add(volumeSliderGroup);
	
		knob.on("dragmove", () => {
			const knobAbs = knob.getAbsolutePosition();
			const groupAbs = volumeSliderGroup.getAbsolutePosition();
			const localX = knobAbs.x - groupAbs.x;
	
			let ratio = (localX - bar.x()) / bar.width();
			ratio = Math.max(0, Math.min(1, ratio));
			
			fill.width(bar.width() * ratio);
			percent.text(Math.round(ratio * 100) + "%");
		});
		return volumeSliderGroup;
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

	getBgmSlider(): Konva.Group {
		return this.bgmslider;
	}

	getSoundEffectSlider(): Konva.Group {
		return this.soundeffectslider;
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
