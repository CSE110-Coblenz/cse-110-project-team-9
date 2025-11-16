import Konva from "konva";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../../../constants.ts";

interface MatchingPair {
    question: string;
    answer: string;
}

/**
 * PuzzleView - Matching/wiring style puzzle (like Among Us wiring task)
 * Questions on left, answers on right, draw lines to match
 */
export class PuzzleView {
    private parent: Konva.Group;
    private feedbackText: Konva.Text;
    private puzzleGroup: Konva.Group;
    private linesLayer: Konva.Group;
    private onSubmit: (matches: Map<number, number>) => void;
    
    private leftButtons: Konva.Group[] = [];
    private rightButtons: Konva.Group[] = [];
    private lines: Konva.Line[] = [];
    private matches = new Map<number, number>(); // left index -> right index (display positions)
    private shuffleMapping: number[] = []; // Maps shuffled right index back to original answer index
    
    private selectedLeft: number | null = null;
    private tempLine: Konva.Line | null = null;

    constructor(parent: Konva.Group, onSubmit: (matches: Map<number, number>) => void) {
        this.parent = parent;
        this.onSubmit = onSubmit;

        this.puzzleGroup = new Konva.Group({ visible: false });
        this.parent.add(this.puzzleGroup);

        this.linesLayer = new Konva.Group();
        this.puzzleGroup.add(this.linesLayer);

        this.feedbackText = new Konva.Text({
            x: STAGE_WIDTH / 2,
            y: STAGE_HEIGHT / 2,
            text: "",
            fontSize: 48,
            fontFamily: "Serif",
            fill: "white",
            align: "center",
            visible: false,
        });
        this.feedbackText.offsetX(this.feedbackText.width() / 2);
        this.parent.add(this.feedbackText);
        this.feedbackText.moveToTop();

        // Track mouse movement for temporary line drawing
        this.puzzleGroup.on("mousemove", (e) => this.handleMouseMove(e));
    }

    render(puzzle: { question: string; options: string[] }) {
        // Parse the puzzle data into matching pairs
        // Expected format: question contains pairs separated by " | "
        // e.g., "Match: Q1|A1, Q2|A2, Q3|A3"
        const pairs = this.parsePuzzleData(puzzle);
        
        this.reset();
        this.puzzleGroup.visible(true);
        
        // Move puzzle to top so it renders above obstacles
        this.puzzleGroup.moveToTop();
        this.feedbackText.moveToTop();
        
        // Shuffle answers and track the mapping
        const answersWithIndices = pairs.map((p, idx) => ({ answer: p.answer, originalIndex: idx }));
        answersWithIndices.sort(() => Math.random() - 0.5);
        
        const shuffledAnswers = answersWithIndices.map(a => a.answer);
        this.shuffleMapping = answersWithIndices.map(a => a.originalIndex);
        
        this.createMatchingInterface(pairs.map(p => p.question), shuffledAnswers);
        
        this.parent.getLayer()?.draw();
    }

    private parsePuzzleData(puzzle: { question: string; options: string[] }): MatchingPair[] {
        // For now, assume options array contains pairs in format "question:answer"
        // Or we use the question as a title and options are "Q:A" format
        const pairs: MatchingPair[] = [];
        
        // If options contain ":" we parse them as question:answer
        if (puzzle.options.length > 0 && puzzle.options[0].includes(":")) {
            puzzle.options.forEach(opt => {
                const [q, a] = opt.split(":");
                pairs.push({ question: q.trim(), answer: a.trim() });
            });
        } else {
            // Fallback: create simple pairs from options
            // This maintains backwards compatibility
            puzzle.options.forEach((opt, idx) => {
                pairs.push({ 
                    question: `Q${idx + 1}`, 
                    answer: String(opt) 
                });
            });
        }
        
        return pairs;
    }

