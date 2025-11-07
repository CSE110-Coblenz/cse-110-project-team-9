//Axis-Aligned Bounding Box collision types and manager
//kept inside the WizardGameScreen folder because collisions are use only in this mini-game
export type AABB = { x: number; y: number; width: number; height: number };

export interface Collidable {
    // Returns the current bounding box of the object in world coordinates
	getBoundingBox(): AABB | null;
    // Optional call for collision handling e.g. when a collision is detected
	onCollision?(other: Collidable): void;
}

export class CollisionManager {
    /**
     * list of all possible collisison objects
     */
	private collidables: Collidable[] = [];

    /**
     * remove from entity list collision
     * @param c MVC model object
     */
	public register(c: Collidable) {
		if (!this.collidables.includes(c)) this.collidables.push(c);
	}

    /**
     * remove from entity list collision
     * @param c MVC model object
     */
	public unregister(c: Collidable) {
		this.collidables = this.collidables.filter(x => x !== c);
	}

	//TODO: do konva collision instead that will be better
    /**
     * Processes collision detection among registered collidables
     */
	public update() {
		const list = this.collidables;
		for (let i = 0; i < list.length; i++) {
			const aBox = list[i].getBoundingBox();
			if (!aBox) continue;
			for (let j = i + 1; j < list.length; j++) {
				const bBox = list[j].getBoundingBox();
				if (!bBox) continue;
				if (this.aabbIntersect(aBox, bBox)) {
					list[i].onCollision?.(list[j]);
					list[j].onCollision?.(list[i]);
				}
			}
		}
	}

	private aabbIntersect(a: AABB, b: AABB): boolean {
        //check if boxes a and b overlap in 2D space
		return !(b.x > a.x + a.width || b.x + b.width < a.x || b.y > a.y + a.height || b.y + b.height < a.y);
	}
}



// import Konva from 'konva';

// var width = window.innerWidth;
// var height = window.innerHeight;

// var stage = new Konva.Stage({
//   container: 'container',
//   width: width,
//   height: height,
// });

// var layer = new Konva.Layer();
// stage.add(layer);

// function createShape() {
//   var group = new Konva.Group({
//     x: Math.random() * width,
//     y: Math.random() * height,
//     draggable: true,
//   });
//   var shape = new Konva.Rect({
//     width: 30 + Math.random() * 30,
//     height: 30 + Math.random() * 30,
//     fill: 'grey',
//     rotation: 360 * Math.random(),
//     name: 'fillShape',
//   });
//   group.add(shape);

//   var boundingBox = shape.getClientRect({ relativeTo: group });

//   var box = new Konva.Rect({
//     x: boundingBox.x,
//     y: boundingBox.y,
//     width: boundingBox.width,
//     height: boundingBox.height,
//     stroke: 'red',
//     strokeWidth: 1,
//   });
//   group.add(box);
//   return group;
// }

// for (var i = 0; i < 10; i++) {
//   layer.add(createShape());
// }

// layer.on('dragmove', function (e) {
//   var target = e.target;
//   var targetRect = e.target.getClientRect();
//   layer.children.forEach(function (group) {
//     // do not check intersection with itself
//     if (group === target) {
//       return;
//     }
//     if (haveIntersection(group.getClientRect(), targetRect)) {
//       group.findOne('.fillShape').fill('red');
//     } else {
//       group.findOne('.fillShape').fill('grey');
//     }
//   });
// });

// function haveIntersection(r1, r2) {
//   return !(
//     r2.x > r1.x + r1.width ||
//     r2.x + r2.width < r1.x ||
//     r2.y > r1.y + r1.height ||
//     r2.y + r2.height < r1.y
//   );
// }
