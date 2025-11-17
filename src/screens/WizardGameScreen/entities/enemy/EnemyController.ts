import Konva from "konva";

//Enemy MVC
import { EnemyModel } from "./EnemyModel";
import { EnemyViewer } from "./EnemyViewer";

//Collision Handling
import { Collidable, AABB } from "../CollisionManager";

//Audio Controller
import { AudioController } from "../../../../audios/AudioController";

export class EnemyController<Animation extends string> implements Collidable {
    private keys: Record<string, boolean> = {};

    constructor(
        private model: EnemyModel, 
        private view: EnemyViewer<Animation>,
        private audio: AudioController
    ) {}

    /**
     * check collision
     * @param other
     */
    public onCollision?(other: Collidable): void{
        //delete or death?
        if (!this.model.dead) {
            this.model.setAnimation("death");
        }
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
    getShape(): Konva.Group { return this.view.group;}
    getBoundingBox(): AABB | null { return this.view.getCurrentWorldBoundingBox(); }
}