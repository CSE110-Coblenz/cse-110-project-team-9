import { PlayerModel } from "./PlayerModel";
import { PlayerViewer } from "./PlayerView";
import { InputHandler } from "../../InputHandler";
import { Collidable } from "../CollisionManager";
import { AudioController } from "../../../../audios/AudioController";
import { PlayerHUD } from "./PlayerHUD";
import { ENEMY_DAMAGE, PLAYER_STAMINA_DRAIN } from "../../config";

export class PlayerController implements Collidable {
    constructor(
        private _model: PlayerModel, 
        private _hud: PlayerHUD,
        private view: PlayerViewer,
        private audio: AudioController,
        private input: InputHandler,
        private exit: () => void,
        private mathQuestion: () => void
    ) {
        for (const key in this._model.audio) {
            this.audio.registerSound(key, this._model.audio[key]);
        }
    }

    destroy() {
        this._hud.render();
        this.view.render(this._model);
        this.exit();
    }
    
    public onCollision(_other: Collidable): void {
        this._model.damage(ENEMY_DAMAGE);
    }

    public onAttackCollision(_attacker: Collidable): void {
        // no attack collision for player
    }

    public reset() {
        this._model.reset();
    }

    update(deltaTime: number) {
        if (this._model.health == 0) {
            this.destroy();
        }

        if (this._model.stamina === 0) {
            this.mathQuestion();
            this._model.stamina = 100;
        }

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
        if (dx !== 0 || dy !== 0) {
            this._model.bodyCurrentAnimation = "walk";
            this.audio.play("walk_SFX", true);
        } else if (this.input.isDown("f")) {   
            this._model.staminaDrain(PLAYER_STAMINA_DRAIN);
            if(this._model.bodyCurrentAnimation !== "attackslash"){
                this.audio.play("attackslash_SFX", true);
            }
            this._model.bodyCurrentAnimation = "attackslash";
            this._model.attackCurrentAnimation = "attackslash";
        } else if (this.input.isDown("e")) {
            this._model.staminaDrain(PLAYER_STAMINA_DRAIN);
            if(this._model.bodyCurrentAnimation !== "attackdown"){
                this.audio.play("attackdown_SFX", true);
            }
            this._model.bodyCurrentAnimation = "attackdown";
            this._model.attackCurrentAnimation = "attackdown";
        } else if (this.input.isDown("r")) {
            this._model.staminaDrain(PLAYER_STAMINA_DRAIN);
            if(this._model.bodyCurrentAnimation !== "attackbow"){
                this.audio.play("attackbow_SFX", true);
            }
            this._model.bodyCurrentAnimation = "attackbow";
            this._model.attackCurrentAnimation = "attackbow";
        } else {
            this.audio.stop("attackslash_SFX");
            this.audio.stop("attackdown_SFX");
            this.audio.stop("attackbow_SFX");
            this.audio.stop("walk_SFX");
            this._model.bodyCurrentAnimation = "idle";            
        }
        this._hud.render();
        this.view.render(this._model);
    }

    get model() { return this._model; }
    get shape() { return this.view.group; }
    get bodyBox() { return this.view.bodyBoxes; }
    get attackBox() { return this.view.attackBoxes; }
    get dead(): boolean { return this.model.dead; }
    get type(): "enemy" | "player" { return "player"; }

    moveBy(dx: number, dy: number) {
        this._model.x += dx/2;
        this._model.y += dy/2;
    }
}