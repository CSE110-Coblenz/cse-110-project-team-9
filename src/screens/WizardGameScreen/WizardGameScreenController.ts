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
import { PLAYER_START_X, PLAYER_START_Y, PLAYER_SCALE } from "./config";

export class WizardGameScreenController extends ScreenController {
    private model: WizardGameScreenModel;
    private view: WizardGameScreenView;

    private playerController: PlayerController;
    private enemyManager: EnemyManager;

    private collisionManager: CollisionManager;
    private input: InputHandler;

    private lastUpdateTime = 0;
    private animationFrameId: number | null = null;

    private paused;

    private keydownHandler = (e: KeyboardEvent) => {
        if (e.key === 'Escape'){
            this.pauseGame();
            this.screenSwitcher.layerOnScreen({ type: "wizardguide" });
        } 
    }

    constructor(private screenSwitcher: ScreenSwitcher, private audio: AudioController) {
        super();
        this.model = new WizardGameScreenModel();
        this.view = new WizardGameScreenView();
        this.input = new InputHandler();

        this.audio.registerSound("wizard_bgm",`${import.meta.env.BASE_URL}wizardminigame/audio/mp3/Pixel 5.mp3`);

        this.paused = false;
        
        this.playerController = PlayerFactory.create(
            PLAYER_START_X,
            PLAYER_START_Y,
            PLAYER_SCALE,
            "knight", 
            this.view.getGroup(),
            this.audio, 
            this.input,
            () => this.exit(),
            () => this.mathQuestion()
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

    startGame() {
        this.view.show();
        window.addEventListener('keydown', this.keydownHandler);
        this.input.bind();
        this.collisionManager.register(this.playerController);

        this.audio.play("wizard_bgm", true);
        this.lastUpdateTime = performance.now();
        this.updateLoop();

        this.pauseGame();
        this.screenSwitcher.layerOnScreen({ type: "wizardguide" });
    }

    private updateLoop = () => {
        if(this.paused) return;

        const now = performance.now();
        const delta = (now - this.lastUpdateTime) / 1000;
        this.lastUpdateTime = now;

        this.playerController.update(delta);
        this.enemyManager.update(
            delta,
            this.playerController.model.x,
            this.playerController.model.y
        );
        this.collisionManager.update();

        this.animationFrameId = requestAnimationFrame(this.updateLoop);
    };

    stopGame() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        this.input.unbind();
        window.removeEventListener('keydown', this.keydownHandler);
        this.collisionManager.unregisterAll();
        this.audio.stopAll();
        this.enemyManager.reset();
        this.playerController.reset();
        this.lastUpdateTime = 0;
        this.view.hide();
    }

    hide(): void {
        this.stopGame();
    }

    pauseGame() {
        this.paused = true;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        this.input.unbind();
    }

    resumeGame() {
        console.log("resumeGame called!");
        this.paused = false;
        this.input.bind();
        this.lastUpdateTime = performance.now();
        this.updateLoop();
    }

    exit() {
        this.stopGame();
        this.screenSwitcher.switchToScreen({ type:"mainGame" });
    }

    mathQuestion() {
        this.pauseGame();
        this.screenSwitcher.layerOnScreen({ type:"linear_screen" });
    }

    getView(): WizardGameScreenView {
        return this.view;
    }
}