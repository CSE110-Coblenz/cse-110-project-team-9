import Konva from "konva";
import type { View } from "../../types";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants";

export class MainGameScreenView implements View {
    private group: Konva.Group;
    private tiles: Konva.Rect[] = [];
    private diceRollButton: Konva.Group;
    private diceResultText: Konva.Text;

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

        const titleText = new Konva.Text({
            x: 0,
            y: 20,
            width: STAGE_WIDTH,
            text: "main game board",
            fontSize: 30,
            fontStyle: 'bold',
            fill: '#333',
            align: 'center'
        });
        this.group.add(titleText);

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

        // Dice Roll Button
        this.diceRollButton = new Konva.Group({
            x: STAGE_WIDTH - 150,
            y: STAGE_HEIGHT - 80,
        });

        const buttonRect = new Konva.Rect({
            width: 120,
            height: 50,
            fill: "#ff7675",
            cornerRadius: 10,
            shadowBlur: 5,
            name: 'buttonRect' // Give it a name to find it easily
        });

        const buttonText = new Konva.Text({
            text: "Roll Dice",
            fontSize: 18,
            fontStyle: "bold",
            fill: "white",
            width: 120,
            height: 50,
            align: "center",
            verticalAlign: "middle",
            listening: false, // Make the text ignore mouse events
        });

        this.diceRollButton.add(buttonRect, buttonText);
        this.group.add(this.diceRollButton);

        // Dice Result Text
        this.diceResultText = new Konva.Text({
            x: STAGE_WIDTH / 2 - 50,
            y: 50,
            fontSize: 24,
            fontStyle: "bold",
            fill: "#333",
            visible: false,
        });
        this.group.add(this.diceResultText);
    }

    movePlayerToTile(index: number): void {
        return;
    }

    getTiles(): Konva.Rect[] {
        return this.tiles;
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

    onPlayerRoll(callback: () => void): void {
        // The event listener must be on a shape with a visible area (the rectangle),
        // not the group itself, which is just an invisible container.
        const buttonRect = this.diceRollButton.findOne('.buttonRect');
        if (buttonRect) {
            buttonRect.on("click tap", () => {
				callback();
            });
        }
    }

    displayRollResult(result: number): void {
        this.diceResultText.text(`You rolled a ${result}!`);
        // Explicitly move the text to the top of the drawing order within its group.
        this.diceResultText.moveToTop();
        this.diceResultText.visible(true);

        // We must redraw the layer to show the change in visibility.
        this.group.getLayer()?.batchDraw();

        setTimeout(() => {
            this.diceResultText.visible(false);
            // We also need to redraw after hiding it.
            this.group.getLayer()?.batchDraw();
        }, 3000); // Hide the text after 3 seconds
    }
}
