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

			const aBox = a.bodyBox;

			//check for collisions between all collidables
			for (let j = i + 1; j < this.collidables.length; j++) {
				const b = this.collidables[j];

				//pass if dead
				if (b.dead) continue;

				const bBox = b.bodyBox;

				//
				if (!((a.type === "player" && b.type === "enemy") ||
					  (a.type === "enemy" && b.type === "player"))) continue;

				if (this.aabbIntersect(aBox, bBox)) {
					this.resolveOverlap(a, b, aBox, bBox);
					a.onCollision(b);
					b.onCollision(a);
				}

				this.handleAttackCollision(a, b, aBox, bBox);
			}
		}
	}
	
	private aabbIntersect(a: box, b: box): boolean {
		//check if overlap
		return !(
			b.x > a.x + a.width ||
			b.x + b.width < a.x || 
			b.y > a.y + a.height || 
			b.y + b.height < a.y
		);
	}

	private handleAttackCollision(a: Collidable, b: Collidable, aBody: box, bBody: box) {
		const aAttack = a.attackBox;
		if (aAttack && this.isPlayerEnemyPair(a.type,b.type) && this.aabbIntersect(aAttack, bBody)) {
			b.onAttackCollision(a);
		}

		const bAttack = b.attackBox;
		if (bAttack && this.isPlayerEnemyPair(a.type,b.type) && this.aabbIntersect(bAttack, aBody)) {
			a.onAttackCollision(b);
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

	private resolveOverlap(a: Collidable, b: Collidable, aBox: box, bBox: box) {
		const separation = this.computeSeparationVector(aBox, bBox);
		if (!separation) return;

		const halfX = separation.x / 2;
		const halfY = separation.y / 2;
		
		a.moveBy(halfX, halfY);
		b.moveBy(-halfX, -halfY);
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