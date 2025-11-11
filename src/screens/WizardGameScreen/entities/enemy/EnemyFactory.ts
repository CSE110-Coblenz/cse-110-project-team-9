import Konva from 'konva';

//Enemy MVC
import { EnemyViewer } from './EnemyViewer';
import { EnemyModel } from './EnemyModel'; 
import { EnemyController } from './EnemyController';

import { AudioController } from '../../../../audios/AudioController';

//Types of assets
import { wizardSrc, WIZARD_ANIMATIONS, type WizardAnimation, WIZARD_BOUNDING_BOXES } from "../types/Wizard";
import { knightSrc, KNIGHT_ANIMATIONS, type KnightAnimation, KNIGHT_BOUNDING_BOXES} from "../types/Knight";

export type EnemyType = "wizard" | "knight";

/**
 * creation and instantiated of enemy class 
 */
export class EnemyFactory {
    static create(
        type: EnemyType, 
        group: Konva.Group,
        audio: AudioController
    ): EnemyController<any> {
        const model = new EnemyModel(300, 60, 150);
        let viewer: EnemyViewer<any>;

        switch(type) {
            case "wizard":
                viewer =  new EnemyViewer<WizardAnimation>(
                    group,
                    { image: wizardSrc, animations: WIZARD_ANIMATIONS },
                    model,
                    WIZARD_BOUNDING_BOXES,
                );
                break;
            case "knight":
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