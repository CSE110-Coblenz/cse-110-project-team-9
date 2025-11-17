import Konva from "konva";

//Enemy MVC
import { EnemyModel } from "./EnemyModel";
import { EnemyViewer } from "./EnemyViewer";

//Collision Handling
import { Collidable, AABB } from "../CollisionManager";

//Audio Controller
import { AudioController } from "../../../../audios/AudioController";

export class EnemyController implements Collidable {
    private keys: Record<string, boolean> = {};

    constructor(
        private model: EnemyModel, 
        private view: EnemyViewer,
        private audio: AudioController
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
    public onCollision?(other: Collidable): void{
        this.model.damage(100);
    }

    /**
     * after 
     * @param deltaTime different in time from last animation event
     */
    update(deltaTime: number) {
        this.view.render(this.model);
    }

    /**
     * Getter methods for various utility
     */
    shape(): Konva.Group { return this.view.group;}
    boundingBox(): AABB { return this.view.getCurrentWorldBoundingBox(); }
    dead(): boolean { return this.model.dead; }
    destroy(): void { this.destructor(); }
}