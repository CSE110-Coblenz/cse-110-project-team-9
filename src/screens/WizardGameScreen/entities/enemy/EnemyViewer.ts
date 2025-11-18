import Konva from "konva";
import { EnemyModel } from "./EnemyModel";

export class EnemyViewer {
    private sprite: Konva.Sprite;

    /**
    * Building sprite image for the enemy class
     * with built in animatons
     * @param _group konva sprite group
     * @param entity knight/wizard type of imgatlas and animations
     * @param _model current enemy model
     * @param _scale scaling of sprite
     */
    constructor(
        private _group: Konva.Group,
        private entity: { image: string; animations: Record<string, number[]> },
        private _model: EnemyModel,
        private _scale: number
    ) {
        const enemy = new Image();
 
        this.sprite = new Konva.Sprite({
            image: enemy,
            animations: this.entity.animations,
            animation: this._model.currentAnimation,
            frameRate: 10, //about .100 seconds
            frameIndex: 0,
            scaleX: _scale,
            scaleY: _scale,
        });
        this.group.add(this.sprite);
        
        this.sprite.start();

        enemy.src = this.entity.image;
    }

    destructor() { this.sprite.destroy(); }

    /**
     * Renders parameters for controller movement x and y pos
     * @param _model player parmeters speed,x,y
     * @returns Nonexistent entity
     */
    public render(_model: EnemyModel): void {

        //flip direction
        if (_model.direction === "left") {
            this.sprite.scaleX(-this._scale);
            this.sprite.offsetX(100); //TODO: abstract atlas image size
        } else {
            this.sprite.scaleX(this._scale);
            this.sprite.offsetX(0);
        }

        this.sprite.x(_model.x);
        this.sprite.y(_model.y);

        if (this.sprite.animation() !== _model.currentAnimation) {
            this.sprite.animation(_model.currentAnimation);
            this.sprite.start();
        }
        
    }

    /**
     * getters utilities
     */
    get group() { return this._group; }
    get boundingBoxes() {return this._model.worldBoundingBox(this.sprite.frameIndex(), this._scale); }
}



