import { ScreenController } from "../../types";
import type { ScreenSwitcher } from "../../types";
import { WizardGameScreenModel } from "./WizardGameScreenModel";
import { WizardGameScreenViewer } from "./WizardGameScreenViewer";
import { CollisionManager } from "./entities/CollisionManager";
import { PlayerController } from "./entities/player/PlayerController";
import { PlayerFactory } from "./entities/player/PlayerFactory";
import { AudioController } from "../../audios/AudioController";
import { InputHandler } from "./InputHandler";
import { EnemyManager } from "./entities/enemy/EnemyManager";

const PLAYER_START_X = 200;
const PLAYER_START_Y = 100;
const PlAYER_SCALE = 4;

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
        this.model = new WizardGameScreenModel();
        this.view = new WizardGameScreenViewer();
        this.input = new InputHandler();
        
        this.playerController = PlayerFactory.create(
            PLAYER_START_X,
            PLAYER_START_Y,
            PlAYER_SCALE,
            "knight", 
            this.view.getGroup(),
            this.audio, 
            this.input
        );

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
        //TODO: combine input handling
        //global keys for game
        this.windowBind();
        //input keys for player
        this.input.bind();
        this.collisionManager.register(this.playerController);
        this.disableImageSmoothing();
        this.lastUpdateTime = performance.now();
        this.updateLoop();
    }

    private disableImageSmoothing(): void {
        const layer = this.view.getGroup().getLayer();
        if (layer) {
            const ctx = layer.getContext() as unknown as CanvasRenderingContext2D;
            ctx.imageSmoothingEnabled = false;
        }
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

        //repeat update loop keep response time smooth calls back at monitor refresh rate
        this.animationFrameId = requestAnimationFrame (this.updateLoop);
    };

    stopGame() {
        //no longer need a call back
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        //remove all colldiable left
        this.collisionManager.unregisterAll();

        //delete objects
        this.enemyManager.clear();
        this.playerController.reset();
        // unbind input handling
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
 * add collision for player on enemy and enemy on enemy just don't overlap
 * 
 * add collision for player on enemy or enemy on player hit or attack
 * 
 * add boundary box for window
 * 
 * Add hurt animation
 * Add death animation
 * 
 * when player dies end game result screen  
 * 
 * Generate AI SFX and Grab BGM
 * 
 * BUGS/FIX:
 * Fix exit game/ mem cleanup
 * holding shift key down while walking
 * 
  */