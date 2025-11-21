import Konva from 'konva';
import { PlayerModel } from './PlayerModel';
import { DEFAULT_HEALTH } from '../../config';

export class PlayerHUD {
    private healthBar: Konva.Rect;
    private staminaBar: Konva.Rect;
    private group: Konva.Group

    private readonly barWidth: number = 70;
    private readonly barHeight: number = 5;

    constructor(group: Konva.Group, private model: PlayerModel) {
        this.group = group;

        this.healthBar = new Konva.Rect({
            x: 0,
            y: 0,
            width: this.barWidth,
            height: this.barHeight,
            fill: "red",
        });

        this.staminaBar = new Konva.Rect({
            x: 0,
            y: 0,
            width: this.barWidth,
            height: this.barHeight,
            fill: "yellow",
        });

        this.group.add(this.healthBar);
        this.group.add(this.staminaBar);
    }

    render() {
        // calculate percentage
        const healthPercent = Math.max(0, this.model.health / DEFAULT_HEALTH);
        const staminaPercent = Math.max(0, this.model.stamina / 100);

        // move above player
        this.healthBar.x(this.model.x + 200 - this.barWidth / 2);
        this.healthBar.y(this.model.y + 140 - (10 + this.barHeight));
        this.healthBar.width(this.barWidth * healthPercent);

        this.staminaBar.x(this.model.x + 200 - this.barWidth / 2);
        this.staminaBar.y(this.model.y + 140 - (5 + this.barHeight));
        this.staminaBar.width(this.barWidth * staminaPercent);

        this.healthBar.moveToTop();
        this.staminaBar.moveToTop();

        this.group.getLayer()?.batchDraw();
    }
}
