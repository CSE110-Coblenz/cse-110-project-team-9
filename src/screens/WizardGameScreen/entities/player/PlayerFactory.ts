import Konva from 'konva';

//Player MVC
import { PlayerViewer } from "./PlayerViewer";
import { PlayerModel } from './PlayerModel';
import { PlayerController } from "./PlayerController";

import { AudioController } from '../../../../audios/AudioController';

//Types of assets
import { wizardSrc, WIZARD_ANIMATIONS, type WizardAnimation, WIZARD_BOUNDING_BOXES} from "../types/Wizard";
import { knightSrc, KNIGHT_ANIMATIONS, type KnightAnimation, KNIGHT_BOUNDING_BOXES} from "../types/Knight";

export type PlayerType = "wizard" | "knight";

/**
 * creation and instantiated of player class 
 */
export class PlayerFactory {
    static create(
        type: PlayerType, 
        group: Konva.Group,
        audio: AudioController
    ): PlayerController<any> {
        const model = new PlayerModel(150, 60, 150);
        let viewer: PlayerViewer<any>;

        switch(type) {
            case "wizard":
                viewer =  new PlayerViewer<WizardAnimation>(
                    group,
                    { image: wizardSrc, animations: WIZARD_ANIMATIONS },
                    model,
                    WIZARD_BOUNDING_BOXES,
                );
                break;
            case "knight":
                viewer = new PlayerViewer<KnightAnimation>(
                    group,
                    { image: knightSrc, animations: KNIGHT_ANIMATIONS },
                    model,
                    KNIGHT_BOUNDING_BOXES,
                );
                break;
            default:
                throw new Error('unknown player type');
        }

        return new PlayerController(model, viewer, audio);
    }
}




