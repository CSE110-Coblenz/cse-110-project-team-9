//Enemy MVC
import { EnemyModel } from "./EnemyModel";
import { EnemyViewer } from "./EnemyViewer";

//Collision Handling
import { Collidable } from "../CollisionManager";

//Audio Controller
import { AudioController } from "../../../../audios/AudioController";

export class EnemyController implements Collidable {
    private keys: Record<string, boolean> = {};

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

        //mark for garbage collection
        (this as any).model = null;
        (this as any).view = null;
    }

    /**
     * check collision
     * @param other
     */
    public onCollision?(other: Collidable): void{
        this._model.damage(100);
    }

    /**
     * after 
     * @param deltaTime different in time from last animation event
     */
    update(deltaTime: number, playerX: number, playerY: number) {
        //TODO: for now to just linearly follow player i guess 
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
        this._model.move(dx * this._model.speed * deltaTime, dy * this._model.speed * deltaTime);

        if (dx !== 0 || dy !== 0) {
            this._model.animation = "walk";
        } else {
            this._model.animation = "idle"; 
        }
        
        this.view.render(this._model);
    }

    /**
     * Getter methods for various utility
     */
    shape() { return this.view.group;}
    boundingBox() { return this.view.boundingBoxes; }
    dead() { return this._model.dead; }
    destroy() { this.destructor(); }
}