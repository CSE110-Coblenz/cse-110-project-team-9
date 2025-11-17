import Konva from "konva";
import { PlayerModel } from "./PlayerModel";

export class PlayerViewer<Animation extends string> {
    private sprite: Konva.Sprite;

    /**
     * Building sprite image for the player class
     * with built in animatons
     * @param _group konva sprite group
     * @param entity knight/wizard type of imgatlas and animations
     * @param model current player model
     * @param boundingBoxes bounding box for player given type 
     */
    constructor(
        private _group: Konva.Group,
        private entity: { image: string; animations: Record<string, number[]> },
        private model: PlayerModel,
        private boundingBoxes: Record<string, { x: number; y: number; width: number; height: number }[]>
    ) {
        const player = new Image();

        this.sprite = new Konva.Sprite({
            image: player,
            animations: this.entity.animations,
            animation: this.model.currentAnimation as Animation,
            frameRate: 10, //about .100 seconds
            frameIndex: 0,
            scaleX: 4,
            scaleY: 4,
        });
        this.group.add(this.sprite);

        //disable smoothing
        const layer = this.group.getLayer();
        if (layer) {
            const ctx = layer.getContext() as unknown as CanvasRenderingContext2D;
            ctx.imageSmoothingEnabled = false;
        }

        this.sprite.start();

        player.src = this.entity.image;
    }

    /**
     * Renders parameters for controller movement x and y pos
     * @param model player parmeters speed,x,y
     * @returns Nonexistent entity
     */
    public render(model: PlayerModel): void {
        if (!this.sprite) return;

        this.sprite.x(model.x);
        this.sprite.y(model.y);

        if (this.sprite.animation() !== model.currentAnimation) {
            this.sprite.animation(model.currentAnimation);
            this.sprite.start();
        }
        
    }

    /**
     * getters for visual elements;
     */
    get group() { return this._group; }
    
    //TODO: clean this mess up
    /**
     * 
     * @returns 
     */
    public getCurrentWorldBoundingBox(): { x: number; y: number; width: number; height: number } {
        
        const frames = this.boundingBoxes[this.model.currentAnimation as Animation];

        const frameIndex = Math.max(0, Math.min(frames.length - 1, this.sprite.frameIndex()));
        const frameBox = frames[frameIndex];

        const scaleX = this.sprite.scaleX();
        const scaleY = this.sprite.scaleY();

        return{
            x: this.sprite.x() + frameBox.x * scaleX,
            y: this.sprite.y() + frameBox.y * scaleY,
            width: frameBox.width * scaleX,
            height: frameBox.height * scaleY
        }
    }
}



