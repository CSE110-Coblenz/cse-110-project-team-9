//Game manager Switch
import { ScreenController } from "../../types";
import type { ScreenSwitcher } from "../../types";
//Wizard Main
import { WizardGameScreenModel } from "./WizardGameScreenModel";
import { WizardGameScreenViewer } from "./WizardGameScreenViewer";
//Player MVC
import { WizardPlayerModel } from "./entities/WizardPlayerModel";
import { WizardPlayerViewer } from "./entities/WizardPlayerViewer";
import { WizardPlayerController } from "./entities/WizardPlayerController";
import { CollisionManager } from "./CollisionManager";
//projectile MVC
import { WizardProjectileController } from "./entities/WizardProjectileController";
import { WizardProjectileModel } from "./entities/WizardProjectileModel";
import { WizardProjectileViewer } from "./entities/WizardProjectileViewer";
//Math MVC
// import { WizardMathController } from "./entities/WizardProjectileController";
// import { WizardMathModel } from "./entities/WizardProjectileModel";
// import { WizardMathViewer } from "./entities/WizardProjectileViewer";
//Tower MVC

export class WizardGameScreenController extends ScreenController {
    private model: WizardGameScreenModel;
    private view: WizardGameScreenViewer;

    private WizardplayerModel: WizardPlayerModel;
    private WizardplayerViewer: WizardPlayerViewer;
    private WizardplayerController: WizardPlayerController;

    private WizardprojectileModel: WizardProjectileModel;
    private WizardprojectileViewer: WizardProjectileViewer;
    private WizardprojectileController: WizardProjectileController;

    private collisionManager: CollisionManager;

    private showBoundingBoxes = false;
    private debugKeyHandler: (e: KeyboardEvent) => void;

    private lastUpdateTime = 0;
    private animationFrameId: number | null = null;

    constructor(private screenSwitcher: ScreenSwitcher) {
        super();
        //Game MVC
        this.model = new WizardGameScreenModel();
        this.view = new WizardGameScreenViewer();

        //wizard player MVC
        this.WizardplayerModel = new WizardPlayerModel();
        this.WizardplayerViewer = new WizardPlayerViewer(this.view.getGroup());
        this.WizardplayerController = new WizardPlayerController(this.WizardplayerModel, this.WizardplayerViewer);

        //wizard projectiles MVC
        this.WizardprojectileModel = new WizardProjectileModel();
        this.WizardprojectileViewer = new WizardProjectileViewer(this.view.getGroup());
        this.WizardprojectileController = new WizardProjectileController(this.WizardprojectileModel, this.WizardprojectileViewer);

        //collision betweene entities
        this.collisionManager = new CollisionManager();

        //debug key handler to toggle bounding boxes
        this.debugKeyHandler = (e: KeyboardEvent) => {
            if (e.key === 'b') {
                this.showBoundingBoxes = !this.showBoundingBoxes;
                // toggle viewer debug bbox
                if (this.WizardplayerViewer && typeof (this.WizardplayerViewer as any).toggleBoundingBox === 'function') {
                    (this.WizardplayerViewer as any).toggleBoundingBox(this.showBoundingBoxes);
                }
            }
        };
    }

    startGame() {
        this.view.show();
        this.WizardplayerController.bindControls();

        //register collidables e.g. player for now. projectiles and blocks to added later
        this.collisionManager.register(this.WizardplayerController);
        this.collisionManager.register(this.WizardprojectileController);

        // add debug key listener (press 'b' to toggle pixel-perfect boundbox display)
        window.addEventListener('keydown', this.debugKeyHandler);
        //current time to get deltas
        this.lastUpdateTime = performance.now();
        this.updateLoop();
    }

    private updateLoop = () => {
        //computer difference in time since last frame
        const now = performance.now();
        const delta = (now - this.lastUpdateTime) / 1000;

        //grabe current time for next delta calc
        this.lastUpdateTime = now;

        //update entities with delta from last frame
        this.WizardplayerController.update(delta);
        this.WizardprojectileController.update(delta);
        
        //check collisions  
        this.collisionManager.update();

        //repeat update loop keep reponsetime smooth
        this.animationFrameId = requestAnimationFrame (this.updateLoop);
    };

    stopGame() {
        //dont run update loop anymore 
        if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);

        //remove player controls
        this.WizardplayerController.unbindControls();

        //remove collidables
        this.collisionManager.unregister(this.WizardplayerController);
        this.collisionManager.unregister(this.WizardprojectileController);

        //remove debug key listener
        window.removeEventListener('keydown', this.debugKeyHandler);
    }

    getView(): WizardGameScreenViewer {
        return this.view;
    }
}
