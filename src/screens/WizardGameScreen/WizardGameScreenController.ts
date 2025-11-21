import { ScreenController } from "../../types";
import type { ScreenSwitcher } from "../../types";
import { WizardGameScreenModel } from "./WizardGameScreenModel";
import { WizardGameScreenView } from "./WizardGameScreenView";
import { CollisionManager } from "./entities/CollisionManager";
import { PlayerController } from "./entities/player/PlayerController";
import { PlayerFactory } from "./entities/player/PlayerFactory";
import { AudioController } from "../../audios/AudioController";
import { InputHandler } from "./InputHandler";
import { EnemyManager } from "./entities/enemy/EnemyManager";
import { PLAYER_START_X, PLAYER_START_Y, PlAYER_SCALE } from "./config";

export class WizardGameScreenController extends ScreenController {
    private model: WizardGameScreenModel;
    private view: WizardGameScreenView;

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
            this.pauseGame();
            this.screenSwitcher.layerOnScreen({ type: "wizardguide" })
        } 
    }

    constructor(private screenSwitcher: ScreenSwitcher, private audio: AudioController) {
        super();
        this.model = new WizardGameScreenModel();
        this.view = new WizardGameScreenView();
        this.input = new InputHandler();

        this.audio.registerSound("wizard_bgm","/wizardminigame/audio/mp3/Pixel 5.mp3");
        
        this.playerController = PlayerFactory.create(
            PLAYER_START_X,
            PLAYER_START_Y,
            PlAYER_SCALE,
            "knight", 
            this.view.getGroup(),
            this.audio, 
            this.input,
            () => this.exit(),
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
        //global keys for game
        this.windowBind();
        //input keys for player
        this.input.bind();
        this.collisionManager.register(this.playerController);
        this.disableImageSmoothing();

        this.audio.play("wizard_bgm", true);
        this.lastUpdateTime = performance.now();
        this.updateLoop();

        //start game paused
        this.pauseGame();
            this.screenSwitcher.layerOnScreen({ type: "wizardguide" })
    }

    private disableImageSmoothing(): void {
        //weird fix to make sure the pixels are not smoothed over
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
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        // unbind input handling
        this.windowUnbind();
        this.input.unbind();

        //remove all colldiable left
        this.collisionManager.unregisterAll();

        this.audio.stopAll();
        //clear and reset enemies
        this.enemyManager.reset();
        //resett plaeyer
        this.playerController.reset();

        //reset game state parameters
        this.lastUpdateTime = 0;
        this.showBoundingBoxes = false;
        this.collisionManager.toggleDebugMode(false);

        //hide the view
        this.view.hide();
    }

    hide(): void {
        this.stopGame();
    }

    pauseGame() {
        //stop update loop
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        this.input.unbind();
    }

    resumeGame() {
        this.input.bind();

        // restart loop
        this.lastUpdateTime = performance.now();
        this.updateLoop();
    }

    exit() {
        this.stopGame();
        this.screenSwitcher.switchToScreen({ type:"mainGame" });
    }

    getView(): WizardGameScreenView {
        return this.view;
    }
}