import Konva from "konva";
//MVC imports
import { PlayerModel } from "./PlayerModel";
//TODO: should I computer the bounding boxes in types intead
import { computeAllAnimationBoundingBoxes } from "../CreateBoundingBox";
//TODO: global turn on and off debug bounding boxes
import { DebugBoundingBoxViewer } from "../DebugBoundingBox";

export interface EntityType<A extends string>{
    image: string;
    animations: Record<A, number[]>;
}

export class PlayerViewer<A extends string> {
    private sprite: Konva.Sprite | null = null;
    private currentAnimation: A;
    // caches only the pixel bounding boxes per animation e.g. idle , walk, attack
    private frameBoundingBoxes: Partial<Record<string, { x: number; y: number; width: number; height: number }[]>> = {};
    // opacity check for sprites
    private alphaThreshold = 1; 
    //add increase padding around pixel perfect bounding box
    private padding = 0;
    //debug red box visualizer
    private debugViewer!: DebugBoundingBoxViewer;

    /**
     * 
     * @param group 
     * @param entityConfig grabs a type for object with corresponding animations
     */
    constructor(
        private group: Konva.Group,
        private entity: EntityType<A>,
        initialAnimation: A
    ) {
        this.currentAnimation = initialAnimation;
        const player = new Image();

        player.onload = () => {
            this.sprite = new Konva.Sprite({
                x: 150,
                y: 60,
                image: player,
                animation: this.currentAnimation,
                animations: this.entity.animations,
                frameRate: 10, //about .100 secondsd
                frameIndex: 0,
                scaleX: 4,
                scaleY: 4,
            });
            this.group.add(this.sprite);

            //compute bounding box for given character
            this.frameBoundingBoxes = computeAllAnimationBoundingBoxes(
                player,
                this.entity.animations as Record<string, number[]>,
                this.alphaThreshold,
                this.padding
            );

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
        player.src = this.entity.image;
    }

    //TODO: interface move entity generic

    /**
     * 
     * @returns 
     */
    public getCurrentWorldBoundingBox(): { x: number; y: number; width: number; height: number } | null {
        if(!this.sprite) return null; 
        
        const frames = this.frameBoundingBoxes[this.currentAnimation];
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

    //TODO: interface move entity genric

    /**
     * debuging function to toggle bounding box rendering   
     * @param show true shows bounding box false hides
     */
    public toggleBoundingBox(show: boolean) {
        this.debugViewer.toggleVisibility(show);
    }

    /**
     * plays an animations through completion
     * @param name grabs animation name
     */
    public playAnimation(name: A): void {
        if (this.sprite && name !== this.currentAnimation) {
            this.sprite.animation(name);
            this.sprite.start();
            this.currentAnimation = name;
        }
    }

    //TODO: interface move entity generic

    /**
     * Renders parameters for controller movement x and y pos
     * @param model player parmeters speed,x,y
     * @returns Nonexistent entity
     */
    public render(model: PlayerModel): void {
        if (!this.sprite) return;
        this.sprite.x(model.x);
        this.sprite.y(model.y);
        
        //DEBUG: update bounding box
        const box = this.getCurrentWorldBoundingBox();
        this.debugViewer.updateBox(box);
    }
}



