import Konva from "konva";

export class PlayerSprite {
    private sprite!: Konva.Sprite;
    private idleImg!: HTMLImageElement;
    private walkImg!: HTMLImageElement;
    private attackImg!: HTMLImageElement;
    private hurtImg!: HTMLImageElement;
    private accessImg!: HTMLImageElement;
    private isReady = false;
    private facingLeft = false;
    private currentAnimationState: 'idle' | 'walk' | 'attack' | 'hurt' | 'access' = 'idle';

    // animations assume frames are arranged horizontally in each spritesheet
    //1024x128, 8 frames
    private static readonly IDLE_ANIM = [
        0, 0, 128, 128,
        128, 0, 128, 128,
        256, 0, 128, 128,
        384, 0, 128, 128,
        512, 0, 128, 128,
        640, 0, 128, 128,
        768, 0, 128, 128,
        896, 0, 128, 128,
    ];
    //1024x128, 8 frames
    private static readonly RUN_ANIM = [
        0, 0, 128, 128,
        128, 0, 128, 128,
        256, 0, 128, 128,
        384, 0, 128, 128,
        512, 0, 128, 128,
        640, 0, 128, 128,
        768, 0, 128, 128,
        896, 0, 128, 128,
    ];
    //2048x128, 9 frames
    private static readonly ATTACK_ANIM = [
        0, 0, 128, 128,
        128, 0, 128, 128,
        256, 0, 128, 128,
        384, 0, 128, 128,
        512, 0, 128, 128,
        640, 0, 128, 128,
        768, 0, 128, 128,
    ];

    //512x128, 4 frames
    private static readonly HURT_ANIM = [
        0, 0, 128, 128,
        128, 0, 128, 128,
        256, 0, 128, 128,
        384, 0, 128, 128,
    ];
    //2048x128, 16 frames
    private static readonly ACCESS_ANIM = [
        0, 0, 128, 128,
        128, 0, 128, 128,
        256, 0, 128, 128,
        384, 0, 128, 128,
        512, 0, 128, 128,
        640, 0, 128, 128,
        768, 0, 128, 128,
        896, 0, 128, 128,
        1024, 0, 128, 128,
        1152, 0, 128, 128,
        1280, 0, 128, 128,
        1408, 0, 128, 128,
        1536, 0, 128, 128,
        1664, 0, 128, 128,
        1792, 0, 128, 128,
        1920, 0, 128, 128,
    ];

    constructor(parentGroup: Konva.Group, x: number, y: number, options?: { scale?: number; frameRate?: number; onReady?: (p: PlayerSprite) => void }) {
        // Load both images
        this.idleImg = new Image();
        this.walkImg = new Image();
        this.attackImg = new Image();
        this.hurtImg = new Image();
        this.accessImg = new Image();

        let loaded = 0;
        const checkReady = () => {
            loaded++;
            if (loaded >= 5) this.createSprite(parentGroup, x, y, options);
        };

        this.idleImg.onload = checkReady;
        this.walkImg.onload = checkReady;
        this.attackImg.onload = checkReady;
        this.hurtImg.onload = checkReady;
        this.accessImg.onload = checkReady;

        this.idleImg.src = `${import.meta.env.BASE_URL}AmongUsMiniGame/Sprites/idle.png`;
        this.walkImg.src = `${import.meta.env.BASE_URL}AmongUsMiniGame/Sprites/run.png`;
        this.attackImg.src = `${import.meta.env.BASE_URL}AmongUsMiniGame/Sprites/attack.png`;
        this.hurtImg.src = `${import.meta.env.BASE_URL}AmongUsMiniGame/Sprites/hurt.png`;
        this.accessImg.src = `${import.meta.env.BASE_URL}AmongUsMiniGame/Sprites/magic.png`;
    }

    private createSprite(parentGroup: Konva.Group, x: number, y: number, options?: { scale?: number; frameRate?: number; onReady?: (p: PlayerSprite) => void }) {
        const animations: Record<string, number[]> = {
            idle: PlayerSprite.IDLE_ANIM,
            walk: PlayerSprite.RUN_ANIM,
            attack: PlayerSprite.ATTACK_ANIM,
            hurt: PlayerSprite.HURT_ANIM,
            access: PlayerSprite.ACCESS_ANIM,
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
        // Don't override special animations (attack, hurt, access)
        if (this.currentAnimationState === 'attack' || this.currentAnimationState === 'hurt' || this.currentAnimationState === 'access') {
            return;
        }
        if (isMoving) {
            // switch to walk image + animation
            this.sprite.image(this.walkImg as any);
            this.sprite.animation('walk');
            this.sprite.frameRate(12);
            this.currentAnimationState = 'walk';
        } else {
            this.sprite.image(this.idleImg as any);
            this.sprite.animation('idle');
            this.sprite.frameRate(8);
            this.currentAnimationState = 'idle';
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

    setAttacking(): void {
        if (!this.isReady) return;
        this.currentAnimationState = 'attack';
        this.sprite.image(this.attackImg as any);
        this.sprite.animation('attack');
        this.sprite.frameRate(15);
        this.sprite.frameIndex(0);
        this.sprite.start();
    }

    setHurt(): void {
        if (!this.isReady) return;
        this.currentAnimationState = 'hurt';
        this.sprite.image(this.hurtImg as any);
        this.sprite.animation('hurt');
        this.sprite.frameRate(8);
        this.sprite.frameIndex(0);
        this.sprite.start();
    }

    setAccessing(): void {
        if (!this.isReady) return;
        this.currentAnimationState = 'access';
        this.sprite.image(this.accessImg as any);
        this.sprite.animation('access');
        this.sprite.frameRate(12);
        this.sprite.frameIndex(0);
        this.sprite.start();
    }

    resetToIdle(): void {
        if (!this.isReady) return;
        this.currentAnimationState = 'idle';
        this.sprite.image(this.idleImg as any);
        this.sprite.animation('idle');
        this.sprite.frameRate(8);
        this.sprite.start();
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
