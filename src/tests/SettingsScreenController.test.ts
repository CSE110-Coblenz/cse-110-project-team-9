/**
 * Unit tests for SettingsScreenController using Vitest
 */

import { describe, it, beforeEach, expect, vi, beforeAll } from "vitest";
import { SettingsScreenController } from "../screens/SettingsScreen/SettingsScreenController";
import { AudioController } from "../audios/AudioController";
import type { ScreenSwitcher, Screen } from "../types";

let viewInstance: any;

/**
 * Mock the SettingsScreenView class
 */
vi.mock("../screens/SettingsScreen/SettingsScreenView", () => {
    return {
        SettingsScreenView: class {
            constructor() {
                viewInstance = this;
            }

            getSaveButton = vi.fn().mockReturnValue({ on: vi.fn() });
            setVolumeChangeHandler = vi.fn();
            hide = vi.fn();
            getGroup = vi.fn().mockReturnValue({});
        },
    };
});

/**
 * Mock the AudioController class
 */
vi.mock("../audios/AudioController");

describe("SettingsScreenController", () => {
    let mockScreenSwitcher: ScreenSwitcher;
    let mockAudio: AudioController;
    let controller: SettingsScreenController;

    beforeAll(() => {
        // Mock localStorage
        globalThis.localStorage = {
            getItem: vi.fn(),
            setItem: vi.fn(),
            removeItem: vi.fn(),
            clear: vi.fn(),
        } as any;
    });

    beforeEach(() => {
        mockScreenSwitcher = {
            switchToScreen: vi.fn(),
            layerOnScreen: vi.fn(),
        };
        mockAudio = {
            getVolume: vi.fn().mockReturnValue(0.5),
            changeVolume: vi.fn(),
        } as unknown as AudioController;

        controller = new SettingsScreenController(mockScreenSwitcher, mockAudio);
    });

    /**
     * Test 1: Initialization
     */
    it("should initialize correctly", () => {
        expect(controller).toBeDefined();
        expect(viewInstance.getSaveButton).toHaveBeenCalled();
        expect(viewInstance.setVolumeChangeHandler).toHaveBeenCalled();
    });

    /**
     * Test 2: Save button saves volumes to localStorage
     */
    it("should save volumes to localStorage when save button is clicked", () => {
        (mockAudio.getVolume as any).mockReturnValueOnce(0.7).mockReturnValueOnce(0.8);
        
        const callback = viewInstance.getSaveButton().on.mock.calls[0][1];
        callback();

        expect(mockAudio.getVolume).toHaveBeenCalledWith("bgm");
        expect(mockAudio.getVolume).toHaveBeenCalledWith("sfx");
        expect(localStorage.setItem).toHaveBeenCalledWith("bgm_volume", "0.7");
        expect(localStorage.setItem).toHaveBeenCalledWith("sfx_volume", "0.8");
    });

    /**
     * Test 3: Save button switches to return screen
     */
    it("should switch to return screen when save button is clicked and returnTo is set", () => {
        const returnScreen: Screen = { type: "mainGame" };
        controller.setReturnTo(returnScreen);
        
        const callback = viewInstance.getSaveButton().on.mock.calls[0][1];
        callback();

        expect(mockScreenSwitcher.switchToScreen).toHaveBeenCalledWith(returnScreen);
    });

    /**
     * Test 4: Save button does not switch when returnTo is null
     */
    it("should not switch screen when returnTo is null", () => {
        const callback = viewInstance.getSaveButton().on.mock.calls[0][1];
        callback();

        expect(mockScreenSwitcher.switchToScreen).not.toHaveBeenCalled();
    });

    /**
     * Test 5: Volume change handler calls changeVolume
     */
    it("should call changeVolume when volume change handler is triggered", () => {
        const handler = viewInstance.setVolumeChangeHandler.mock.calls[0][0];
        
        handler(0.6, "bgm");
        expect(mockAudio.changeVolume).toHaveBeenCalledWith(0.6, "bgm");
        
        handler(0.4, "sfx");
        expect(mockAudio.changeVolume).toHaveBeenCalledWith(0.4, "sfx");
    });

    /**
     * Test 6: setReturnTo sets return screen
     */
    it("should set return screen correctly", () => {
        const returnScreen: Screen = { type: "home" };
        controller.setReturnTo(returnScreen);
        
        const callback = viewInstance.getSaveButton().on.mock.calls[0][1];
        callback();

        expect(mockScreenSwitcher.switchToScreen).toHaveBeenCalledWith(returnScreen);
    });
});