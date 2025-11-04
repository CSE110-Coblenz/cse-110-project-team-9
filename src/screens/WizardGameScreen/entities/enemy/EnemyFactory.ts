import Konva from 'konva';
import { EnemyViewer } from './EnemyViewer';
import type { EnemyModel } from './EnemyModel';

//Types of assets
import { wizardSrc, WIZARD_ANIMATIONS, type WizardAnimation, WIZARD_BOUNDING_BOXES } from "../types/Wizard";
import { knightSrc, KNIGHT_ANIMATIONS, type KnightAnimation, KNIGHT_BOUNDING_BOXES} from "../types/Knight";

export type EnemyType = "wizard" | "knight";

//TODO: clean up with player factory as well please
export class EnemyFactory {
    static create(type: EnemyType, group: Konva.Group, model: EnemyModel): EnemyViewer<any> {
        switch(type) {
            case "wizard":
                return new EnemyViewer<WizardAnimation>(
                    group,
                    { image: wizardSrc, animations: WIZARD_ANIMATIONS},
                    model,
                    WIZARD_BOUNDING_BOXES
                )
            case "knight":
                return new EnemyViewer<KnightAnimation>(
                    group,
                    { image: knightSrc, animations: KNIGHT_ANIMATIONS},
                    model,
                    KNIGHT_BOUNDING_BOXES
                )
            default:
                throw new Error('unknown player type: ${type}');
        }
    }
}