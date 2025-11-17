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
        private model: PlayerModel, 
        private view: PlayerViewer,
        private audio: AudioController,
        private input = new InputHandler()
    ) {
        for (const key in this.model.audio){
            this.audio.registerSound(key, model.audio[key]);
        }
    }

    destructor() {
        this.view.destructor();

        //mark for garbage collection
        (this as any).model = null;
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
        this.model.reset();
    }

    /**
     * take damage function
     * @param amount amount of damage
     */
    public damage(amount: number){
        this.model.damage(amount);
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
        
        //speed on time about x(for given model) pixel per second from last move
        this.model.move(dx * this.model.speed * deltaTime, dy * this.model.speed * deltaTime);

        //actions and animation only one at a time
        if (dx !== 0 || dy !== 0) {
            this.model.setAnimation("walk");
            this.audio.play("walk", true);
        } else if (this.input.isDown("f")) {
            this.model.setAnimation("attackslash");
            this.audio.play("attackslash");
        } else if (this.input.isDown("e")) {
            this.model.setAnimation("attackdown");
            this.audio.play("attackdown");
        } else if (this.input.isDown("r")) {
            this.model.setAnimation("attackbow");
            this.audio.play("attackbow");
        } else {
            this.audio.stop("walk");
            this.model.setAnimation("idle");            
        }
        this.view.render(this.model);
    }

    /**
     * Getter methods for various utility
     */
    shape(): Konva.Group { return this.view.group; }
    boundingBox(): AABB { return this.view.getCurrentWorldBoundingBox(); }
    dead(): boolean { return this.model.dead; }
    destroy(): void { this.destructor(); }
}