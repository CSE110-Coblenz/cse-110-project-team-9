import Konva from "konva";
import { STAGE_WIDTH, STAGE_HEIGHT, SETTINGS_WIDTH, SETTINGS_HEIGHT } from "../../constants";
import type { View } from "../../types";


export class LinearScreenView implements View{
	private group: Konva.Group;


	constructor() {


	  //create group
	  const group = new Konva.Group({visible: false});
	  

	  

	  //----------------Creating Graph-----------------------------------------------

          
          let m = Math.floor((Math.random() * (5 - (0))) + 0 )   ;  //maximum possible slope is 5, minimum is 0. Will add functionality for negative slopes.
	  let b = Math.floor((Math.random() * (5 - (0))) + 0 )   ; 
	  let width = STAGE_WIDTH/3;
	  let height = STAGE_HEIGHT/3 + 30;
	  let ax_len = (200); 
	  let num_ticks = 10;
	  let second_point_x = ( (num_ticks - b) / m )
        



          //Create Line
          const line = new Konva.Line({
	  	points: [width , height-(b * (ax_len / num_ticks)), width + (second_point_x * (ax_len / num_ticks)) , height - ( (m*second_point_x+b) * (ax_len / num_ticks) )],  //placeholder line, this will change. Is represented as [x1,y1,x2,y2...]
	  	//Points on linear graph are (0,y_intercept) and (second_point_x, m(second_point_x)+b)
		//
	  	stroke: 'red',
		strokeWidth: 3
          });


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
          for (let i=1; i<=10; i++){
		group.add(new Konva.Line({
			points: [width + i * (ax_len / num_ticks), height, width + i * (ax_len / num_ticks), height - ax_len],
			stroke: 'black',
			strokeWidth: 1
		}));
	  }

	  //Axis Label Y
          for (let i=1; i<=10; i++){
		group.add(new Konva.Line({
			points: [width, height - i * (ax_len / num_ticks)   , width + ax_len ,  height - i * (ax_len / num_ticks)      ],
			stroke: 'black',
			strokeWidth: 1
		}));
	  }

	  //-----------------------------------------------------------------------------





	  //add to instance definition
	  this.group = group;
       }	


	getGroup(): Konva.Group {
		return this.group;
	}
	

	show(): void{
		this.group.visible(true);
	}

	hide(): void{
		this.group.visible(false);
	}

}









