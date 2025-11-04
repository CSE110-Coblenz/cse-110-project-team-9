import Konva from "konva";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants";

export class MathScreenView {
  private group: Konva.Group;
  private questionCard: Konva.Rect;
  private questionText: Konva.Text;
  private directionsText: Konva.Text;
  private feedbackText: Konva.Text;

  private answerRect: Konva.Rect;
  private answerText: Konva.Text;

  private checkButtonRect: Konva.Rect;
  private checkButtonText: Konva.Text;

  // Stores the current input from the user as a string
  private currentInput = "";
  private isTyping = false;
  private onCheckCallback: ((answer: string) => void) | null = null;

  constructor() {
    this.group = new Konva.Group({ visible: true });

    //Set's the background image as the stage size
    Konva.Image.fromURL("/backgroundCastle.png", (img) => {
      img.setAttrs({
        x: 0,
        y: 0,
        width: STAGE_WIDTH,
        height: STAGE_HEIGHT,
        listening: false,
      });
      this.group.add(img);
      img.moveToBottom();
    });

    /*
    * A background card for the question text
    * This card will contain the question and any relevant instructions
    */
    const cardWidth = 600;
    const cardHeight = 180;
    const cardX = 100;
    const cardY = 100;

    this.questionCard = new Konva.Rect({
      x: cardX,
      y: cardY,
      width: cardWidth,
      height: cardHeight,
      fill: "rgba(31, 104, 214, 0.7)", 
      stroke: "black",
      strokeWidth: 2,
      cornerRadius: 10,
    });
    this.group.add(this.questionCard);

    this.questionText = new Konva.Text({
      x: cardX + 20,
      y: cardY + 25,
      width: cardWidth - 40,
      text: "Loading question...",
      fontSize: 30,
      fontFamily: "Arial",
      fill: "white",
      align: "center",
    });
    this.group.add(this.questionText);

    this.directionsText = new Konva.Text({
      x: cardX + 20,
      y: cardY + 75,
      width: cardWidth - 40,
      text: "",
      fontSize: 18,
      fontFamily: "Arial",
      fill: "white",
      align: "center",
    });
    this.group.add(this.directionsText);

    this.feedbackText = new Konva.Text({
      x: cardX,
      y: cardY + cardHeight + 20,
      width: cardWidth,
      text: "",
      fontSize: 20,
      fontFamily: "Arial",
      fill: "white",
      align: "center",
    });
    this.group.add(this.feedbackText);

    // Answer box that will act like an input field
    const answerBoxWidth = 350;
    const answerBoxHeight = 40;
    const answerBoxX = 150;
    const answerBoxY = 350;

    this.answerRect = new Konva.Rect({
      x: answerBoxX,
      y: answerBoxY,
      width: answerBoxWidth,
      height: answerBoxHeight,
      fill: "rgba(31, 104, 214, 0.7)", 
      stroke: "black",
      strokeWidth: 2,
      cornerRadius: 10,
    });
    this.group.add(this.answerRect);


    //Displays the user's text input inside the answer box
    this.answerText = new Konva.Text({
      x: answerBoxX + 10,
      y: answerBoxY + 8,
      width: answerBoxWidth - 20,
      text: "",
      fontSize: 20,
      fontFamily: "Arial",
      fill: "white",
      align: "left",
    });
    this.group.add(this.answerText);

    // Click events to activate typing
    this.answerRect.on("click", () => this.activateTyping());
    this.answerText.on("click", () => this.activateTyping());

    //Submit button next to answer box to check the answer
    const buttonWidth = 110;
    const buttonHeight = 40;
    const buttonX = answerBoxX + answerBoxWidth + 20;
    const buttonY = answerBoxY;

    this.checkButtonRect = new Konva.Rect({
      x: buttonX,
      y: buttonY,
      width: buttonWidth,
      height: buttonHeight,
      fill: "rgba(31, 104, 214, 0.7)", 
      stroke: "black",
      strokeWidth: 2,
      cornerRadius: 10,
    });
    this.group.add(this.checkButtonRect);

    this.checkButtonText = new Konva.Text({
      x: buttonX,
      y: buttonY + 10,
      width: buttonWidth,
      text: "Check Answer",
      fontSize: 15,
      fontFamily: "Arial",
      fill: "white",
      align: "center",
    });
    this.group.add(this.checkButtonText);

    // Click events for check
    this.checkButtonRect.on("click", () => this.handleCheck());
    this.checkButtonText.on("click", () => this.handleCheck());

    // Keyboard functionality
    window.addEventListener("keydown", (e) => this.handleKey(e));
  }

  // Public Methods
  showEquation(equation: string) {
    this.questionText.text(equation);
    this.feedbackText.text("");
    this.updateLayer();
  }

  showEnterFactored() {
    this.directionsText.text("Type the factored form, e.g. (x-2)(x-5), then press Check.");
    this.updateLayer();
  }

  showEnterSolutions() {
    this.directionsText.text("Now enter the solution(s), e.g. 2, 5 and press Check solution.");
    this.updateLayer();
  }

  /*
  Feedback method to show if the user's answer was correct or incorrect
  To be implemented 
  */

  clearAnswer() {
    this.currentInput = "";
    this.answerText.text("");
    this.answerRect.stroke("black");
    this.updateLayer();
  }

  //Private Methods

  /*
  Method Name: activateTyping
  Description: Activates typing mode when the answer box is clicked.
  Parameters: None
  Returns: void
  */
  private activateTyping() {
    this.isTyping = true;
    this.answerRect.stroke("white");
    this.updateLayer();
  }


  private handleCheck() {
    if (this.onCheckCallback) {
      this.onCheckCallback(this.currentInput.trim());
    }
  }

  // Method Name: updateLayer
  private updateLayer() {
    const layer = this.group.getLayer();
    if (layer) layer.batchDraw();
  }

  //Displays the screen
   /**
	 * Show the screen
	 */
	show(): void {
		this.group.visible(true);
		this.group.getLayer()?.draw();
	}

	/**
	 * Hide the screen
	 */
	hide(): void {
		this.group.visible(false);
		this.group.getLayer()?.draw();
	}

	getGroup(): Konva.Group {
		return this.group;
	}
}
