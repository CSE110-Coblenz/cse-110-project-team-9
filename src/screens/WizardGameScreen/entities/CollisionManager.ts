import Konva from "konva";

/**
 * Axix-Aligned Bounding box
 */
export type box = { x: number; y: number; width: number; height: number };

export interface Collidable {
	x: number;
	y: number; 
	shape: Konva.Group;
	//returns world coordinates of bounding box attack and body
	bodyBox: box;
	attackBox: box | null;
	dead: boolean;
	//collision against players and enemies are different
	type: "player" | "enemy";

    //delete
    destroy?(): void;

    // collision on detection
    onCollision?(other: Collidable): void;
    onAttackCollision?(attacker: Collidable): void;

    //debuging yellow boundary box
    debugBoundingBox?(show: boolean): void;

	moveBy?(dx: number, dy: number): void;
}

/**
 * Collision detection for various sprite assets and window border
 */
export class CollisionManager {
	//list of all collidable objects
	private collidables: Collidable[] = [];
	//red debug bounding box
	private debugMode = false;
	//map of all entities to toggle debug bounding box
	private debugViewers: Map<Collidable, DebugBoundingBoxViewer> = new Map();

    /**
     * remove from entity list collision
     * @param c MVC model object
     */
	public register(c: Collidable) {
		if (!this.collidables.includes(c)) this.collidables.push(c);

		// create debug viewer that is layered on top of entity group
		if (this.debugMode && c.shape && !this.debugViewers.has(c)){

			const viewer = new DebugBoundingBoxViewer(c.shape);
			this.debugViewers.set(c, viewer);
			viewer.toggleVisibility(true);
		}

	}

	/**
     * remove from entity list collision
     * @param c MVC model object
     */
	public unregister(c: Collidable) {
		this.collidables = this.collidables.filter(x => x !== c);

		//destroy debug layer 
		const viewer = this.debugViewers.get(c);
        if (viewer) {
            viewer.destroy();
            this.debugViewers.delete(c);
        }
	}

	/**
     * remove entity list collision
     * @param c MVC model object
     */
	public unregisterAll() {
		for (const [collidable, viewer] of this.debugViewers.entries()) {
			viewer.destroy();
		}

		this.debugViewers.clear();
		this.collidables = [];
	}

	/**
	 * toggles the debugging mode on and off
	 */
	public toggleDebugMode(show: boolean){
		this.debugMode = show;

		//create debug bounding boxes view
		for (const c of this.collidables) {
			if (c.shape && !this.debugViewers.has(c)) {
				const viewer = new DebugBoundingBoxViewer(c.shape);
				this.debugViewers.set(c, viewer);
			}
		}

		this.debugViewers.forEach(viewer => viewer.toggleVisibility(show));
	}

    /**
     * proccess collidable objects that are registered
     */
	public update() {
        for (let i = 0; i < this.collidables.length; i++) {
			//for all konva rectangle box a
            const a = this.collidables[i];

			//destroy dead
			if (a.dead) {
                a.destroy?.();
                this.unregister(a);
                i--; // adjust index after removal
                continue;
            }

			//get body box
			const aBox = a.bodyBox;

            //update debug box
            if (this.debugMode && aBox) {
                this.debugViewers.get(a)?.updateBox(aBox);
            }

			//check collision with any entity
            for (let j = i + 1; j < this.collidables.length; j++) {
				//for all konva rectangle box b
                const b = this.collidables[j];

				//skip if dead
				if (b.dead) continue; 

				const bBox = b.bodyBox;
			                
				if (!this.shouldProcessBodyCollision(a, b)) continue;

                if (this.aabbIntersect(aBox, bBox)) {
					this.resolveOverlap(a, b, aBox, bBox);
                    a.onCollision?.(b);
                    b.onCollision?.(a);
                }

				this.handleAttackCollision(a, b, aBox, bBox);
            }
        }
	}
	
