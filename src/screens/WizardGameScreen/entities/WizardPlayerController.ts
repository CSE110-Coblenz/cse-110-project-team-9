import type { WizardPlayerModel } from "./WizardPlayerModel";
import type { WizardPlayerViewer } from "./WizardPlayerViewer";
import type { Collidable, AABB } from "../CollisionManager";

export class WizardPlayerController implements Collidable {
    private keys: Record<string, boolean> = {};
    private walkSound: HTMLAudioElement;

    //TODO: add audio files
    constructor(private model: WizardPlayerModel, private view: WizardPlayerViewer) {
        this.walkSound = new Audio("/8-bit-grass-footsteps-2-408574.mp3")
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

    /** Optional collision handler called by the CollisionManager. */
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
        if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","w","a","s","d","f"].includes(e.key)) {
            this.keys[e.key] = true;
        }
    }

    /**
     * takes x input key to be false (not pressed)
     * @param e 
     */
    private handleKeyUp = (e: KeyboardEvent) => {
        if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","w","a","s","d","f"].includes(e.key)) {
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

        //speed on time about 150 pixel per second from last move
        this.model.x += dx * this.model.speed * deltaTime;
        this.model.y += dy * this.model.speed * deltaTime;

        //actions and animation only one at a time
        if (dx !== 0 || dy !== 0) {
            this.walkSound.play();
            this.view.playAnimation("walk");
        } else if (this.keys["f"]) {
            this.view.playAnimation("attack");
        } else {
            this.view.playAnimation("idle");
        }
        this.view.render(this.model);
    }
}