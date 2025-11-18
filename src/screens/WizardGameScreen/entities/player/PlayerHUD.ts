import Konva from 'konva';
import { PlayerModel } from './PlayerModel';

export class PlayerHUD {
    private healthBar: Konva.Rect;
    private manaBar: Konva.Rect;

    private readonly barWidth: number = 75; // full width
    private readonly barHeight: number = 5;

    constructor(private group: Konva.Group, private model: PlayerModel) {
        this.healthBar = new Konva.Rect({
            x: 0,
            y: 0,
            width: this.barWidth,
            height: this.barHeight,
            fill: "red",
        });

        this.manaBar = new Konva.Rect({
            x: 0,
            y: 0,
            width: this.barWidth,
            height: this.barHeight,
            fill: "blue",
        });

        group.add(this.healthBar);
        group.add(this.manaBar);
    }

    render() {
        // calculate percentage
        const healthPercent = Math.max(0, this.model.health / 100);
        const manaPercent = Math.max(0, this.model.mana / 100);

        // move above player
        this.healthBar.x(this.model.x + 200 - this.barWidth / 2);
        this.healthBar.y(this.model.y + 140 - (10 + this.barHeight));
        this.healthBar.width(this.barWidth * healthPercent);

        this.manaBar.x(this.model.x + 200 - this.barWidth / 2);
        this.manaBar.y(this.model.y + 140 - (5 + this.barHeight));
        this.manaBar.width(this.barWidth * manaPercent);

        this.group.getLayer()?.batchDraw();
    }
}
