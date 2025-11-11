//Game manager Switch
import { ScreenController } from "../../types";
import type { ScreenSwitcher } from "../../types";
//Wizard Main
import { WizardGameScreenModel } from "./WizardGameScreenModel";
import { WizardGameScreenViewer } from "./WizardGameScreenViewer";
//Collision Manager
import { CollisionManager } from "./entities/CollisionManager";
//Player MVC
import { PlayerModel } from "./entities/player/PlayerModel";
import { PlayerViewer } from "./entities/player/PlayerViewer";
import { PlayerController } from "./entities/player/PlayerController";
//Enemy MVC
import { EnemyModel } from "./entities/enemy/EnemyModel";  
import { EnemyViewer } from "./entities/enemy/EnemyViewer";
import { EnemyController } from "./entities/enemy/EnemyController";
//sprite factories
import { PlayerFactory } from "./entities/player/PlayerFactory";
import { EnemyFactory } from "./entities/enemy/EnemyFactory";
//sprite type
import type { WizardAnimation } from "./entities/types/Wizard";
import type { KnightAnimation } from "./entities/types/Knight";
//audio
import { AudioController } from "../../audios/AudioController";


export class WizardGameScreenController extends ScreenController {
    private model: WizardGameScreenModel;
    private view: WizardGameScreenViewer;

    private playerModel: PlayerModel;
    private playerViewer: PlayerViewer<WizardAnimation | KnightAnimation>;
    private playerController: PlayerController<WizardAnimation | KnightAnimation>;

    private enemyModel: EnemyModel;
    private enemyViewer: EnemyViewer<WizardAnimation | KnightAnimation>;
    private enemyController: EnemyController<WizardAnimation | KnightAnimation>;

    private collisionManager: CollisionManager;

    private showBoundingBoxes = false;
    private debugKeyHandler: (e: KeyboardEvent) => void;

    private lastUpdateTime = 0;
    private animationFrameId: number | null = null;

    constructor(private screenSwitcher: ScreenSwitcher, private audio: AudioController) {
        super();
        //Game MVC
        this.model = new WizardGameScreenModel();
        this.view = new WizardGameScreenViewer();
        this.audio = audio;

        //player MVC
        this.playerModel = new PlayerModel();
        this.playerViewer = PlayerFactory.create("knight",this.view.getGroup(), this.playerModel);
        this.playerController = new PlayerController(this.playerModel, this.playerViewer);

        //enemy MVC
        this.enemyModel = new EnemyModel();
        this.enemyViewer = EnemyFactory.create("knight",this.view.getGroup(), this.enemyModel);
        this.enemyController = new EnemyController(this.enemyModel, this.enemyViewer);

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
                //TODO: make more generic add to collision manager debug feature
                if (this.enemyViewer && typeof (this.enemyViewer as any).toggleBoundingBox === 'function') {
                    (this.enemyViewer as any).toggleBoundingBox(this.showBoundingBoxes);
                }
            }
        };
    }

    startGame() {
        this.view.show();
        this.playerController.bindControls();

        //register collidables e.g. player for now. projectiles and blocks to added later
        this.collisionManager.register(this.playerController);
        this.collisionManager.register(this.enemyController);

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
        this.enemyController.update(delta);
        
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
        this.collisionManager.unregister(this.enemyController);

        //TODO: move to debug
        //remove debug key listener
        window.removeEventListener('keydown', this.debugKeyHandler);
    }

    getView(): WizardGameScreenViewer {
        return this.view;
    }
}
