import Konva from "konva";
import type { View } from "../../types";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants";

export class MainGameScreenView implements View {
  private group: Konva.Group;
  private tiles: Konva.Rect[] = [];

  constructor() {
    this.group = new Konva.Group({ visible: false });

    const background = new Konva.Rect({
      x: 0,
      y: 0,
      width: STAGE_WIDTH,
      height: STAGE_HEIGHT,
      fill: "#f5f5dc",
    });
    this.group.add(background);

    const nodeSize = 100;
    const startX = STAGE_WIDTH / 2 - (nodeSize * 2 + 45);
    const startY = STAGE_HEIGHT / 2 - nodeSize / 2;

    const nodes = [
      { label: "Wizard Minigame", color: "#a29bfe" },
      { label: "Among Us Minigame", color: "#74b9ff" },
      { label: "Question 1", color: "#55efc4" },
      { label: "Question 2", color: "#ffeaa7" },
    ];

    nodes.forEach((node, i) => {
      const tile = new Konva.Rect({
        x: startX + i * (nodeSize + 30),
        y: startY,
        width: nodeSize,
        height: nodeSize,
        fill: node.color,
        stroke: "#333",
        cornerRadius: 12,
        shadowBlur: 6,
      });
      this.tiles.push(tile);
      this.group.add(tile);

      const label = new Konva.Text({
        x: tile.x(),
        y: tile.y() + nodeSize / 2 - 10,
        width: nodeSize,
        text: node.label,
        fontSize: 13,
        fontStyle: "bold",
        fill: "#222",
        align: "center",
      });
      this.group.add(label);
    });
  }

  movePlayerToTile(index: number): void {
    return;
  }

  getGroup(): Konva.Group {
    return this.group;
  }

  show(): void {
    this.group.visible(true);
  }

  hide(): void {
    this.group.visible(false);
  }
}
