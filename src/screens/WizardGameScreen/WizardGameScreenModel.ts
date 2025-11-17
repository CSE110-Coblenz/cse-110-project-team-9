import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants";

export class WizardGameScreenModel {
    public width: number;
    public height: number;

    /**
     * constructs the game model window
     */
    constructor() {
        this.width = STAGE_WIDTH;
        this.height = STAGE_HEIGHT;
    }
}