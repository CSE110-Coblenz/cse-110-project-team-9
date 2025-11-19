import { SPRITE_WIDTH, PLAYER_START_X, PLAYER_START_Y, 
    DEFAULT_HEALTH, DEFAULT_STAMINA, PLAYER_SPEED} from "../../config";
//player bounding boxes for list of animations
//[x, y, width, height] per frame
type BoundingBox = { x: number; y: number; width: number; height: number };
type BoundingBoxMap = Record<string, BoundingBox[]>;

export class PlayerModel {
    private _x: number;
    private _y: number;
    private _speed: number;
    private _health: number;
    private _stamina: number;
    private _bodyCurrentAnimation: string;
    private _attackCurrentAnimation: string | null;
    //audio key to audio file mapping
    private _audio: Record<string, string>;
    //to flip the player ot look natural and directional attacks
    private _direction: "left" | "right";
    //to take damage
    private _bodyBoxes: BoundingBoxMap;
    //to do damage
    private _attackBoxes: BoundingBoxMap;
    
    constructor(
        x: number, 
        y: number, 
        speed: number, 
        audio: Record<string, string>,
        bodyBoxes: BoundingBoxMap,
        attackBoxes: BoundingBoxMap
    ) {
        this._x = x;
        this._y = y;
        this._speed = speed;
        this._health = DEFAULT_HEALTH;
        this._stamina = DEFAULT_STAMINA;
        this._bodyCurrentAnimation = "idle";
        this._attackCurrentAnimation = null;
        this._audio = audio;
        this._direction = "right";
        this._bodyBoxes = bodyBoxes;
        this._attackBoxes = attackBoxes;
    }

    //reset function after every game and delete player function
    reset() {
        this._x = PLAYER_START_X;
        this._y = PLAYER_START_Y;
        this._speed = PLAYER_SPEED;
        this._health = DEFAULT_HEALTH;
        this._stamina = DEFAULT_STAMINA;
        this._bodyCurrentAnimation = "idle";
        this._attackCurrentAnimation = null;
        this._direction = "right";
    }

    damage(amount: number) {
        //take damage floors to 0
        this._health = Math.max(0, this._health - amount);
    }

    bodyBox(frameIndex: number, scale: number): BoundingBox {
        //generate collision box for body
        const frames = this._bodyBoxes[this._bodyCurrentAnimation];
        const frameBox = frames[frameIndex];
        return this.calculateBoundingBox(frameBox, scale);
    }

    attackBox(frameIndex: number, scale: number): BoundingBox {
        //no collision box for attacks to hit essentially delete box
        if (this._attackCurrentAnimation === null) {
            return { x: 0, y: 0, width: 0, height: 0 };
        }
        
        //otherwise generate box as normal
        const frames = this._attackBoxes[this._attackCurrentAnimation];
        const frameBox = frames[frameIndex];
        return this.calculateBoundingBox(frameBox, scale);
    }

    private calculateBoundingBox(frameBox: BoundingBox, scale: number): BoundingBox {
        let x = this._x;
        if (this._direction === "left") {
            x += SPRITE_WIDTH * scale - frameBox.width * scale - frameBox.x * scale;
        } else {
            x += frameBox.x * scale;
        }

        return {
            x,
            y: this._y + frameBox.y * scale,
            width: frameBox.width * scale,
            height: frameBox.height * scale
        };
    }

    /**
     * setters and getter methods to keep values private
     */
    get x() { return this._x; }
    get y() { return this._y; }
    get speed() { return this._speed; }
    get dead() { return this._health <= 0; }
    get bodyCurrentAnimation() { return this._bodyCurrentAnimation; }
    get attackCurrentAnimation(): string | null { return this._attackCurrentAnimation; }
    get audio() { return this._audio; }
    get health() { return this._health; }
    get mana() { return this._stamina; }
    get direction() { return this._direction; }

    set x(x: number) { this._x = x; }
    set y(y: number) { this._y = y; }
    set direction(d: "left" | "right") { this._direction = d; }
    set bodyCurrentAnimation(a: string) { this._bodyCurrentAnimation = a; }
    set attackCurrentAnimation(a: string | null) { this._attackCurrentAnimation = a; }
    set mana(m: number) { this._stamina = m; }
}