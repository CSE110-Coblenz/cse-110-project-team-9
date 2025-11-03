import Konva from 'konva';
import { PlayerViewer } from "./PlayerViewer";
//Types of assets
import { Wizard, WIZARD_ANIMATIONS, type WizardAnimation } from "../types/Wizard";
import { Knight, KNIGHT_ANIMATIONS, type KnightAnimation } from "../types/Knight";

export type PlayerType = "wizard" | "knight";

//TODO: most like will not need later IDK if just need it for testing for now
export class PlayerFactory {
    static create(type: PlayerType, group: Konva.Group): PlayerViewer<any> {
        switch(type) {
            case "wizard":
                return new PlayerViewer<WizardAnimation>(
                    group,
                    { image: Wizard, animations: WIZARD_ANIMATIONS},
                    //starting animation
                    "idle"
                )
            case "knight":
                return new PlayerViewer<KnightAnimation>(
                    group,
                    { image: Knight, animations: KNIGHT_ANIMATIONS},
                    "idle"
                )
            //can add more types of player class
            default:
                throw new Error('unknown player type: ${type}');
        }
    }
}




