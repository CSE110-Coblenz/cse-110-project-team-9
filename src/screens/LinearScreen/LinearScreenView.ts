import Konva from "konva";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants";
import type { View } from "../../types";


export class LinearScreenView implements View{
	private group: Konva.Group;
	private slope = "";
	private intercept = "";
	private current = this.slope;
	private current_marker = 0;
	private slopeText: Konva.Text;
	private intText: Konva.Text;
	private currentText: Konva.Text;
	private slope_answer: Konva.Rect;
	private int_answer: Konva.Rect;
	private onSubmit?: () => void;
	private m: number;
	private b: number;
	private keyHandler = (e: KeyboardEvent) => this.type(e);

	constructor() {
		//create group
		const group = new Konva.Group({visible: false});

		//----------------Creating Graph-----------------------------------------------
		let ax_len = (200);
		let width = STAGE_WIDTH / 2 - ax_len / 2;
		let height = STAGE_HEIGHT / 2 + ax_len / 2 - 80;
		
		this.m = Math.floor((Math.random() * (5 - (-5))) + -5 )   ;  //maximum possible slope is 5, minimum is 0. Will add functionality for negative slopes.
		this.b = Math.floor((Math.random() * (5 - (0))) + 0 )   ;
		let num_ticks = 10;
		let second_point_x = ( (num_ticks - this.b) / this.m )
       
        //Create Line
		let ln = new Konva.Line({});
			if (this.m >= 0) {
				ln = new Konva.Line({
				points: [width , height-(this.b * (ax_len / num_ticks)), width + (second_point_x * (ax_len / num_ticks)) , height - ( (this.m*second_point_x+this.b) * (ax_len / num_ticks) )],  //placeholder line, this will change. Is represented as [x1,y1,x2,y2...]
				//Points on linear graph are (0,y_intercept) and (second_point_x, m(second_point_x)+b)
				//
				stroke: 'red',
				strokeWidth: 3,
				name: 'equationLine'
			});
			}else{
				this.b = Math.floor((Math.random() * (10 - (5))) + 5 ); //altering problem so that line is visible
				ln = new Konva.Line({
				points: [width, height-(this.b*(ax_len / num_ticks)), width+((this.b/-this.m)*(ax_len / num_ticks)  ), height],
				stroke: 'red',
				strokeWidth: 3,
				name: 'equationLine'
			});
		}

		const line = ln;

		//Create Axes
		const x_axis = new Konva.Line({
			points: [width, height, width + ax_len, height],
			stroke: 'black',
			strokeWidth: 3
		});

		const y_axis = new Konva.Line({
			points: [width, height, width, height - ax_len],
			stroke: 'black',
			strokeWidth: 3
		});

		group.add(line);
		group.add(x_axis);
		group.add(y_axis);

	    //Axis Label X
        for (let i=1; i<=num_ticks; i++){
				group.add(new Konva.Line({
				points: [width + i * (ax_len / num_ticks), height, width + i * (ax_len / num_ticks), height - ax_len],
				stroke: 'black',
				strokeWidth: 1
			}));
		}

	    //Axis Label Y
        for (let i=1; i<=num_ticks; i++){
				group.add(new Konva.Line({
				points: [width, height - i * (ax_len / num_ticks)   , width + ax_len ,  height - i * (ax_len / num_ticks)      ],
				stroke: 'black',
				strokeWidth: 1
			}));
		}
		
	  //--------------------------Creating Answer Boxes----------------
		let text_width = 90;
		let text_height = 30;
		let spacing = 20;
		let center_x = STAGE_WIDTH / 2;
		let answer_y = 3*STAGE_HEIGHT/6;
		let button_y = 3*STAGE_HEIGHT/6+100;
		
		const slope_answer = new Konva.Rect({
			x: center_x - text_width - spacing/2 - 10,
			y: answer_y + 40,
			width: text_width,
			height: text_height,
			fill: 'gray',
			stroke: 'red'
		});
		this.slope_answer = slope_answer;

		const int_answer = new Konva.Rect({
			x: center_x + spacing/2 + 15,
			y: answer_y + 40,
			width: text_width,
			height: text_height,
			fill: 'gray',
			stroke: 'black'
		});
		this.int_answer = int_answer;

		const m_equals_text = new Konva.Text({
			x: center_x - text_width - spacing/2 - 50,
			y: answer_y + 40 + text_height/2 - 10,
			text: "m =",
			fontSize: 20,
			fontFamily: "HomeScreenFont",
			fill: "black",
			align: "right",
			width: 40
		});
		group.add(m_equals_text);

		const b_equals_text = new Konva.Text({
			x: center_x + spacing/2 - 25,
			y: answer_y + 40 + text_height/2 - 10,
			text: "b =",
			fontSize: 20,
			fontFamily: "HomeScreenFont",
			fill: "black",
			align: "right",
			width: 40
		});
		group.add(b_equals_text);

		const txt = new Konva.Text({
			x: center_x - text_width - spacing/2 - 10,
			y: answer_y + 40 + text_height/2 - 10,
			text: "",
			fontSize: 20,
			fontFamily: "HomeScreenFont",
			fill: "white",
			align: "center",
			width: text_width

		})
		this.slopeText = txt


		const int_txt = new Konva.Text({
			x: center_x + spacing/2 + 15,
			y: answer_y + 40 + text_height/2 - 10,
			text: "",
			fontSize: 20,
			fontFamily: "HomeScreenFont",
			fill: "white",
			align: "center",
			width: text_width

		})
		this.intText = int_txt

		this.currentText = this.slopeText;

		group.add(slope_answer);
		group.add(int_answer);
		group.add(this.slopeText);
		group.add(this.intText)

		const switch_button = new Konva.Rect({
			x: center_x - text_width - spacing/2,
			y: button_y,
			width: text_width,
			height: text_height,
			fill: 'blue',
			stroke: 'black',
		});

		group.add(switch_button);


		const switch_text = new Konva.Text({
			x: center_x - text_width - spacing/2,
			y: button_y - 25,
			text: "Switch",
			fontSize: 20,
			fontFamily: "HomeScreenFont",
			fill: "black",
			align: "center",
			width: text_width

		});
		group.add(switch_text);

		const submit = new Konva.Rect({
			x: center_x + spacing/2,
			y: button_y,
			width: text_width,
			height: text_height,
			fill: 'blue',
			stroke: 'black',
		});

		group.add(submit)

		const submit_text = new Konva.Text({
			x: center_x + spacing/2,
			y: button_y - 25,
			text: "Submit",
			fontSize: 20,
			fontFamily: "HomeScreenFont",
			fill: "black",
			align: "center",
			width: text_width

		});
	  	group.add(submit_text);

		switch_button.on("click", ()=> this.switch_box());	  

//---------------------Checking Answer----------------------
	    const feedback = new Konva.Text({
			x: 0,
			y: 3*STAGE_HEIGHT/4+10,
			text: "",
			fontSize: 50,
			fontFamily: "HomeScreenFont",
			fill: "black",
			align: "center",
			width: STAGE_WIDTH
		});

		group.add(feedback);

	    submit.on("click", () => {
			let slope_entered = Number(this.slope);
			let intercept_entered = Number(this.intercept);

			if (isNaN(slope_entered) || isNaN(intercept_entered)){
				feedback.text("Incorrect! m="+((this.m as unknown) as string)+" and b="+((this.b as unknown) as string));
				feedback.moveToTop();
			} else if (this.m === slope_entered && this.b === intercept_entered){
				feedback.text("Correct! Keep it up!");
				feedback.moveToTop();
			} else {
				feedback.text("Incorrect! m="+((this.m as unknown) as string)+" and b="+((this.b as unknown) as string));
				feedback.moveToTop();
			}

			if (this.onSubmit) {
				setTimeout(() => {
					this.onSubmit!();
				}, 400);
			}
		});

	    //add to instance definition
		this.group = group;
    }	


