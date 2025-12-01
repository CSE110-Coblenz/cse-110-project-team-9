/**
 * Unit tests for MainGameScreenController using Vitest
 */

import { describe, it, beforeEach, expect, vi, beforeAll } from "vitest";
import { MainGameScreenController } from "../../screens/MainGameScreen/MainGameScreenController";
import { AudioController } from "../../audios/AudioController";
import type { ScreenSwitcher } from "../../types";
import { NodeType, MainGameScreenModel } from "../../screens/MainGameScreen/MainGameScreenModel";

/**
 * Mock Konva
 */
vi.mock("konva", () => {
    return {
        default: {
            Group: vi.fn().mockImplementation(() => ({
                visible: vi.fn(),
                add: vi.fn(),
                moveToBottom: vi.fn(),
                moveToTop: vi.fn(),
                getLayer: vi.fn().mockReturnValue({
                    batchDraw: vi.fn(),
                }),
                children: [],
            })),
            Circle: vi.fn().mockImplementation(() => ({
                x: vi.fn(),
                y: vi.fn(),
                destroy: vi.fn(),
            })),
            Text: vi.fn().mockImplementation(() => ({
                text: vi.fn(),
                visible: vi.fn(),
                moveToTop: vi.fn(),
            })),
            Image: {
                fromURL: vi.fn((url, callback) => {
                    const mockImage = {
                        image: vi.fn().mockReturnValue({
                            width: 1920,
                            height: 1080,
                        }),
                        width: vi.fn(),
                        height: vi.fn(),
                        offsetX: vi.fn(),
                        offsetY: vi.fn(),
                        x: vi.fn(),
                        y: vi.fn(),
                    };
                    if (callback) {
                        setTimeout(() => callback(mockImage), 0);
                    }
                    return mockImage;
                }),
            },
            Rect: vi.fn().mockImplementation(() => ({
                x: vi.fn(),
                y: vi.fn(),
                width: vi.fn(),
                height: vi.fn(),
            })),
            Arc: vi.fn().mockImplementation(() => ({
                innerRadius: vi.fn(),
                outerRadius: vi.fn(),
                angle: vi.fn(),
                rotation: vi.fn(),
                fill: vi.fn(),
                opacity: vi.fn(),
            })),
            Line: vi.fn().mockImplementation(() => ({
                points: vi.fn(),
                fill: vi.fn(),
                closed: vi.fn(),
            })),
            Tween: vi.fn().mockImplementation(() => ({
                play: vi.fn(),
            })),
            Easings: {
                EaseInOut: vi.fn(),
                EaseOut: vi.fn(),
                EaseIn: vi.fn(),
            },
        },
    };
});

/**
 * Mock MainGameScreenView
 */
let viewInstance: any;
vi.mock("../../screens/MainGameScreen/MainGameScreenView", () => {
    return {
        MainGameScreenView: class {
            constructor() {
                viewInstance = this;
            }
            disableRollButton = vi.fn();
            enableRollButton = vi.fn();
            displayRollResult = vi.fn();
            animatePlayerPieceRoll = vi.fn().mockResolvedValue(undefined);
            displayNodeEvent = vi.fn();
            displayEnd = vi.fn();
            spinMinigameWheel = vi.fn().mockResolvedValue(1);
            getTiles = vi.fn().mockReturnValue([]);
            show = vi.fn();
            hide = vi.fn();
            rollCallback: (() => void) | null = null;
            settingsCallback: (() => void) | null = null;
            onPlayerRoll(callback: () => void): void {
                this.rollCallback = callback;
            }
            onSettingsOpen(callback: () => void): void {
                this.settingsCallback = callback;
            }
        },
    };
});

/**
 * Mock AudioController
 */
vi.mock("../../audios/AudioController");

