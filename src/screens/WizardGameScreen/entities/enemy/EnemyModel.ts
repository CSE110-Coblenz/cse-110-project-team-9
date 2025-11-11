export class EnemyModel {
    private _x: number;
    private _y: number;
    private _speed: number;
    private _dead: boolean;
    private _currentAnimation: string;
    
    /**
     * 
     * @param x x pos in game
     * @param y y pos in game
     * @param speed average speed in pixels
     * @param dead existing or not
     */
    constructor(x = 150, y = 60, speed = 150, currentAnimation = "idle") {
        this._x = x;
        this._y = y;
        this._speed = speed;
        this._dead = false; 
        this._currentAnimation = currentAnimation;
    }

    /**
     * getters for private values
     */
    get x() { return this._x; }
    get y() { return this._y; }
    get speed() { return this._speed; }
    get dead() { return this._dead; }
    get currentAnimation() { return this._currentAnimation; }

    /**
     * setters for private values
     */
    setAnimation(animation: string){
        this._currentAnimation = animation;
    }

    move(dx: number, dy: number){
        this._x += dx;
        this._y += dy;
    }

    death() {
        this._dead = true;
    }
}
