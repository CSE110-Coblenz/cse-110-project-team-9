import Konva from "konva";
import { STAGE_WIDTH, STAGE_HEIGHT, SETTINGS_WIDTH, SETTINGS_HEIGHT } from "../../constants";
import type { View } from "../../types";


export class LinearScreenView implements View{
	private group: Konva.Group;


	constructor() {


	  //create group
	  const group = new Konva.Group({visible: false});
	  


          //Create Line
          const line = new Konva.Line({
	  points: [0,0,50,50,100,100],  //placeholder line, this will change. Is represented as [x1,y1,x2,y2...]
	  stroke: 'black'

          });


          //add line to group
          group.add(line);


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









