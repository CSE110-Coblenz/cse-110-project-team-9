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
    private minigameSelectorGroup!: Konva.Group;
    private minigameWheel!: Konva.Group;
    private audio: AudioController;
    private bg1!: Konva.Image;
    private bg2!: Konva.Image;
    private scaledBgWidth!: number;
    private boardHeadIndex = 39; // Start with the 40th tile (index 39) as the leftmost
    private endScreenGroup: Konva.Group;

    constructor(model: MainGameScreenModel, audio: AudioController) {
        this.model = model;
        this.audio = audio;
        const boardLength = 40;
        this.group = new Konva.Group({ visible: false });

        // Background image
        Konva.Image.fromURL(`${import.meta.env.BASE_URL}mainboard/images/forestRoad.png`, (imageNode: Konva.Image) => {
            const imageObj = imageNode.image(); // Call the method to get the HTMLImageElement
            // Type guard to ensure we have an HTMLImageElement with width and height
            if (!(imageObj instanceof HTMLImageElement)) {
                console.error("Background image is not an HTMLImageElement", imageObj);
                return;
            }

            const bgWidth = imageObj.width;
            const bgHeight = imageObj.height;

            this.scaledBgWidth = STAGE_WIDTH;

            this.bg1 = new Konva.Image({
                image: imageObj,
                x: 0,
                y: 0,
                width: STAGE_WIDTH,
                height: STAGE_HEIGHT,
            });
            this.group.add(this.bg1);
            this.bg1.moveToBottom();

            this.bg2 = new Konva.Image({
                image: imageObj,
                x: STAGE_WIDTH,
                y: 0,
                width: STAGE_WIDTH,
                height: STAGE_HEIGHT,
            });
            this.group.add(this.bg2);
            this.bg2.moveToBottom();
        });


        const nodeSize = 100;
        const startX = STAGE_WIDTH / 2 - (nodeSize * 2 + 45);
        const startY = STAGE_HEIGHT / 2 - nodeSize / 2;

        // Create the initial 4 tiles based on the model
        for (let i = 0; i < 4; i++) {
            this.createTile((this.boardHeadIndex + i) % boardLength, startX, startY, nodeSize);
        }

        //piece image on top of second node
        Konva.Image.fromURL(`${import.meta.env.BASE_URL}mainboard/images/WizardDuck.png`, (image) => {
            this.pieceImage = image;
            const secondTile = this.tiles[1]; // This is now the "Start" tile

            if (secondTile) {
                this.pieceImage.x(secondTile.x());
                this.pieceImage.y(secondTile.y() - 25); // Slightly above the tile center
                this.pieceImage.width(100);
                this.pieceImage.height(100)
                this.pieceImage.offsetX(37.5); // Center the image
                this.pieceImage.offsetY(37.5); // Center the image
                this.group.add(this.pieceImage);
                this.group.getLayer()?.batchDraw();
            }
        });

        // Dice Roll Button
        this.diceRollButton = new Konva.Group({
            x: STAGE_WIDTH - 220,
            y: STAGE_HEIGHT - 110,
        });

        // Add a background rect to define the clickable area of the group
        const diceBg = new Konva.Rect({
            width: 200,
            height: 100,
        });

        const buttonText = new Konva.Text({
            text: "Roll Dice",
            fontSize: 18,
            fontFamily: "homeScreenFont",
            fill: "black",
            width: 200,
            height: 100,
            align: "center",
            verticalAlign: "middle",
            listening: false, // Make the text ignore mouse events
        });

        Konva.Image.fromURL(`${import.meta.env.BASE_URL}mainboard/images/OpenBanner.png`, (buttonImage: Konva.Image) => {

            buttonImage.width(200);
            buttonImage.height(100);
            buttonImage.name('buttonRect');
            
            this.diceRollButton.add(buttonImage);
            buttonImage.moveToBottom();
            this.group.getLayer()?.batchDraw();
        });
        this.diceRollButton.add(diceBg);
        this.diceRollButton.add(buttonText);
        this.group.add(this.diceRollButton);

        // Settings Button
        this.settingsButton = new Konva.Group({
            x: 20,
            y: STAGE_HEIGHT - 110,
        });

        // Add a background rect to define the clickable area of the group
        const settingsBg = new Konva.Rect({
            width: 200,
            height: 100,
            // fill: 'red', // uncomment for debugging hit area
            // opacity: 0.5,
        });

        const settingsButtonText = new Konva.Text({
            text: "Settings",
            fontSize: 18,
            fontFamily: "homeScreenFont",
            fill: "black",
            width: 200,
            height: 100,
            align: "center",
            verticalAlign: "middle",
            listening: false,
        });


        Konva.Image.fromURL(`${import.meta.env.BASE_URL}mainboard/images/OpenBanner.png`, (settingsButtonImage: Konva.Image) => {
            settingsButtonImage.width(200);
            settingsButtonImage.height(100);
            settingsButtonImage.name('settingsButtonRect');
            this.settingsButton.add(settingsButtonImage);
            settingsButtonImage.moveToBottom();
            this.group.getLayer()?.batchDraw();
        });
        this.settingsButton.add(settingsBg);
        this.settingsButton.add(settingsButtonText);
        this.group.add(this.settingsButton);

        // Dice Result Text
        this.diceResultText = new Konva.Text({
            x: STAGE_WIDTH / 2 - 50,
            y: 50,
            fontSize: 24,
            fontFamily: "homeScreenFont",
            fill: "#ffffff",
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
            fill: "#ffffff", // A distinct color
            align: 'center',
            visible: false,
        });
        this.group.add(this.nodeEventText);

        this.createMinigameWheel();

        // Create End Screen Group (initially hidden)
        this.endScreenGroup = new Konva.Group({
            visible: false,
        });

        const endBackground = new Konva.Rect({
            x: 0,
            y: 0,
            width: STAGE_WIDTH,
            height: STAGE_HEIGHT,
            fill: 'black',
        });

        const endText = new Konva.Text({
            text: 'Completed!',
            fontSize: 60,
            fontFamily: 'homeScreenFont',
            fill: 'white',
            width: STAGE_WIDTH,
            align: 'center',
            y: STAGE_HEIGHT / 2 - 30,
        });

        this.endScreenGroup.add(endBackground, endText);
        this.group.add(this.endScreenGroup);
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
            
            // Animate background
            [this.bg1, this.bg2].forEach(bg => {
                new Konva.Tween({
                    node: bg,
                    x: bg.x() - distance,
                    duration: 0.65,
                    easing: Konva.Easings.EaseInOut,
                    onFinish: () => {
                        // If a bg image completely leaves the screen to the left,
                        // move it to the right of the other one.
                        if (bg.x() <= -this.scaledBgWidth) {
                            bg.x(bg.x() + this.scaledBgWidth * 2);
                        }
                    }
                }).play();
            });


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

    private createMinigameWheel(): void {
        this.minigameSelectorGroup = new Konva.Group({
            x: STAGE_WIDTH / 2,
            y: STAGE_HEIGHT / 2,
            visible: false,
        });

        this.minigameWheel = new Konva.Group({
            // Positioned at the center of the parent group
            x: 0,
            y: 0,
        });


        const shieldSize = 300;
        const shieldRadius = shieldSize / 2;

        // The inner radius for the colors to fit inside the shield's border
        const colorRadius = shieldRadius * 0.85; 

        Konva.Image.fromURL(`${import.meta.env.BASE_URL}mainboard/images/shield.png`, (shieldImage: Konva.Image) => {
            shieldImage.width(shieldSize);
            shieldImage.height(shieldSize);
            shieldImage.offsetX(shieldRadius);
            shieldImage.offsetY(shieldRadius);
            this.minigameWheel.add(shieldImage);
            shieldImage.moveToBottom();
            this.group.getLayer()?.batchDraw();
        });

        // Red half
        const redHalf = new Konva.Arc({
            innerRadius: 0,
            outerRadius: colorRadius,
            angle: 180,
            rotation: -90,
            fill: '#ff7675', // Red
            opacity: 0.25,
        });

        // Blue half
        const blueHalf = new Konva.Arc({
            innerRadius: 0,
            outerRadius: colorRadius,
            angle: 180,
            rotation: 90,
            fill: '#74b9ff', // Blue
            opacity: 0.25,
        });

        const pointer = new Konva.Line({
            points: [shieldRadius + 30, -15, shieldRadius + 5, 0, shieldRadius + 30, 15],
            fill: '#333',
            closed: true,
        });

        // Text for Red half
        const amongUsText = new Konva.Text({
            text: "Among Us",
            fontSize: 24,
            fontFamily: "homeScreenFont",
            fontStyle: "bold",
            fill: "white",
            x: shieldRadius * 0.5,
            y: 0,
            listening: false,
        });
        amongUsText.offsetX(amongUsText.width() / 2);
        amongUsText.offsetY(amongUsText.height() / 2);

        // Text for Blue half
        const wizardText = new Konva.Text({
            text: "Wizard",
            fontSize: 24,
            fontFamily: "homeScreenFont",
            fontStyle: "bold",
            fill: "white",
            x: -shieldRadius * 0.5,
            y: 0,
            listening: false,
            rotation: 180,
        });
        wizardText.offsetX(wizardText.width() / 2);
        wizardText.offsetY(wizardText.height() / 2);


        this.minigameWheel.add(redHalf, blueHalf, amongUsText, wizardText);
        this.minigameSelectorGroup.add(this.minigameWheel, pointer);
        this.group.add(this.minigameSelectorGroup);
    }

    public spinMinigameWheel(): Promise<number> {
        return new Promise((resolve) => {
            this.minigameSelectorGroup.visible(true);
            this.minigameSelectorGroup.moveToTop();
            this.minigameWheel.rotation(0);
            this.group.getLayer()?.batchDraw();

            const spinDuration = 4; // seconds
            const minRotations = 5;
            const result = Math.random(); // 0 to < 1
            const choice = result < 0.5 ? 1 : 2; // 1 for red, 2 for blue

            // Land in the middle of the chosen color slice
            // Red is from 270 to 90 degrees. Blue is from 90 to 270.
            // We want to avoid landing exactly on the line.
            const redLandingZone = 315; // Middle of red
            const blueLandingZone = 135; // Middle of blue
            const finalRotation = choice === 1 ? redLandingZone : blueLandingZone;

            const totalRotation = 360 * minRotations + finalRotation;

            const tween = new Konva.Tween({
                node: this.minigameWheel,
                rotation: totalRotation,
                duration: spinDuration,
                easing: Konva.Easings.EaseOut,
                onFinish: () => {
                    setTimeout(() => {
                        this.minigameSelectorGroup.visible(false);
                        resolve(choice);
                    }, 1500); // Wait a bit before hiding
                },
            });
            tween.play();
        });
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
            case NodeType.END:
                return { label: "End", color: "#dfe6e9" };
        }
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
        // Attach listener to the group itself, which now has a background shape to capture events.
        this.settingsButton.on("click tap", () => {
            callback();
        });
    }

    onPlayerRoll(callback: () => void): void {
        this.diceRollButton.on("click tap", () => {
            callback();
        });
    }

    displayRollResult(result: number): void {
        this.diceResultText.text(`Rolled a ${result}!`);
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
        this.diceRollButton.listening(false);
        this.diceRollButton.opacity(0.5);
        this.group.getLayer()?.batchDraw();
    }

    enableRollButton(): void {
        this.diceRollButton.listening(true);
        this.diceRollButton.opacity(1);
        this.group.getLayer()?.batchDraw();
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

    displayEnd(onDisplay?: () => void): void {
        // Hide all other children of the main group
        this.group.children.forEach(child => {
            if (child !== this.endScreenGroup) {
                child.hide();
            }
        });
        this.endScreenGroup.show();
        this.group.getLayer()?.batchDraw();

        // Execute the callback if provided
        onDisplay?.();
    }
}