export class PlayerModel {
    public x: number;
    public y: number;
    public speed: number;

    //TODO: refactor x and y pos into generic entity model perhaps
    
    /**
     * 
     * @param x x pos in game
     * @param y y pos in game
     * @param speed average speed in pixels
     */
    constructor(x = 150, y = 60, speed = 150) {
        this.x = x;
        this.y = y;
        this.speed = speed;
    }
}
