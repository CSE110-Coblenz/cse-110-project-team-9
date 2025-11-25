import Konva from "konva";
import { EnemyModel } from "./EnemyModel";
import { FRAME_RATE, SPRITE_WIDTH } from "../../config";

export class EnemyView {
    private bodySprite: Konva.Sprite;
    private attackSprite: Konva.Sprite;
    private previousDirection: "left" | "right" | null = null;

    constructor(
        private _group: Konva.Group,
        private entity: { image: string; animations: Record<string, number[]> },
        private entity_attack: { image: string; animations: Record<string, number[]> },
        private _model: EnemyModel,
        private _scale: number
    ) {
        this.bodySprite = this.createSprite(this.entity, this._model.bodyCurrentAnimation, true);
        this.attackSprite = this.createSprite(this.entity_attack, "attacklight", false);
        
        this.group.add(this.bodySprite);
        this.group.add(this.attackSprite);
    }

    destructor() { 
        this.bodySprite.destroy(); 
        this.attackSprite.destroy(); 
    }

    private createSprite(
        entity: { image: string; animations: Record<string, number[]> },
        animation: string,
        visible: boolean
    ): Konva.Sprite {
        const image = new Image();
        image.src = entity.image;

        return new Konva.Sprite({
            image,
            animations: entity.animations,
            animation,
            frameRate: FRAME_RATE,
            frameIndex: 0,
            scaleX: this._scale,
            scaleY: this._scale,
            visible,
        });
    }

    public render(_model: EnemyModel): void {

        //flips direction of animation a or d
        if (this.previousDirection !== null && this.previousDirection !== _model.direction) {
            // direction change reset animation frames to 0
            this.bodySprite.frameIndex(0);
            this.attackSprite.frameIndex(0);
            
            //restart animation if running
            if (this.bodySprite.isRunning()) {
                this.bodySprite.start();
            }
            if (this.attackSprite.isRunning()) {
                this.attackSprite.start();
            }
        }
        this.previousDirection = _model.direction;

        //flip direction of sprite
        if (_model.direction === "left") {
            this.bodySprite.scaleX(-this._scale);
            this.bodySprite.offsetX(SPRITE_WIDTH);
            this.attackSprite.scaleX(-this._scale);
            this.attackSprite.offsetX(SPRITE_WIDTH);
        } else {
            this.bodySprite.scaleX(this._scale);
            this.bodySprite.offsetX(0);
            this.attackSprite.scaleX(this._scale);
            this.attackSprite.offsetX(0);
        }

        //updates sprite based on the x and y positions of current model
        this.bodySprite.x(_model.x);
        this.bodySprite.y(_model.y);
        this.attackSprite.x(_model.x);
        this.attackSprite.y(_model.y);

        //keeps playing current animation in a loop till a new animation
        if (this.bodySprite.animation() !== _model.bodyCurrentAnimation) {
            this.bodySprite.animation(_model.bodyCurrentAnimation);
            this.bodySprite.start();
        }

        //attack sprite visibility and animation control
        if (_model.attackCurrentAnimation !== null) {
            if (!this.attackSprite.visible()) {
                this.attackSprite.visible(true);

                this.attackSprite.moveToTop();

                this.attackSprite.animation(_model.attackCurrentAnimation);
                this.attackSprite.start();

                const layer = this.group.getLayer();
                if (layer) {
                    layer.batchDraw();
                }
            } else {

                if (this.attackSprite.animation() !== _model.attackCurrentAnimation) {
                    this.attackSprite.animation(_model.attackCurrentAnimation);
                    this.attackSprite.start();
                }
            }
        } else {
            if (this.attackSprite.visible()) {
                this.attackSprite.visible(false);
                this.attackSprite.stop();
            }
        }
    }

    get group() { return this._group; }
    get bodyBoxes() { return this._model.bodyBox(this.bodySprite.frameIndex(), this._scale); }
    get attackBoxes() { return this._model.attackBox(this.attackSprite.frameIndex(), this._scale); }
}


