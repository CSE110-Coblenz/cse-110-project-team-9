import { NodeType, MainGameScreenModel } from "../MainGameScreen/MainGameScreenModel";
import { MainGameScreenView } from "../MainGameScreen/MainGameScreenView";
import { ScreenController, ScreenSwitcher } from "../../types";
import { AudioController } from "../../audios/AudioController";

export class MainGameScreenController extends ScreenController {

    private audio: AudioController;
    private view: MainGameScreenView;
    private screenSwitcher: ScreenSwitcher;
    private gameModel: MainGameScreenModel = new MainGameScreenModel();

    private readonly BOARD_LENGTH = 40;

    constructor(screenSwitcher: ScreenSwitcher, audio: AudioController) {
        super();

        this.view = new MainGameScreenView(this.gameModel, audio);
        this.screenSwitcher = screenSwitcher;
        this.audio = audio;

        this.view.onPlayerRoll(() => this.onPlayerRoll());
        this.view.onSettingsOpen(() => {
            this.audio.play("click_sfx");
            this.screenSwitcher.layerOnScreen({ type: "settings" });
        });

        audio.registerSound("mainboard_bgm", `${import.meta.env.BASE_URL}mainboard/audio/mainboardBGM.mp3`);
        audio.registerSound("click_sfx", `${import.meta.env.BASE_URL}homescreen/audio/click.mp3`);
        audio.registerSound("dice_sfx", `${import.meta.env.BASE_URL}mainboard/audio/dice_roll.mp3`);
        audio.registerSound("piece_move_sfx", `${import.meta.env.BASE_URL}mainboard/audio/piece_move.mp3`);

        const tiles = this.view.getTiles();

        // tiles[0].on("click", () => this.screenSwitcher.switchToScreen({ type: "wizard" }));
        // tiles[1].on("click", () => this.screenSwitcher.switchToScreen({ type: "amongus" }));
        // tiles[2].on("click", () => this.screenSwitcher.switchToScreen({ type: "basicQuestion1" }));
        // tiles[3].on("click", () => this.screenSwitcher.switchToScreen({ type: "basicQuestion2" }));
    }

    public diceRoll(): number {
        return Math.floor(Math.random() * 6) + 1;
        //return 4;
    }

    public async onPlayerRoll() {
        this.view.disableRollButton();
        
        this.audio.play("click_sfx");

        const roll = this.diceRoll();
        this.audio.play("dice_sfx", false);
        this.view.displayRollResult(roll);

        // Execute the rest of the turn logic asynchronously.
        this.executeTurn(roll);
    }

    private async executeTurn(roll: number): Promise<void> {
        await this.view.animatePlayerPieceRoll(roll);
        const currentPosition = this.gameModel.getPlayerPosition();

        const newPosition = (currentPosition + roll) % this.BOARD_LENGTH;
        this.gameModel.setPlayerPosition(newPosition); // newPosition is 0-indexed
        this.triggerNodeEvent(newPosition + 1); // getNodeType is 1-indexed

        this.view.enableRollButton();
    }

    public triggerNodeEvent(nodeIndex: number): void {
        const nodeType = this.gameModel.getNodeType(nodeIndex); 
        switch (nodeType)
        {   
            case NodeType.EASY_QUESTION:
            case NodeType.MEDIUM_QUESTION:
            case NodeType.HARD_QUESTION:
                this.view.displayNodeEvent("You landed on a Question tile!");
                //const newQuestionScore = this.gameModel.getPlayerScore("default") + 5;
                //this.gameModel.setPlayerScore("default", newQuestionScore);
                //this.view.updateScoreDisplay(newQuestionScore);
                break;

            case NodeType.MINIGAME:
                this.view.displayNodeEvent("You landed on a Minigame tile!");
                //this.screenSwitcher.switchToScreen({ type: "wizardminigame" });
                this.triggerRandomMinigame();
                // Wait for the message to display, then trigger minigame
                // setTimeout(() => {
                //     this.triggerRandomMinigame();
                // }, 1000);
                break;

            case NodeType.START:
                // No action needed for the start tile
                break;

            default:
                console.warn(`Unknown node type encountered at index ${nodeIndex}.`);
        }
    }

    /**
     * Randomly select and launch a minigame
     */
    private async triggerRandomMinigame(): Promise<void> {
        const choice = await this.view.spinMinigameWheel();

        if (choice === 1) {
            // Red side: Launch Among Us minigame
            this.screenSwitcher.switchToScreen({ type: "amongUsMenu" });
        } else {
            // Blue side: Launch Wizard minigame
            this.screenSwitcher.switchToScreen({ type: "amongUsMenu" });
        }
    }

    public getView(): MainGameScreenView {
        return this.view;
    }
    
    public show(): void {
        this.audio.play("mainboard_bgm", true);
        this.view.show();
    }

    public hide(): void {
        this.audio.stopAll();
        this.view.hide();
    }
}
