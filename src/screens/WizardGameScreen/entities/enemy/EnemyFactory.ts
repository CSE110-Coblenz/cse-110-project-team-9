import Konva from 'konva';

//Enemy MVC
import { EnemyViewer } from './EnemyViewer';
import { EnemyModel } from './EnemyModel'; 
import { EnemyController } from './EnemyController';

import { AudioController } from '../../../../audios/AudioController';

//Types of assets
import { orcSrc, ORC_ANIMATIONS, ORC_BOUNDING_BOXES, ORC_AUDIO} from "../types/Orc";

export type EnemyType = "orc";

/**
 * creation and instantiated of enemy class 
 */
export class EnemyFactory {
    static create(
        x: number,
        y: number,  
        type: EnemyType, 
        group: Konva.Group,
        audio: AudioController
    ): EnemyController {
        let model: EnemyModel;
        let viewer: EnemyViewer;
        let scale = 4;


        switch(type) {
            case "orc":
                model = new EnemyModel(x, y, 100, ORC_AUDIO, ORC_BOUNDING_BOXES);
                viewer = new EnemyViewer(
                    group,
                    { image: orcSrc, animations: ORC_ANIMATIONS },
                    model,
                    scale,
                );
                break;
            default:
                throw new Error(`Unknown enemy type: ${type}`);
        }

        return new EnemyController(model, viewer, audio);
    }
}