import Konva from "konva";
import type { View } from "../../types";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants";
import { MainGameScreenModel, NodeType } from "./MainGameScreenModel";
import { AudioController } from "../../audios/AudioController";

export class MainGameScreenView implements View {
    private group: Konva.Group;
    private tiles: Konva.Circle[] = [];
    private tileLabels: Konva.Text[] = [];
    private diceRollButton: Konva.Group;
    private settingsButton: Konva.Group;
    private nodeEventText: Konva.Text;
    private diceResultText: Konva.Text;
    private pieceImage!: Konva.Image;
    private model: MainGameScreenModel;
    private audio: AudioController;
    private boardHeadIndex = 39; // Start with the 40th tile (index 39) as the leftmost

    constructor(model: MainGameScreenModel, audio: AudioController) {
        this.model = model;
        this.audio = audio;
        const boardLength = 40;
        this.group = new Konva.Group({ visible: false });

        const background = new Konva.Rect({
        x: 0,
        y: 0,
        width: STAGE_WIDTH,
        height: STAGE_HEIGHT,
        fill: "#f5f5dc",
        });
        this.group.add(background);

        // const titleText = new Konva.Text({
        //     x: 0,
        //     y: 20,
        //     width: STAGE_WIDTH,
        //     text: "main game board",
        //     fontSize: 30,
        //     fontFamily: 'HomeScreenFont',
        //     fill: '#333',
        //     align: 'center'
        // });
        // this.group.add(titleText);

        // Score Text
        //const score = this.model.getPlayerScore(currentPlayerID);
        // this.scoreText = new Konva.Text({
        //     x: 20,
        //     y: 20,
        //     //text: `Score: ${score}`,
        //     fontSize: 24,
        //     fontStyle: 'bold',
        //     fill: '#333',
        // });
        //this.group.add(this.scoreText);


        const nodeSize = 100;
        const startX = STAGE_WIDTH / 2 - (nodeSize * 2 + 45);
        const startY = STAGE_HEIGHT / 2 - nodeSize / 2;

        // Create the initial 4 tiles based on the model
        for (let i = 0; i < 4; i++) {
            this.createTile((this.boardHeadIndex + i) % boardLength, startX, startY, nodeSize);
        }

        //piece image on top of second node
        Konva.Image.fromURL(`${import.meta.env.BASE_URL}mainboard/images/pieceImagePH.png`, (image) => {
            this.pieceImage = image;
            const secondTile = this.tiles[1]; // This is now the "Start" tile

            if (secondTile) {
                this.pieceImage.x(secondTile.x());
                this.pieceImage.y(secondTile.y() - 25); // Slightly above the tile center
                this.pieceImage.width(75);
                this.pieceImage.height(75);
                this.pieceImage.offsetX(37.5); // Center the image
                this.pieceImage.offsetY(37.5); // Center the image
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
            fontFamily: "homeScreenFont",
            fill: "white",
            width: 120,
            height: 50,
            align: "center",
            verticalAlign: "middle",
            listening: false, // Make the text ignore mouse events
        });

        this.diceRollButton.add(buttonRect, buttonText);
        this.group.add(this.diceRollButton);

        // Settings Button
        this.settingsButton = new Konva.Group({
            x: 30,
            y: STAGE_HEIGHT - 80,
        });

        const settingsButtonRect = new Konva.Rect({
            width: 120,
            height: 50,
            fill: "#808080", // Grey color
            cornerRadius: 10,
            shadowBlur: 5,
            name: 'settingsButtonRect'
        });

        const settingsButtonText = new Konva.Text({
            text: "Settings",
            fontSize: 18,
            fontFamily: "homeScreenFont",
            fill: "white",
            width: 120,
            height: 50,
            align: "center",
            verticalAlign: "middle",
            listening: false,
        });

        this.settingsButton.add(settingsButtonRect, settingsButtonText);
        this.group.add(this.settingsButton);

        // Dice Result Text
        this.diceResultText = new Konva.Text({
            x: STAGE_WIDTH / 2 - 50,
            y: 50,
            fontSize: 24,
            fontFamily: "homeScreenFont",
            fill: "#333",
            visible: false,
        });
        this.group.add(this.diceResultText);

        // Node Event Text
        this.nodeEventText = new Konva.Text({
            x: 0,
            y: 90, // Below the dice roll result
            width: STAGE_WIDTH,
            fontSize: 24,
            fontFamily: "homeScreenFont",
            fill: "#d63031", // A distinct color
            align: 'center',
            visible: false,
        });
        this.group.add(this.nodeEventText);
    }

    

    async animatePlayerPieceRoll(count: number): Promise<void> {
        for (let i = 0; i < count; i++) {
            await this.doSinglePieceAnimation();
            this.audio.play("piece_move_sfx", false);
        }
    }

    private doSinglePieceAnimation(): Promise<void> {
        return new Promise((resolve) => {
            const boardLength = 40;
            if (!this.pieceImage) {
                resolve();
                return;
            }
            const originalY = this.pieceImage.y();
            this.boardHeadIndex = (this.boardHeadIndex + 1) % boardLength;

            const nodeSize = 100;
            const startX = STAGE_WIDTH / 2 - (nodeSize * 2 + 45);
            const startY = STAGE_HEIGHT / 2 - nodeSize / 2;

            // Animate tiles and labels moving left
            //const nodeSize = 100;
            const distance = nodeSize + 30;
            const allTiles = this.group.find('.tile');
            const allLabels = this.group.find('.tile-label');
            
            allTiles.forEach(tile => {
                new Konva.Tween({ node: tile, x: tile.x() - distance, duration: 0.65, easing: Konva.Easings.EaseInOut }).play();
            });
            
            allLabels.forEach(label => {
                new Konva.Tween({ node: label, x: label.x() - distance, duration: 0.65, easing: Konva.Easings.EaseInOut }).play();
            });
            
            // Spawn the next tile
            setTimeout(() => {
                const nextTileIndex = (this.boardHeadIndex + 3) % boardLength;
                this.createTile(nextTileIndex, startX, startY, nodeSize);
            }, 400); // 0.5 second delay

            // Animate piece jumping
            const tweenUp = new Konva.Tween({
                node: this.pieceImage!,
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
                        node: this.pieceImage!,
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

    private createTile(boardIndex: number, startX: number, startY: number, nodeSize: number): void {
        const nodeType = this.model.getNodeType(boardIndex + 1); // getNodeType is 1-indexed
        const nodeInfo = this.getNodeInfo(nodeType);

        // Calculate position relative to the current visible tiles
        const displayIndex = (boardIndex - this.boardHeadIndex + 40) % 40;

        const tile = new Konva.Circle({
            x: startX + displayIndex * (nodeSize + 30) + nodeSize / 2,
            y: startY + nodeSize / 2,
            radius: nodeSize / 2,
            fill: nodeInfo.color,
            stroke: "#333",
            shadowBlur: 6,
        });
        tile.name('tile');
        this.tiles.push(tile);
        this.group.add(tile);

        const label = new Konva.Text({
            x: tile.x(),
            y: tile.y(),
            offsetX: nodeSize / 2,
            offsetY: nodeSize / 2,
            width: nodeSize,
            height: nodeSize,
            text: nodeInfo.label,
            fontSize: 13,
            fontFamily: "homeScreenFont",
            fill: "#222",
            align: "center",
            verticalAlign: "middle",
            name: 'tile-label'
        });
        this.tileLabels.push(label);
        this.group.add(label);

        // Ensure the piece image is always on top
        this.pieceImage?.moveToTop();
    }

    private getNodeInfo(nodeType: NodeType): { label: string; color: string } {
        switch (nodeType) {
            case NodeType.START:
                return { label: "Start", color: "#ffffff" };
            case NodeType.EASY_QUESTION:
                return { label: "Easy Q", color: "#55efc4" };
            case NodeType.MEDIUM_QUESTION:
                return { label: "Medium Q", color: "#ffeaa7" };
            case NodeType.HARD_QUESTION:
                return { label: "Hard Q", color: "#fab1a0" };
            case NodeType.MINIGAME:
                return { label: "Minigame", color: "#a29bfe" };
            default:
                return { label: "Unknown", color: "#dfe6e9" };
        }
    }


    movePlayerToTile(index: number): void {
        return;
    }

    getTiles(): Konva.Circle[] {
        return this.tiles;
    }

    getSettingsButton(): Konva.Group {
        return this.settingsButton;
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

    onSettingsOpen(callback: () => void): void {
        const settingsButtonRect = this.settingsButton.findOne('.settingsButtonRect');
        if (settingsButtonRect) {
            settingsButtonRect.on("click tap", () => {
                callback();
            });
        }
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
        const buttonRect = this.diceRollButton.findOne('.buttonRect') as Konva.Shape | undefined;
        if (buttonRect) {
            buttonRect.listening(false);
            buttonRect.fill('#b2bec3'); // A disabled grey color
            this.group.getLayer()?.batchDraw();
        }
    }

    enableRollButton(): void {
        const buttonRect = this.diceRollButton.findOne('.buttonRect') as Konva.Shape | undefined;
        if (buttonRect) {
            buttonRect.listening(true);
            buttonRect.fill('#ff7675'); // Original color
            this.group.getLayer()?.batchDraw();
        }
    }

    displayNodeEvent(message: string): void {
        this.nodeEventText.text(message);
        this.nodeEventText.moveToTop();
        this.nodeEventText.visible(true);

        this.group.getLayer()?.batchDraw();

        setTimeout(() => {
            this.nodeEventText.visible(false);
            this.group.getLayer()?.batchDraw();
        }, 3000); // Hide after 3 seconds
    }

    // updateScoreDisplay(newScore: number): void {
    //     this.scoreText.text(`Score: ${newScore}`);
    //     this.group.getLayer()?.batchDraw();
    // }
}
