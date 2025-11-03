import Konva from "konva";
import { WIZARD_ANIMATIONS, type WizardAnimation } from "./WizardAnimations";
import { PlayerModel } from "./PlayerModel";
import { computeAllAnimationBoundingBoxes } from "./CreateBoundingBox";
import { DebugBoundingBoxViewer } from "./DebugBoundingBoxViewer";

export class PlayerViewer {
    private sprite: Konva.Sprite | null = null;
    private currentAnimation: WizardAnimation = "idle";
    // caches only the pixel bounding boxes per animation e.g. idle , walk, attack
    private frameBoundingBoxes: Partial<Record<WizardAnimation, { x: number; y: number; width: number; height: number }[]>> = {};
    // opacity check for sprites
    private alphaThreshold = 1; 
    //add increase padding around pixel perfect bounding box
    private padding = 0;
    //debug red box visualizer
    private debugViewer!: DebugBoundingBoxViewer;

    /**
     * constructs the wizard sprite
     * @param group 
     */
    constructor(private group: Konva.Group) {
        const wizard = new Image();
        wizard.onload = () => {
            this.sprite = new Konva.Sprite({
                x: 150,
                y: 60,
                image: wizard,
                animation: this.currentAnimation,
                //constant in a typescript from image atlas
                animations: WIZARD_ANIMATIONS,
                frameRate: 10, //about .100 secondsd
                frameIndex: 0,
                scaleX: 4,
                scaleY: 4,
                imageSmoothingEnabled: false
            });
            this.group.add(this.sprite);

            //compute bounding box for given character
            this.frameBoundingBoxes = computeAllAnimationBoundingBoxes(wizard, WIZARD_ANIMATIONS as Record<string, number[]>, this.alphaThreshold, this.padding);

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
        wizard.src = "public/WizardMiniGame/Sprites/Wizard.png";
    }

    //TODO: interface move

    /**
     * 
     * @returns 
     */
    public getCurrentWorldBoundingBox(): { x: number; y: number; width: number; height: number } | null {
        if (!this.sprite) return null;
        const anim = this.currentAnimation;
        const frames = this.frameBoundingBoxes[anim];
        if (!frames || frames.length === 0) return null;

        const frameIndex = typeof (this.sprite as any).frameIndex === 'function' ? (this.sprite as any).frameIndex() : 0;
        const idx = Math.max(0, Math.min(frames.length - 1, frameIndex));
        const frameBoundBox = frames[idx];

        const scaleX = (this.sprite.scaleX && typeof this.sprite.scaleX === 'function') ? (this.sprite.scaleX() as number) : 1;
        const scaleY = (this.sprite.scaleY && typeof this.sprite.scaleY === 'function') ? (this.sprite.scaleY() as number) : 1;

        const worldX = (this.sprite.x && typeof this.sprite.x === 'function') ? (this.sprite.x() as number) + frameBoundBox.x * scaleX : frameBoundBox.x * scaleX;
        const worldY = (this.sprite.y && typeof this.sprite.y === 'function') ? (this.sprite.y() as number) + frameBoundBox.y * scaleY : frameBoundBox.y * scaleY;
        const worldW = frameBoundBox.width * scaleX;
        const worldH = frameBoundBox.height * scaleY;

        return { x: worldX, y: worldY, width: worldW, height: worldH };
    }

    //TODO: interface move

    /**
     * debuging function to toggle bounding box rendering   
     * @param show true shows bounding box false hides
     */
    public toggleBoundingBox(show: boolean) {
        this.debugViewer.toggleVisibility(show);
    }

    /**
     * plays an animations through completion
     * @param name wizardAnimations which is animations
     */
    public playAnimation(name: WizardAnimation): void {
        if (this.sprite && name !== this.currentAnimation) {
            this.sprite.animation(name);
            this.sprite.start();
            this.currentAnimation = name;
        }
    }

    //TODO: interface move

    /**
     * Renders parameters for controller movement x and y pos
     * @param model wizard parmeters speed,x,y
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



