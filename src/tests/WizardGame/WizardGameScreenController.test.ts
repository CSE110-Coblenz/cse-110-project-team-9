/**
 * Unit tests for WizardGameScreenController using Vitest
 */

import { describe, it, beforeEach, expect, vi, beforeAll } from "vitest";
import { WizardGameScreenController } from "../../screens/WizardGameScreen/WizardGameScreenController";
import { AudioController } from "../../audios/AudioController";
import type { ScreenSwitcher } from "../../types";

/**
 * Mock Konva
 */
vi.mock("konva", () => {
    return {
        default: {
            Group: vi.fn().mockImplementation(() => ({
                visible: vi.fn(),
                add: vi.fn(),
                getLayer: vi.fn().mockReturnValue({
                    getContext: vi.fn().mockReturnValue({
                        imageSmoothingEnabled: true,
                    }),
                }),
            })),
            Image: vi.fn().mockImplementation(() => ({
                src: "",
            })),
        },
    };
});

/**
 * Mock WizardGameScreenView
 */
let viewInstance: any;
vi.mock("../../screens/WizardGameScreen/WizardGameScreenView", () => {
    return {
        WizardGameScreenView: class {
            constructor() {
                viewInstance = this;
            }
            show = vi.fn();
            hide = vi.fn();
            getGroup = vi.fn().mockReturnValue({
                getLayer: vi.fn().mockReturnValue({
                    getContext: vi.fn().mockReturnValue({
                        imageSmoothingEnabled: true,
                    }),
                }),
            });
        },
    };
});

/**
 * Mock WizardGameScreenModel
 */
vi.mock("../../screens/WizardGameScreen/WizardGameScreenModel", () => {
    return {
        WizardGameScreenModel: class {
            width = 800;
            height = 600;
        },
    };
});

/**
 * Mock PlayerFactory
 */
vi.mock("../../screens/WizardGameScreen/entities/player/PlayerFactory", () => {
    return {
        PlayerFactory: {
            create: vi.fn().mockReturnValue({
                update: vi.fn(),
                reset: vi.fn(),
                model: { x: 200, y: 100 },
            }),
        },
    };
});

/**
 * Mock EnemyManager
 */
vi.mock("../../screens/WizardGameScreen/entities/enemy/EnemyManager", () => {
    return {
        EnemyManager: class {
            update = vi.fn();
            reset = vi.fn();
        },
    };
});

/**
 * Mock CollisionManager
 */
vi.mock("../../screens/WizardGameScreen/entities/CollisionManager", () => {
    return {
        CollisionManager: class {
            register = vi.fn();
            unregisterAll = vi.fn();
            update = vi.fn();
        },
    };
});

/**
 * Mock InputHandler
 */
vi.mock("../../screens/WizardGameScreen/InputHandler", () => {
    return {
        InputHandler: class {
            bind = vi.fn();
            unbind = vi.fn();
        },
    };
});

/**
 * Mock AudioController
 */
vi.mock("../../audios/AudioController");

describe("WizardGameScreenController", () => {
    let mockScreenSwitcher: ScreenSwitcher;
    let mockAudio: AudioController;
    let controller: WizardGameScreenController;

    beforeAll(() => {
        // Mock performance API
        globalThis.performance = {
            now: vi.fn().mockReturnValue(1000),
        } as any;

        // Mock requestAnimationFrame
        globalThis.requestAnimationFrame = vi.fn((cb) => {
            setTimeout(cb, 16);
            return 1;
        }) as any;

        // Mock cancelAnimationFrame
        globalThis.cancelAnimationFrame = vi.fn();

        // Mock window.addEventListener and removeEventListener
        globalThis.window = {
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
        } as any;
    });

    beforeEach(() => {
        vi.clearAllMocks();

        mockScreenSwitcher = {
            switchToScreen: vi.fn(),
            layerOnScreen: vi.fn(),
            lastScreen: { type: "mainGame" },
        };

        mockAudio = {
            play: vi.fn(),
            stopAll: vi.fn(),
            registerSound: vi.fn(),
        } as unknown as AudioController;

        controller = new WizardGameScreenController(mockScreenSwitcher, mockAudio);
    });

    /**
     * Test 1: Initialization
     */
    it("should initialize correctly", () => {
        expect(controller).toBeDefined();
        expect(mockAudio.registerSound).toHaveBeenCalledWith(
            "wizard_bgm",
            "/wizardminigame/audio/mp3/Pixel 5.mp3"
        );
    });

    /**
     * Test 2: startGame sets up the game
     */
    it("should start the game correctly", () => {
        controller.startGame();

        expect(viewInstance.show).toHaveBeenCalled();
        expect(mockAudio.play).toHaveBeenCalledWith("wizard_bgm", true);
        expect(mockScreenSwitcher.layerOnScreen).toHaveBeenCalledWith({ type: "wizardguide" });
    });

    /**
     * Test 3: stopGame cleans up resources
     */
    it("should stop the game and clean up", () => {
        controller.startGame();
        controller.stopGame();

        expect(viewInstance.hide).toHaveBeenCalled();
        expect(mockAudio.stopAll).toHaveBeenCalled();
    });

    /**
     * Test 4: hide calls stopGame
     */
    it("should hide the game screen", () => {
        const stopGameSpy = vi.spyOn(controller as any, "stopGame");
        controller.hide();

        expect(stopGameSpy).toHaveBeenCalled();
    });

    /**
     * Test 5: pauseGame stops the update loop
     */
    it("should pause the game", () => {
        controller.startGame();
        controller.pauseGame();

        expect(globalThis.cancelAnimationFrame).toHaveBeenCalled();
    });

    /**
     * Test 6: resumeGame restarts the update loop
     */
    it("should resume the game", () => {
        controller.startGame();
        controller.pauseGame();
        controller.resumeGame();

        expect(globalThis.requestAnimationFrame).toHaveBeenCalled();
    });

    /**
     * Test 7: exit switches to mainGame screen
     */
    it("should exit to mainGame screen", () => {
        controller.startGame();
        controller.exit();

        expect(mockScreenSwitcher.switchToScreen).toHaveBeenCalledWith({ type: "mainGame" });
    });

    /**
     * Test 8: getView returns the view
     */
    it("should return the view", () => {
        const view = controller.getView();
        expect(view).toBe(viewInstance);
    });

    /**
     * Test 9: Escape key pauses and shows guide
     */
    it("should handle Escape key press", () => {
        const pauseGameSpy = vi.spyOn(controller as any, "pauseGame");
        controller.startGame();

        const event = new KeyboardEvent("keydown", { key: "Escape" });
        (controller as any).keydownHandler(event);

        expect(pauseGameSpy).toHaveBeenCalled();
        expect(mockScreenSwitcher.layerOnScreen).toHaveBeenCalledWith({ type: "wizardguide" });
    });
});

