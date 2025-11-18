//Game manager Switch
import { ScreenController } from "../../types";
import type { ScreenSwitcher } from "../../types";
//Wizard Main
import { WizardGameScreenModel } from "./WizardGameScreenModel";
import { WizardGameScreenViewer } from "./WizardGameScreenViewer";
//Collision Manager
import { CollisionManager } from "./entities/CollisionManager";
//player
import { PlayerController } from "./entities/player/PlayerController";
// import { PlayerHUD } from "./entities/player/PlayerHUD";
import { PlayerFactory } from "./entities/player/PlayerFactory";
//audio
import { AudioController } from "../../audios/AudioController";
//input handler
import { InputHandler } from "./InputHandler";
//enemy manager
import { EnemyManager } from "./entities/enemy/EnemyManager";

export class WizardGameScreenController extends ScreenController {
    private model: WizardGameScreenModel;
    private view: WizardGameScreenViewer;

    private playerController: PlayerController;
        private enemyManager: EnemyManager;

    private collisionManager: CollisionManager;
    private input: InputHandler;

    private showBoundingBoxes = false;

    private lastUpdateTime = 0;
    private animationFrameId: number | null = null;

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
        super();
        //Game MVC
        this.model = new WizardGameScreenModel();
        this.view = new WizardGameScreenViewer();
        this.audio = audio;

        //input handler
        this.input = new InputHandler();
        
        //player
        this.playerController = PlayerFactory.create(
            150, 
            150, 
            "knight", 
            this.view.getGroup(),  //maybe add hud for player as seperta layer
            this.audio, 
            this.input
        );

        //collision between entities
        this.collisionManager = new CollisionManager();

        //enemy wave/spawner
        this.enemyManager = new EnemyManager(
            this.view.getGroup(),
            this.collisionManager,
            this.audio,
            this.model.height,
            this.model.width 
        );
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

        //TODO: remove this goad awful thing
        //disable image smoothing for sprites
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
        this.playerController.update(delta)

        this.enemyManager.update(
            delta,
            this.playerController.model.x,
            this.playerController.model.y
        );

        //update collison manager
        this.collisionManager.update()

        //repeat update loop keep response time smooth
        this.animationFrameId = requestAnimationFrame (this.updateLoop);
    };

    stopGame() {
        //dont run update loop anymore 
        if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);

        //remove collidables
        this.collisionManager.unregisterAll();

        //delete objects
        this.enemyManager.clear();
        this.playerController.reset();

        this.windowUnbind();
        this.input.unbind();
    }

    getView(): WizardGameScreenViewer {
        return this.view;
    }
}

/**
 * TODO: notepad
 * 
 * NEED TO COMPLETE:
 * seperate attack image from player / same thing with enemy HARD
 * 
 * add boundary box for window
 * add boundary box for all collidable entities no overlap
 * 
 * Add hurt animation
 * 
 * when player dies end game result screen  
 * 
 * Generate AI SFX and Grab BGM
 * 
 * BUGS/FIX:
 * holding down attack button does not repeat the audio
 * Fix exit game/ mem cleanup
 * holding shift key down while walking
 * 
  */