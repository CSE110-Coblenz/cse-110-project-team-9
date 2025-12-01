import { NodeType, MainGameScreenModel } from "../MainGameScreen/MainGameScreenModel";
import { MainGameScreenView } from "../MainGameScreen/MainGameScreenView";
import { ScreenController, ScreenSwitcher } from "../../types";
import { AudioController } from "../../audios/AudioController";
import type { DifficultyLevel } from "../../class/MathEquations/dictionaryMethods";
import { setCurrentDifficulty } from "../../class/MathEquations/QuadraticEquationsHelper";

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
    }

    public diceRoll(): number {
        return Math.floor(Math.random() * 6) + 1;
        //return 30;
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
        const currentPosition = this.gameModel.getPlayerPosition();
        const potentialNewPosition = currentPosition + roll;
        const finalPosition = this.BOARD_LENGTH - 1; // End node is at index 39

        // Calculate how many moves we can actually make before reaching the end
        let actualMoves: number;
        let targetPosition: number;

        if (potentialNewPosition >= finalPosition) {
            // Player would reach or pass the end node - stop at the end
            actualMoves = finalPosition - currentPosition;
            targetPosition = finalPosition;
        } else {
            // Normal move - can use the full roll
            actualMoves = roll;
            targetPosition = potentialNewPosition;
        }

        // Only animate the actual moves we can make
        if (actualMoves > 0) {
            await this.view.animatePlayerPieceRoll(actualMoves);
        }

        // Set the final position
        this.gameModel.setPlayerPosition(targetPosition);
        this.triggerNodeEvent(targetPosition + 1); // getNodeType is 1-indexed

        // Only re-enable the roll button if we didn't reach the end
        if (targetPosition < finalPosition) {
            this.view.enableRollButton();
        }
        // If we reached the end, triggerNodeEvent will call displayEnd and the button stays disabled
    }

    public triggerNodeEvent(nodeIndex: number): void {
        const nodeType = this.gameModel.getNodeType(nodeIndex); 
        switch (nodeType)
        {   
            case NodeType.EASY_QUESTION:
                setCurrentDifficulty("easy" as DifficultyLevel);
                this.view.displayNodeEvent("You landed on an Easy Question tile!");
                this.screenSwitcher.layerOnScreen({ type: "math" });
                break;
            case NodeType.MEDIUM_QUESTION:
                setCurrentDifficulty("medium" as DifficultyLevel);
                this.view.displayNodeEvent("You landed on a Medium Question tile!");
                this.screenSwitcher.layerOnScreen({ type: "math" });
                break;
            case NodeType.HARD_QUESTION:
                setCurrentDifficulty("hard" as DifficultyLevel);
                this.view.displayNodeEvent("You landed on a Hard Question tile!");  
                this.screenSwitcher.layerOnScreen({ type: "math" });
                break;

            case NodeType.MINIGAME:
                this.view.displayNodeEvent("Landed on a Minigame tile!");
                this.triggerRandomMinigame();
                break;

            case NodeType.START:
                // No action needed for the start tile
                break;

            case NodeType.END:
                this.view.displayEnd(() => {
                    // After 5 seconds, reload the page
                    setTimeout(() => window.location.reload(), 5000);
                });
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
            this.screenSwitcher.switchToScreen({ type: "wizardminigame" });
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