describe("MainGameScreenController", () => {
    let mockScreenSwitcher: ScreenSwitcher;
    let mockAudio: AudioController;
    let controller: MainGameScreenController;
    let mockModel: MainGameScreenModel;

    beforeAll(() => {
        // Mock environment variables
        (import.meta as any).env = {
            BASE_URL: "/",
        };
    });

    beforeEach(() => {
        vi.clearAllMocks();

        mockScreenSwitcher = {
            switchToScreen: vi.fn(),
            layerOnScreen: vi.fn(),
            lastScreen: { type: "home" },
        };

        mockAudio = {
            play: vi.fn(),
            stopAll: vi.fn(),
            registerSound: vi.fn(),
        } as unknown as AudioController;

        // Create a real model instance for testing
        mockModel = new MainGameScreenModel();

        controller = new MainGameScreenController(mockScreenSwitcher, mockAudio);
    });

    /**
     * Test 1: Initialization
     */
    it("should initialize correctly", () => {
        expect(controller).toBeDefined();
        expect(mockAudio.registerSound).toHaveBeenCalledWith(
            "mainboard_bgm",
            expect.stringContaining("mainboardBGM.mp3")
        );
        expect(mockAudio.registerSound).toHaveBeenCalledWith(
            "click_sfx",
            expect.stringContaining("click.mp3")
        );
    });

    /**
     * Test 2: Dice roll returns valid value
     */
    it("should roll dice and return value between 1 and 6", () => {
        const roll = controller.diceRoll();
        expect(roll).toBeGreaterThanOrEqual(1);
        expect(roll).toBeLessThanOrEqual(6);
    });

    /**
     * Test 3: Normal move within board
     */
    it("should move player normally when not reaching end node", async () => {
        // Set player at position 10
        (controller as any).gameModel.setPlayerPosition(10);
        const roll = 5;

        // Mock diceRoll to return 5
        vi.spyOn(controller, "diceRoll").mockReturnValue(5);

        // Use the stored roll callback
        if (viewInstance.rollCallback) {
            await viewInstance.rollCallback();
        }

        // Check that animation was called with the full roll
        expect(viewInstance.animatePlayerPieceRoll).toHaveBeenCalled();
        expect(viewInstance.enableRollButton).toHaveBeenCalled();
    });

    /**
     * Test 4: Stop at end node when reaching exactly
     */
    it("should stop at end node when roll reaches exactly end node", async () => {
        // Set player at position 35 (5 moves from end at position 39)
        (controller as any).gameModel.setPlayerPosition(35);
        const roll = 4; // This would reach position 39 (end node)

        // Mock diceRoll to return 4
        vi.spyOn(controller, "diceRoll").mockReturnValue(4);

        // Use the stored roll callback
        if (viewInstance.rollCallback) {
            await viewInstance.rollCallback();
        }

        // Should animate only 4 moves (35 -> 39)
        expect(viewInstance.animatePlayerPieceRoll).toHaveBeenCalledWith(4);
        
        // Position should be set to end node (39)
        const finalPosition = (controller as any).gameModel.getPlayerPosition();
        expect(finalPosition).toBe(39);
        
        // Roll button should NOT be re-enabled
        expect(viewInstance.enableRollButton).not.toHaveBeenCalled();
    });

    /**
     * Test 5: Stop at end node when roll would exceed end node
     */
    it("should stop at end node when roll would exceed end node", async () => {
        // Set player at position 37 (2 moves from end at position 39)
        (controller as any).gameModel.setPlayerPosition(37);
        const roll = 5; // This would go to position 42, but should stop at 39

        // Mock diceRoll to return 5
        vi.spyOn(controller, "diceRoll").mockReturnValue(5);

        // Use the stored roll callback
        if (viewInstance.rollCallback) {
            await viewInstance.rollCallback();
        }

        // Should animate only 2 moves (37 -> 39), not 5
        expect(viewInstance.animatePlayerPieceRoll).toHaveBeenCalledWith(2);
        
        // Position should be set to end node (39), not 42
        const finalPosition = (controller as any).gameModel.getPlayerPosition();
        expect(finalPosition).toBe(39);
        
        // Roll button should NOT be re-enabled
        expect(viewInstance.enableRollButton).not.toHaveBeenCalled();
    });

    /**
     * Test 6: Trigger END node event
     */
    it("should trigger END node event and display end screen", () => {
        (controller as any).gameModel.setPlayerPosition(39);
        controller.triggerNodeEvent(40); // End node is at index 40 (1-indexed)

        expect(viewInstance.displayEnd).toHaveBeenCalled();
    });

    /**
     * Test 7: Trigger QUESTION node event
     */
    it("should trigger QUESTION node event", () => {
        controller.triggerNodeEvent(2); // EASY_QUESTION node

        expect(viewInstance.displayNodeEvent).toHaveBeenCalledWith("Landed on a Question tile!");
    });

    /**
     * Test 8: Trigger MINIGAME node event
     */
    it("should trigger MINIGAME node event", async () => {
        controller.triggerNodeEvent(5); // MINIGAME node

        expect(viewInstance.displayNodeEvent).toHaveBeenCalledWith("Landed on a Minigame tile!");
        // Note: triggerRandomMinigame is async, so we can't easily test the screen switch here
    });

    /**
     * Test 9: Show method plays BGM
     */
    it("should play BGM when show is called", () => {
        controller.show();
        expect(mockAudio.play).toHaveBeenCalledWith("mainboard_bgm", true);
        expect(viewInstance.show).toHaveBeenCalled();
    });

    /**
     * Test 10: Hide method stops audio
     */
    it("should stop all audio and hide view when hide is called", () => {
        controller.hide();
        expect(mockAudio.stopAll).toHaveBeenCalled();
        expect(viewInstance.hide).toHaveBeenCalled();
    });

    /**
     * Test 11: Settings button opens settings
     */
    it("should open settings when settings button is clicked", () => {
        // Use the stored settings callback
        if (viewInstance.settingsCallback) {
            viewInstance.settingsCallback();
        }

        expect(mockAudio.play).toHaveBeenCalledWith("click_sfx");
        expect(mockScreenSwitcher.layerOnScreen).toHaveBeenCalledWith({ type: "settings" });
    });

    /**
     * Test 12: Player roll disables button and plays sounds
     */
    it("should disable roll button and play sounds when player rolls", async () => {
        vi.spyOn(controller, "diceRoll").mockReturnValue(3);
        
        // Use the stored roll callback
        if (viewInstance.rollCallback) {
            await viewInstance.rollCallback();
        }

        expect(viewInstance.disableRollButton).toHaveBeenCalled();
        expect(mockAudio.play).toHaveBeenCalledWith("click_sfx");
        expect(mockAudio.play).toHaveBeenCalledWith("dice_sfx", false);
        expect(viewInstance.displayRollResult).toHaveBeenCalledWith(3);
    });
});
