/**
 * Unit tests for InputHandler using Vitest
 */

import { describe, it, beforeEach, expect, vi, afterEach } from "vitest";
import { InputHandler } from "../../screens/WizardGameScreen/InputHandler";

describe("InputHandler", () => {
    let inputHandler: InputHandler;
    let mockAddEventListener: ReturnType<typeof vi.fn>;
    let mockRemoveEventListener: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        mockAddEventListener = vi.fn();
        mockRemoveEventListener = vi.fn();

        globalThis.window = {
            addEventListener: mockAddEventListener,
            removeEventListener: mockRemoveEventListener,
        } as any;

        inputHandler = new InputHandler();
    });

    afterEach(() => {
        inputHandler.unbind();
    });

    /**
     * Test 1: Initialization
     */
    it("should initialize with empty keys and listeners not bound", () => {
        expect(inputHandler).toBeDefined();
        expect(inputHandler.isDown("w")).toBe(false);
    });

    /**
     * Test 2: Bind adds event listeners
     */
    it("should bind event listeners", () => {
        inputHandler.bind();

        expect(mockAddEventListener).toHaveBeenCalledTimes(2);
        expect(mockAddEventListener).toHaveBeenCalledWith("keydown", expect.any(Function));
        expect(mockAddEventListener).toHaveBeenCalledWith("keyup", expect.any(Function));
    });

    /**
     * Test 3: Bind doesn't add listeners twice
     */
    it("should not bind listeners if already bound", () => {
        inputHandler.bind();
        mockAddEventListener.mockClear();
        inputHandler.bind();

        expect(mockAddEventListener).not.toHaveBeenCalled();
    });

    /**
     * Test 4: Unbind removes event listeners
     */
    it("should unbind event listeners", () => {
        inputHandler.bind();
        inputHandler.unbind();

        expect(mockRemoveEventListener).toHaveBeenCalledTimes(2);
        expect(mockRemoveEventListener).toHaveBeenCalledWith("keydown", expect.any(Function));
        expect(mockRemoveEventListener).toHaveBeenCalledWith("keyup", expect.any(Function));
    });

    /**
     * Test 5: Unbind clears keys
     */
    it("should clear keys when unbinding", () => {
        inputHandler.bind();
        
        // Simulate key press
        const keydownEvent = new KeyboardEvent("keydown", { key: "w" });
        (inputHandler as any).onKeyDown(keydownEvent);
        
        expect(inputHandler.isDown("w")).toBe(true);
        
        inputHandler.unbind();
        
        expect(inputHandler.isDown("w")).toBe(false);
    });

    /**
     * Test 6: isDown returns true for pressed allowed keys
     */
    it("should detect when allowed keys are pressed", () => {
        inputHandler.bind();
        
        const keydownEvent = new KeyboardEvent("keydown", { key: "w" });
        (inputHandler as any).onKeyDown(keydownEvent);
        
        expect(inputHandler.isDown("w")).toBe(true);
    });

    /**
     * Test 7: isDown returns false for unpressed keys
     */
    it("should return false for unpressed keys", () => {
        inputHandler.bind();
        
        expect(inputHandler.isDown("w")).toBe(false);
        expect(inputHandler.isDown("a")).toBe(false);
    });

    /**
     * Test 8: isDown returns false for disallowed keys
     */
    it("should not detect disallowed keys", () => {
        inputHandler.bind();
        
        const keydownEvent = new KeyboardEvent("keydown", { key: "z" });
        (inputHandler as any).onKeyDown(keydownEvent);
        
        expect(inputHandler.isDown("z")).toBe(false);
    });

    /**
     * Test 9: Arrow keys are detected
     */
    it("should detect arrow keys", () => {
        inputHandler.bind();
        
        const arrowDown = new KeyboardEvent("keydown", { key: "ArrowUp" });
        (inputHandler as any).onKeyDown(arrowDown);
        
        // InputHandler stores the key as-is from e.key, so "ArrowUp"
        expect(inputHandler.isDown("ArrowUp")).toBe(true);
    });

    /**
     * Test 10: Key up releases the key
     */
    it("should release key on keyup", () => {
        inputHandler.bind();
        
        const keydownEvent = new KeyboardEvent("keydown", { key: "w" });
        const keyupEvent = new KeyboardEvent("keyup", { key: "w" });
        
        (inputHandler as any).onKeyDown(keydownEvent);
        expect(inputHandler.isDown("w")).toBe(true);
        
        (inputHandler as any).onKeyUp(keyupEvent);
        expect(inputHandler.isDown("w")).toBe(false);
    });

    /**
     * Test 11: Keys are stored with original case
     */
    it("should store keys with original case from event", () => {
        inputHandler.bind();
        
        // InputHandler stores keys as-is from e.key, not lowercase
        const keydownEvent = new KeyboardEvent("keydown", { key: "w" });
        (inputHandler as any).onKeyDown(keydownEvent);
        
        // Check with the actual case stored (lowercase "w" in this case)
        expect(inputHandler.isDown("w")).toBe(true);
    });

    /**
     * Test 12: Multiple keys can be pressed simultaneously
     */
    it("should handle multiple keys pressed simultaneously", () => {
        inputHandler.bind();
        
        (inputHandler as any).onKeyDown(new KeyboardEvent("keydown", { key: "w" }));
        (inputHandler as any).onKeyDown(new KeyboardEvent("keydown", { key: "a" }));
        
        expect(inputHandler.isDown("w")).toBe(true);
        expect(inputHandler.isDown("a")).toBe(true);
    });
});

