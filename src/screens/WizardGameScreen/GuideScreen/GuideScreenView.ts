import Konva from "konva";
import { STAGE_WIDTH, STAGE_HEIGHT, SETTINGS_WIDTH, SETTINGS_HEIGHT } from "../../../constants";
import type { View } from "../../../types";

export class GuideScreenView implements View {
    private group: Konva.Group;
    private closeButton: Konva.Group;
   
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
   

        const panel = new Konva.Rect({
            x: (STAGE_WIDTH - SETTINGS_WIDTH) / 2,
            y: (STAGE_HEIGHT - SETTINGS_HEIGHT) / 2,
            width: SETTINGS_WIDTH,
            height: SETTINGS_HEIGHT,
            fill: "lightgray",
            stroke: "black",
            strokeWidth: 2,
            cornerRadius: 10,
        });
   
        const title = new Konva.Text({
            x: 220,
            y: 170,
            text: "Welcome to the Wizard Minigame!",
            fontSize: 30,
            fontFamily: "HomeScreenFont",
            fill: "black",
        });
   
        this.group.add(panel, title);

        //text box padding
        const panelPaddingX = 10;
        const panelPaddingTop = 60;

        //compute location
        const textX = (STAGE_WIDTH - SETTINGS_WIDTH) / 2 + panelPaddingX;
        const textY = (STAGE_HEIGHT - SETTINGS_HEIGHT) / 2 + panelPaddingTop;
        const textWidth = SETTINGS_WIDTH - panelPaddingX * 2;

        // Guide text content
        const guideContent = 
        `        - yellow bar is stamina
        - empty stamina a Question will appear
        - WASD to move
        - F  R  E  hold to attack
        - Esc to pause/comeback to guide
        Have fun! :)`;

        const guideText = new Konva.Text({
            x: textX,
            y: textY,
            width: textWidth,
            text: guideContent,
            fontSize: 20,
            fontFamily: "HomeScreenFont",
            fill: "black",
            lineHeight: 1.4,
            align: "left",
        });

        this.group.add(guideText);

   
        this.closeButton = this.createTextButton(
            "Close",
            370,
            390,
            30,
            "HomeScreenFont",
            "black"
        );
    }
   
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

    getSaveButton(): Konva.Group {
        return this.closeButton;
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