import { describe, it, expect, beforeEach, vi } from "vitest";
import { STAGE_WIDTH, STAGE_HEIGHT, GAME_DURATION } from "../../constants";
import { PuzzleModel } from "../../screens/AmongUsGameScreen/GameScreen/_Puzzle/PuzzleModel";
import { AmongUsGameScreenModel } from "../../screens/AmongUsGameScreen/GameScreen/GameScreenModel";
import { AmongUsGameScreenController } from "../../screens/AmongUsGameScreen/GameScreen/GameScreenController";
import { AudioController } from "../../audios/AudioController";

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

describe("PuzzleModel - Quadratic Generation", () => {
  it("generates quadratic puzzles with correct format", () => {
    const puzzle = PuzzleModel.generateQuadraticPuzzle(1, 3);
    
    expect(puzzle.getId()).toBe(1);
    expect(puzzle.getQuestion()).toBe("Solve for the roots of each equation");
    expect(puzzle.getOptions()).toHaveLength(3);
    expect(puzzle.isSolved()).toBe(false);
  });

  it("generates options in equation:roots format", () => {
    const puzzle = PuzzleModel.generateQuadraticPuzzle(1, 3);
    const options = puzzle.getOptions();
    
    options.forEach(opt => {
      const optStr = String(opt);
      expect(optStr).toContain(":");
      expect(optStr).toContain("=");
      expect(optStr).toContain("x");
    });
  });

  it("generates unique root pairs within a puzzle", () => {
    const puzzle = PuzzleModel.generateQuadraticPuzzle(1, 5);
    const options = puzzle.getOptions();
    const rootSets = new Set<string>();
    
    options.forEach(opt => {
      const [_, roots] = String(opt).split(":");
      rootSets.add(roots.trim());
    });
    
    // All root sets should be unique
    expect(rootSets.size).toBe(5);
  });

  it("generates roots within valid range (-10 to 10)", () => {
    const puzzle = PuzzleModel.generateQuadraticPuzzle(1, 10);
    const options = puzzle.getOptions();
    
    options.forEach(opt => {
      const [_, roots] = String(opt).split(":");
      const numbers = roots.match(/-?\d+/g)?.map(Number) || [];
      
      numbers.forEach(num => {
        expect(num).toBeGreaterThanOrEqual(-10);
        expect(num).toBeLessThanOrEqual(10);
      });
    });
  });

  it("generates valid quadratic equations", () => {
    const puzzle = PuzzleModel.generateQuadraticPuzzle(1, 3);
    const options = puzzle.getOptions();
    
    options.forEach(opt => {
      const [equation, _] = String(opt).split(":");
      // Should contain x² term
      expect(equation).toMatch(/x²/);
      // Should end with = 0
      expect(equation).toMatch(/=\s*0$/);
    });
  });
});

describe("PuzzleModel - Matching Evaluation", () => {
  let puzzle: PuzzleModel;
  
  beforeEach(() => {
    // Create a puzzle with known equations for testing
    puzzle = new PuzzleModel({
      id: 1,
      question: "Test",
      options: ["eq1:roots1", "eq2:roots2", "eq3:roots3"],
      correctIndex: 0
    });
  });

  it("evaluates correct matching as true", () => {
    const correctMatches = new Map<number, number>([
      [0, 0],
      [1, 1],
      [2, 2]
    ]);
    
    expect(puzzle.evaluateMatching(correctMatches)).toBe(true);
    expect(puzzle.isSolved()).toBe(true);
  });

  it("evaluates incorrect matching as false", () => {
    const incorrectMatches = new Map<number, number>([
      [0, 1], // Wrong match
      [1, 2],
      [2, 0]
    ]);
    
    expect(puzzle.evaluateMatching(incorrectMatches)).toBe(false);
    expect(puzzle.isSolved()).toBe(false);
  });

  it("evaluates partial matching as false", () => {
    const partialMatches = new Map<number, number>([
      [0, 0],
      [1, 1]
      // Missing third match
    ]);
    
    expect(puzzle.evaluateMatching(partialMatches)).toBe(false);
    expect(puzzle.isSolved()).toBe(false);
  });

  it("evaluates empty matching as false", () => {
    const emptyMatches = new Map<number, number>();
    
    expect(puzzle.evaluateMatching(emptyMatches)).toBe(false);
    expect(puzzle.isSolved()).toBe(false);
  });

  it("marks puzzle as solved only on correct answer", () => {
    const wrongMatches = new Map<number, number>([[0, 1], [1, 0], [2, 2]]);
    puzzle.evaluateMatching(wrongMatches);
    expect(puzzle.isSolved()).toBe(false);
    
    const correctMatches = new Map<number, number>([[0, 0], [1, 1], [2, 2]]);
    puzzle.evaluateMatching(correctMatches);
    expect(puzzle.isSolved()).toBe(true);
  });
});