	getGroup(): Konva.Group {
		return this.group;
	}
	
	type(e: KeyboardEvent): void{
		if (e.key === "Backspace"){
			this.current = this.current.slice(0,-1);
		}else if (e.key.length === 1){
			this.current += e.key;
		} 

		this.currentText.text(this.current);

		if(this.current_marker === 0){
			this.slope = this.current;
		}else{
			this.intercept = this.current;
		}

		this.currentText.moveToTop();
	}

	switch_box(){
		if (this.current_marker === 0){
			this.current_marker = 1;
			this.current = this.intercept;
			this.currentText = this.intText;
			this.int_answer.stroke("red");
			this.slope_answer.stroke("black");
		}else{
			this.current_marker = 0;
			this.current = this.slope;
			this.currentText = this.slopeText;
			this.slope_answer.stroke("red");
			this.int_answer.stroke("black");
		}
	}

	private resetEquation() {
		let ax_len = 200;
		let num_ticks = 10;

		this.m = Math.floor(Math.random() * (5 - (-5)) + -5); //maximum possible slope is 5, minimum is 0. Will add functionality for negative slopes.
		this.b = Math.floor(Math.random() * 5);

		let width = STAGE_WIDTH / 2 - ax_len / 2;
		let height = STAGE_HEIGHT / 2 + ax_len / 2 - 80;

		let second_point_x = (num_ticks - this.b) / this.m;

		// Remove previous line
		this.group.find('.equationLine').forEach(line => line.destroy());

		// Create new line
		let ln: Konva.Line;
		if (this.m >= 0) {
			ln = new Konva.Line({
				points: [
					width,
					height - this.b * (ax_len / num_ticks),
					width + second_point_x * (ax_len / num_ticks),
					height - (this.m * second_point_x + this.b) * (ax_len / num_ticks)
					//Points on linear graph are (0,y_intercept) and (second_point_x, m(second_point_x)+b)
				],
				stroke: 'red',
				strokeWidth: 3,
				name: 'equationLine'
			});
		} else {
			this.b = Math.floor(Math.random() * (10 - 5) + 5);
			ln = new Konva.Line({
				points: [
					width,
					height - this.b * (ax_len / num_ticks),
					width + (this.b / -this.m) * (ax_len / num_ticks),
					height
				],
				stroke: 'red',
				strokeWidth: 3,
				name: 'equationLine'
			});
		}

		this.group.add(ln);

		// Reset input state
		this.slope = '';
		this.intercept = '';
		this.current = this.slope;
		this.current_marker = 0;
		this.currentText = this.slopeText;
		this.slopeText.text('');
		this.intText.text('');
		this.slope_answer.stroke('red');
		this.int_answer.stroke('black');
	}

	show(): void{
		this.resetEquation();
		this.group.visible(true);
		this.group.moveToTop();
		window.addEventListener("keydown", this.keyHandler);
	}

	hide(): void{
		this.group.visible(false);
		window.removeEventListener('keydown', this.keyHandler);
	}

	setOnSubmit(callback: () => void): void {
		this.onSubmit = callback;
	}
}