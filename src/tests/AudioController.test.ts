/**
 * Unit tests for AudioController using Vitest
 */

import { describe, it, beforeEach, expect, vi, beforeAll } from "vitest";
import { AudioController } from "../audios/AudioController";
import { AudioModel } from "../audios/AudioModel";

describe("AudioController", () => {
    let audioController: AudioController;
    let mockAudioElement: any;

    beforeAll(() => {
        // Mock HTMLAudioElement
        globalThis.Audio = class {
            muted = false;
            currentTime = 0;
            loop = false;
            volume = 0.5;
            play = vi.fn().mockResolvedValue(undefined);
            pause = vi.fn();
            
            constructor(public src?: string) {
                mockAudioElement = this;
            }
        } as any;
    });

    beforeEach(() => {
        // Reset AudioModel singleton
        (AudioModel as any).instance = null;
        audioController = new AudioController();
    });

    /**
     * Test 1: Initialization
     */
    it("should initialize correctly", () => {
        expect(audioController).toBeDefined();
    });

    /**
     * Test 2: playBGM with valid BGM key
     */
    it("should play music when valid BGM key is provided", () => {
        const model = (audioController as any).model;
        const sound = model.sounds["home_bgm"];
        const playSpy = vi.spyOn(sound, "play");
        
        audioController.playBGM("home_bgm");
        
        expect(sound.muted).toBe(false);
        expect(playSpy).toHaveBeenCalled();
    });

    /**
     * Test 3: playBGM rejects non-BGM keys
     */
    it("should not play music when non-BGM key is provided", () => {
        const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
        const model = (audioController as any).model;
        const sound = model.sounds["click_sfx"];
        const playSpy = vi.spyOn(sound, "play");
        
        audioController.playBGM("click_sfx");
        
        expect(consoleSpy).toHaveBeenCalled();
        expect(playSpy).not.toHaveBeenCalled();
        consoleSpy.mockRestore();
    });

    /**
     * Test 4: playBGM with invalid key
     */
    it("should not throw error when invalid key is provided", () => {
        expect(() => {
            audioController.playBGM("invalid_key");
        }).not.toThrow();
    });

    /**
     * Test 5: playSFX with valid SFX key
     */
    it("should play SFX when valid SFX key is provided", () => {
        const model = (audioController as any).model;
        const sound = model.sounds["click_sfx"];
        const playSpy = vi.spyOn(sound, "play");
        
        audioController.playSFX("click_sfx");
        
        expect(sound.muted).toBe(false);
        expect(sound.currentTime).toBe(0);
        expect(playSpy).toHaveBeenCalled();
    });

    /**
     * Test 6: playSFX rejects non-SFX keys
     */
    it("should not play SFX when non-SFX key is provided", () => {
        const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
        const model = (audioController as any).model;
        const sound = model.sounds["home_bgm"];
        const playSpy = vi.spyOn(sound, "play");
        
        audioController.playSFX("home_bgm");
        
        expect(consoleSpy).toHaveBeenCalled();
        expect(playSpy).not.toHaveBeenCalled();
        consoleSpy.mockRestore();
    });

    /**
     * Test 7: playSFX with invalid key
     */
    it("should not throw error when invalid SFX key is provided", () => {
        expect(() => {
            audioController.playSFX("invalid_key");
        }).not.toThrow();
    });

    /**
     * Test 8: playBGM doesn't restart if already playing
     */
    it("should not restart BGM if already playing", () => {
        const model = (audioController as any).model;
        const sound = model.sounds["home_bgm"];
        sound.paused = false;
        sound.ended = false;
        const playSpy = vi.spyOn(sound, "play");
        
        audioController.playBGM("home_bgm");
        
        expect(sound.muted).toBe(false);
        expect(playSpy).not.toHaveBeenCalled();
    });

    /**
     * Test 9: stopBGM stops looping sounds
     */
    it("should stop all looping sounds", () => {
        const model = (audioController as any).model;
        const sound = model.sounds["home_bgm"]; // home_bgm has loop = true
        const pauseSpy = vi.spyOn(sound, "pause");
        
        audioController.stopBGM();
        
        expect(pauseSpy).toHaveBeenCalled();
    });

    /**
     * Test 10: changeVolume for BGM
     */
    it("should change BGM volume", () => {
        audioController.changeVolume(0.7, "bgm");
        expect(audioController.getVolume("bgm")).toBe(0.7);
    });

    /**
     * Test 11: changeVolume for SFX
     */
    it("should change SFX volume", () => {
        audioController.changeVolume(0.8, "sfx");
        expect(audioController.getVolume("sfx")).toBe(0.8);
    });

    /**
     * Test 12: getVolume returns correct values
     */
    it("should return correct volume values", () => {
        audioController.changeVolume(0.6, "bgm");
        audioController.changeVolume(0.4, "sfx");
        
        expect(audioController.getVolume("bgm")).toBe(0.6);
        expect(audioController.getVolume("sfx")).toBe(0.4);
    });

    /**
     * Test 13: Volume validation - invalid values
     */
    it("should clamp volume to valid range", () => {
        audioController.changeVolume(-1, "bgm");
        expect(audioController.getVolume("bgm")).toBeGreaterThanOrEqual(0);
        
        audioController.changeVolume(2, "bgm");
        expect(audioController.getVolume("bgm")).toBeLessThanOrEqual(1);
    });
});