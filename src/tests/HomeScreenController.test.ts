/**
 * Unit tests for HomeScreenController using Vitest
 */

import { describe, it, beforeEach, expect, vi, beforeAll } from "vitest";

/**
 * Import the HomeScreenController and its dependencies
 */

import { HomeScreenController } from "../screens/HomeScreen/HomeScreenController";
import { AudioController } from "../audios/AudioController";
import type { ScreenSwitcher } from "../types";

/**
 * Create mock's instance
 */

let viewInstance: any;

/**
 * Mock the HomeScreenView class
 */

vi.mock("../screens/HomeScreen/HomeScreenView", () => {
    return {
        HomeScreenView: class {
        constructor() {
            viewInstance = this;
        }

        /**
         * vi.fn() : Create mock functions for the methods used in HomeScreen
         * on: vi.fn() : Mock the event listener (Button click)
         * off: vi.fn() : Mock the event remover (Remove click listener)
         */
        getSettingsButton = vi.fn().mockReturnValue({ on: vi.fn() });
        getStartButton = vi.fn().mockReturnValue({ on: vi.fn() });
        getGroup = vi.fn().mockReturnValue({ on: vi.fn(), off: vi.fn() });
        hide = vi.fn();
        },
    };
});

/**
 * Mock the AudioController class
 */

vi.mock("../audios/AudioController");

/**
 * Unit tests for HomeScreenController
 */

describe("HomeScreenController", () => {
    let mockScreenSwitcher: ScreenSwitcher;
    let mockAudio: AudioController;
    let controller: HomeScreenController;
    
    /**
     * beforeAll: Setup before the tests run
     */
    beforeAll(() => {
        globalThis.document.createElement = vi.fn((tag) => {
        if (tag === "video") {
            return {
            style: {},
            load: vi.fn(),
            play: vi.fn().mockResolvedValue(undefined),
            addEventListener: vi.fn(),
            muted: false,
            };
        }
        return { style: {} };
        }) as unknown as typeof document.createElement;
    });

    /**
     * beforeEach: Setup before each test case (Not to share state between tests)
     */
    beforeEach(() => {
        mockScreenSwitcher = { 
            switchToScreen: vi.fn(),
            layerOnScreen: vi.fn()
        };
        mockAudio = {
        playMusic: vi.fn(),
        stopBGM: vi.fn(),
        } as unknown as AudioController;

        controller = new HomeScreenController(mockScreenSwitcher, mockAudio);
    });

    /**
     * Test 1: Initialization
     */
    it("should initialize correctly", () => {
        expect(controller).toBeDefined();
        expect(viewInstance.getSettingsButton).toHaveBeenCalled();
        expect(viewInstance.getStartButton).toHaveBeenCalled();
        expect(viewInstance.getGroup).toHaveBeenCalled();
    });

    /**
     * Test 2: Settings Button Click
     */
    it("should switch to settings screen when settings button clicked", () => {
        const callback = viewInstance.getSettingsButton().on.mock.calls[0][1];
        callback();

        expect(mockAudio.playMusic).toHaveBeenCalledWith("click_sfx");
        expect(mockScreenSwitcher.layerOnScreen).toHaveBeenCalledWith({ type: "settings", returnTo: { type: "home" } });
    });

    /**
     * Test 3: Start Button Click
     */
    it("should switch to mainGame screen when start button clicked", () => {
        const callback = viewInstance.getStartButton().on.mock.calls[0][1];
        callback();

        expect(mockAudio.playMusic).toHaveBeenCalledWith("click_sfx");
        expect(mockScreenSwitcher.switchToScreen).toHaveBeenCalledWith({ type: "mainGame" });
    });

    /**
     * Test 4: Group Click to Play BGM
     */
    it("should play BGM when group clicked and remove listener", () => {
        const callback = viewInstance.getGroup().on.mock.calls[0][1];
        callback();

        expect(mockAudio.playMusic).toHaveBeenCalledWith("home_bgm");
        expect(viewInstance.getGroup().off).toHaveBeenCalledWith("click");
    });

    /**
     * Test 5: Hide Method
     */
    it("should stop BGM and hide view when hide() is called", () => {
        controller.hide();
        expect(mockAudio.stopBGM).toHaveBeenCalled();
        expect(viewInstance.hide).toHaveBeenCalled();
    });
});