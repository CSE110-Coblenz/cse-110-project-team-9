import Konva from "konva";
import { WIZARD_ANIMATIONS, type WizardAnimation } from "./WizardPlayerAnimations";
import type { WizardPlayerModel } from "./WizardPlayerModel";

export class WizardPlayerViewer {
    private sprite: Konva.Sprite | null = null;
    private currentAnimation: WizardAnimation = "idle";

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
                frameRate: 10,
                frameIndex: 0,
                scaleX: 4,
                scaleY: 4,
                imageSmoothingEnabled: false
            });
            this.group.add(this.sprite);
            this.sprite.start();
            
        };
        //inside public file
        wizard.src = "/Wizard.png";
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
    }
}
