/**
 * Unit tests for EnemyManager using Vitest
 */

import { describe, it, beforeEach, expect, vi } from "vitest";
import { EnemyManager } from "../../screens/WizardGameScreen/entities/enemy/EnemyManager";
import { CollisionManager } from "../../screens/WizardGameScreen/entities/CollisionManager";
import { AudioController } from "../../audios/AudioController";
import Konva from "konva";

/**
 * Mock EnemyFactory
 */
vi.mock("../../screens/WizardGameScreen/entities/enemy/EnemyFactory", () => {
    return {
        EnemyFactory: {
            create: vi.fn().mockReturnValue({
                update: vi.fn(),
                destroy: vi.fn(),
                dead: false,
            }),
        },
    };
});

/**
 * Mock CollisionManager
 */
vi.mock("../../screens/WizardGameScreen/entities/CollisionManager", () => {
    return {
        CollisionManager: vi.fn().mockImplementation(() => ({
            register: vi.fn(),
        })),
    };
});

/**
 * Mock AudioController
 */
vi.mock("../../audios/AudioController", () => {
    return {
        AudioController: vi.fn(),
    };
});

describe("EnemyManager", () => {
    let enemyManager: EnemyManager;
    let mockGroup: Konva.Group;
    let mockCollision: CollisionManager;
    let mockAudio: AudioController;
    let mockCreateFn: ReturnType<typeof vi.fn>;

    beforeEach(async () => {
        vi.clearAllMocks();
        
        // Get the mocked EnemyFactory to access the mock function
        const { EnemyFactory } = await import("../../screens/WizardGameScreen/entities/enemy/EnemyFactory");
        mockCreateFn = EnemyFactory.create as ReturnType<typeof vi.fn>;

        mockGroup = {
            add: vi.fn(),
        } as unknown as Konva.Group;

        mockCollision = {
            register: vi.fn(),
        } as unknown as CollisionManager;

        mockAudio = {} as AudioController;

        enemyManager = new EnemyManager(
            mockGroup,
            mockCollision,
            mockAudio,
            800,
            600
        );
    });

    /**
     * Test 1: Initialization
     */
    it("should initialize with empty enemies array", () => {
        expect(enemyManager).toBeDefined();
    });

    /**
     * Test 2: Spawns enemy after spawn interval
     */
    it("should spawn enemy after spawn interval", () => {
        // Update with time greater than spawn interval (1.2 seconds)
        enemyManager.update(1.5, 400, 300);
        
        expect(mockCreateFn).toHaveBeenCalled();
        expect(mockCollision.register).toHaveBeenCalled();
    });

    /**
     * Test 3: Does not spawn enemy before spawn interval
     */
    it("should not spawn enemy before spawn interval", () => {
        // Update with time less than spawn interval
        enemyManager.update(0.5, 400, 300);
        
        expect(mockCreateFn).not.toHaveBeenCalled();
    });

    /**
     * Test 4: Spawn timer resets after spawning
     */
    it("should reset spawn timer after spawning", () => {
        // First spawn
        enemyManager.update(1.5, 400, 300);
        mockCreateFn.mockClear();
        
        // Should not spawn immediately after
        enemyManager.update(0.5, 400, 300);
        
        expect(mockCreateFn).not.toHaveBeenCalled();
    });

    /**
     * Test 5: Updates all enemies
     */
    it("should update all enemies", () => {
        const mockEnemy = {
            update: vi.fn(),
            dead: false,
        };
        mockCreateFn.mockReturnValue(mockEnemy);
        
        // Spawn an enemy
        enemyManager.update(1.5, 400, 300);
        
        // Update again
        enemyManager.update(0.1, 400, 300);
        
        expect(mockEnemy.update).toHaveBeenCalledWith(0.1, 400, 300);
    });

    /**
     * Test 6: Does not update dead enemies
     */
    it("should not update dead enemies", () => {
        const mockEnemy = {
            update: vi.fn(),
            dead: true,
        };
        mockCreateFn.mockReturnValue(mockEnemy);
        
        // Spawn a dead enemy
        enemyManager.update(1.5, 400, 300);
        
        // Update again
        enemyManager.update(0.1, 400, 300);
        
        expect(mockEnemy.update).not.toHaveBeenCalled();
    });

    /**
     * Test 7: Clear destroys all enemies
     */
    it("should destroy all enemies when cleared", () => {
        const mockEnemy1 = {
            update: vi.fn(),
            destroy: vi.fn(),
            dead: false,
        };
        const mockEnemy2 = {
            update: vi.fn(),
            destroy: vi.fn(),
            dead: false,
        };
        
        mockCreateFn
            .mockReturnValueOnce(mockEnemy1)
            .mockReturnValueOnce(mockEnemy2);
        
        // Spawn two enemies
        enemyManager.update(1.5, 400, 300);
        enemyManager.update(1.5, 400, 300);
        
        enemyManager.clear();
        
        expect(mockEnemy1.destroy).toHaveBeenCalled();
        expect(mockEnemy2.destroy).toHaveBeenCalled();
    });

    /**
     * Test 8: Reset clears and resets timer
     */
    it("should reset enemies and spawn timer", () => {
        const mockEnemy = {
            update: vi.fn(),
            destroy: vi.fn(),
            dead: false,
        };
        mockCreateFn.mockReturnValue(mockEnemy);
        
        // Spawn an enemy
        enemyManager.update(1.5, 400, 300);
        
        enemyManager.reset();
        
        expect(mockEnemy.destroy).toHaveBeenCalled();
        
        // Timer should be reset, so next spawn should take full interval
        mockCreateFn.mockClear();
        enemyManager.update(0.5, 400, 300);
        expect(mockCreateFn).not.toHaveBeenCalled();
    });

    /**
     * Test 9: Spawns enemies at random positions
     */
    it("should spawn enemies at random positions within map bounds", () => {
        enemyManager.update(1.5, 400, 300);
        
        expect(mockCreateFn).toHaveBeenCalled();
        const callArgs = mockCreateFn.mock.calls[0];
        const x = callArgs[0];
        const y = callArgs[1];
        
        // Check that position is within map bounds (0 to mapWidth/Height)
        expect(x).toBeGreaterThanOrEqual(0);
        expect(x).toBeLessThanOrEqual(800);
        expect(y).toBeGreaterThanOrEqual(0);
        expect(y).toBeLessThanOrEqual(600);
    });
});

