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
            lastScreen: { type: "starting" },
        };
        mockAudio = {
            bgmVolume: 0.5,
            sfxVolume: 0.5,
            setBgmVolume: vi.fn(),
            setSfxVolume: vi.fn(),
            play: vi.fn(),
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
     * Test 2: Save button plays click sound and hides
     */
    it("should play click sound and hide when save button is clicked", () => {
        const callback = viewInstance.getSaveButton().on.mock.calls[0][1];
        callback();

        expect(mockAudio.play).toHaveBeenCalledWith("click_sfx");
        expect(viewInstance.hide).toHaveBeenCalled();
    });

    /**
     * Test 3: Volume change handler calls setBgmVolume or setSfxVolume
     */
    it("should call setBgmVolume when volume change handler is triggered for bgm", () => {
        const handler = viewInstance.setVolumeChangeHandler.mock.calls[0][0];
        
        handler(0.6, "bgm");
        expect(mockAudio.setBgmVolume).toHaveBeenCalledWith(0.6);
    });

    /**
     * Test 4: Volume change handler calls setSfxVolume for sfx
     */
    it("should call setSfxVolume when volume change handler is triggered for sfx", () => {
        const handler = viewInstance.setVolumeChangeHandler.mock.calls[0][0];
        
        handler(0.4, "sfx");
        expect(mockAudio.setSfxVolume).toHaveBeenCalledWith(0.4);
    });
});