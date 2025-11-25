/**
 * Unit tests for PlayerModel using Vitest
 */

import { describe, it, beforeEach, expect } from "vitest";
import { PlayerModel } from "../../screens/WizardGameScreen/entities/player/PlayerModel.js";
import { 
    PLAYER_START_X, 
    PLAYER_START_Y, 
    DEFAULT_HEALTH, 
    DEFAULT_STAMINA, 
    PLAYER_SPEED,
    SPRITE_WIDTH 
} from "../../screens/WizardGameScreen/config.js";

describe("PlayerModel", () => {
    let model: PlayerModel;
    const mockAudio = { walk_SFX: "/test/path.mp3" };
    const mockBodyBoxes = {
        idle: [{ x: 10, y: 10, width: 80, height: 80 }],
        walk: [{ x: 10, y: 10, width: 80, height: 80 }],
    };
    const mockAttackBoxes = {
        attackslash: [{ x: 20, y: 20, width: 60, height: 60 }],
    };

    beforeEach(() => {
        model = new PlayerModel(
            100,
            200,
            PLAYER_SPEED,
            mockAudio,
            mockBodyBoxes,
            mockAttackBoxes
        );
    });

    /**
     * Test 1: Initialization
     */
    it("should initialize with correct values", () => {
        expect(model.x).toBe(100);
        expect(model.y).toBe(200);
        expect(model.speed).toBe(PLAYER_SPEED);
        expect(model.health).toBe(DEFAULT_HEALTH);
        expect(model.stamina).toBe(DEFAULT_STAMINA);
        expect(model.bodyCurrentAnimation).toBe("idle");
        expect(model.attackCurrentAnimation).toBeNull();
        expect(model.direction).toBe("right");
    });

    /**
     * Test 2: Damage reduces health
     */
    it("should reduce health when damaged", () => {
        model.damage(10);
        
        expect(model.health).toBe(DEFAULT_HEALTH - 10);
    });

    /**
     * Test 3: Health cannot go below 0
     */
    it("should not allow health to go below 0", () => {
        model.damage(DEFAULT_HEALTH + 100);
        
        expect(model.health).toBe(0);
    });

    /**
     * Test 4: Dead when health is 0
     */
    it("should be dead when health is 0", () => {
        model.damage(DEFAULT_HEALTH);
        
        expect(model.dead).toBe(true);
    });

    /**
     * Test 5: Not dead when health is above 0
     */
    it("should not be dead when health is above 0", () => {
        model.damage(10);
        
        expect(model.dead).toBe(false);
    });

    /**
     * Test 6: Stamina drain reduces stamina
     */
    it("should reduce stamina when drained", () => {
        model.staminaDrain(10);
        
        expect(model.stamina).toBe(DEFAULT_STAMINA - 10);
    });

    /**
     * Test 7: Stamina cannot go below 0
     */
    it("should not allow stamina to go below 0", () => {
        model.staminaDrain(DEFAULT_STAMINA + 100);
        
        expect(model.stamina).toBe(0);
    });

    /**
     * Test 8: Reset restores initial values
     */
    it("should reset to initial values", () => {
        model.x = 500;
        model.y = 600;
        model.damage(50);
        model.staminaDrain(30);
        model.bodyCurrentAnimation = "walk";
        model.attackCurrentAnimation = "attackslash";
        model.direction = "left";
        
        model.reset();
        
        expect(model.x).toBe(PLAYER_START_X);
        expect(model.y).toBe(PLAYER_START_Y);
        expect(model.speed).toBe(PLAYER_SPEED);
        expect(model.health).toBe(DEFAULT_HEALTH);
        expect(model.stamina).toBe(DEFAULT_STAMINA);
        expect(model.bodyCurrentAnimation).toBe("idle");
        expect(model.attackCurrentAnimation).toBeNull();
        expect(model.direction).toBe("right");
    });

    /**
     * Test 9: Body box calculation for right direction
     */
    it("should calculate body box correctly for right direction", () => {
        model.x = 100;
        model.y = 200;
        model.direction = "right";
        const scale = 4;
        
        const box = model.bodyBox(0, scale);
        
        expect(box.x).toBe(100 + 10 * scale);
        expect(box.y).toBe(200 + 10 * scale);
        expect(box.width).toBe(80 * scale);
        expect(box.height).toBe(80 * scale);
    });

    /**
     * Test 10: Body box calculation for left direction
     */
    it("should calculate body box correctly for left direction", () => {
        model.x = 100;
        model.y = 200;
        model.direction = "left";
        const scale = 4;
        
        const box = model.bodyBox(0, scale);
        
        const expectedX = 100 + SPRITE_WIDTH * scale - 80 * scale - 10 * scale;
        expect(box.x).toBe(expectedX);
        expect(box.y).toBe(200 + 10 * scale);
        expect(box.width).toBe(80 * scale);
        expect(box.height).toBe(80 * scale);
    });

    /**
     * Test 11: Attack box returns empty when no attack animation
     */
    it("should return empty box when no attack animation", () => {
        model.attackCurrentAnimation = null;
        
        const box = model.attackBox(0, 4);
        
        expect(box).toEqual({ x: 0, y: 0, width: 0, height: 0 });
    });

    /**
     * Test 12: Attack box calculation when attack animation is set
     */
    it("should calculate attack box when attack animation is set", () => {
        model.x = 100;
        model.y = 200;
        model.attackCurrentAnimation = "attackslash";
        model.direction = "right";
        const scale = 4;
        
        const box = model.attackBox(0, scale);
        
        expect(box.x).toBe(100 + 20 * scale);
        expect(box.y).toBe(200 + 20 * scale);
        expect(box.width).toBe(60 * scale);
        expect(box.height).toBe(60 * scale);
    });

    /**
     * Test 13: Setters work correctly
     */
    it("should update values through setters", () => {
        model.x = 300;
        model.y = 400;
        model.direction = "left";
        model.bodyCurrentAnimation = "walk";
        model.attackCurrentAnimation = "attackslash";
        
        expect(model.x).toBe(300);
        expect(model.y).toBe(400);
        expect(model.direction).toBe("left");
        expect(model.bodyCurrentAnimation).toBe("walk");
        expect(model.attackCurrentAnimation).toBe("attackslash");
    });

    /**
     * Test 14: Audio getter returns audio map
     */
    it("should return audio map", () => {
        expect(model.audio).toEqual(mockAudio);
    });
});

