import { describe, it, expect, beforeEach } from 'vitest';
import { MainGameScreenModel, NodeType } from '../../screens/MainGameScreen/MainGameScreenModel';

describe('MainGameScreenModel', () => {
  let model: MainGameScreenModel;

  beforeEach(() => {
    // Create a new model instance before each test
    model = new MainGameScreenModel();
  });

  it('should initialize with a default position of 0', () => {
    expect(model.getPlayerPosition()).toBe(0);
  });

  it('should correctly set and get player position', () => {
    const newPosition = 15;

    model.setPlayerPosition(newPosition);
    expect(model.getPlayerPosition()).toBe(newPosition);
  });

  it('should return the correct node type for a given index', () => {
    // The board is 1-indexed in the model's public interface
    expect(model.getNodeType(1)).toBe(NodeType.START);
    expect(model.getNodeType(2)).toBe(NodeType.EASY_QUESTION);
    expect(model.getNodeType(40)).toBe(NodeType.MINIGAME);
  });

  it('should throw an error for an out-of-bounds node index', () => {
    // Test boundaries
    expect(() => model.getNodeType(0)).toThrow('Node index out of bounds.');
    expect(() => model.getNodeType(41)).toThrow('Node index out of bounds.');
  });
});
