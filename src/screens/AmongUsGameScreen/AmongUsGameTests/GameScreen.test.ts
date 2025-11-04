import { describe, it, expect } from "vitest";

import { STAGE_WIDTH, STAGE_HEIGHT, GAME_DURATION } from "../../../constants.ts";

describe("constants", () => {
  it("exports positive numeric stage dimensions", () => {
    expect(typeof STAGE_WIDTH).toBe("number");
    expect(typeof STAGE_HEIGHT).toBe("number");
    expect(STAGE_WIDTH).toBeGreaterThan(0);
    expect(STAGE_HEIGHT).toBeGreaterThan(0);
  });

  it("exports reasonable game duration", () => {
    expect(typeof GAME_DURATION).toBe("number");
    expect(GAME_DURATION).toBeGreaterThanOrEqual(1);
  });
});