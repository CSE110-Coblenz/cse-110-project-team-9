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

    constructor(id: number, x: number, y: number, puzzle: PuzzleModel | null, parentGroup: Konva.Group, onClick?: (p: PuzzleModel | null) => void) {
        this.id = id;
        this.puzzle = puzzle;
        this.solved = false;

        this.group = parentGroup;

        // Load the rotating blade spritesheet and create a sprite
        const bladeAnimations = {
            idle: [
                0, 0, 48, 48,
                0, 48, 48, 48,
                0, 96, 48, 48,
                0, 144, 48, 48,
            ],
        };

        const img = new Image();
        img.onload = () => {
            this.sprite = new Konva.Sprite({
                x,
                y,
                image: img,
                animations: bladeAnimations,
                animation: 'idle',
                frameRate: 12,
                scaleX: 3,
                scaleY: 3,
                frameIndex: 0,
            });

            // center the sprite on its origin
            this.sprite.offsetX(24);
            this.sprite.offsetY(24);

            this.group.add(this.sprite);
            this.sprite.start();
            // attach click handler if provided
            if (onClick) {
                this.sprite.on('click', () => {
                    onClick(this.puzzle);
                });
                // also touch support
                this.sprite.on('touchstart', () => {
                    onClick(this.puzzle);
                });
            }
            this.group.getLayer()?.draw();
        };
        img.src = `${import.meta.env.BASE_URL}AmongUsMiniGame/Objects/Rotating_blades.png`;
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
}
