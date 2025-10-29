//Game manager Switch
import { ScreenController } from "../../types";
import type { ScreenSwitcher } from "../../types";
//Wizard Main
import { WizardGameScreenModel } from "./WizardGameScreenModel";
import { WizardGameScreenViewer } from "./WizardGameScreenViewer";
//Player MVC
import { WizardPlayerModel } from "./entities/WizardPlayerModel";
import { WizardPlayerViewer } from "./entities/WizardPlayerViewer";
import { WizardPlayerController } from "./entities/WizardPlayerController";

export class WizardGameScreenController extends ScreenController {
    private model: WizardGameScreenModel;
    private view: WizardGameScreenViewer;
    private playerModel: WizardPlayerModel;
    private playerViewer: WizardPlayerViewer;
    private playerController: WizardPlayerController;
    private lastUpdateTime = 0;
    private animationFrameId: number | null = null;

    constructor(private screenSwitcher: ScreenSwitcher) {
        super();
        this.model = new WizardGameScreenModel();
        this.view = new WizardGameScreenViewer();
        this.playerModel = new WizardPlayerModel();
        this.playerViewer = new WizardPlayerViewer(this.view.getGroup());
        this.playerController = new WizardPlayerController(this.playerModel, this.playerViewer);
    }

    startGame() {
        this.view.show();
        this.playerController.bindControls();
        this.lastUpdateTime = performance.now();
        this.updateLoop();
    }

    private updateLoop = () => {
        const now = performance.now();
        const delta = (now - this.lastUpdateTime) / 1000;
        this.lastUpdateTime = now;

        this.playerController.update(delta);
        this.animationFrameId = requestAnimationFrame(this.updateLoop);
    };

    stopGame() {
        if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
        this.playerController.unbindControls();
    }

    getView(): WizardGameScreenViewer {
        return this.view;
    }
}