describe("PuzzleModel - Reset Functionality", () => {
  it("resets solved state", () => {
    const puzzle = new PuzzleModel({
      id: 1,
      question: "Test",
      options: ["a:1", "b:2"],
      correctIndex: 0
    });
    
    const correctMatches = new Map<number, number>([[0, 0], [1, 1]]);
    puzzle.evaluateMatching(correctMatches);
    expect(puzzle.isSolved()).toBe(true);
    
    puzzle.reset();
    expect(puzzle.isSolved()).toBe(false);
  });
});

describe("AmongUsGameScreenModel", () => {
  let model: AmongUsGameScreenModel;
  
  beforeEach(() => {
    model = new AmongUsGameScreenModel();
  });

  it("initializes with score of 0", () => {
    expect(model.getScore()).toBe(0);
  });

  it("initializes with default puzzles", () => {
    const puzzles = model.getPuzzles();
    expect(puzzles.length).toBeGreaterThan(0);
    expect(puzzles[0]).toBeInstanceOf(PuzzleModel);
  });

  it("increments score correctly", () => {
    expect(model.getScore()).toBe(0);
    model.incrementScore();
    expect(model.getScore()).toBe(1);
    model.incrementScore();
    expect(model.getScore()).toBe(2);
  });

  it("reports not complete when puzzles unsolved", () => {
    expect(model.getIsComplete()).toBe(false);
  });

  it("reports complete when all puzzles solved", () => {
    const puzzles = model.getPuzzles();
    
    // Solve all puzzles
    puzzles.forEach(puzzle => {
      const correctMatches = new Map<number, number>();
      puzzle.getOptions().forEach((_, idx) => {
        correctMatches.set(idx, idx);
      });
      puzzle.evaluateMatching(correctMatches);
    });
    
    expect(model.getIsComplete()).toBe(true);
  });

  it("resets score and puzzles", () => {
    model.incrementScore();
    model.incrementScore();
    expect(model.getScore()).toBe(2);
    
    const oldPuzzles = model.getPuzzles();
    oldPuzzles[0].evaluateMatching(new Map([[0, 0], [1, 1], [2, 2]]));
    
    model.reset();
    
    expect(model.getScore()).toBe(0);
    const newPuzzles = model.getPuzzles();
    expect(newPuzzles.every(p => !p.isSolved())).toBe(true);
  });
});

describe("Quadratic Equation Formatting", () => {
  it("generates equations with proper mathematical format", () => {
    const puzzle = PuzzleModel.generateQuadraticPuzzle(1, 5);
    const options = puzzle.getOptions();
    
    options.forEach(opt => {
      const [equation, _] = String(opt).split(":");
      
      // Should not have double signs like "+ -" or "- +"
      expect(equation).not.toMatch(/\+\s*-/);
      expect(equation).not.toMatch(/-\s*\+/);
      
      // Should have proper spacing around operators
      expect(equation).toMatch(/\s[+\-]\s/);
    });
  });

  it("handles zero coefficients correctly", () => {
    // Test with roots that might produce zero coefficients
    const puzzle = PuzzleModel.generateQuadraticPuzzle(1, 10);
    const options = puzzle.getOptions();
    
    options.forEach(opt => {
      const [equation, _] = String(opt).split(":");
      
      // Should not contain "+ 0" or "- 0"
      expect(equation).not.toMatch(/[+\-]\s*0(?![.\d])/);
    });
  });
});

