import Konva from "konva";
import type { View } from "../../types";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants";

export class MainGameScreenView implements View {
    private group: Konva.Group;
    private tiles: Konva.Circle[] = [];
    private tileLabels: Konva.Text[] = [];
    private diceRollButton: Konva.Group;
    private diceResultText: Konva.Text;
    private pieceImage: Konva.Image;

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
        const tile = new Konva.Circle({
            x: startX + i * (nodeSize + 30) + nodeSize / 2,
            y: startY + nodeSize / 2,
            radius: nodeSize / 2,
            fill: node.color,
            stroke: "#333",
            shadowBlur: 6,
        });
        tile.name('tile'); // Name the tiles for easy selection
        this.tiles.push(tile);
        this.group.add(tile);

        const label = new Konva.Text({
            x: tile.x(),
            y: tile.y() - 10,
            offsetX: nodeSize / 2,
            text: node.label,
            fontSize: 13,
            fontStyle: "bold",
            fill: "#222",
            align: "center",
            name: 'tile-label' // Name the labels for easy selection
        });
        this.tileLabels.push(label);
        this.group.add(label);
        });

        //piece image on top of second node
        Konva.Image.fromURL('mainboard/images/pieceImagePH.png', (image) => {
            this.pieceImage = image;
            const secondTile = this.tiles[1]; // The "Among Us Minigame" tile

            if (secondTile) {
                this.pieceImage.setAttrs({
                    x: secondTile.x(),
                    y: secondTile.y() - 25, // Slightly above the tile center
                    width: 75,
                    height: 75,
                    offsetX: 37.5, // Center the image
                    offsetY: 37.5, // Center the image
                });
                this.group.add(this.pieceImage);
                this.group.getLayer()?.batchDraw();
            }
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

    async animatePlayerPieceRoll(count: number): Promise<void> {
        for (let i = 0; i < count; i++) {
            await this.doSinglePieceAnimation();
        }
    }

    private doSinglePieceAnimation(): Promise<void> {
        return new Promise((resolve) => {
            if (!this.pieceImage) {
                resolve();
                return;
            }
            const originalY = this.pieceImage.y();

            // Animate tiles and labels moving left
            const nodeSize = 100;
            const distance = nodeSize + 30;
            const allTiles = this.group.find('.tile');
            const allLabels = this.group.find('.tile-label');
            
            allTiles.forEach(tile => {
                new Konva.Tween({ node: tile, x: tile.x() - distance, duration: 0.65, easing: Konva.Easings.EaseInOut }).play();
            });
            
            allLabels.forEach(label => {
                new Konva.Tween({ node: label, x: label.x() - distance, duration: 0.65, easing: Konva.Easings.EaseInOut }).play();
            });
            
            // Animate piece jumping
            const tweenUp = new Konva.Tween({
                node: this.pieceImage,
                y: originalY - 75,
                duration: 0.15,
                easing: Konva.Easings.EaseOut,
                onFinish: () => {
                    // After one animation step, the first tile is now two positions behind the player.
                    // We can remove it.
                    if (this.tiles.length > 0) {
                        const tileToRemove = this.tiles.shift(); // Remove from front of array
                        tileToRemove?.destroy(); // Remove from canvas
                    }
                    if (this.tileLabels.length > 0) {
                        const labelToRemove = this.tileLabels.shift(); // Remove from front of array
                        labelToRemove?.destroy(); // Remove from canvas
                    }

                    const tweenDown = new Konva.Tween({
                        node: this.pieceImage,
                        y: originalY,
                        duration: 0.5,
                        easing: Konva.Easings.EaseIn,
                        onFinish: resolve,
                    });
                    tweenDown.play();
                },
            });
            tweenUp.play();
        });
    }

    movePlayerToTile(index: number): void {
        return;
    }

    getTiles(): Konva.Circle[] {
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
    disableRollButton(): void {
        const buttonRect = this.diceRollButton.findOne('.buttonRect');
        if (buttonRect) {
            buttonRect.listening(false);
            buttonRect.fill('#b2bec3'); // A disabled grey color
            this.group.getLayer()?.batchDraw();
        }
    }

    enableRollButton(): void {
        const buttonRect = this.diceRollButton.findOne('.buttonRect');
        if (buttonRect) {
            buttonRect.listening(true);
            buttonRect.fill('#ff7675'); // Original color
            this.group.getLayer()?.batchDraw();
        }
    }
}
