import Konva from 'konva';
import type { WizardProjectileModel } from './ProjectileModel';

export class WizardProjectileViewer {
    private shape: Konva.Rect | null = null;

    constructor(private group: Konva.Group) {}

    public create(model: WizardProjectileModel) {
        const rect = new Konva.Rect({
            x: model.x,
            y: model.y,
            width: model.width,
            height: model.height,
            fill: 'orange',
        });
        this.shape = rect;
        this.group.add(rect);
    }

    public render(model: WizardProjectileModel) {
        if (!this.shape) return;
        this.shape.x(model.x);
        this.shape.y(model.y);
    }

    // Return a simple AABB for the projectile (world coords)
    public getCurrentWorldBoundingBox(): { x: number; y: number; width: number; height: number } {
        if (!this.shape) return { x: 0, y: 0, width: 0, height: 0 };
        return { x: this.shape.x(), y: this.shape.y(), width: this.shape.width(), height: this.shape.height() };
    }
}
