import { NodeType, MainGameScreenModel } from "../MainGameScreen/MainGameScreenModel";
import { MainGameScreenView } from "../MainGameScreen/MainGameScreenView";
import { ScreenController, ScreenSwitcher } from "../../types";
import { AudioController } from "../../audios/AudioController";

export class MainGameScreenController extends ScreenController {

    private audio: AudioController;
    private view: MainGameScreenView;
    private screenSwitcher: ScreenSwitcher;
    private gameModel: MainGameScreenModel = new MainGameScreenModel(["default"]);

    private readonly BOARD_LENGTH = 40;

    constructor(screenSwitcher: ScreenSwitcher, audio: AudioController) {
        super();

        this.view = new MainGameScreenView(this.gameModel);
        this.screenSwitcher = screenSwitcher;
        this.audio = audio;

        this.view.onPlayerRoll(() => this.onPlayerRoll());
        this.view.onSettingsOpen(() => {
            this.audio.play("click_sfx");
            this.screenSwitcher.layerOnScreen({ type: "settings" });
        });

        audio.registerSound("mainboard_bgm", "/mainboard/audio/mainboardBGM.mp3");
        audio.registerSound("click_sfx", "/homescreen/audio/click.mp3");
    }

    public diceRoll(): number {
        return Math.floor(Math.random() * 6) + 1;
    }

    public async onPlayerRoll() {
        this.view.disableRollButton();
        
        this.audio.play("click_sfx");

        const roll = this.diceRoll();
        console.log(`Player rolled a ${roll}.`);
        this.view.displayRollResult(roll);
        await this.view.animatePlayerPieceRoll(roll);

        const currentPlayerID = this.gameModel.getCurrentPlayerID();
        const currentPosition = this.gameModel.getPlayerPosition(currentPlayerID);

        const newPosition = (currentPosition + roll) % this.BOARD_LENGTH;
        console.log("Player moved to position " + (newPosition + 1));
        this.gameModel.setPlayerPosition(currentPlayerID, newPosition);
        this.triggerNodeEvent(currentPlayerID, newPosition + 1);

        this.view.enableRollButton();
    }

    public triggerNodeEvent(playerID: string, nodeIndex: number): void {
        const nodeType = this.gameModel.getNodeType(nodeIndex);
        
        switch (nodeType) {
            case NodeType.EASY_QUESTION:
            case NodeType.MEDIUM_QUESTION:
            case NodeType.HARD_QUESTION:
                this.view.displayNodeEvent("You landed on a Question tile!");
                const newQuestionScore = this.gameModel.getPlayerScore("default") + 5;
                this.gameModel.setPlayerScore("default", newQuestionScore);
                this.view.updateScoreDisplay(newQuestionScore);
                break;

            case NodeType.MINIGAME:
                this.view.displayNodeEvent("You landed on a Minigame tile!");
                
                // Wait for the message to display, then trigger minigame
                setTimeout(() => {
                    this.triggerRandomMinigame();
                }, 1000);
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
    private triggerRandomMinigame(): void {
        const minigameChoice = Math.floor(Math.random() * 2) + 1; // 1 or 2
        
        console.log(`Launching minigame ${minigameChoice}`);
        
        if (minigameChoice === 1) {
            // Launch Among Us minigame
            this.screenSwitcher.switchToScreen({ type: "amongUsMenu" });
        } else {
            // Launch Wizard minigame (not implemented yet)
            this.screenSwitcher.switchToScreen({ type: "amongUsMenu" });
        }
    }

    /**
     * Called when returning from a minigame
     * Updates player score based on minigame performance
     */
    public returnFromMinigame(minigameScore: number): void {
        const currentPlayerID = this.gameModel.getCurrentPlayerID();
        const currentScore = this.gameModel.getPlayerScore(currentPlayerID);
        const newScore = currentScore + minigameScore;
        
        this.gameModel.setPlayerScore(currentPlayerID, newScore);
        this.view.updateScoreDisplay(newScore);
        
        console.log(`Minigame completed! Score: ${minigameScore}. Total: ${newScore}`);
    }

    public advanceToNextPlayer(): void {
        this.gameModel.advanceToNextPlayer();

        const nextPlayerID = this.gameModel.getCurrentPlayerID();
        console.log(`Advancing to player ${nextPlayerID}.`);
    }

    public show(): void {
        this.audio.play("mainboard_bgm", true);
        this.view.show();
    }

    public hide(): void {
        this.audio.stopAll();
        this.view.hide();
    }

    public getView(): MainGameScreenView {
        return this.view;
    }
}