///Axis-Aligned Bounding Box collision types and manager
//kept inside the WizardGameScreen folder because collisions are use only in this mini-game
export type AABB = { x: number; y: number; width: number; height: number };

export interface Collidable {
    // Returns the current bounding box of the object in world coordinates
	getBoundingBox(): AABB | null;
    // Optional call for collision handling e.g. when a collision is detected
	onCollision?(other: Collidable): void;
	// TODO: move debug again maybe/
	debugBoundingBox?(show: boolean): void;
}

export class CollisionManager {
	//list of all collidable objects
	private collidables: Collidable[] = [];
	//red debug bounding box
	private debugMode = false;


    /**
     * remove from entity list collision
     * @param c MVC model object
     */
	public register(c: Collidable) {
		if (!this.collidables.includes(c)) this.collidables.push(c);
	}

    /**
     * remove from entity list collision
     * @param c MVC model object
     */
	public unregister(c: Collidable) {
		this.collidables = this.collidables.filter(x => x !== c);
	}

	//TODO: do konva collision instead that will be better
    /**
     * Processes collision detection among registered collidables
     */
	public update() {
		const list = this.collidables;
		for (let i = 0; i < list.length; i++) {
			const aBox = list[i].getBoundingBox();
			if (!aBox) continue;
			for (let j = i + 1; j < list.length; j++) {
				const bBox = list[j].getBoundingBox();
				if (!bBox) continue;
				if (this.aabbIntersect(aBox, bBox)) {
					list[i].onCollision?.(list[j]);
					list[j].onCollision?.(list[i]);
				}
			}
		}
	}

	private aabbIntersect(a: AABB, b: AABB): boolean {
        //check if boxes a and b overlap in 2D space
		return !(b.x > a.x + a.width || b.x + b.width < a.x || b.y > a.y + a.height || b.y + b.height < a.y);
	}

	public toggleDebugMode(show: boolean) {
        this.debugMode = show;
        this.collidables.forEach(c => c.debugBoundingBox?.(show));
    }
}