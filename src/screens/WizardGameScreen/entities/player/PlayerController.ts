import type { PlayerModel } from "./PlayerModel";
import type { PlayerViewer } from "./PlayerViewer";
import type { Collidable, AABB } from "../CollisionManager";
import { AudioController } from "../../../../audios/AudioController";
import { InputHandler } from "../../Inputhandler";

export class PlayerController<Animation extends string> implements Collidable {

    constructor(
        private model: PlayerModel, 
        private view: PlayerViewer<Animation>,
        private audio: AudioController,
        private input = new InputHandler()
    ) {
        for (const key in this.model.audio){
            this.audio.registerSound(key, model.audio[key]);
        }
    }

    /**
     * Return the player's current bounding box in world coordinates, or null if not available.
     * This delegates to the viewer which has access to sprite/frame info.
     */
    public getBoundingBox(): AABB | null {
        // viewer exposes getCurrentWorldBoundingBox()
        if (this.view && typeof (this.view as any).getCurrentWorldBoundingBox === 'function') {
            return (this.view as any).getCurrentWorldBoundingBox();
        }
        return null;
    }
    /**
     * check collision
     * @param other
     */
    public onCollision?(other: Collidable): void;
    
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
}