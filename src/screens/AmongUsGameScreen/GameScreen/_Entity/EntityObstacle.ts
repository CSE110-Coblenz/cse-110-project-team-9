import Konva from "konva";
import { PuzzleModel } from "../_Puzzle/PuzzleModel";

/**
 * Obstacle entity - visual + puzzle data
 * Creates a Konva.Sprite (rotating blade) and exposes simple API for position and lifecycle.
 */
export class Obstacle {
    id: number;
    puzzle: PuzzleModel | null;
    private solved: boolean;

    private group: Konva.Group;
    private sprite!: Konva.Sprite;

    constructor(id: number, x: number, y: number, puzzle: PuzzleModel | null, parentGroup: Konva.Group) {
        this.id = id;
        this.puzzle = puzzle;
        this.solved = false;

        this.group = parentGroup;

        // Load the rotating blade spritesheet and create a sprite
        //576x48, 12 frames
        const bombAnimations = {
            idle: [
                0, 0, 48, 48,
                48, 0, 48, 48,
                96, 0, 48, 48,
                144, 0, 48, 48,
                192, 0, 48, 48,
            ],

            explode: [
                0, 0, 48, 48,
                48, 0, 48, 48,
                96, 0, 48, 48,
                144, 0, 48, 48,
                192, 0, 48, 48,
                240, 0, 48, 48,
                288, 0, 48, 48,
                336, 0, 48, 48,
                384, 0, 48, 48,
                432, 0, 48, 48,
                480, 0, 48, 48,
                528, 0, 48, 48,
            ],
        };

        const img = new Image();
        img.onload = () => {
            this.sprite = new Konva.Sprite({
                x,
                y,
                image: img,
                animations: bombAnimations,
                animation: 'idle',
                frameRate: 12,
                scaleX: 2,
                scaleY: 2,
                frameIndex: 0,
            });

            // center the sprite on its origin
            this.sprite.offsetX(24);
            this.sprite.offsetY(24);

            this.group.add(this.sprite);
            this.sprite.start();
            this.group.getLayer()?.draw();
        };
        img.src = `${import.meta.env.BASE_URL}AmongUsMiniGame/Objects/Bomb.png`;
    }

    markSolved(): void {
        this.solved = true;
        // optional: hide or stop animation
        if (this.sprite) {
            this.sprite.stop();
            this.sprite.visible(false);
            this.group.getLayer()?.batchDraw();
        }
    }

    isSolved(): boolean {
        return this.solved;
    }

    getPosition(): { x: number; y: number } | null {
        if (!this.sprite) return null;
        return { x: this.sprite.x(), y: this.sprite.y() };
    }

    setPosition(x: number, y: number): void {
        if (!this.sprite) return;
        this.sprite.x(x);
        this.sprite.y(y);
        this.group.getLayer()?.batchDraw();
    }

    destroy(): void {
        this.sprite?.destroy();
    }

    setInteractive(interactive: boolean): void {
        if (this.sprite) {
            this.sprite.listening(interactive);
        }
    }

    /**
     * Check if a point (player) is within a certain distance of this obstacle
     */
    isPlayerNearby(playerPos: { x: number; y: number }, threshold: number = 100): boolean {
        if (!this.sprite) return false;
        const obstaclePos = { x: this.sprite.x(), y: this.sprite.y() };
        const distance = Math.hypot(playerPos.x - obstaclePos.x, playerPos.y - obstaclePos.y);
        return distance <= threshold;
    }

    /**
     * Play the explode animation once
     */
    playExplodeAnimation(onComplete?: () => void): void {
        if (!this.sprite) return;
        
        this.sprite.animation('explode');
        this.sprite.frameRate(12);
        this.sprite.frameIndex(0);
        
        // Calculate duration: 12 frames at 12 fps = 1 second
        const duration = 12 / 12 * 1000;
        
        this.sprite.start();
        
        setTimeout(() => {
            this.sprite.stop();
            if (onComplete) onComplete();
        }, duration);
    }
}
