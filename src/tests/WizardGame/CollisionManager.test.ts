/**
 * Unit tests for CollisionManager using Vitest
 */

import { describe, it, beforeEach, expect, vi } from "vitest";
import { CollisionManager, Collidable, box } from "../../screens/WizardGameScreen/entities/CollisionManager";
import Konva from "konva";

/**
 * Create mock Collidable objects for testing
 */
function createMockCollidable(
    x: number,
    y: number,
    width: number,
    height: number,
    type: "player" | "enemy",
    dead: boolean = false
): Collidable {
    const mockGroup = {
        add: vi.fn(),
        getLayer: vi.fn(),
    } as unknown as Konva.Group;

    const mockBodyBox: box = { x, y, width, height };
    
    return {
        x,
        y,
        shape: mockGroup,
        bodyBox: mockBodyBox,
        attackBox: null,
        dead,
        type,
        destroy: vi.fn(),
        onCollision: vi.fn(),
        onAttackCollision: vi.fn(),
        moveBy: vi.fn(),
    };
}

describe("CollisionManager", () => {
    let collisionManager: CollisionManager;

    beforeEach(() => {
        collisionManager = new CollisionManager();
    });

    /**
     * Test 1: Initialization
     */
    it("should initialize with empty collidables array", () => {
        expect(collisionManager).toBeDefined();
    });

    /**
     * Test 2: Register a collidable
     */
    it("should register a collidable", () => {
        const collidable = createMockCollidable(0, 0, 10, 10, "player");
        
        collisionManager.register(collidable);
        
        // Verify it's registered by checking if collision detection works
        const collidable2 = createMockCollidable(5, 5, 10, 10, "enemy");
        collisionManager.register(collidable2);
        collisionManager.update();
        
        expect(collidable.onCollision).toHaveBeenCalled();
    });

    /**
     * Test 3: Register same collidable twice doesn't duplicate
     */
    it("should not register the same collidable twice", () => {
        const collidable = createMockCollidable(0, 0, 10, 10, "player");
        
        collisionManager.register(collidable);
        collisionManager.register(collidable);
        
        const collidable2 = createMockCollidable(100, 100, 10, 10, "enemy");
        collisionManager.register(collidable2);
        collisionManager.update();
        
        // Should only be called once (not twice)
        expect(collidable.onCollision).toHaveBeenCalledTimes(0);
    });

    /**
     * Test 4: Unregister a collidable
     */
    it("should unregister a collidable", () => {
        const collidable = createMockCollidable(0, 0, 10, 10, "player");
        
        collisionManager.register(collidable);
        collisionManager.unregister(collidable);
        
        const collidable2 = createMockCollidable(5, 5, 10, 10, "enemy");
        collisionManager.register(collidable2);
        collisionManager.update();
        
        // Should not be called since unregistered
        expect(collidable.onCollision).not.toHaveBeenCalled();
    });

    /**
     * Test 5: UnregisterAll clears all collidables
     */
    it("should unregister all collidables", () => {
        const collidable1 = createMockCollidable(0, 0, 10, 10, "player");
        const collidable2 = createMockCollidable(5, 5, 10, 10, "enemy");
        
        collisionManager.register(collidable1);
        collisionManager.register(collidable2);
        collisionManager.unregisterAll();
        
        const collidable3 = createMockCollidable(10, 10, 10, 10, "enemy");
        collisionManager.register(collidable3);
        collisionManager.update();
        
        // Should not be called since all were unregistered
        expect(collidable1.onCollision).not.toHaveBeenCalled();
        expect(collidable2.onCollision).not.toHaveBeenCalled();
    });

    /**
     * Test 6: Collision detection between player and enemy
     */
    it("should detect collision between player and enemy", () => {
        const player = createMockCollidable(0, 0, 10, 10, "player");
        const enemy = createMockCollidable(5, 5, 10, 10, "enemy");
        
        collisionManager.register(player);
        collisionManager.register(enemy);
        collisionManager.update();
        
        expect(player.onCollision).toHaveBeenCalledWith(enemy);
        expect(enemy.onCollision).toHaveBeenCalledWith(player);
    });

    /**
     * Test 7: No collision when objects are far apart
     */
    it("should not detect collision when objects are far apart", () => {
        const player = createMockCollidable(0, 0, 10, 10, "player");
        const enemy = createMockCollidable(100, 100, 10, 10, "enemy");
        
        collisionManager.register(player);
        collisionManager.register(enemy);
        collisionManager.update();
        
        expect(player.onCollision).not.toHaveBeenCalled();
        expect(enemy.onCollision).not.toHaveBeenCalled();
    });

    /**
     * Test 8: Dead entities are destroyed and removed
     */
    it("should destroy and remove dead entities", () => {
        const deadEntity = createMockCollidable(0, 0, 10, 10, "player", true);
        
        collisionManager.register(deadEntity);
        collisionManager.update();
        
        expect(deadEntity.destroy).toHaveBeenCalled();
        
        // Verify it's removed by checking it doesn't collide with new entity
        const enemy = createMockCollidable(5, 5, 10, 10, "enemy");
        collisionManager.register(enemy);
        collisionManager.update();
        
        expect(deadEntity.onCollision).not.toHaveBeenCalled();
    });

    /**
     * Test 9: Attack collision detection
     */
    it("should detect attack collision", () => {
        const player = createMockCollidable(0, 0, 10, 10, "player");
        const enemy = createMockCollidable(5, 5, 10, 10, "enemy");
        
        // Set attack box for player
        player.attackBox = { x: 0, y: 0, width: 15, height: 15 };
        
        collisionManager.register(player);
        collisionManager.register(enemy);
        collisionManager.update();
        
        expect(enemy.onAttackCollision).toHaveBeenCalledWith(player);
    });

    /**
     * Test 10: No collision between same type (player-player or enemy-enemy)
     */
    it("should not detect collision between same type entities", () => {
        const player1 = createMockCollidable(0, 0, 10, 10, "player");
        const player2 = createMockCollidable(5, 5, 10, 10, "player");
        
        collisionManager.register(player1);
        collisionManager.register(player2);
        collisionManager.update();
        
        expect(player1.onCollision).not.toHaveBeenCalled();
        expect(player2.onCollision).not.toHaveBeenCalled();
    });

    /**
     * Test 11: Overlap resolution moves entities
     */
    it("should resolve overlap by moving entities", () => {
        const player = createMockCollidable(0, 0, 10, 10, "player");
        const enemy = createMockCollidable(5, 5, 10, 10, "enemy");
        
        collisionManager.register(player);
        collisionManager.register(enemy);
        collisionManager.update();
        
        expect(player.moveBy).toHaveBeenCalled();
        expect(enemy.moveBy).toHaveBeenCalled();
    });
});

