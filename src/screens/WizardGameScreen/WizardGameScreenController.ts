//Game manager Switch
import { ScreenController } from "../../types";
import type { ScreenSwitcher } from "../../types";
//Wizard Main
import { WizardGameScreenModel } from "./WizardGameScreenModel";
import { WizardGameScreenViewer } from "./WizardGameScreenViewer";
//Collision Manager
import { CollisionManager } from "./entities/CollisionManager";
//entities 
import { PlayerController } from "./entities/player/PlayerController";
import { EnemyController } from "./entities/enemy/EnemyController";
//sprite factories
import { PlayerFactory } from "./entities/player/PlayerFactory";
import { EnemyFactory } from "./entities/enemy/EnemyFactory";
//sprite type
import type { WizardAnimation } from "./entities/types/Wizard";
import type { KnightAnimation } from "./entities/types/Knight";
//audio
import { AudioController } from "../../audios/AudioController";
//input handler
import { InputHandler } from "./InputHandler";

export class WizardGameScreenController extends ScreenController {
    private model: WizardGameScreenModel;
    private view: WizardGameScreenViewer;

    private playerController: PlayerController<WizardAnimation | KnightAnimation>;
    private enemyController: EnemyController<WizardAnimation | KnightAnimation>;

    private collisionManager: CollisionManager;

    private showBoundingBoxes = false;

    private lastUpdateTime = 0;
    private animationFrameId: number | null = null;

    private input: InputHandler;

    //TODO: this is for testing purposes
    private keydownHandler = (e: KeyboardEvent) => {
        if (e.key === 'b') {
            this.showBoundingBoxes = !this.showBoundingBoxes;
            this.collisionManager.toggleDebugMode(this.showBoundingBoxes);
        } 
        if (e.key === 'Escape'){
            this.stopGame();
            this.screenSwitcher.switchToScreen({ type:"home" });
        } 
        if (e.key === '1'){
            this.screenSwitcher.layerOnScreen({ type:"settings" });
        }
    }

    constructor(private screenSwitcher: ScreenSwitcher, private audio: AudioController) {
        //TODO: add dynamic resolution
        super();
        //Game MVC
        this.model = new WizardGameScreenModel();
        this.view = new WizardGameScreenViewer();
        this.audio = audio;

        //input handler
        this.input = new InputHandler();
        
        //entities
        this.enemyController = EnemyFactory.create("knight", this.view.getGroup(), this.audio);
        this.playerController = PlayerFactory.create("knight", this.view.getGroup(), this.audio, this.input);

        //collision betweene entities
        this.collisionManager = new CollisionManager();
    }

    windowBind() {
        window.addEventListener('keydown', this.keydownHandler);
    }

    windowUnbind() {
        window.removeEventListener('keydown', this.keydownHandler);
    }

    startGame() {
        this.view.show();
        this.windowBind();
        this.input.bind();

        //register collidables e.g. player for now. projectiles and blocks to added later
        this.collisionManager.register(this.playerController);
        this.collisionManager.register(this.enemyController);

        // disable image smoothing for sprites
        const layer = this.view.getGroup().getLayer();
        if (layer) {
            const ctx = layer.getContext() as unknown as CanvasRenderingContext2D;
            ctx.imageSmoothingEnabled = false;
        }

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

        //repeat update loop keep response time smooth
        this.animationFrameId = requestAnimationFrame (this.updateLoop);
    };

    stopGame() {
        //dont run update loop anymore 
        if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);

        //remove collidables
        this.collisionManager.unregister(this.playerController);
        this.collisionManager.unregister(this.enemyController);

        this.playerController.reset();

        this.windowUnbind();
        this.input.unbind();
    }

    getView(): WizardGameScreenViewer {
        return this.view;
    }
}