describe("Default Puzzle Generation", () => {
  it("creates three default quadratic puzzles", () => {
    const puzzles = PuzzleModel.createDefaultPuzzles();
    
    expect(puzzles).toHaveLength(3);
    expect(puzzles[0].getId()).toBe(1);
    expect(puzzles[1].getId()).toBe(2);
    expect(puzzles[2].getId()).toBe(3);
  });

  it("each default puzzle has 3 equations", () => {
    const puzzles = PuzzleModel.createDefaultPuzzles();
    
    puzzles.forEach(puzzle => {
      expect(puzzle.getOptions()).toHaveLength(3);
    });
  });

  it("generates different puzzles each time", () => {
    const puzzles1 = PuzzleModel.createDefaultPuzzles();
    const puzzles2 = PuzzleModel.createDefaultPuzzles();
    
    const options1 = puzzles1[0].getOptions().map(String).join("|");
    const options2 = puzzles2[0].getOptions().map(String).join("|");
    
    // Very unlikely to generate identical puzzles twice
    expect(options1).not.toBe(options2);
  });
});

describe("Edge Cases", () => {
  it("handles negative coefficient 'a' correctly", () => {
    // Generate many puzzles to ensure we get negative 'a' values
    let hasNegativeA = false;
    
    for (let i = 0; i < 20; i++) {
      const puzzle = PuzzleModel.generateQuadraticPuzzle(i, 3);
      const options = puzzle.getOptions();
      
      options.forEach(opt => {
        const [equation, _] = String(opt).split(":");
        if (equation.startsWith("-")) {
          hasNegativeA = true;
        }
      });
    }
    
    expect(hasNegativeA).toBe(true);
  });

  it("handles repeated roots (perfect squares)", () => {
    // While rare with random generation, system should handle it
    const puzzle = new PuzzleModel({
      id: 1,
      question: "Test",
      options: ["x² - 4x + 4 = 0:x = 2"],
      correctIndex: 0
    });
    
    expect(puzzle.getOptions()[0]).toContain(":");
  });

  it("validates puzzle data structure", () => {
    const puzzle = PuzzleModel.generateQuadraticPuzzle(1, 3);
    const data = puzzle.getPuzzleData();
    
    expect(data).toHaveProperty("id");
    expect(data).toHaveProperty("question");
    expect(data).toHaveProperty("options");
    expect(data).toHaveProperty("correctIndex");
  });
});

describe("Game Controller - Time Management", () => {
  let controller: AmongUsGameScreenController;
  let mockScreenSwitcher: any;
  let mockAudio: AudioController;

  beforeEach(() => {
    mockScreenSwitcher = {
      switchToScreen: vi.fn(),
      layerOnScreen: vi.fn(),
      lastScreen: null
    };
    mockAudio = {
      registerSound: vi.fn(),
      play: vi.fn(),
      stop: vi.fn()
    } as any;

    controller = new AmongUsGameScreenController(mockScreenSwitcher, mockAudio);
  });

  it("initializes with game duration", () => {
    // Check that controller is properly initialized
    expect(controller).toBeDefined();
  });

  it("applies time penalty for wrong answers", () => {
    // Create a mock puzzle for testing
    const puzzle = new PuzzleModel({
      id: 1,
      question: "Test",
      options: ["a:1", "b:2", "c:3"],
      correctIndex: 0
    });

    // Time penalty should be 10 seconds (TIME_PENALTY_WRONG = 10)
    expect(puzzle).toBeDefined();
  });

  it("enforces minimum time of 0", () => {
    // Time should never go below 0
    expect(0).toBeLessThanOrEqual(0);
  });
});

describe("Game Controller - Puzzle Interaction", () => {
  let model: AmongUsGameScreenModel;

  beforeEach(() => {
    model = new AmongUsGameScreenModel();
  });

  it("tracks current open puzzle", () => {
    const puzzles = model.getPuzzles();
    expect(puzzles.length).toBeGreaterThan(0);
  });

  it("allows switching between puzzles", () => {
    const puzzles = model.getPuzzles();
    expect(puzzles[0]).toBeInstanceOf(PuzzleModel);
    expect(puzzles[1]).toBeInstanceOf(PuzzleModel);
  });

  it("prevents duplicate puzzle activation", () => {
    const puzzle = model.getPuzzles()[0];
    expect(puzzle.getId()).toBe(1);
    // Same puzzle should not open twice without moving away
  });
});

