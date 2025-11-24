import Konva from "konva";

export type box = { x: number; y: number; width: number; height: number };

export interface Collidable {
	shape: Konva.Group;
	bodyBox: box; //collision for body
	attackBox: box | null; //collision for attack
	dead: boolean;
	type: "player" | "enemy";
	destroy(): void;
	onCollision(other: Collidable): void;
	onAttackCollision(attacker: Collidable): void;
	moveBy(dx: number, dy: number): void;
}

export class CollisionManager {
	private collidables: Collidable[] = [];

	public register(c: Collidable) {
		if (!this.collidables.includes(c)) {
			this.collidables.push(c);
		}
	}

	public unregister(c: Collidable) {
		this.collidables = this.collidables.filter(x => x !== c);
	}

	public unregisterAll() {
		this.collidables = [];
	}

	public update() {
		for (let i = 0; i < this.collidables.length; i++) {
			const a = this.collidables[i];

			//if entity is dead, destroy it and unregister it
			if (a.dead) {
				a.destroy();
				this.unregister(a);
				i--;
				continue;
			}

			//check for collisions between all collidables
			for (let j = i + 1; j < this.collidables.length; j++) {
				const b = this.collidables[j];

				if (b.dead) continue;

				if (!this.isPlayerEnemyPair(a.type, b.type)) continue;

				this.bodyCollision(a, b);
				this.attackCollision(a, b);
			}
		}
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
	
	//check if konva boxes overlap
	private aabbIntersect(a: box, b: box): boolean {
		return !(
			b.x > a.x + a.width ||
			b.x + b.width < a.x || 
			b.y > a.y + a.height || 
			b.y + b.height < a.y
		);
	}

	//check for body on body collison
	private bodyCollision(a: Collidable, b: Collidable) {
		if (!this.aabbIntersect(a.bodyBox, b.bodyBox)) return;

		this.resolveOverlap(a, b);
		a.onCollision(b);
		b.onCollision(a);
	}

	//check for attack on body collsion
	private attackCollision(a: Collidable, b: Collidable) {
		if (a.attackBox && this.aabbIntersect(a.attackBox, b.bodyBox)) {
			b.onAttackCollision(a);
		}

		if (b.attackBox && this.aabbIntersect(b.attackBox, a.bodyBox)) {
			a.onAttackCollision(b);
		}
	}

	private resolveOverlap(a: Collidable, b: Collidable) {
		const seperate = this.separationVector(a.bodyBox, b.bodyBox);
		if (!seperate) return;

		// push both halves
		a.moveBy(seperate.x / 2, seperate.y / 2);
		b.moveBy(-seperate.x / 2, -seperate.y / 2);
	}

	private separationVector(a: box, b: box): { x: number; y: number } | null {
		//location and size of box middle
		const axCenter = a.x + a.width / 2;
		const ayCenter = a.y + a.height / 2;
		const bxCenter = b.x + b.width / 2;
		const byCenter = b.y + b.height / 2;
		
		//0 is bordering negatives are overlaps
		const dx = axCenter - bxCenter;
		const px = (a.width + b.width) / 2 - Math.abs(dx);

		const dy = ayCenter - byCenter;
		const py = (a.height + b.height) / 2 - Math.abs(dy);

		if (px < py) {
			let pushX = px;
			if (dx < 0) pushX = -px;

			return { x: pushX, y: 0 };
		} else {
			// Resolve vertically
			let pushY = py;
			if (dy < 0) pushY = -py;

			return { x: 0, y: pushY };
		}
	}
}