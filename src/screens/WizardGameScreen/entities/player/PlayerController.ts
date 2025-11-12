import type { PlayerModel } from "./PlayerModel";
import type { PlayerViewer } from "./PlayerViewer";
import type { Collidable, AABB } from "../CollisionManager";
import { AudioController } from "../../../../audios/AudioController";

export class PlayerController<Animation extends string> implements Collidable {
    private keys: Record<string, boolean> = {};    

    constructor(
        private model: PlayerModel, 
        private view: PlayerViewer<Animation>,
        private audio: AudioController
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
     * add Listening functionality
     */
    bindControls() {
        window.addEventListener("keydown", (e) => this.handleKeyDown(e));
        window.addEventListener("keyup", (e) => this.handleKeyUp(e));
    }
    /**
     * remove Listening functionality
     */
    unbindControls() {
        window.removeEventListener("keydown", (e) => this.handleKeyDown(e));
        window.removeEventListener("keyup", (e) => this.handleKeyUp(e));
    }
    /**
     * takes x input key to be true (pressed)
     * @param e keyboard event
     */
    private handleKeyDown = (e: KeyboardEvent) => {
        if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","w","a","s","d","f","e","r"].includes(e.key)) {
            this.keys[e.key] = true;
        }
    }
    /**
     * takes x input key to be false (not pressed)
     * @param e 
     */
    private handleKeyUp = (e: KeyboardEvent) => {
        if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","w","a","s","d","f","e","r"].includes(e.key)) {
            this.keys[e.key] = false;
        }
    }
    /**
     * after 
     * @param deltaTime different in time from last animation event
     */
    update(deltaTime: number) {
        let dx = 0, dy = 0;

        if (this.keys["ArrowUp"] || this.keys["w"]) dy -= 1;
        if (this.keys["ArrowDown"] || this.keys["s"]) dy += 1;
        if (this.keys["ArrowLeft"] || this.keys["a"]) dx -= 1;
        if (this.keys["ArrowRight"] || this.keys["d"]) dx += 1;

        //fix for double speed diagonal movement
        if (dx !== 0 && dy !== 0) {
            const mag = Math.sqrt(dx * dx + dy * dy);
            dx /= mag;
            dy /= mag;
        }
        
        //speed on time about x(for given model) pixel per second from last move
        this.model.move(dx * this.model.speed * deltaTime, dy * this.model.speed * deltaTime);

        //TODO: input handling
        //TODO: broken audio

        //actions and animation only one at a time
        if (dx !== 0 || dy !== 0) {
            this.model.setAnimation("walk");
            this.audio.play("walk", true);
        } else if (this.keys["f"]) {
            this.model.setAnimation("attackslash");
            this.audio.play("attackslash");
        } else if (this.keys["e"]) {
            this.model.setAnimation("attackdown");
            this.audio.play("attackdown");
        } else if (this.keys["r"]) {
            this.model.setAnimation("attackbow");
            this.audio.play("attackbow");
        } else {
            this.audio.stop("walk");
            this.model.setAnimation("idle");            
        }
        this.view.render(this.model);
    }
}