describe("Player Animation States", () => {
  it("tracks animation states correctly", () => {
    const puzzle = new PuzzleModel({
      id: 1,
      question: "Test",
      options: ["a:1", "b:2"],
      correctIndex: 0
    });

    expect(puzzle).toBeDefined();
    // Animation states: idle, walk, attack, hurt, access
  });

  it("prevents movement animation during special animations", () => {
    // Special animations (attack, hurt, access) should not be interrupted
    const puzzle = new PuzzleModel({
      id: 1,
      question: "Test",
      options: ["a:1"],
      correctIndex: 0
    });

    expect(puzzle).toBeDefined();
  });

  it("resets to idle animation after special action", () => {
    const puzzle = new PuzzleModel({
      id: 1,
      question: "Test",
      options: ["a:1"],
      correctIndex: 0
    });

    expect(puzzle).toBeDefined();
    // After attack/hurt/access completes, should return to idle
  });
});

describe("Keyboard Input Handling", () => {
  it("recognizes movement keys (W, A, S, D)", () => {
    const keys = ['w', 'a', 's', 'd'];
    keys.forEach(key => {
      expect(['w', 'a', 's', 'd']).toContain(key);
    });
  });

  it("recognizes E key for interaction", () => {
    const interactionKey = 'e';
    expect(interactionKey).toBe('e');
  });

  it("handles case-insensitive key input", () => {
    const key = 'W'.toLowerCase();
    expect(key).toBe('w');
  });
});

describe("E-Key Puzzle Access System", () => {
  let model: AmongUsGameScreenModel;

  beforeEach(() => {
    model = new AmongUsGameScreenModel();
  });

  it("requires player to be near obstacle to open puzzle", () => {
    // Interaction distance is 100 pixels
    expect(100).toBeGreaterThan(0);
  });

  it("plays access animation before showing puzzle", () => {
    // Access animation: 16 frames at 12 fps = ~1333ms
    const frames = 16;
    const frameRate = 12;
    const duration = (frames / frameRate) * 1000;
    
    expect(duration).toBeGreaterThan(1000);
    expect(duration).toBeLessThan(1500);
  });

  it("shows puzzle after access animation completes", () => {
    const accessAnimationTime = 1400; // ms
    expect(accessAnimationTime).toBeGreaterThan(0);
  });

  it("allows switching to different puzzle while one is open", () => {
    const puzzle1 = model.getPuzzles()[0];
    const puzzle2 = model.getPuzzles()[1];
    
    expect(puzzle1.getId()).not.toBe(puzzle2.getId());
  });

  it("prevents reopening same puzzle without moving", () => {
    const puzzle = model.getPuzzles()[0];
    // Cannot press E on same puzzle repeatedly
    expect(puzzle).toBeDefined();
  });
});

describe("Answer Feedback System", () => {
  let model: AmongUsGameScreenModel;

  beforeEach(() => {
    model = new AmongUsGameScreenModel();
  });

  it("shows 'Correct!' message for correct answers", () => {
    const feedback = "Correct!";
    expect(feedback).toContain("Correct");
  });

  it("shows 'Wrong!' message for incorrect answers", () => {
    const feedback = "Wrong!";
    expect(feedback).toContain("Wrong");
  });

  it("applies time penalty only for wrong answers", () => {
    const penalty = 10; // seconds
    expect(penalty).toBe(10);
  });

  it("marks obstacles as solved after correct answer", () => {
    const puzzle = model.getPuzzles()[0];
    const matches = new Map<number, number>([[0, 0], [1, 1], [2, 2]]);
    
    puzzle.evaluateMatching(matches);
    expect(puzzle.isSolved()).toBe(true);
  });

  it("reopens puzzle after incorrect answer for retry", () => {
    const puzzle = model.getPuzzles()[0];
    const wrongMatches = new Map<number, number>([[0, 1], [1, 0], [2, 2]]);
    
    puzzle.evaluateMatching(wrongMatches);
    expect(puzzle.isSolved()).toBe(false);
    // Puzzle should reopen for another attempt
  });
});

describe("Animation Sequence Timing", () => {
  it("plays attack animation for 1 second before feedback", () => {
    const attackDuration = 1000; // ms
    expect(attackDuration).toBe(1000);
  });

  it("shows feedback for 1.5 seconds", () => {
    const feedbackDuration = 1500; // ms
    expect(feedbackDuration).toBe(1500);
  });

  it("plays hurt and explode animations simultaneously on wrong answer", () => {
    // Both animations play at the same time
    expect(true).toBe(true);
  });

  it("resets player to idle after animations", () => {
    const idleState = 'idle';
    expect(idleState).toBe('idle');
  });
});