import { PlayerModel } from "./PlayerModel";
import { PlayerViewer } from "./PlayerViewer";
import { InputHandler } from "../../InputHandler";
import { Collidable } from "../CollisionManager";
import { AudioController } from "../../../../audios/AudioController";
import { PlayerHUD } from "./PlayerHUD";

//todo: config file
const DAMAGE_ON_COLLISION = 5;

export class PlayerController implements Collidable {
    constructor(
        private _model: PlayerModel, 
        private _hud: PlayerHUD,
        private view: PlayerViewer,
        private audio: AudioController,
        private input: InputHandler 
    ) {
        for (const key in this._model.audio) {
            this.audio.registerSound(key, this._model.audio[key]);
        }
    }

    destructor() {
        this.view.destructor();
        // this.model.destructor();
        // this._hud.destructor();
    }
    
    public onCollision?(_other: Collidable): void {
        this._model.damage(DAMAGE_ON_COLLISION);
    }

    public reset() {
        this._model.reset();
    }

    public damage(amount: number) {
        this._model.damage(amount);
    }
    

    update(deltaTime: number) {
        let dx = 0, dy = 0;

        if (this.input.isDown("ArrowUp") || this.input.isDown("w")) dy -= 1;
        if (this.input.isDown("ArrowDown") || this.input.isDown("s")) dy += 1;
        if (this.input.isDown("ArrowLeft") || this.input.isDown("a")) dx -= 1;
        if (this.input.isDown("ArrowRight") || this.input.isDown("d")) dx += 1;

        //fix for double speed diagonal movement
        if (dx !== 0 && dy !== 0) {
            const mag = Math.sqrt(dx * dx + dy * dy);
            dx /= mag;
            dy /= mag;
        }

        //flips player image based on what direction you are going
        if (dx < 0) this._model.direction = "left";
        if (dx > 0) this._model.direction = "right";
                
        //speed on time about x(for given model) pixel per second from last move
        this._model.x += dx * this._model.speed * deltaTime;
        this._model.y += dy * this._model.speed * deltaTime;
        
        this._model.attackCurrentAnimation = null;

        //actions and animation only one at a time
        if (dx !== 0 || dy !== 0) {
            this._model.bodyCurrentAnimation = "walk";
            this.audio.play("walk", true);
        } else if (this.input.isDown("f")) {            
            if(this._model.bodyCurrentAnimation !== "attackslash"){
                this.audio.play("attackslash", true);
            }
            this._model.bodyCurrentAnimation = "attackslash";
            this._model.attackCurrentAnimation = "attackslash";
        } else if (this.input.isDown("e")) {
            if(this._model.bodyCurrentAnimation !== "attackdown"){
                this.audio.play("attackdown", true);
            }
            this._model.bodyCurrentAnimation = "attackdown";
            this._model.attackCurrentAnimation = "attackdown";
        } else if (this.input.isDown("r")) {
            if(this._model.bodyCurrentAnimation !== "attackbow"){
                this.audio.play("attackbow", true);
            }
            this._model.bodyCurrentAnimation = "attackbow";
            this._model.attackCurrentAnimation = "attackbow";
        } else {
            this.audio.stop("attackslash");
            this.audio.stop("attackdown");
            this.audio.stop("attackbow");
            this.audio.stop("walk");
            this._model.bodyCurrentAnimation = "idle";            
        }
        this._hud.render();
        this.view.render(this._model);
    }

    /**
     * Getter methods for various utility
     */
    get model() { return this._model; }
    shape() { return this.view.group; }
    boundingBox() { return this.view.bodyBoxes; }
    bodyBox() { return this.view.bodyBoxes; }
    attackBox() { return this.view.attackBoxes; }
    dead() { return this.model.dead; }
    destroy() { this.destructor(); }
}