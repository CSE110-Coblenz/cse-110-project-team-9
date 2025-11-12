import { KnightAudioMap } from "../types/Knight";

export class PlayerModel {
    private _x: number;
    private _y: number;
    private _speed: number;
    private _dead: boolean;
    private _currentAnimation: string;
    //this is a audio mapping
    private _AUDIO: Record<string, string>;
    
    /**
     * 
     * @param x x pos in screen
     * @param y y pos in screen
     * @param speed average speed in pixels a second
     * @param currentAnimation current active animation
     * @param AUDIO audio files for animations/events
     */
    constructor(x = 150, y = 60, speed = 150, currentAnimation = "idle", AUDIO: Record<string, string>) {
        this._x = x;
        this._y = y;
        this._speed = speed;
        this._dead = false;
        this._currentAnimation = currentAnimation;
        this._AUDIO = AUDIO;
    }

    /**
     * getters for private values
     */
    get x() { return this._x; }
    get y() { return this._y; }
    get speed() { return this._speed; }
    get dead() { return this._dead; }
    get currentAnimation() { return this._currentAnimation; }
    get audio() { return this._AUDIO }
        
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