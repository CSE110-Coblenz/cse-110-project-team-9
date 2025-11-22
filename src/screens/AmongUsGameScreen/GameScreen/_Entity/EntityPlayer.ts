import Konva from "konva";

export class PlayerSprite {
    private sprite!: Konva.Sprite;
    private idleImg!: HTMLImageElement;
    private walkImg!: HTMLImageElement;
    private isReady = false;
    private facingLeft = false;

    // animations assume frames are arranged horizontally in each spritesheet
    private static readonly IDLE_ANIM = [
        0, 0, 128, 128,
        128, 0, 128, 128,
        256, 0, 128, 128,
        384, 0, 128, 128,
        512, 0, 128, 128,
        640, 0, 128, 128,
    ];

    private static readonly WALK_ANIM = [
        0, 0, 128, 128,
        128, 0, 128, 128,
        256, 0, 128, 128,
        384, 0, 128, 128,
        512, 0, 128, 128,
        640, 0, 128, 128,
    ];

    constructor(parentGroup: Konva.Group, x: number, y: number, options?: { scale?: number; frameRate?: number; onReady?: (p: PlayerSprite) => void }) {
        // Load both images
        this.idleImg = new Image();
        this.walkImg = new Image();

        let loaded = 0;
        const checkReady = () => {
            loaded++;
            if (loaded >= 2) this.createSprite(parentGroup, x, y, options);
        };

        this.idleImg.onload = checkReady;
        this.walkImg.onload = checkReady;

        this.idleImg.src = `${import.meta.env.BASE_URL}AmongUsMiniGame/Sprites/Rogue/Idle/idle.png`;
        this.walkImg.src = `${import.meta.env.BASE_URL}AmongUsMiniGame/Sprites/Rogue/Walk/walk.png`;
    }

    private createSprite(parentGroup: Konva.Group, x: number, y: number, options?: { scale?: number; frameRate?: number; onReady?: (p: PlayerSprite) => void }) {
        const animations: Record<string, number[]> = {
            idle: PlayerSprite.IDLE_ANIM,
            walk: PlayerSprite.WALK_ANIM,
        };

        this.sprite = new Konva.Sprite({
            x,
            y,
            image: this.idleImg,
            animations,
            animation: 'idle',
            frameRate: options?.frameRate ?? 8,
            scaleX: options?.scale ?? 2,
            scaleY: options?.scale ?? 2,
            frameIndex: 0,
        });

        // center origin
        this.sprite.offsetX(64);
        this.sprite.offsetY(64);

        parentGroup.add(this.sprite);
        this.sprite.start();
        this.isReady = true;
        options?.onReady?.(this);
        parentGroup.getLayer()?.draw();
    }

    setMoving(isMoving: boolean): void {
        if (!this.isReady) return;
        if (isMoving) {
            // switch to walk image + animation
            this.sprite.image(this.walkImg as any);
            this.sprite.animation('walk');
            this.sprite.frameRate(12);
        } else {
            this.sprite.image(this.idleImg as any);
            this.sprite.animation('idle');
            this.sprite.frameRate(8);
        }
        this.sprite.start();
    }

    setDirection(left: boolean): void {
        if (!this.isReady) return;
        if (this.facingLeft === left) return;
        this.facingLeft = left;
        const scale = Math.abs(this.sprite.scaleX() || 1);
        this.sprite.scaleX(left ? -scale : scale);
    }

    moveBy(dx: number, dy: number): void {
        if (!this.isReady) return;
        this.sprite.x(this.sprite.x() + dx);
        this.sprite.y(this.sprite.y() + dy);
        this.sprite.getLayer()?.batchDraw();
    }

    setPosition(x: number, y: number): void {
        if (!this.isReady) return;
        this.sprite.x(x);
        this.sprite.y(y);
        this.sprite.getLayer()?.batchDraw();
    }

    getPosition(): { x: number; y: number } | null {
        if (!this.isReady) return null;
        return { x: this.sprite.x(), y: this.sprite.y() };
    }

        moveToTop(): void {
            if (!this.isReady) return;
            this.sprite.moveToTop();
            this.sprite.getLayer()?.draw();
        }

    destroy(): void {
        this.sprite?.destroy();
    }
}
