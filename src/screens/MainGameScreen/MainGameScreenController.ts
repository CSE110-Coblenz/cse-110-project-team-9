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
    }

    public async onPlayerRoll() {
        this.view.disableRollButton();
        
        this.audio.play("click_sfx");

        const roll = this.diceRoll();
        this.audio.play("dice_sfx", false);
        this.view.displayRollResult(roll);

        this.executeTurn(roll);
    }

    private async executeTurn(roll: number): Promise<void> {
        const currentPosition = this.gameModel.getPlayerPosition();
        const potentialNewPosition = currentPosition + roll;
        const finalPosition = this.BOARD_LENGTH - 1;

        let actualMoves: number;
        let targetPosition: number;

        if (potentialNewPosition >= finalPosition) {
            actualMoves = finalPosition - currentPosition;
            targetPosition = finalPosition;
        } else {
            actualMoves = roll;
            targetPosition = potentialNewPosition;
        }

        if (actualMoves > 0) {
            await this.view.animatePlayerPieceRoll(actualMoves);
        }

        this.gameModel.setPlayerPosition(targetPosition);
        this.triggerNodeEvent(targetPosition + 1);

        if (targetPosition < finalPosition) {
            this.view.enableRollButton();
        }
    }

    public triggerNodeEvent(nodeIndex: number): void {
        const nodeType = this.gameModel.getNodeType(nodeIndex); 
        switch (nodeType)
        {   
            case NodeType.EASY_QUESTION:
                setCurrentDifficulty("easy" as DifficultyLevel);
                this.view.displayNodeEvent("Landed on a Question tile!");
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
                break;

            case NodeType.END:
                this.view.displayEnd(() => {
                    setTimeout(() => window.location.reload(), 5000);
                });
                break;

            default:
                console.warn(`Unknown node type encountered at index ${nodeIndex}.`);
        }
    }

    private async triggerRandomMinigame(): Promise<void> {
        const choice = await this.view.spinMinigameWheel();

        if (choice === 1) {
            this.screenSwitcher.switchToScreen({ type: "amongUsMenu" });
        } else {
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
