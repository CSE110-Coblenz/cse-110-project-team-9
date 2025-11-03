//Game manager Switch
import { ScreenController } from "../../types";
import type { ScreenSwitcher } from "../../types";
//Wizard Main
import { WizardGameScreenModel } from "./WizardGameScreenModel";
import { WizardGameScreenViewer } from "./WizardGameScreenViewer";
//Collision Manager
import { CollisionManager } from "./CollisionManager";
//Player MVC
import { PlayerModel } from "./entities/player/PlayerModel";
import { PlayerViewer } from "./entities/player/PlayerViewer";
import { PlayerController } from "./entities/player/PlayerController";
//Player type
import { PlayerFactory } from "./entities/player/PlayerFactory";
import type { WizardAnimation } from "./entities/types/Wizard";
import type { KnightAnimation } from "./entities/types/Knight";

export class WizardGameScreenController extends ScreenController {
    private model: WizardGameScreenModel;
    private view: WizardGameScreenViewer;

    private playerModel: PlayerModel;
    private playerViewer: PlayerViewer<WizardAnimation | KnightAnimation>;
    private playerController: PlayerController<WizardAnimation | KnightAnimation>;

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

        //player MVC
        this.playerModel = new PlayerModel();
        this.playerViewer = PlayerFactory.create("knight",this.view.getGroup());
        this.playerController = new PlayerController(this.playerModel, this.playerViewer);

        //collision betweene entities
        this.collisionManager = new CollisionManager();

        //TODO: move to debug
        //debug key handler to toggle bounding boxes
        this.debugKeyHandler = (e: KeyboardEvent) => {
            if (e.key === 'b') {
                this.showBoundingBoxes = !this.showBoundingBoxes;
                // toggle viewer debug bbox
                if (this.playerViewer && typeof (this.playerViewer as any).toggleBoundingBox === 'function') {
                    (this.playerViewer as any).toggleBoundingBox(this.showBoundingBoxes);
                }
            }
        };
    }

    startGame() {
        this.view.show();
        this.playerController.bindControls();

        //register collidables e.g. player for now. projectiles and blocks to added later
        this.collisionManager.register(this.playerController);

        // TODO move to debug functionality
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
        this.playerController.update(delta);
        
        //check collisions between entities (not boundaries)  
        this.collisionManager.update();

        //repeat update loop keep reponsetime smooth
        this.animationFrameId = requestAnimationFrame (this.updateLoop);
    };

    stopGame() {
        //dont run update loop anymore 
        if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);

        //remove player controls
        this.playerController.unbindControls();

        //remove collidables
        this.collisionManager.unregister(this.playerController);

        //TODO: move to debug
        //remove debug key listener
        window.removeEventListener('keydown', this.debugKeyHandler);
    }

    getView(): WizardGameScreenViewer {
        return this.view;
    }
}
