import { NodeType, MainGameScreenModel } from "../MainGameScreen/MainGameScreenModel";
import { MainGameScreenView } from "../MainGameScreen/MainGameScreenView";
import { ScreenController, ScreenSwitcher } from "../../types"


export class MainGameScreenController extends ScreenController {

    private view: MainGameScreenView;
    private screenSwitcher: ScreenSwitcher;
    private gameModel: MainGameScreenModel = new MainGameScreenModel(["player1"]);

    private readonly BOARD_LENGTH = 40;

    constructor(screenSwitcher: ScreenSwitcher){
        
        super();

        this.view = new MainGameScreenView();
        this.screenSwitcher = screenSwitcher;

        const tiles = this.view.getTiles();

        // tiles[0].on("click", () => this.screenSwitcher.switchToScreen({ type: "wizard" }));
        // tiles[1].on("click", () => this.screenSwitcher.switchToScreen({ type: "amongus" }));
        // tiles[2].on("click", () => this.screenSwitcher.switchToScreen({ type: "basicQuestion1" }));
        // tiles[3].on("click", () => this.screenSwitcher.switchToScreen({ type: "basicQuestion2" }));
    }


    public diceRoll(): number {
        return Math.floor(Math.random() * 6) + 1;
    }

    public onPlayerRoll(){
        const roll = this.diceRoll();
        console.log(`Player rolled a ${roll}.`);

        const currentPlayerID = this.gameModel.getCurrentPlayerID();
        const currentPosition = this.gameModel.getPlayerPosition(currentPlayerID);

        const newPosition = (currentPosition + roll) % this.BOARD_LENGTH;
        console.log("Player moved to position " + (newPosition + 1));
        this.gameModel.setPlayerPosition(currentPlayerID, newPosition); // newPosition is 0-indexed
        this.triggerNodeEvent(currentPlayerID, newPosition + 1); // getNodeType is 1-indexed
    }

    public triggerNodeEvent(playerID: string, nodeIndex: number): void {
        const nodeType = this.gameModel.getNodeType(nodeIndex); 
        switch (nodeType)
        {
            case NodeType.EASY_QUESTION:
            case NodeType.MEDIUM_QUESTION:
            case NodeType.HARD_QUESTION:
                //switch to main screen controller to switch to question screen
                console.log(`Player ${playerID} landed on a question node at position ${nodeIndex}.`);
                break;
            case NodeType.MINIGAME:
                //switch to main screen controller to switch to minigame screen
                console.log(`Player ${playerID} landed on a minigame node at position ${nodeIndex}.`);
                break;
            default:
                throw new Error("Unknown node type encountered.");
        }
    }

    public advanceToNextPlayer(): void {
        this.gameModel.advanceToNextPlayer();

        const nextPlayerID = this.gameModel.getCurrentPlayerID();
        console.log(`Advancing to player ${nextPlayerID}.`);
    }

    public getView(): MainGameScreenView {
        return this.view;
    }
}