    private createMatchingInterface(questions: string[], answers: string[]) {
        const leftX = 150;
        const rightX = STAGE_WIDTH - 250;
        const startY = 150;
        const spacing = 80;
        
        // Title
        const titleText = new Konva.Text({
            x: STAGE_WIDTH / 2,
            y: 80,
            text: "Match the pairs",
            fontSize: 32,
            fontFamily: "Serif",
            fill: "white",
            align: "center",
        });
        titleText.offsetX(titleText.width() / 2);
        this.puzzleGroup.add(titleText);

        // Create left buttons (questions)
        questions.forEach((q, idx) => {
            const btn = this.createButton(leftX, startY + idx * spacing, q, "left", idx);
            this.leftButtons.push(btn);
            this.puzzleGroup.add(btn);
        });

        // Create right buttons (answers)
        answers.forEach((a, idx) => {
            const btn = this.createButton(rightX, startY + idx * spacing, a, "right", idx);
            this.rightButtons.push(btn);
            this.puzzleGroup.add(btn);
        });

        // Submit button
        const submitBtn = new Konva.Group();
        const submitRect = new Konva.Rect({
            x: STAGE_WIDTH / 2 - 75,
            y: STAGE_HEIGHT - 100,
            width: 150,
            height: 50,
            fill: "green",
            stroke: "white",
            strokeWidth: 2,
            cornerRadius: 10,
        });
        const submitLabel = new Konva.Text({
            x: STAGE_WIDTH / 2,
            y: STAGE_HEIGHT - 88,
            text: "Submit",
            fontSize: 24,
            fontFamily: "Serif",
            fill: "white",
            align: "center",
        });
        submitLabel.offsetX(submitLabel.width() / 2);
        submitBtn.add(submitRect, submitLabel);
        submitBtn.on("click", () => this.handleSubmit());
        this.puzzleGroup.add(submitBtn);
    }

    private createButton(x: number, y: number, text: string, side: "left" | "right", index: number): Konva.Group {
        const group = new Konva.Group();
        
        const circle = new Konva.Circle({
            x: side === "left" ? x + 180 : x + 20,
            y: y + 20,
            radius: 8,
            fill: "yellow",
            stroke: "orange",
            strokeWidth: 2,
        });

        const rect = new Konva.Rect({
            x: x,
            y: y,
            width: 200,
            height: 40,
            fill: "rgba(0, 0, 0, 0.7)",
            stroke: "purple",
            strokeWidth: 2,
            cornerRadius: 5,
        });

        const label = new Konva.Text({
            x: x + 10,
            y: y + 10,
            text: text,
            fontSize: 16,
            fontFamily: "Serif",
            fill: "white",
            width: 180,
            align: side === "left" ? "left" : "right",
        });

        group.add(rect, label, circle);
        
        // Click handler for connection points
        circle.on("click", () => {
            if (side === "left") {
                this.handleLeftClick(index);
            } else {
                this.handleRightClick(index);
            }
        });

        // Hover effects
        circle.on("mouseenter", () => {
            circle.fill("white");
            circle.radius(10);
            this.parent.getLayer()?.draw();
        });
        circle.on("mouseleave", () => {
            circle.fill("yellow");
            circle.radius(8);
            this.parent.getLayer()?.draw();
        });

        return group;
    }

    private handleLeftClick(index: number) {
        if (this.selectedLeft === index) {
            // Deselect
            this.selectedLeft = null;
            if (this.tempLine) {
                this.tempLine.destroy();
                this.tempLine = null;
            }
        } else {
            // Remove existing connection from this left button
            if (this.matches.has(index)) {
                const rightIdx = this.matches.get(index)!;
                this.matches.delete(index);
                this.redrawLines();
            }
            
            this.selectedLeft = index;
            // Create temporary line
            const pos = this.getConnectionPoint("left", index);
            this.tempLine = new Konva.Line({
                points: [pos.x, pos.y, pos.x, pos.y],
                stroke: "white",
                strokeWidth: 3,
                opacity: 0.5,
                lineCap: "round",
            });
            this.linesLayer.add(this.tempLine);
        }
        this.parent.getLayer()?.draw();
    }

