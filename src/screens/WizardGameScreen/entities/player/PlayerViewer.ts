import Konva from "konva";
import { PlayerModel } from "./PlayerModel";
import { DebugBoundingBoxViewer } from "../DebugBoundingBox";

export class PlayerViewer<Animation extends string> {
    private sprite: Konva.Sprite | null = null;
    //debug red box visualizer
    private debugViewer: DebugBoundingBoxViewer;

    /**
     * 
     * @param group konva sprite group
     * @param entity knight/wizard type of imgatlas and animations
     * @param model current player model
     * @param boundingBoxes bounding box for player given type 
     */
    constructor(
        private group: Konva.Group,
        private entity: { image: string; animations: Record<string, number[]> },
        private model: PlayerModel,
        private boundingBoxes: Record<string, { x: number; y: number; width: number; height: number }[]>
    ) {
        //DEBUG: bounding box red outline
        this.debugViewer = new DebugBoundingBoxViewer(this.group);

        const player = new Image();
        player.onload = () => {
            this.sprite = new Konva.Sprite({
                image: player,
                animations: this.entity.animations,
                animation: this.model.currentAnimation as Animation,
                frameRate: 10, //about .100 secondsd
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
        };
        player.src = this.entity.image;
    }

    /**
     * 
     * @returns 
     */
    public getCurrentWorldBoundingBox(): { x: number; y: number; width: number; height: number } | null {
        if(!this.sprite) return null; 
        
        const frames = this.boundingBoxes[this.model.currentAnimation as Animation];
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
    public render(model: PlayerModel): void {
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



