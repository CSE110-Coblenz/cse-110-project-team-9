import type { EnemyModel } from "./EnemyModel";
import { EnemyViewer } from "./EnemyViewer";
import type { Collidable, AABB } from "../../CollisionManager";

export class EnemyController<Animation extends string> implements Collidable {
    private keys: Record<string, boolean> = {};

    constructor(private model: EnemyModel, private view: EnemyViewer<Animation>) {

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
    public onCollision?(other: Collidable): void{
        if (!this.model.dead) {
            this.model.death();
            this.model.setAnimation("death");
        }


        //TODO delete mvc
    }

    /**
     * after 
     * @param deltaTime different in time from last animation event
     */
    update(deltaTime: number) {
        this.view.render(this.model);

    }
}