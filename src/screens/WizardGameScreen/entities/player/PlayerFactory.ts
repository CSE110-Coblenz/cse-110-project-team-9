import Konva from 'konva';
import { PlayerViewer } from "./PlayerViewer";
//Types of assets
import { Wizard, WIZARD_ANIMATIONS, type WizardAnimation } from "../types/Wizard";
import { Knight, KNIGHT_ANIMATIONS, type KnightAnimation } from "../types/Knight";

export type PlayerType = "wizard" | "knight";

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
            default:
                throw new Error('unknown player type: ${type}');
        }
    }
}




