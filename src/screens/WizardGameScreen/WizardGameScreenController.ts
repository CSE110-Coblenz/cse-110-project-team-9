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

    //TODO: remove
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

    private debugKey = (e: KeyboardEvent) => {
        console.log({
            key: e.key,
            keyLower: (e.key || "").toLowerCase(),
            code: e.code,
            isRepeat: e.repeat,
            capsLockOn: e.getModifierState && e.getModifierState("CapsLock")
        });
    };

    constructor(private screenSwitcher: ScreenSwitcher, private audio: AudioController) {
        super();
        //Game MVC
        this.model = new WizardGameScreenModel();
        this.view = new WizardGameScreenViewer();
        this.audio = audio;

        //input handler
        this.input = new InputHandler();
        
        //player
        this.playerController = PlayerFactory.create("knight", this.view.getGroup(), this.audio, this.input);

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

        window.addEventListener("keydown", this.debugKey);

        //register collidables e.g. player for now. projectiles and blocks to added later
        this.collisionManager.register(this.playerController);

        //TODO: fix
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
 * holding down attack button does not repeat the audio
 * fix escape key not returning back to main menu
 * holding shift key down while walking
 * main game board assets need a change
 */