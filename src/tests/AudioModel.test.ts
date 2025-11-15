/**
 * Unit tests for AudioModel using Vitest
 */

import { describe, it, beforeEach, expect, vi, beforeAll } from "vitest";
import { AudioModel } from "../audios/AudioModel";

describe("AudioModel", () => {
    let mockAudioElement: any;

    beforeAll(() => {
        // Mock HTMLAudioElement
        globalThis.Audio = class {
            muted = false;
            currentTime = 0;
            loop = false;
            volume = 0.5;
            play = vi.fn();
            pause = vi.fn();
            
            constructor(public src?: string) {
                mockAudioElement = this;
            }
        } as any;
    });

    beforeEach(() => {
        // Reset singleton instance
        (AudioModel as any).instance = null;
    });

    /**
     * Test 1: Singleton pattern
     */
    it("should return the same instance on multiple calls", () => {
        const instance1 = AudioModel.getInstance();
        const instance2 = AudioModel.getInstance();
        
        expect(instance1).toBe(instance2);
    });

    /**
     * Test 1: Initial volume values
     */
    it("should initialize with default volumes", () => {
        const model = AudioModel.getInstance();
        
        expect(model.getVolume("bgm")).toBe(0.5);
        expect(model.getVolume("sfx")).toBe(0.5);
    });

    /**
     * Test 2: Volume validation - negative values
     */
    it("should validate and clamp negative volume values", () => {
        const model = AudioModel.getInstance();
        model.setVolume(-1, "bgm");
        
        expect(model.getVolume("bgm")).toBe(0.5); // Default fallback
    });

    /**
     * Test 3: Volume validation - values over 1
     */
    it("should validate and clamp volume values over 1", () => {
        const model = AudioModel.getInstance();
        model.setVolume(2, "bgm");
        
        expect(model.getVolume("bgm")).toBe(0.5); // Default fallback
    });

    /**
     * Test 4: Volume validation - NaN
     */
    it("should validate and handle NaN values", () => {
        const model = AudioModel.getInstance();
        model.setVolume(NaN, "bgm");
        
        expect(model.getVolume("bgm")).toBe(0.5); // Default fallback
    });

    /**
     * Test 5: registerSound creates new audio
     */
    it("should register a new sound", () => {
        const model = AudioModel.getInstance();
        model.registerSound("test_sound", "/path/to/sound.mp3", false);
        
        expect(model.sounds["test_sound"]).toBeDefined();
    });

    /**
     * Test 6: registerSound with loop
     */
    it("should register sound with loop enabled", () => {
        const model = AudioModel.getInstance();
        model.registerSound("loop_sound", "/path/to/sound.mp3", true);
        
        expect(model.sounds["loop_sound"].loop).toBe(true);
    });

    /**
     * Test 7: registerSound with overwrite
     */
    it("should overwrite existing sound when overwrite is true", () => {
        const model = AudioModel.getInstance();
        model.registerSound("existing", "/path/to/sound1.mp3", false);
        const firstAudio = model.sounds["existing"];
        
        model.registerSound("existing", "/path/to/sound2.mp3", true, true);
        
        expect(model.sounds["existing"]).not.toBe(firstAudio);
    });

    /**
     * Test 8: registerSound without overwrite
     */
    it("should not overwrite existing sound when overwrite is false", () => {
        const model = AudioModel.getInstance();
        model.registerSound("existing", "/path/to/sound1.mp3", false);
        const firstAudio = model.sounds["existing"];
        
        model.registerSound("existing", "/path/to/sound2.mp3", false, false);
        
        expect(model.sounds["existing"]).toBe(firstAudio);
    });

    /**
     * Test 9: applyVolume updates all sounds
     */
    it("should apply volume to all registered sounds", () => {
        const model = AudioModel.getInstance();
        model.registerSound("test_bgm", "/path/to/bgm.mp3", false);
        model.registerSound("test_sfx", "/path/to/sfx.mp3", false);
        
        model.setVolume(0.9, "bgm");
        model.setVolume(0.3, "sfx");
        
        // Note: This test depends on the key naming convention (includes "bgm")
        // In real implementation, sounds with "bgm" in key get bgmVolume
        expect(model.sounds["test_bgm"].volume).toBe(0.9);
        expect(model.sounds["test_sfx"].volume).toBe(0.3);
    });
});