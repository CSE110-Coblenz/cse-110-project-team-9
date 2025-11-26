import Konva from "konva";
import { STAGE_WIDTH, STAGE_HEIGHT, SETTINGS_WIDTH, SETTINGS_HEIGHT } from "../../constants";
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

	constructor() {


	  //create group
	  const group = new Konva.Group({visible: false});
	  

	  

	  //----------------Creating Graph-----------------------------------------------

          
      let m = Math.floor((Math.random() * (5 - (-5))) + -5 )   ;  //maximum possible slope is 5, minimum is 0. Will add functionality for negative slopes.
	  let b = Math.floor((Math.random() * (5 - (0))) + 0 )   ; 
	  let width = STAGE_WIDTH/3;
	  let height = STAGE_HEIGHT/3 + 30;
	  let ax_len = (200); 
	  let num_ticks = 10;
	  let second_point_x = ( (num_ticks - b) / m )
       

          //Create Line
		 let ln = new Konva.Line({});
		  if (m >= 0) {
             ln = new Konva.Line({
	  		points: [width , height-(b * (ax_len / num_ticks)), width + (second_point_x * (ax_len / num_ticks)) , height - ( (m*second_point_x+b) * (ax_len / num_ticks) )],  //placeholder line, this will change. Is represented as [x1,y1,x2,y2...]
	  		//Points on linear graph are (0,y_intercept) and (second_point_x, m(second_point_x)+b)
			//
	  		stroke: 'red',
			strokeWidth: 3
          });
		}else{
			b = Math.floor((Math.random() * (10 - (5))) + 5 ); //altering problem so that line is visible
		    ln = new Konva.Line({
			points: [width, height-(b*(ax_len / num_ticks)), width+((b/-m)*(ax_len / num_ticks)  ), height],
			stroke: 'red',
			strokeWidth: 3

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

	  //-----------------------------------------------------------------------------

	  //--------------------------Creating Answer Boxes----------------
	  let text_width = 90;
	  let text_height = 30;
	  
	  const m_equals_text = new Konva.Text({
		x: 4*STAGE_WIDTH/12-115,
		y: 3*STAGE_HEIGHT/6+5,
		text: "m=",
		fontSize: 20,
		fontFamily: "Arial",
		fill: "black",
		align: "center"

	  });
	  group.add(m_equals_text);

	  const b_equals_text = new Konva.Text({
		x: 8*STAGE_WIDTH/12-90,
		y: 3*STAGE_HEIGHT/6+5,
		text: "b=",
		fontSize: 20,
		fontFamily: "Arial",
		fill: "black",
		align: "center"

	  });
	  group.add(b_equals_text);


	 
	  const slope_answer = new Konva.Rect({
		x: 4*STAGE_WIDTH/12-80,
		y: 3*STAGE_HEIGHT/6,
		width: text_width,
		height: text_height,
		fill: 'gray',
		stroke: 'red'
	  });
	  this.slope_answer = slope_answer;

	  const int_answer = new Konva.Rect({
		x: 8*STAGE_WIDTH/12-60,
		y: 3*STAGE_HEIGHT/6,
		width: text_width,
		height: text_height,
		fill: 'gray',
		stroke: 'black'
	  });
	  this.int_answer = int_answer;

	  const txt = new Konva.Text({
		x: 4*STAGE_WIDTH/12-75,
		y: 3*STAGE_HEIGHT/6+5,
		text: "",
		fontSize: 20,
		fontFamily: "Arial",
		fill: "white",
		align: "center"

	  })
	  this.slopeText = txt


	  const int_txt = new Konva.Text({
		x: 8*STAGE_WIDTH/12-55,
		y: 3*STAGE_HEIGHT/6+5,
		text: "",
		fontSize: 20,
		fontFamily: "Arial",
		fill: "white",
		align: "center"

	  })
	  this.intText = int_txt

	  this.currentText = this.slopeText;

	  group.add(slope_answer);
	  group.add(int_answer);
	  group.add(this.slopeText);
	  group.add(this.intText)

	  const switch_button = new Konva.Rect({
		x: 4*STAGE_WIDTH/12-80,
		y: 3*STAGE_HEIGHT/6+100,
		width: text_width,
		height: text_height,
		fill: 'blue',
		stroke: 'black',
	  });

	  group.add(switch_button);


	  const switch_text = new Konva.Text({
		x: 4*STAGE_WIDTH/12-70,
		y: 3*STAGE_HEIGHT/6+75,
		text: "Switch:",
		fontSize: 20,
		fontFamily: "Arial",
		fill: "black",
		align: "center"

	  });
	  group.add(switch_text);

	  const submit = new Konva.Rect({
		x: 8*STAGE_WIDTH/12-60,
		y: 3*STAGE_HEIGHT/6+100,
		width: text_width,
		height: text_height,
		fill: 'blue',
		stroke: 'black',
	  });

	  group.add(submit)

	  const submit_text = new Konva.Text({
		x: 8*STAGE_WIDTH/12-50,
		y: 3*STAGE_HEIGHT/6+75,
		text: "Submit:",
		fontSize: 20,
		fontFamily: "Arial",
		fill: "black",
		align: "center"

	  });
	  group.add(submit_text);



	  switch_button.on("click", ()=> this.switch_box());
	  /*int_answer.on("click", ()=>this.type());
	  */

	  window.addEventListener("keydown", (e)=>this.type(e));
	  

//---------------------Checking Answer----------------------
	    const feedback = new Konva.Text({
		x: STAGE_WIDTH/4-50,
		y: 3*STAGE_HEIGHT/4+70,
		text: "",
		fontSize: 50,
		fontFamily: "Arial",
		fill: "black",
		align: "center"
		});

		group.add(feedback);


	    submit.on("click", () => {
		let slope_entered = Number(this.slope);
		if (isNaN(slope_entered)){
			feedback.text("Incorrect! m="+((m as unknown) as string)+" and b="+((b as unknown) as string));
		}

		if (m ===  slope_entered){
			feedback.text("Correct! Keep it up!");
		}else{
			feedback.text("Incorrect! m="+((m as unknown) as string)+" and b="+((b as unknown) as string));
		}

		feedback.moveToTop();
	  });


	//-----------------------------------------------------------





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


	show(): void{
		this.group.visible(true);
	}

	hide(): void{
		this.group.visible(false);
	}

}