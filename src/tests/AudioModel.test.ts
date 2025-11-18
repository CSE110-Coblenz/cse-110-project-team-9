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
     * Test 2: Initial volume values
     */
    it("should initialize with default volumes", () => {
        const model = AudioModel.getInstance();
        
        expect(model.bgmVolume).toBe(0.5);
        expect(model.sfxVolume).toBe(0.5);
    });

    /**
     * Test 3: setBgmVolume and get bgmVolume
     */
    it("should set and get BGM volume", () => {
        const model = AudioModel.getInstance();
        model.setBgmVolume(0.7);
        
        expect(model.bgmVolume).toBe(0.7);
    });

    /**
     * Test 4: setSfxVolume and get sfxVolume
     */
    it("should set and get SFX volume", () => {
        const model = AudioModel.getInstance();
        model.setSfxVolume(0.8);
        
        expect(model.sfxVolume).toBe(0.8);
    });

    /**
     * Test 5: applyVolume updates all sounds
     */
    it("should apply volume to all registered sounds", () => {
        const model = AudioModel.getInstance();
        
        // Register sounds through the sounds object directly for testing
        model.sounds["test_bgm"] = new Audio();
        model.sounds["test_sfx"] = new Audio();
        
        model.setBgmVolume(0.9);
        model.setSfxVolume(0.3);
        
        // Note: This test depends on the key naming convention (includes "bgm")
        // In real implementation, sounds with "bgm" in key get bgmVolume
        expect(model.sounds["test_bgm"].volume).toBe(0.9);
        expect(model.sounds["test_sfx"].volume).toBe(0.3);
    });

    /**
     * Test 6: sounds object is initialized as empty
     */
    it("should initialize with empty sounds object", () => {
        const model = AudioModel.getInstance();
        
        expect(model.sounds).toBeDefined();
        expect(Object.keys(model.sounds).length).toBe(0);
    });
});
