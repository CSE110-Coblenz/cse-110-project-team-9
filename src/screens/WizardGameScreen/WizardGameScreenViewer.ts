import Konva from "konva";
import type { View } from "../../types";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants";

export class WizardGameScreenViewer implements View {
    private group: Konva.Group;

    constructor() {
        this.group = new Konva.Group({ visible: false });

        //Place holder for background
        const bg = new Konva.Rect({
            x: 0,
            y: 0,
            width: STAGE_WIDTH,
            height: STAGE_HEIGHT,
            fill: "#3a7389ff",
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
