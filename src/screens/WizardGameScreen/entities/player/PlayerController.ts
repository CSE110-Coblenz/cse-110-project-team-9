import Konva from "konva";

//Player MVC
import { PlayerModel } from "./PlayerModel";
import { PlayerViewer } from "./PlayerViewer";

//Input Handling
import { InputHandler } from "../../InputHandler";

//Collision Handling
import { Collidable, AABB } from "../CollisionManager";

//Audio Controller
import { AudioController } from "../../../../audios/AudioController";

export class PlayerController implements Collidable {

    constructor(
        private _model: PlayerModel, 
        private view: PlayerViewer,
        private audio: AudioController,
        private input: InputHandler 
    ) {

        for (const key in this._model.audio){
            this.audio.registerSound(key, _model.audio[key]);
        }
    }

    destructor() {
        this.view.destructor();

        //mark for garbage collection
        (this as any)._model = null;
        (this as any).view = null;
    }
    
    /**
     * check collision
     * @param other
     */
    public onCollision?(other: Collidable): void;

    /**
     * reset function;
     */
    public reset(){
        this._model.reset();
    }

    /**
     * take damage function
     * @param amount amount of damage
     */
    public damage(amount: number){
        this._model.damage(amount);
    }
    
    /**
     * after 
     * @param deltaTime different in time from last animation event
     */
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
        this._model.move(dx * this._model.speed * deltaTime, dy * this._model.speed * deltaTime);

        //actions and animation only one at a time
        if (dx !== 0 || dy !== 0) {
            this._model.animation = "walk";
            this.audio.play("walk", true);
        } else if (this.input.isDown("f")) {
            this._model.animation = "attackslash";
            this.audio.play("attackslash");
        } else if (this.input.isDown("e")) {
            this._model.animation = "attackdown";
            this.audio.play("attackdown");
        } else if (this.input.isDown("r")) {
            this._model.animation = "attackbow";
            this.audio.play("attackbow");
        } else {
            this.audio.stop("walk");
            this._model.animation = "idle";            
        }
        this.view.render(this._model);
    }

    /**
     * Getter methods for various utility
     */
    get model() { return this._model; }
    shape() { return this.view.group; }
    boundingBox() { return this.view.boundingBoxes; }
    dead() { return this.model.dead; }
    destroy() { this.destructor(); }
}