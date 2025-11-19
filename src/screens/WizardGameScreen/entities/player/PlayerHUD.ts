import Konva from 'konva';
import { PlayerModel } from './PlayerModel';

export class PlayerHUD {
    private healthBar: Konva.Rect;
    private staminaBar: Konva.Rect;

    private readonly barWidth: number = 70;
    private readonly barHeight: number = 5;

    constructor(private group: Konva.Group, private model: PlayerModel) {
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

        group.add(this.healthBar);
        group.add(this.staminaBar);
    }

    render() {
        // calculate percentage
        const healthPercent = Math.max(0, this.model.health / 100);
        const manaPercent = Math.max(0, this.model.mana / 100);

        // move above player
        this.healthBar.x(this.model.x + 200 - this.barWidth / 2);
        this.healthBar.y(this.model.y + 140 - (10 + this.barHeight));
        this.healthBar.width(this.barWidth * healthPercent);

        this.staminaBar.x(this.model.x + 200 - this.barWidth / 2);
        this.staminaBar.y(this.model.y + 140 - (5 + this.barHeight));
        this.staminaBar.width(this.barWidth * manaPercent);

        this.group.getLayer()?.batchDraw();
    }
}
