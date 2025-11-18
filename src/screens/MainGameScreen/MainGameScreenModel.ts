import {Player} from '../../class/MainGameScreenClasses/Player';

export enum NodeType {
    START,
    EASY_QUESTION,
    MEDIUM_QUESTION,
    HARD_QUESTION,
    MINIGAME
}

export class MainGameScreenModel {

    private players: Map<string, Player> = new Map<string, Player>();

    private currentPlayerID: string;
    private playerOrder: string[];

    private readonly mainGameBoard : NodeType[] =[
    NodeType.START,            // 1
    NodeType.EASY_QUESTION,    // 2
    NodeType.MEDIUM_QUESTION,  // 3
    NodeType.HARD_QUESTION,    // 4
    NodeType.MINIGAME,    // 5
    NodeType.MEDIUM_QUESTION,  // 6
    NodeType.MINIGAME,         // 7
    NodeType.HARD_QUESTION,    // 8
    NodeType.EASY_QUESTION,    // 9
    NodeType.MINIGAME,  // 10
    NodeType.HARD_QUESTION,    // 11
    NodeType.EASY_QUESTION,    // 12
    NodeType.MEDIUM_QUESTION,  // 13
    NodeType.MINIGAME,         // 14
    NodeType.EASY_QUESTION,    // 15
    NodeType.EASY_QUESTION,    // 16
    NodeType.MEDIUM_QUESTION,  // 17
    NodeType.EASY_QUESTION,    // 18
    NodeType.EASY_QUESTION,    // 19
    NodeType.HARD_QUESTION,    // 20
    NodeType.MINIGAME,         // 21
    NodeType.EASY_QUESTION,    // 22
    NodeType.HARD_QUESTION,    // 23
    NodeType.EASY_QUESTION,    // 24
    NodeType.HARD_QUESTION,    // 25
    NodeType.EASY_QUESTION,    // 26
    NodeType.HARD_QUESTION,    // 27
    NodeType.MINIGAME,         // 28
    NodeType.MEDIUM_QUESTION,  // 29
    NodeType.EASY_QUESTION,    // 30
    NodeType.MEDIUM_QUESTION,  // 31
    NodeType.MINIGAME,    // 32
    NodeType.MEDIUM_QUESTION,  // 33
    NodeType.EASY_QUESTION,    // 34
    NodeType.MINIGAME,         // 35
    NodeType.MEDIUM_QUESTION,  // 36
    NodeType.EASY_QUESTION,    // 37
    NodeType.HARD_QUESTION,    // 38
    NodeType.EASY_QUESTION,    // 39
    NodeType.MINIGAME          // 40
    ]

    constructor(playerIDs: string[]){
        if (this.mainGameBoard.length !== 40)
        {
            throw new Error("Main game board must have exactly 40 nodes.");
        }

        this.playerOrder = playerIDs;
        this.currentPlayerID = playerIDs[0];

        for(const id of playerIDs){
            this.players.set(id, new Player(id));
        }
    }

    public getNodeType( nodeIndex: number ) : NodeType {
        if (nodeIndex < 1 || nodeIndex > this.mainGameBoard.length) {
            throw new Error("Node index out of bounds.");
        }
        return this.mainGameBoard[nodeIndex - 1];
    }

    public advanceToNextPlayer(): void {
        const currentIndex = this.playerOrder.indexOf(this.currentPlayerID);
        const nextIndex = (currentIndex + 1) % this.playerOrder.length;
        this.currentPlayerID = this.playerOrder[nextIndex];
    }

    private getPlayer(playerID: string): Player {
        return this.players.get(playerID)!;
    }

    public getCurrentPlayerID(): string {
        return this.currentPlayerID;
    }

    public getPlayerPosition(playerID: string): number {
        return this.getPlayer(playerID).position;
    }

    public setPlayerPosition(playerID: string, position: number): void {
        this.getPlayer(playerID).position = position;
    }

    // public getPlayerScore(playerID: string): number {
    //     return this.getPlayer(playerID).score;
    // }

    // public setPlayerScore(playerID: string, score: number): void {
    //     this.getPlayer(playerID).score = score;
    // }


}