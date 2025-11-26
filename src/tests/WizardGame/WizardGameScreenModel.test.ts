/**
 * Unit tests for WizardGameScreenModel using Vitest
 */

import { describe, it, expect } from "vitest";
import { WizardGameScreenModel } from "../../screens/WizardGameScreen/WizardGameScreenModel";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants";

describe("WizardGameScreenModel", () => {
    /**
     * Test 1: Initialization
     */
    it("should initialize with correct width and height", () => {
        const model = new WizardGameScreenModel();
        
        expect(model.width).toBe(STAGE_WIDTH);
        expect(model.height).toBe(STAGE_HEIGHT);
    });

    /**
     * Test 2: Width and height are public properties
     */
    it("should have accessible width and height properties", () => {
        const model = new WizardGameScreenModel();
        
        expect(typeof model.width).toBe("number");
        expect(typeof model.height).toBe("number");
        expect(model.width).toBeGreaterThan(0);
        expect(model.height).toBeGreaterThan(0);
    });
});

