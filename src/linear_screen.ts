import Konva from "konva";

//Creating Stage
const stage = new Konva.Stage({
	container: 'container',
	width: window.innerWidth,
	height: window.innerHeight
});


//create layer
const layer = new Konva.Layer();
stage.add(layer);


//Create Line
const line = new Konva.Line({
	points: [0,0,50,50,100,100],  //placeholder line, this will change. Is represented as [x1,y1,x2,y2...]
	stroke: 'black'

});


//add line to layer
layer.add(line);
