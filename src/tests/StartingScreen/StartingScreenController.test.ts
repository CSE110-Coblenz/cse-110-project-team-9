/**
 * Unit tests for StartingScreenController using Vitest
 */

import { describe, it, beforeEach, expect, vi, beforeAll } from "vitest";
import { StartingScreenController } from "../../screens/StartingScreen/StartingScreenController";
import type { ScreenSwitcher } from "../../types";

/**
 * Create mock's instance
 */
let viewInstance: any;

/**
 * Mock the StartingScreenView class
 */
vi.mock("../../screens/StartingScreen/StartingScreenView", () => {
    return {
        StartingScreenView: class {
            constructor() {
                viewInstance = this;
            }

            /**
             * vi.fn() : Create mock functions for the methods used in StartingScreen
             * getGroup: vi.fn() : Mock the group getter for click event listener
             */
            getGroup = vi.fn().mockReturnValue({ 
                on: vi.fn(),
                off: vi.fn() 
            });
        },
    };
});


/**
 * Unit tests for StartingScreenController
 */
describe("StartingScreenController", () => {
    let mockScreenSwitcher: ScreenSwitcher;
    let controller: StartingScreenController;

    /**
     * beforeAll: Setup before the tests run
     */
    beforeAll(() => {
        globalThis.document.createElement = vi.fn((tag) => {
            if (tag === "video") {
                return {
                    style: {},
                    src: "",
                    load: vi.fn(),
                    play: vi.fn().mockResolvedValue(undefined),
                    addEventListener: vi.fn(),
                    muted: false,
                };
            }
            return { style: {} };
        }) as unknown as typeof document.createElement;
    });

    /**
     * beforeEach: Setup before each test case (Not to share state between tests)
     */
    beforeEach(() => {
        mockScreenSwitcher = {
            switchToScreen: vi.fn(),
            layerOnScreen: vi.fn(),
            lastScreen: { type: "starting" },
        };

        controller = new StartingScreenController(mockScreenSwitcher);
    });

    /**
     * Test 1: Initialization
     */
    it("should initialize correctly", () => {
        expect(controller).toBeDefined();
        expect(viewInstance.getGroup).toHaveBeenCalled();
    });

    /**
     * Test 2: Click event listener setup
     */
    it("should set up click event listener on group", () => {
        expect(viewInstance.getGroup().on).toHaveBeenCalledWith("click", expect.any(Function));
    });

    /**
     * Test 3: Click anywhere to go to HomeScreen
     */
    it("should switch to home screen when clicked", () => {
        const callback = viewInstance.getGroup().on.mock.calls[0][1];
        callback();

        expect(mockScreenSwitcher.switchToScreen).toHaveBeenCalledWith({ type: "home" });
    });

    /**
     * Test 4: getView method
     */
    it("should return the view instance", () => {
        const view = controller.getView();
        expect(view).toBe(viewInstance);
    });
});
