import { EnemyModel } from "./EnemyModel";
import { EnemyViewer } from "./EnemyViewer";
import { Collidable } from "../CollisionManager";
import { AudioController } from "../../../../audios/AudioController";

//todo: config file
const DAMAGE_ON_COLLISION = 5;

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

    destructor() {
        this.view.destructor();
    }

    /**
     * check collision
     * @param other
     */
    public onCollision?(other: Collidable): void{
        this._model.damage(DAMAGE_ON_COLLISION);
    }

    /**
     * after 
     * @param deltaTime different in time from last animation event
     */
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

    /**
     * Getter methods for various utility
     */
    shape() { return this.view.group;}
    boundingBox() { return this.view.bodyBoxes; }
    bodyBox() { return this.view.bodyBoxes; }
    attackBox() { return this.view.attackBoxes; }
    dead() { return this._model.dead; }
    destroy() { this.destructor(); }
}