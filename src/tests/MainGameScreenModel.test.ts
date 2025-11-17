import { describe, it, expect, beforeEach } from 'vitest';
import { MainGameScreenModel, NodeType } from '../screens/MainGameScreen/MainGameScreenModel';

describe('MainGameScreenModel', () => {
  let model: MainGameScreenModel;
  const playerIDs = ['player1', 'player2'];

  beforeEach(() => {
    // Create a new model instance before each test
    model = new MainGameScreenModel(playerIDs);
  });

  it('should initialize with the correct first player', () => {
    expect(model.getCurrentPlayerID()).toBe('player1');
  });

  it('should correctly set and get player position', () => {
    const playerID = 'player1';
    const newPosition = 15;

    model.setPlayerPosition(playerID, newPosition);
    expect(model.getPlayerPosition(playerID)).toBe(newPosition);
  });

  it('should correctly set and get player score', () => {
    const playerID = 'player1';
    const newScore = 100;

    model.setPlayerScore(playerID, newScore);
    expect(model.getPlayerScore(playerID)).toBe(newScore);
  });

  it('should advance to the next player correctly', () => {
    expect(model.getCurrentPlayerID()).toBe('player1');

    model.advanceToNextPlayer();
    expect(model.getCurrentPlayerID()).toBe('player2');
  });

  it('should loop back to the first player after the last player', () => {
    // Start with player1
    model.advanceToNextPlayer(); // Now player2
    expect(model.getCurrentPlayerID()).toBe('player2');

    model.advanceToNextPlayer(); // Should loop back to player1
    expect(model.getCurrentPlayerID()).toBe('player1');
  });

  it('should return the correct node type for a given index', () => {
    // The board is 1-indexed in the model's public interface
    expect(model.getNodeType(1)).toBe(NodeType.START);
    expect(model.getNodeType(2)).toBe(NodeType.EASY_QUESTION);
    expect(model.getNodeType(7)).toBe(NodeType.MINIGAME);
    expect(model.getNodeType(40)).toBe(NodeType.MINIGAME);
  });

  it('should throw an error for an out-of-bounds node index', () => {
    // Test boundaries
    expect(() => model.getNodeType(0)).toThrow('Node index out of bounds.');
    expect(() => model.getNodeType(41)).toThrow('Node index out of bounds.');
  });

  it('should initialize players with a default position of 0 and score of 0', () => {
    const playerID = 'player1';
    expect(model.getPlayerPosition(playerID)).toBe(0);
    expect(model.getPlayerScore(playerID)).toBe(0);
  });
});
