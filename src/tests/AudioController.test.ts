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
     * Test 2: playMusic with valid key
     */
    it("should play music when valid key is provided", () => {
        const model = (audioController as any).model;
        const sound = model.sounds["home_bgm"];
        const playSpy = vi.spyOn(sound, "play");
        
        audioController.playMusic("home_bgm");
        
        expect(sound.muted).toBe(false);
        expect(sound.currentTime).toBe(0);
        expect(playSpy).toHaveBeenCalled();
    });

    /**
     * Test 3: playMusic with invalid key
     */
    it("should not throw error when invalid key is provided", () => {
        expect(() => {
            audioController.playMusic("invalid_key");
        }).not.toThrow();
    });

    /**
     * Test 4: stopBGM stops looping sounds
     */
    it("should stop all looping sounds", () => {
        const model = (audioController as any).model;
        const sound = model.sounds["home_bgm"]; // home_bgm has loop = true
        const pauseSpy = vi.spyOn(sound, "pause");
        
        audioController.stopBGM();
        
        expect(pauseSpy).toHaveBeenCalled();
        expect(sound.currentTime).toBe(0);
    });

    /**
     * Test 5: changeVolume for BGM
     */
    it("should change BGM volume", () => {
        audioController.changeVolume(0.7, "bgm");
        expect(audioController.getVolume("bgm")).toBe(0.7);
    });

    /**
     * Test 6: changeVolume for SFX
     */
    it("should change SFX volume", () => {
        audioController.changeVolume(0.8, "sfx");
        expect(audioController.getVolume("sfx")).toBe(0.8);
    });

    /**
     * Test 7: getVolume returns correct values
     */
    it("should return correct volume values", () => {
        audioController.changeVolume(0.6, "bgm");
        audioController.changeVolume(0.4, "sfx");
        
        expect(audioController.getVolume("bgm")).toBe(0.6);
        expect(audioController.getVolume("sfx")).toBe(0.4);
    });

    /**
     * Test 8: Volume validation - invalid values
     */
    it("should clamp volume to valid range", () => {
        audioController.changeVolume(-1, "bgm");
        expect(audioController.getVolume("bgm")).toBeGreaterThanOrEqual(0);
        
        audioController.changeVolume(2, "bgm");
        expect(audioController.getVolume("bgm")).toBeLessThanOrEqual(1);
    });
});