import Konva from 'konva';
import { EnemyViewer } from './EnemyView';
import { EnemyModel } from './EnemyModel'; 
import { EnemyController } from './EnemyController';
import { AudioController } from '../../../../audios/AudioController';
import { ENEMY_SPEED } from '../../config';

//Types of assets
import { orcSrc, orcAttackSrc, ORC_ANIMATIONS, ORC_ATTACK_ANIMATIONS, ORC_BOUNDING_BOXES, ORC_ATTACK_BOUNDING_BOXES, ORC_AUDIO} from "../types/Orc";

export type EnemyType = "orc";  //addable enemies here

export class EnemyFactory {
    static create(
        x: number,
        y: number,  
        scale: number,
        type: EnemyType, 
        group: Konva.Group,
        audio: AudioController
    ): EnemyController {
        let model: EnemyModel;
        let viewer: EnemyViewer;

        switch(type) {
            case "orc":
                model = new EnemyModel(
                    x, 
                    y, 
                    ENEMY_SPEED, 
                    ORC_AUDIO, 
                    ORC_BOUNDING_BOXES,
                    ORC_ATTACK_BOUNDING_BOXES
                );
                viewer = new EnemyViewer(
                    group,
                    { image: orcSrc, animations: ORC_ANIMATIONS },
                    { image: orcAttackSrc, animations: ORC_ATTACK_ANIMATIONS },
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