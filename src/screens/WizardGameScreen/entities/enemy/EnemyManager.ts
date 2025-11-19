import Konva from "konva";
import { EnemyFactory, EnemyType } from "./EnemyFactory";
import { EnemyController } from "./EnemyController";
import { CollisionManager } from "../CollisionManager";
import { AudioController } from "../../../../audios/AudioController";

export class EnemyManager {
    private enemies: EnemyController[]
    private spawnTimer: number;
    private spawnInterval: number;

    constructor(
        private group: Konva.Group,
        private collision: CollisionManager,
        private audio: AudioController,
        private mapWidth: number,
        private mapHeight: number
    ) {
        this.enemies = []
        this.spawnTimer = 0;
        this.spawnInterval = 1.2; //seconds
    }

    update(delta: number, playerX: number, playerY: number) {

        this.spawnTimer += delta;
        if (this.spawnTimer >= this.spawnInterval) {
            this.spawnRandomEnemy();
            this.spawnTimer = 0;
        }

        for (const enemy of this.enemies) {
            if (!enemy.dead()) {
                enemy.update(delta, playerX, playerY);
            }
        }
    }

    private spawnRandomEnemy() {
        //Spawns them anywhere on map
        const x = Math.random() * this.mapWidth;
        const y = Math.random() * this.mapHeight;

        const types: EnemyType[] = ["orc"];
        const type = types[Math.floor(Math.random() * types.length)];

        const enemy = EnemyFactory.create(x, y, type, this.group, this.audio);

        this.enemies.push(enemy);
        this.collision.register(enemy);
    }

    clear() {
        for (const e of this.enemies) e.destroy();
        this.enemies = [];
    }
}
