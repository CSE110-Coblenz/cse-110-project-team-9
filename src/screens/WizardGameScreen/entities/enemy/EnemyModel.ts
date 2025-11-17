export class EnemyModel {
    private _x: number;
    private _y: number;
    private _speed: number;
    private _health: number; //out of 100
    private _currentAnimation: string;
    //this is a audio mapping
    private _AUDIO: Record<string, string>;
    
    /**
     * 
     * @param x x pos in screen
     * @param y y pos in screen
     * @param speed average speed in pixels a second
     * @param AUDIO audio files for animations/events
     */
    constructor(x = 150, y = 60, speed = 150, AUDIO: Record<string,string>) {
        this._x = x;
        this._y = y;
        this._speed = speed;
        this._health = 100;
        this._currentAnimation = "idle";
        this._AUDIO = AUDIO;
    }

    /**
     * take daamage functions
     * @param amount damage taken ammount
     */
    damage(amount: number) {
        this._health -= amount;
        if (this._health < 0) this._health = 0;
    }

    /**
     * getters for private values
     */
    get x() { return this._x; }
    get y() { return this._y; }
    get speed() { return this._speed; }
    get dead() { return this._health <= 0; }
    get currentAnimation() { return this._currentAnimation; }
    get audio() { return this._AUDIO }
    get health() { return this._health; }

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
}
