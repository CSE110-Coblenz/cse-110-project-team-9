import Konva from "konva";
import type { View } from "../../types";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants";

export class WizardGameScreenView implements View {
    private group: Konva.Group;

    constructor() {
        this.group = new Konva.Group({ visible: false });
        const backgroundSrc = "/wizardminigame/Grass_Sample.png";

        const imageObj = new Image();
        imageObj.src = backgroundSrc;

        const bg = new Konva.Image({
            x: 0,
            y: 0,
            image: imageObj,
            width: STAGE_WIDTH,
            height: STAGE_HEIGHT,
            name: 'background',
        });
        this.group.add(bg);
    }

    public show(): void {
        this.group.visible(true);
    }

    public hide(): void {
        this.group.visible(false);
    }   

    public getGroup(): Konva.Group {
        return this.group;
    }
}