// src/game/entities/Player.ts
import { STAGE_HEIGHT, STAGE_WIDTH } from "../../../../constants";

export class Player {
	private x: number;
	private y: number;
	private speed: number;
	private state: "idle" | "walk" = "idle";
	private direction: "up" | "down" | "left" | "right" = "down";

	constructor(startX = STAGE_WIDTH / 2, startY = STAGE_HEIGHT / 2, speed = 45) {
		this.x = startX;
		this.y = startY;
		this.speed = speed;
	}

	getPosition() {
		return { x: this.x, y: this.y };
	}

	move(dx: number, dy: number, dt: number) {
		const len = Math.hypot(dx, dy) || 1;
		const normX = dx / len;
		const normY = dy / len;
		this.x += normX * this.speed * dt;
		this.y += normY * this.speed * dt;

		this.state = "walk";
		if (Math.abs(dx) > Math.abs(dy)) {
			this.direction = dx > 0 ? "right" : "left";
		} else {
			this.direction = dy > 0 ? "down" : "up";
		}

		// clamp position inside stage
		const half = 90;
		this.x = Math.max(half, Math.min(STAGE_WIDTH - half, this.x));
		this.y = Math.max(half, Math.min(STAGE_HEIGHT - half, this.y));
	}

	stop() {
		this.state = "idle";
	}

	getSpeed() {
		return this.speed;
	}

	setSpeed(newSpeed: number) {
		this.speed = newSpeed;
	}

	getState() {
		return this.state;
	}

	getDirection() {
		return this.direction;
	}

	setDirection(dir: "up" | "down" | "left" | "right") {
		this.direction = dir;
	}

	getSprite(): string {
		if (this.state === "walk") return `/assets/sprites/player/walk_${this.direction}.png`;
		return `/assets/sprites/player/idle_${this.direction}.png`;
	}
}