    private handleRightClick(index: number) {
        if (this.selectedLeft !== null) {
            // Create connection
            this.matches.set(this.selectedLeft, index);
            
            // Clear temp line
            if (this.tempLine) {
                this.tempLine.destroy();
                this.tempLine = null;
            }
            
            this.selectedLeft = null;
            this.redrawLines();
        } else {
            // Check if this right button is already connected and remove that connection
            for (const [leftIdx, rightIdx] of this.matches.entries()) {
                if (rightIdx === index) {
                    this.matches.delete(leftIdx);
                    this.redrawLines();
                    break;
                }
            }
        }
        this.parent.getLayer()?.draw();
    }

    private handleMouseMove(e: Konva.KonvaEventObject<MouseEvent>) {
        if (this.tempLine && this.selectedLeft !== null) {
            const pos = this.puzzleGroup.getRelativePointerPosition();
            if (pos) {
                const startPos = this.getConnectionPoint("left", this.selectedLeft);
                this.tempLine.points([startPos.x, startPos.y, pos.x, pos.y]);
                this.parent.getLayer()?.draw();
            }
        }
    }

    private getConnectionPoint(side: "left" | "right", index: number): { x: number; y: number } {
        const leftX = 150;
        const rightX = STAGE_WIDTH - 250;
        const startY = 150;
        const spacing = 80;
        
        if (side === "left") {
            return { x: leftX + 188, y: startY + index * spacing + 20 };
        } else {
            return { x: rightX + 12, y: startY + index * spacing + 20 };
        }
    }

    private redrawLines() {
        // Clear all existing lines
        this.lines.forEach(line => line.destroy());
        this.lines = [];

        // Draw lines for all matches
        for (const [leftIdx, rightIdx] of this.matches.entries()) {
            const start = this.getConnectionPoint("left", leftIdx);
            const end = this.getConnectionPoint("right", rightIdx);
            
            const line = new Konva.Line({
                points: [start.x, start.y, end.x, end.y],
                stroke: "cyan",
                strokeWidth: 3,
                lineCap: "round",
            });
            
            this.linesLayer.add(line);
            this.lines.push(line);
        }
        
        this.parent.getLayer()?.draw();
    }

    private handleSubmit() {
        // Convert display positions to original answer indices before validation
        const originalMatches = new Map<number, number>();
        for (const [leftIdx, rightDisplayIdx] of this.matches.entries()) {
            const originalRightIdx = this.shuffleMapping[rightDisplayIdx];
            originalMatches.set(leftIdx, originalRightIdx);
        }
        
        // Pass the matches with original indices to the controller for validation
        this.onSubmit(originalMatches);
    }

    hide(feedback: string) {
        // Hide puzzle interface
        this.puzzleGroup.visible(false);

        // Show feedback
        this.feedbackText.text(feedback);
        this.feedbackText.offsetX(this.feedbackText.width() / 2);
        this.feedbackText.moveToTop();
        this.feedbackText.visible(true);

        this.parent.getLayer()?.draw();

        // Auto-hide feedback after 1.5 seconds
        setTimeout(() => {
            this.feedbackText.visible(false);
            this.reset();
            this.parent.getLayer()?.draw();
        }, 1500);
    }

    reset() {
        this.leftButtons.forEach(btn => btn.destroy());
        this.rightButtons.forEach(btn => btn.destroy());
        this.lines.forEach(line => line.destroy());
        if (this.tempLine) this.tempLine.destroy();
        
        this.puzzleGroup.removeChildren();
        this.linesLayer = new Konva.Group();
        this.puzzleGroup.add(this.linesLayer);
        
        this.leftButtons = [];
        this.rightButtons = [];
        this.lines = [];
        this.matches.clear();
        this.shuffleMapping = [];
        this.selectedLeft = null;
        this.tempLine = null;
        
        this.feedbackText.text("");
        this.feedbackText.visible(false);
        this.parent.getLayer()?.draw();
    }
}