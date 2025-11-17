import Konva from 'konva';

//Enemy MVC
import { EnemyViewer } from './EnemyViewer';
import { EnemyModel } from './EnemyModel'; 
import { EnemyController } from './EnemyController';

import { AudioController } from '../../../../audios/AudioController';

//Types of assets
import { wizardSrc, WIZARD_ANIMATIONS, type WizardAnimation, WIZARD_BOUNDING_BOXES, WIZARD_AUDIO } from "../types/Wizard";
import { knightSrc, KNIGHT_ANIMATIONS, type KnightAnimation, KNIGHT_BOUNDING_BOXES, KNIGHT_AUDIO} from "../types/Knight";

export type EnemyType = "wizard" | "knight";

/**
 * creation and instantiated of enemy class 
 */
export class EnemyFactory {
    static create(
        type: EnemyType, 
        group: Konva.Group,
        audio: AudioController
    ): EnemyController<EnemyType> {
        let model: EnemyModel;
        let viewer: EnemyViewer<EnemyType>;

        switch(type) {
            case "wizard":
                model = new EnemyModel(300, 60, 150, WIZARD_AUDIO);
                viewer =  new EnemyViewer<WizardAnimation>(
                    group,
                    { image: wizardSrc, animations: WIZARD_ANIMATIONS },
                    model,
                    WIZARD_BOUNDING_BOXES,
                );
                break;
            case "knight":
                model = new EnemyModel(300, 60, 150, KNIGHT_AUDIO);
                viewer = new EnemyViewer<KnightAnimation>(
                    group,
                    { image: knightSrc, animations: KNIGHT_ANIMATIONS },
                    model,
                    KNIGHT_BOUNDING_BOXES,
                );
                break;
            default:
                throw new Error('unknown player type');
        }

        return new EnemyController(model, viewer, audio);
    }
}