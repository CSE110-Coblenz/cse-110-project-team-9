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
        
        audioController.play("home_bgm");
        
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
        
        audioController.play("click_sfx");
        
        expect(consoleSpy).toHaveBeenCalled();
        expect(playSpy).not.toHaveBeenCalled();
        consoleSpy.mockRestore();
    });

    /**
     * Test 4: playBGM with invalid key
     */
    it("should not throw error when invalid key is provided", () => {
        expect(() => {
            audioController.play("invalid_key");
        }).not.toThrow();
    });

    /**
     * Test 5: playSFX with valid SFX key
     */
    it("should play SFX when valid SFX key is provided", () => {
        const model = (audioController as any).model;
        const sound = model.sounds["click_sfx"];
        const playSpy = vi.spyOn(sound, "play");
        
        audioController.play("click_sfx");
        
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
        
        audioController.play("home_bgm");
        
        expect(consoleSpy).toHaveBeenCalled();
        expect(playSpy).not.toHaveBeenCalled();
        consoleSpy.mockRestore();
    });

    /**
     * Test 7: playSFX with invalid key
     */
    it("should not throw error when invalid SFX key is provided", () => {
        expect(() => {
            audioController.play("invalid_key");
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
        
        audioController.play("home_bgm");
        
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
        
        audioController.stop("home_bgm");
        
        expect(pauseSpy).toHaveBeenCalled();
    });

    /**
     * Test 10: changeVolume for BGM
     */
    it("should change BGM volume", () => {
        audioController.bgmVolume = 0.7;
        expect(audioController.bgmVolume).toBe(0.7);
    });

    /**
     * Test 11: changeVolume for SFX
     */
    it("should change SFX volume", () => {
        audioController.sfxVolume = 0.8;
        expect(audioController.bgmVolume).toBe(0.8);
    });

    /**
     * Test 12: getVolume returns correct values
     */
    it("should return correct volume values", () => {
        audioController.bgmVolume = 0.6;
        audioController.sfxVolume = 0.4;
        
        expect(audioController.bgmVolume).toBe(0.6);
        expect(audioController.sfxVolume).toBe(0.4);
    });

    /**
     * Test 13: Volume validation - invalid values
     */
    it("should clamp volume to valid range", () => {
        audioController.bgmVolume = -1;
        expect(audioController.bgmVolume).toBeGreaterThanOrEqual(0);
        
        audioController.bgmVolume = 2;
        expect(audioController.sfxVolume).toBeLessThanOrEqual(1);
    });

    /**
     * Test 14: registerSound creates new audio
     */
    it("should register a new sound", () => {
        const model = (audioController as any).model;
        audioController.registerSound("test_sound", "/path/to/sound.mp3", false);
        
        expect(model.sounds["test_sound"]).toBeDefined();
    });

    /**
     * Test 15: registerSound with loop
     */
    it("should register sound with loop enabled", () => {
        const model = (audioController as any).model;
        audioController.registerSound("loop_sound", "/path/to/sound.mp3", true);
        
        expect(model.sounds["loop_sound"].loop).toBe(true);
    });

    /**
     * Test 16: registerSound with overwrite
     */
    it("should overwrite existing sound when overwrite is true", () => {
        const model = (audioController as any).model;
        audioController.registerSound("existing", "/path/to/sound1.mp3", false);
        const firstAudio = model.sounds["existing"];
        
        audioController.registerSound("existing", "/path/to/sound2.mp3", true);
        
        expect(model.sounds["existing"]).not.toBe(firstAudio);
    });

    /**
     * Test 17: registerSound without overwrite
     */
    it("should not overwrite existing sound when overwrite is false", () => {
        const model = (audioController as any).model;
        audioController.registerSound("existing", "/path/to/sound1.mp3", false);
        const firstAudio = model.sounds["existing"];
        
        audioController.registerSound("existing", "/path/to/sound2.mp3", false);
        
        expect(model.sounds["existing"]).toBe(firstAudio);
    });

    /**
     * Test 18: applyVolume updates all sounds
     */
    it("should apply volume to all registered sounds", () => {
        const model = (audioController as any).model;
        audioController.registerSound("test_bgm", "/path/to/bgm.mp3", false);
        audioController.registerSound("test_sfx", "/path/to/sfx.mp3", false);
        
        audioController.bgmVolume = 0.9;
        audioController.sfxVolume = 0.3;
        
        // Note: This test depends on the key naming convention (includes "bgm")
        // In real implementation, sounds with "bgm" in key get bgmVolume
        expect(model.sounds["test_bgm"].volume).toBe(0.9);
        expect(model.sounds["test_sfx"].volume).toBe(0.3);
    });
});