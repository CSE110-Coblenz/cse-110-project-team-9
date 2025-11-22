import Konva from "konva";

export type box = { x: number; y: number; width: number; height: number };

export interface Collidable {
	x: number;
	y: number; 
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

			for (let j = i + 1; j < this.collidables.length; j++) {
				const b = this.collidables[j];

				if (b.dead) continue;

				const bBox = b.bodyBox;

				if (!this.shouldProcessBodyCollision(a, b)) continue;

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
			b.onAttackCollision(a);
		}

		const bAttack = b.attackBox;
		if (bAttack && this.shouldProcessAttack(b, a) && this.aabbIntersect(bAttack, aBody)) {
			a.onAttackCollision(b);
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