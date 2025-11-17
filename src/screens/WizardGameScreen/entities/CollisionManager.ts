import Konva from "konva";

//TODO: simplify these functions

/**
 * Axix-Aligned Bounding box
 */
export type AABB = { x: number; y: number; width: number; height: number };

export interface Collidable {
    // Returns the current bounding box of the object in world coordinates
	getBoundingBox(): AABB | null;

    // Optional call for collision handling e.g. when a collision is detected
	onCollision?(other: Collidable): void;

	//debuging red boundary box
	debugBoundingBox?(show: boolean): void;

	//visualization debug grab konva group
	getShape?(): Konva.Group;
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
		if (this.debugMode && c.getShape && !this.debugViewers.has(c)){

			const viewer = new DebugBoundingBoxViewer(c.getShape());
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

		//destroy debug layer group
		const viewer = this.debugViewers.get(c);
        if (viewer) {
            viewer.destroy();
            this.debugViewers.delete(c);
        }
	}

	/**
	 * toggles the debugging mode on and off
	 */
	public toggleDebugMode(show: boolean){
		this.debugMode = show;

		//create debug bounding boxes view
		for (const c of this.collidables) {
			if (c.getShape && !this.debugViewers.has(c)) {
				const viewer = new DebugBoundingBoxViewer(c.getShape());
				this.debugViewers.set(c, viewer);
			}
		}

		this.debugViewers.forEach(viewer => viewer.toggleVisibility(show));
	}

    /**
     * Processes collision detection among registered collidables
     */
	public update() {
		const list = this.collidables;

        for (let i = 0; i < list.length; i++) {
            const a = list[i];
            const aBox = a.getBoundingBox();
            if (!aBox) continue;

            // Update debug box
            if (this.debugMode) {
                this.debugViewers.get(a)?.updateBox(aBox);
            }

            for (let j = i + 1; j < list.length; j++) {
                const b = list[j];
                const bBox = b.getBoundingBox();
                if (!bBox) continue;

                if (this.aabbIntersect(aBox, bBox)) {
                    a.onCollision?.(b);
                    b.onCollision?.(a);
                }
            }
        }
	}

	private aabbIntersect(a: AABB, b: AABB): boolean {
        //check if boxes a and b overlap in 2D space
		return !(
			b.x > a.x + a.width ||
			b.x + b.width < a.x || 
			b.y > a.y + a.height || 
			b.y + b.height < a.y
		);
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
			stroke: 'red',
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
	public updateBox(box: AABB) {
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