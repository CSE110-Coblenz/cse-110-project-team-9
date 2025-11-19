import { NodeType, MainGameScreenModel } from "../MainGameScreen/MainGameScreenModel";
import { MainGameScreenView } from "../MainGameScreen/MainGameScreenView";
import { ScreenController, ScreenSwitcher } from "../../types"
import { AudioController } from "../../audios/AudioController";


export class MainGameScreenController extends ScreenController {

    private audio: AudioController;
    private view: MainGameScreenView;
    private screenSwitcher: ScreenSwitcher;
    private gameModel: MainGameScreenModel = new MainGameScreenModel();

    private readonly BOARD_LENGTH = 40;

    constructor(screenSwitcher: ScreenSwitcher, audio: AudioController){
        
        super();

        this.view = new MainGameScreenView(this.gameModel, audio);
        this.screenSwitcher = screenSwitcher;
        this.audio = audio;

        this.view.onPlayerRoll(() => this.onPlayerRoll());
			this.view.onSettingsOpen(() => {
				this.audio.play("click_sfx");
				this.screenSwitcher.layerOnScreen({ type: "settings" });
			});

        audio.registerSound("mainboard_bgm", "/mainboard/audio/mainboardBGM.mp3");
        audio.registerSound("click_sfx", "/homescreen/audio/click.mp3");

        const tiles = this.view.getTiles();

        // tiles[0].on("click", () => this.screenSwitcher.switchToScreen({ type: "wizard" }));
        // tiles[1].on("click", () => this.screenSwitcher.switchToScreen({ type: "amongus" }));
        // tiles[2].on("click", () => this.screenSwitcher.switchToScreen({ type: "basicQuestion1" }));
        // tiles[3].on("click", () => this.screenSwitcher.switchToScreen({ type: "basicQuestion2" }));
    }


    public diceRoll(): number {
        return Math.floor(Math.random() * 6) + 1;
    }

	public async onPlayerRoll(){
		this.view.disableRollButton();
		
		// Play dice roll sound effect
		this.audio.play("click_sfx");

        const roll = this.diceRoll();
        this.audio.play("dice_sfx", false);
        console.log(`Player rolled a ${roll}.`);
        this.view.displayRollResult(roll);

        // Play the sound effect immediately, before any async operations.
        this.audio.play("dice_sfx", false);

        // Execute the rest of the turn logic asynchronously.
        this.executeTurn(roll);
    }

    private async executeTurn(roll: number): Promise<void> {
        await this.view.animatePlayerPieceRoll(roll);
        const currentPosition = this.gameModel.getPlayerPosition();

        const newPosition = (currentPosition + roll) % this.BOARD_LENGTH;
        this.gameModel.setPlayerPosition(newPosition); // newPosition is 0-indexed
        console.log(`Player moved to position ${newPosition + 1}`);
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
                // const newMinigameScore = this.gameModel.getPlayerScore("default") + 10;
                // this.gameModel.setPlayerScore("default", newMinigameScore);
                // this.view.updateScoreDisplay(newMinigameScore);
                break;
            case NodeType.START:
                // No action needed for the start tile
                break;
            default:
                console.warn(`Unknown node type encountered at index ${nodeIndex}.`);
        }
    }

    public getView(): MainGameScreenView {
        return this.view;
    }



    public show(): void {
        this.audio.play("mainboard_bgm", true); // true for loop (BGM)
        this.view.show();
    }

    public hide(): void {
        this.audio.stopAll();
        this.view.hide();
    }
}