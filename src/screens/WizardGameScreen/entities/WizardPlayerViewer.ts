import Konva from "konva";
import { WIZARD_ANIMATIONS, type WizardAnimation } from "./WizardPlayerAnimations";
import { WizardPlayerModel } from "./WizardPlayerModel";

export class WizardPlayerViewer {
    private sprite: Konva.Sprite | null = null;
    private currentAnimation: WizardAnimation = "idle";
    // This is tightly bounding box design modular for wizard sprite
    // caches only the pixel bounding boxes per animation e.g. idle , walk, attack
    private frameBoundingBoxes: Partial<Record<WizardAnimation, { x: number; y: number; width: number; height: number }[]>> = {};
    //keeps anything non transparent above this value as opaque we keep bounding
    private alphaThreshold = 1; 
    //add increase padding around pixel perfect bounding box
    private padding = 0;
    //debug rectangle to show bounding box
    private boundingboxRect: Konva.Rect | null = null;
    private showBoundingBox = false;

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

            this.computeAllAnimationBoundingBoxes(wizard);

            //disable smoothing (I know the unknown is just context warning otherwise)
            const layer = this.group.getLayer();
            if (layer) {
                const ctx = layer.getContext() as unknown as CanvasRenderingContext2D;
                ctx.imageSmoothingEnabled = false;
            }

            this.sprite.start();

            // create debug rectangle (invisible by default)
            this.boundingboxRect = new Konva.Rect({
                x: 0,
                y: 0,
                width: 0,
                height: 0,
                stroke: 'red',
                strokeWidth: 1,
                visible: false,
            });
            this.group.add(this.boundingboxRect);
            
        };
        //inside public file
        wizard.src = "/Wizard.png";
    }

    /**
     * computers a tight pixel perfect boudning boxes for every frame in each animation
     * and caches them. Runs once image load. make offscreen and read pixel alpha
     * this is a preprocessing step
     * @param image Wizard image
     */
    private computeAllAnimationBoundingBoxes(image: HTMLImageElement){
        //string "walk" , [x, y, width, height]
        const animations = WIZARD_ANIMATIONS as Record<string, number[]>;
        //for each animation
        for (const key of Object.keys(animations)) {
            //array of numbers for frames for each animation
            const arr = animations[key as WizardAnimation];

            const frames: { x: number; y: number; width: number; height: number }[] = [];
            
            //for each frame in animation add by 4 for x,y,width,height
            for (let i = 0; i < arr.length; i += 4) {
                const frame = { x: arr[i], y: arr[i+1], width: arr[i+2], height: arr[i+3] };
                //compute tight bounding box for frame
                frames.push(this.computeTightBoundingBoxForFrame(image, frame, this.alphaThreshold, this.padding));
            }
            this.frameBoundingBoxes[key as WizardAnimation] = frames;
        }
    }

    /**
     * Computer a tight Bounding box for a single frame inside an image
     * this is done throught putting the frame into an offscreen canvas
     * then looking at the pixel data for non transparent pixels
     * and returning the tightest bounding box around them
     * @param image wizard/knight images
     * @param frame the frame inside the imageatlas
     * @param alphaThreshold opaque threshold
     * @param padding //extra pixels around bounding box (probly not use)
     */
    private computeTightBoundingBoxForFrame(
        image: HTMLImageElement,
        frame: { x: number; y: number; width: number; height: number },
        alphaThreshold = 1, //default value
        padding = 0         //default value
    ): { x: number; y: number; width: number; height: number } {
        //create offscreen canvas to draw frame
        const canvas = document.createElement("canvas");
        //size of frame
        canvas.width = frame.width;
        canvas.height = frame.height;
        const ctx = canvas.getContext("2d");
        //return full frame if no context default bounding box
        if (!ctx) return { x: 0, y: 0, width: frame.width, height: frame.height };
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(image, frame.x, frame.y, frame.width, frame.height, 0, 0, frame.width, frame.height);

        let imgData = ctx.getImageData(0, 0, frame.width, frame.height);

        const data = imgData.data;
        // base values to increase size of bounding box
        let minX = frame.width, minY = frame.height, maxX = -1, maxY = -1;

        const BYTES_PER_PIXEL = 4; // RGBA format
        const ALPHA_OFFSET = 3; // grab opacity value

        // grabs alpha at x,y in frame local x and y
        // helper function
        const getAlphaAt = (x: number, y: number) => {
            const rowStart = y * frame.width * BYTES_PER_PIXEL;
            return data[rowStart + x * BYTES_PER_PIXEL + ALPHA_OFFSET];
        };

        // heavy computation but it runs once per image load and results are cached
        for (let y = 0; y < frame.height; y++) {
            for (let x = 0; x < frame.width; x++) {
                const a = getAlphaAt(x, y);
                if (a > alphaThreshold) {
                    if (x < minX) minX = x;
                    if (x > maxX) maxX = x;
                    if (y < minY) minY = y;
                    if (y > maxY) maxY = y;
                }
            }
        }

        //should not happen but just in case there is no pixel are return full frame
        if( maxX === -1 ) {
            //there is no opaque pixel in this frame return full frame
            return { x: 0, y: 0, width: frame.width, height: frame.height };
        }
        
        //add padding and match pixelart bounds
        minX = Math.max(0, minX - padding);
        minY = Math.max(0, minY - padding);
        maxX = Math.min(frame.width - 1, maxX + padding);
        maxY = Math.min(frame.height - 1, maxY + padding);

        return { x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
    }

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

    /**
     * debuging function to toggle bounding box rendering   
     * @param show true shows bounding box false hides
     */
    public toggleBoundingBox(show: boolean) {
        this.showBoundingBox = show;
        if (this.boundingboxRect) this.boundingboxRect.visible(show);
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

    /**
     * Renders parameters for controller movement x and y pos
     * @param model wizard parmeters speed,x,y
     * @returns Nonexistent entity
     */
    public render(model: WizardPlayerModel): void {
        if (!this.sprite) return;
        this.sprite.x(model.x);
        this.sprite.y(model.y);


        //debug show bounding box
        if (this.showBoundingBox && this.boundingboxRect) {
            const box = this.getCurrentWorldBoundingBox();
            if (box) {
                this.boundingboxRect.x(box.x);
                this.boundingboxRect.y(box.y);
                this.boundingboxRect.width(box.width);
                this.boundingboxRect.height(box.height);
                this.boundingboxRect.visible(true);
            } else {
                this.boundingboxRect.visible(false);
            }
        } else if (this.boundingboxRect) {
            this.boundingboxRect.visible(false);
        }
    }
}



