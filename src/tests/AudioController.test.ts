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

        // Mock window events
        globalThis.window = {
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
        } as any;

        // Mock document visibility
        globalThis.document = {
            visibilityState: "visible",
        } as any;
    });

    beforeEach(() => {
        // Reset AudioModel singleton
        (AudioModel as any).instance = null;
        audioController = new AudioController();
        
        // Simulate user interaction
        (audioController as any).hasUserInteracted = true;
    });

    /**
     * Test 1: Initialization
     */
    it("should initialize correctly", () => {
        expect(audioController).toBeDefined();
    });

    /**
     * Test 2: registerSound registers a new sound
     */
    it("should register a new sound", () => {
        audioController.registerSound("test_bgm", "/test/path.mp3");
        const model = (audioController as any).model;
        expect(model.sounds["test_bgm"]).toBeDefined();
    });

    /**
     * Test 3: play with loop for BGM
     */
    it("should play BGM with loop when loop is true", () => {
        audioController.registerSound("test_bgm", "/test/path.mp3");
        const model = (audioController as any).model;
        const sound = model.sounds["test_bgm"];
        const playSpy = vi.spyOn(sound, "play");
        
        audioController.play("test_bgm", true);
        
        expect(sound.loop).toBe(true);
        expect(playSpy).toHaveBeenCalled();
    });

    /**
     * Test 4: play without loop for SFX
     */
    it("should play SFX without loop and reset currentTime", () => {
        audioController.registerSound("test_sfx", "/test/path.mp3");
        const model = (audioController as any).model;
        const sound = model.sounds["test_sfx"];
        sound.currentTime = 10; // Set to non-zero
        const playSpy = vi.spyOn(sound, "play");
        
        audioController.play("test_sfx", false);
        
        expect(sound.loop).toBe(false);
        expect(sound.currentTime).toBe(0);
        expect(playSpy).toHaveBeenCalled();
    });

    /**
     * Test 5: play with invalid key
     */
    it("should not throw error when invalid key is provided", () => {
        expect(() => {
            audioController.play("invalid_key");
        }).not.toThrow();
    });

    /**
     * Test 6: play doesn't play if user hasn't interacted
     */
    it("should not play if user hasn't interacted", () => {
        (audioController as any).hasUserInteracted = false;
        audioController.registerSound("test_bgm", "/test/path.mp3");
        const model = (audioController as any).model;
        const sound = model.sounds["test_bgm"];
        const playSpy = vi.spyOn(sound, "play");
        
        audioController.play("test_bgm", true);
        
        expect(playSpy).not.toHaveBeenCalled();
    });

    /**
     * Test 7: stop stops a specific sound
     */
    it("should stop a specific sound", () => {
        audioController.registerSound("test_bgm", "/test/path.mp3");
        const model = (audioController as any).model;
        const sound = model.sounds["test_bgm"];
        const pauseSpy = vi.spyOn(sound, "pause");
        
        audioController.stop("test_bgm");
        
        expect(pauseSpy).toHaveBeenCalled();
        expect(sound.currentTime).toBe(0);
    });

    /**
     * Test 8: stopAll stops all sounds
     */
    it("should stop all sounds", () => {
        audioController.registerSound("test_bgm", "/test/path.mp3");
        audioController.registerSound("test_sfx", "/test/path2.mp3");
        const model = (audioController as any).model;
        const sound1 = model.sounds["test_bgm"];
        const sound2 = model.sounds["test_sfx"];
        const pauseSpy1 = vi.spyOn(sound1, "pause");
        const pauseSpy2 = vi.spyOn(sound2, "pause");
        
        audioController.stopAll();
        
        expect(pauseSpy1).toHaveBeenCalled();
        expect(pauseSpy2).toHaveBeenCalled();
    });

    /**
     * Test 9: setBgmVolume and get bgmVolume
     */
    it("should set and get BGM volume", () => {
        audioController.setBgmVolume(0.7);
        expect(audioController.bgmVolume).toBe(0.7);
    });

    /**
     * Test 10: setSfxVolume and get sfxVolume
     */
    it("should set and get SFX volume", () => {
        audioController.setSfxVolume(0.8);
        expect(audioController.sfxVolume).toBe(0.8);
    });

    /**
     * Test 11: Volume is applied to registered sounds
     */
    it("should apply volume to registered sounds", () => {
        audioController.setBgmVolume(0.6);
        audioController.registerSound("test_bgm", "/test/path.mp3");
        const model = (audioController as any).model;
        const sound = model.sounds["test_bgm"];
        
        expect(sound.volume).toBe(0.6);
    });
});
