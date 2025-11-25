export class Player{
    public position:number;
    public score: number;
    private scoreChangeListeners: (() => void)[] = [];

    constructor(){
        this.position = 0;
        this.score = 0;
    }   

    addScore(points: number): void {
        this.score += points;
        // Notify all listeners that the score changed
        this.scoreChangeListeners.forEach(listener => listener());
    }

    getScore(): number {
        return this.score;
    }

    onScoreChange(callback: () => void): void {
        this.scoreChangeListeners.push(callback);
    }

    removeScoreChangeListener(callback: () => void): void {
        this.scoreChangeListeners = this.scoreChangeListeners.filter(listener => listener !== callback);
    }
}