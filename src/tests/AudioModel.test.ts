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
        
        expect(model.bgmVolume).toBe(0.5);
        expect(model.sfxVolume).toBe(0.5);
    });

    /**
     * Test 2: Volume validation - negative values
     */
    it("should validate and clamp negative volume values", () => {
        const model = AudioModel.getInstance();
        model.setBgmVolume(-1);
        
        expect(model.bgmVolume).toBe(0.5); // Default fallback
    });

    /**
     * Test 3: Volume validation - values over 1
     */
    it("should validate and clamp volume values over 1", () => {
        const model = AudioModel.getInstance();
        model.setBgmVolume(2);
        
        expect(model.bgmVolume).toBe(0.5); // Default fallback
    });

    /**
     * Test 4: Volume validation - NaN
     */
    it("should validate and handle NaN values", () => {
        const model = AudioModel.getInstance();
        model.setBgmVolume(NaN);
        
        expect(model.bgmVolume).toBe(0.5); // Default fallback
    });
});