import type { WizardProjectileModel } from './ProjectileModel';
import type { WizardProjectileViewer } from './ProjectileViewer';
import type { Collidable, AABB } from '../CollisionManager';

export class WizardProjectileController implements Collidable {
    public alive = true;
    constructor(private model: WizardProjectileModel, private view: WizardProjectileViewer) {}

    public update(deltaTime: number) {
        // simple upward movement example
        this.model.y -= this.model.speed * deltaTime;
        this.view.render(this.model);
    }

    /**
     * 
     * @returns 
     */
    public getBoundingBox(): AABB | null {
        if (this.view && typeof (this.view as any).getCurrentWorldBoundingBox === 'function') {
            return (this.view as any).getCurrentWorldBoundingBox();
        }
        // fallback to model box
        return { x: this.model.x, y: this.model.y, width: this.model.width, height: this.model.height };
    }  

    /**
     * 
     * @param other 
     */
    public onCollision?(other: Collidable): void {
        // on collision, mark projectile as not alive
       this.alive = false;
    }
}
