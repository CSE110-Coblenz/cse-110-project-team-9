export enum NodeType {
    START,
    EASY_QUESTION,
    MEDIUM_QUESTION,
    HARD_QUESTION,
    MINIGAME
}

export class MainGameScreenModel {

    private position: number;

    private readonly mainGameBoard : NodeType[] =[
    NodeType.START,            // 1
    NodeType.EASY_QUESTION,    // 2
    NodeType.MEDIUM_QUESTION,  // 3
    NodeType.HARD_QUESTION,    // 4
    NodeType.MINIGAME,         // 5
    NodeType.MEDIUM_QUESTION,  // 6
    NodeType.MINIGAME,         // 7
    NodeType.HARD_QUESTION,    // 8
    NodeType.EASY_QUESTION,    // 9
    NodeType.MINIGAME,         // 10
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
    NodeType.MINIGAME,         // 32
    NodeType.MEDIUM_QUESTION,  // 33
    NodeType.EASY_QUESTION,    // 34
    NodeType.MINIGAME,         // 35
    NodeType.MEDIUM_QUESTION,  // 36
    NodeType.EASY_QUESTION,    // 37
    NodeType.HARD_QUESTION,    // 38
    NodeType.EASY_QUESTION,    // 39
    NodeType.MINIGAME          // 40
    ]

    constructor(){
        this.position = 0;
    }

    public getNodeType( nodeIndex: number ) : NodeType {
        if (nodeIndex < 1 || nodeIndex > this.mainGameBoard.length) {
            throw new Error("Node index out of bounds.");
        }
        return this.mainGameBoard[nodeIndex - 1];
    }

    public getPlayerPosition(): number {
        return this.position;
    }

    public setPlayerPosition( position: number): void {
        this.position = position;
    }
}