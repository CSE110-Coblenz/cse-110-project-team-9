import type { WizardPlayerModel } from "./WizardPlayerModel";
import type { WizardPlayerViewer } from "./WizardPlayerViewer";

export class WizardPlayerController {
    private keys: Record<string, boolean> = {};

    constructor(private model: WizardPlayerModel, private view: WizardPlayerViewer) {}

    bindControls() {
        window.addEventListener("keydown", (e) => this.handleKeyDown(e));
        window.addEventListener("keyup", (e) => this.handleKeyUp(e));
    }

    /**
     * 
     */
    unbindControls() {
        window.removeEventListener("keydown", (e) => this.handleKeyDown(e));
        window.removeEventListener("keyup", (e) => this.handleKeyUp(e));
    }

    //TODO: might change wasd or arrowkeys for multiplayer
    /**
     * takes x input key to be true (pressed)
     * @param e keyboard event
     */
    private handleKeyDown = (e: KeyboardEvent) => {
        if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","w","a","s","d"].includes(e.key)) {
            this.keys[e.key] = true;
        }
    }

    /**
     * takes x intut key to be false (not pressed)
     * @param e 
     */
    private handleKeyUp = (e: KeyboardEvent) => {
        if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","w","a","s","d"].includes(e.key)) {
            this.keys[e.key] = false;
        }
    }

    /**
     * 
     * @param deltaTime 
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

        this.model.x += dx * this.model.speed * deltaTime;
        this.model.y += dy * this.model.speed * deltaTime;

        if (dx !== 0 || dy !== 0) {
            this.view.playAnimation("walk");
        } else {
            this.view.playAnimation("idle");
        }
        this.view.render(this.model);
    }
}
