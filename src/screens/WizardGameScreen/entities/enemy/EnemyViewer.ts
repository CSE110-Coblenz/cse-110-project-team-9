import Konva from "konva";
import { EnemyModel } from "./EnemyModel";
//computation
import { DebugBoundingBoxViewer } from "../DebugBoundingBox";

//TODO: move Entity type interface
export interface EntityType<Animation extends string>{
    image: string;
    animations: Record<Animation, number[]>;
}

//TODO: move this
export type BoundingBoxes<Animation extends string> = Record<
    Animation,
    { x: number; y: number; width: number; height: number }[]
>;

export class EnemyViewer<Animation extends string> {
    private sprite: Konva.Sprite | null = null;

    //debug red box visualizer
    private debugViewer!: DebugBoundingBoxViewer;

    /**
     * 
     * @param group konva sprite group
     * @param entity knight/wizard type of imgatlas and animations
     * @param model current enemy model
     * @param boundingBoxes bounding box for enemy given type 
     */
    constructor(
        private group: Konva.Group,
        private entity: EntityType<Animation>,
        private model: EnemyModel,
        private boundingBoxes: BoundingBoxes<Animation>
    ) {
        const enemy = new Image();

        enemy.onload = () => {
            this.sprite = new Konva.Sprite({
                image: enemy,
                animations: this.entity.animations,
                animation: this.model.currentAnimation as Animation,
                frameRate: 10, //about .100 secondsd
                frameIndex: 0,
                scaleX: 4,
                scaleY: 4,
            });
            this.group.add(this.sprite);

            //TODO: might move fix somewhere else
            //disable smoothing (I know the unknown is just context warning otherwise)
            const layer = this.group.getLayer();
            if (layer) {
                const ctx = layer.getContext() as unknown as CanvasRenderingContext2D;
                ctx.imageSmoothingEnabled = false;
            }

            this.sprite.start();
            //DEBUG: bounding box red outline
            this.debugViewer = new DebugBoundingBoxViewer(this.group);
        };
        //inside public file
        enemy.src = this.entity.image;
    }

    //TODO: interface move entity generic

    /**
     * 
     * @returns 
     */
    public getCurrentWorldBoundingBox(): { x: number; y: number; width: number; height: number } | null {
        if(!this.sprite) return null; 
        
        const frames = this.boundingBoxes[this.model.currentAnimation as Animation];
        //TODO: fix partial null values in animations frame I have no clue
        if (!frames?.length) return null;

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
    /**
     * debuging function to toggle bounding box rendering   
     * @param show true shows bounding box false hides
     */
    public toggleBoundingBox(show: boolean) {
        this.debugViewer.toggleVisibility(show);
    }
    /**
     * Renders parameters for controller movement x and y pos
     * @param model player parmeters speed,x,y
     * @returns Nonexistent entity
     */
    public render(model: EnemyModel): void {
        if (!this.sprite) return;

        this.sprite.x(model.x);
        this.sprite.y(model.y);

        if (this.sprite.animation() !== model.currentAnimation) {
            this.sprite.animation(model.currentAnimation);
            this.sprite.start();
        }
        
        //DEBUG: update bounding box
        const box = this.getCurrentWorldBoundingBox();
        this.debugViewer.updateBox(box);
    }

    public debugBoundingBox(show: boolean) {
        this.toggleBoundingBox(show);
    }
}



