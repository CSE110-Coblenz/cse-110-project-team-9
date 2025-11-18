export class PlayerModel {
    private _x: number;
    private _y: number;
    private _speed: number;
    private _health: number; //out of 100
    private _mana: number; //out of 100
    private _currentAnimation: string;
    //this is a audio mapping
    private _AUDIO: Record<string, string>;
    //flips image left or right looks more natural
    private _direction: "left" | "right";
    //collsion bounding boxes per frame
    private _boundingBoxes: Record<string, { x: number; y: number; width: number; height: number }[]>
    
    /**
     * 
     * @param x x pos in screen
     * @param y y pos in screen
     * @param speed average speed in pixels a second
     * @param AUDIO audio files for animations/events
     */
      constructor(
        x: number, y: number, speed: number, 
        AUDIO: Record<string,string>,
        boundingBoxes: Record<string, { x: number; y: number; width: number; height: number }[]>
    ) {
        this._x = x;
        this._y = y;
        this._speed = speed;
        this._health = 100;
        this._mana = 100;
        this._currentAnimation = "idle";
        this._AUDIO = AUDIO;
        this._direction = "right";
        this._boundingBoxes = boundingBoxes;
    }

    /**
     * player reset function after each game
     */
    reset() {
        this._x = 150;
        this._y = 60; 
        this._speed = 150;
        this._health = 100;
        this._mana = 100;
        this._currentAnimation = "idle";
        this._direction = "right";
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
    get mana() { return this._mana; }
    get direction() { return this._direction; }

    public worldBoundingBox(frameIndex: number, scale: number): { x: number; y: number; width: number; height: number } {
        const frames = this._boundingBoxes[this._currentAnimation];
        const frameBox = frames[frameIndex];
        
        let x = this._x;
        if (this._direction === "left") {
            x += 100 * scale - frameBox.width * scale - frameBox.x * scale; // shift collision when flipped
        } else {
            x += frameBox.x * scale;
        }

        return{
            x,
            y: this._y + frameBox.y * scale,
            width: frameBox.width * scale,
            height: frameBox.height * scale
        }
    }

    /**
     * setters for private values
     */
    set direction(d: "left" | "right") { this._direction = d; }
    set animation(a: string) {this._currentAnimation = a; }
    set mana(m: number) {this._mana = m;}

    move(dx: number, dy: number){
        this._x += dx;
        this._y += dy;
    }
}