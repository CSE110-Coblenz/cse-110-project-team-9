import { NodeType, MainGameScreenModel } from "../MainGameScreen/MainGameScreenModel";
import { MainGameScreenView } from "../MainGameScreen/MainGameScreenView";
import { ScreenController, ScreenSwitcher } from "../../types";
import { AudioController } from "../../audios/AudioController";

import { Player } from "../../class/MainGameScreenClasses/Player";

export class MainGameScreenController extends ScreenController {

    private view: MainGameScreenView;
    private screenSwitcher: ScreenSwitcher;
    private gameModel: MainGameScreenModel = new MainGameScreenModel();

    private readonly BOARD_LENGTH = 40;

    constructor(screenSwitcher: ScreenSwitcher, private audio: AudioController, private player: Player) {
        super();

        this.view = new MainGameScreenView(this.gameModel, this.audio, this.player);
        this.screenSwitcher = screenSwitcher;

        // Subscribe to score changes - automatically update display when score changes
        this.player.onScoreChange(() => this.view.updateScoreDisplay());

        this.view.onPlayerRoll(() => this.onPlayerRoll());
        this.view.onSettingsOpen(() => {
            this.audio.play("click_sfx");
            this.screenSwitcher.layerOnScreen({ type: "settings" });
        });

        audio.registerSound("mainboard_bgm", `${import.meta.env.BASE_URL}mainboard/audio/mainboardBGM.mp3`);
        audio.registerSound("click_sfx", `${import.meta.env.BASE_URL}homescreen/audio/click.mp3`);
        audio.registerSound("dice_sfx", `${import.meta.env.BASE_URL}mainboard/audio/dice_roll.mp3`);
        audio.registerSound("piece_move_sfx", `${import.meta.env.BASE_URL}mainboard/audio/piece_move.mp3`);
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
                this.screenSwitcher.layerOnScreen({ type: "math" });
                this.view.updateScoreDisplay();
                break;

            case NodeType.MINIGAME:
                this.triggerRandomMinigame();
                break;

            case NodeType.START:
                this.screenSwitcher.switchToScreen({ type: "home" });
                //TODO: fix restart miss
                break;
        }
    }

    /**
     * Randomly select and launch a minigame
     */
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

    public updateScoreDisplay(): void {
        this.view.updateScoreDisplay();
    }
}
