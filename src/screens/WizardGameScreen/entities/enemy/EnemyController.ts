import { EnemyModel } from "./EnemyModel";
import { EnemyViewer } from "./EnemyView";
import { Collidable } from "../CollisionManager";
import { AudioController } from "../../../../audios/AudioController";
import { PLAYER_DAMAGE } from "../../config";

export class EnemyController implements Collidable {

    constructor(
        private _model: EnemyModel, 
        private view: EnemyViewer,
        private audio: AudioController
    ) {
        for (const key in this._model.audio){
            this.audio.registerSound(key, _model.audio[key]);
        }
    }

    destroy() {
        this.view.destructor();
    }

    public onCollision(_other: Collidable): void { }

    public onAttackCollision(_attacker: Collidable): void {
        this._model.damage(PLAYER_DAMAGE);
    }

    update(deltaTime: number, playerX: number, playerY: number) {
        let dx = playerX - this._model.x;
        let dy = playerY - this._model.y;

        //fix for double speed diagonal movement
        if (dx !== 0 && dy !== 0) {
            const mag = Math.sqrt(dx * dx + dy * dy);
            dx /= mag;
            dy /= mag;
        }

        //flips enemy image based on what direction you are going
        if (dx < 0) this._model.direction = "left";
        if (dx > 0) this._model.direction = "right";

        //speed on time about x(for given model) pixel per second from last move
        this._model.x += dx * this._model.speed * deltaTime;
        this._model.y += dy * this._model.speed * deltaTime;

        if (dx !== 0 || dy !== 0) {
            this._model.bodyCurrentAnimation = "walk";
        } else {
            this._model.bodyCurrentAnimation = "idle"; 
        }
        
        this.view.render(this._model);
    }

    get shape() { return this.view.group; }
    get bodyBox() { return this.view.bodyBoxes; }
    get attackBox() { return this.view.attackBoxes; }
    get dead() { return this._model.dead; }
    get type(): "enemy" | "player" { return "enemy"; }

    moveBy(dx: number, dy: number) {
        this._model.x += dx;
        this._model.y += dy;
    }
}