import Konva from "konva";
import { PlayerModel } from "./PlayerModel";

export class PlayerViewer {
    private sprite: Konva.Sprite;

    /**
     * Building sprite image for the player class
     * with built in animatons
     * @param _group konva sprite group
     * @param entity knight/wizard type of imgatlas and animations
     * @param _model current player model
     * @param _scale scaling of sprite
     */
    constructor(
        private _group: Konva.Group,
        private entity: { image: string; animations: Record<string, number[]> },
        private _model: PlayerModel,
        private _scale: number
    ) {
        const player = new Image();

        this.sprite = new Konva.Sprite({
            image: player,
            animations: this.entity.animations,
            animation: this._model.currentAnimation,
            frameRate: 10, //about .100 seconds
            frameIndex: 0,
            scaleX: this._scale,
            scaleY: this._scale,
        });
        this.group.add(this.sprite);

        this.sprite.start();

        player.src = this.entity.image;
    }

    destructor() { this.sprite.destroy(); }

    /**
     * Renders parameters for controller movement x and y pos
     * @param _model player parmeters speed,x,y
     * @returns Nonexistent entity
     */
    public render(_model: PlayerModel): void {

        //flip direction
        if (_model.direction === "left") {
            this.sprite.scaleX(-this._scale);
            this.sprite.offsetX(100); //TODO: abstract atlas iamge 
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
     * getters for model;
     */
    get group() { return this._group; }
    get boundingBoxes() {return this._model.worldBoundingBox(this.sprite.frameIndex(), this._scale); }
}



