import { GuideScreenView } from "./GuideScreenView";
import { ScreenController, ScreenSwitcher } from "../../../types";
import { AudioController } from "../../../audios/AudioController";
import { WizardGameScreenController } from "../WizardGameScreenController";

export class GuideScreenController extends ScreenController {
    private view: GuideScreenView;
    private screenSwitcher: ScreenSwitcher;
    private audio: AudioController;
    private parentGameController: WizardGameScreenController;

    constructor(
        screenSwitcher: ScreenSwitcher, 
        audio: AudioController,
        parentGameController: WizardGameScreenController
    ) {
        super();
        this.screenSwitcher = screenSwitcher;
        this.view = new GuideScreenView();
        this.audio = audio;
        this.parentGameController = parentGameController;

        /**
         * Button Event Listeners
         */
        this.view.getSaveButton().on("click", () => {
            this.audio.play("click_sfx");
            this.hide();
            this.parentGameController.resumeGame();
        });
    }

    hide(): void {
        this.view.hide();
    }

    /**
     * Get the view
     */
    getView(): GuideScreenView {
        return this.view;
    }
}