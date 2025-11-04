import Konva from 'konva';
import { PlayerViewer } from "./PlayerViewer";
import type { PlayerModel } from './PlayerModel';

//Types of assets
import { wizardSrc, WIZARD_ANIMATIONS, type WizardAnimation, WIZARD_BOUNDING_BOXES } from "../types/Wizard";
import { knightSrc, KNIGHT_ANIMATIONS, type KnightAnimation, KNIGHT_BOUNDING_BOXES} from "../types/Knight";

export type PlayerType = "wizard" | "knight";

//TODO: most like will not need later IDK if just need it for testing for now
export class PlayerFactory {
    static create(type: PlayerType, group: Konva.Group, model: PlayerModel): PlayerViewer<any> {
        switch(type) {
            case "wizard":
                return new PlayerViewer<WizardAnimation>(
                    group,
                    { image: wizardSrc, animations: WIZARD_ANIMATIONS},
                    model,
                    WIZARD_BOUNDING_BOXES
                );
            case "knight":
                return new PlayerViewer<KnightAnimation>(
                    group,
                    { image: knightSrc, animations: KNIGHT_ANIMATIONS},
                    model,
                    KNIGHT_BOUNDING_BOXES
                );
            default:
                throw new Error('unknown player type');
        }
    }
}



