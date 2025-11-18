import Konva from 'konva';

//Enemy MVC
import { EnemyViewer } from './EnemyViewer';
import { EnemyModel } from './EnemyModel'; 
import { EnemyController } from './EnemyController';

import { AudioController } from '../../../../audios/AudioController';

//Types of assets
import { wizardSrc, WIZARD_ANIMATIONS, type WizardAnimation, WIZARD_BOUNDING_BOXES, WIZARD_AUDIO } from "../types/Wizard";
import { knightSrc, KNIGHT_ANIMATIONS, type KnightAnimation, KNIGHT_BOUNDING_BOXES, KNIGHT_AUDIO} from "../types/Knight";
import { orcSrc, ORC_ANIMATIONS, type OrcAnimation, ORC_BOUNDING_BOXES, ORC_AUDIO} from "../types/Orc";

export type EnemyType = "wizard" | "knight" | "orc";

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
            case "wizard":
                model = new EnemyModel(x, y, 150, WIZARD_AUDIO, WIZARD_BOUNDING_BOXES);
                viewer =  new EnemyViewer(
                    group,
                    { image: wizardSrc, animations: WIZARD_ANIMATIONS },
                    model,
                    scale,
                );
                break;
            case "knight":
                model = new EnemyModel(x, y, 150, KNIGHT_AUDIO, KNIGHT_BOUNDING_BOXES);
                viewer = new EnemyViewer(
                    group,
                    { image: knightSrc, animations: KNIGHT_ANIMATIONS },
                    model,
                    scale,
                );
                break;
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
                throw new Error('unknown player type');
        }

        return new EnemyController(model, viewer, audio);
    }
}