	/**
	 * 
	 * @param a konva box a
	 * @param b konva box b
	 * @returns return true if they are overlapping
	 */
	private aabbIntersect(a: box, b: box): boolean {
        //check if boxes a and b overlap in 2D space
		return !(
			b.x > a.x + a.width ||
			b.x + b.width < a.x || 
			b.y > a.y + a.height || 
			b.y + b.height < a.y
		);
	}

	private handleAttackCollision(a: Collidable, b: Collidable, aBody: box, bBody: box) {
		const aAttack = a.attackBox;
		if (aAttack && this.shouldProcessAttack(a, b) && this.aabbIntersect(aAttack, bBody)) {
			b.onAttackCollision?.(a);
		}

		const bAttack = b.attackBox;
		if (bAttack && this.shouldProcessAttack(b, a) && this.aabbIntersect(bAttack, aBody)) {
			a.onAttackCollision?.(b);
		}
	}

	private shouldProcessAttack(attacker: Collidable, defender: Collidable): boolean {
		if (!attacker.type || !defender.type) return true;
		return this.isPlayerEnemyPair(attacker.type, defender.type);
	}

	private shouldProcessBodyCollision(a: Collidable, b: Collidable): boolean {
		const aGroup = a.type;
		const bGroup = b.type;

		if (!aGroup || !bGroup) return true;

		return this.isPlayerEnemyPair(aGroup, bGroup);
	}

	private isPlayerEnemyPair(
		aGroup: "player" | "enemy",
		bGroup: "player" | "enemy"
	): boolean {
		return (
			(aGroup === "player" && bGroup === "enemy") ||
			(aGroup === "enemy" && bGroup === "player")
		);
	}

	private resolveOverlap(a: Collidable, b: Collidable, aBox: box, bBox: box) {
		if (!a.moveBy && !b.moveBy) return;

		const separation = this.computeSeparationVector(aBox, bBox);
		if (!separation) return;

		const halfX = separation.x / 2;
		const halfY = separation.y / 2;
		
		a.moveBy?.(halfX, halfY);
		b.moveBy?.(-halfX, -halfY);
	}

	private computeSeparationVector(a: box, b: box): { x: number; y: number } | null {
		const axCenter = a.x + a.width / 2;
		const ayCenter = a.y + a.height / 2;
		const bxCenter = b.x + b.width / 2;
		const byCenter = b.y + b.height / 2;

		const dx = axCenter - bxCenter;
		const px = (a.width + b.width) / 2 - Math.abs(dx);
		if (px <= 0) return null;

		const dy = ayCenter - byCenter;
		const py = (a.height + b.height) / 2 - Math.abs(dy);
		if (py <= 0) return null;

		if (px < py) {
			return { x: dx < 0 ? -px : px, y: 0 };
		} else {
			return { x: 0, y: dy < 0 ? -py : py };
		}
	}
}

/**
 * Utility class for debuging bounding boxes
 */
export class DebugBoundingBoxViewer {
	private rect: Konva.Rect;

	/**
	 * Create a debug bounding box for an entity
	 * @param group Konva Group for entitiy/image 
	 */
	constructor(group: Konva.Group) {
		this.rect = new Konva.Rect({
			x: 0,
			y: 0,
			width: 0,
			height: 0,
			stroke: 'yellow',
			strokeWidth: 1,
			visible: false,
		});
		group.add(this.rect);
	}

	/**
	 * Toggle visibility of the bounding box
	 */
	public toggleVisibility(show: boolean) {
		this.rect.visible(show);
	}

	/**
	 * Update bounding box with new frame/position
	 */
	public updateBox(box: box) {
		this.rect.x(box.x);
		this.rect.y(box.y);
		this.rect.width(box.width);
		this.rect.height(box.height);
		this.rect.visible(true);
	}

	/**
	 * Delete Bounding Box
	 */
	public destroy() {
		this.rect.destroy();
	}
}