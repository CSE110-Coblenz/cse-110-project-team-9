import Konva from 'konva';

//Player MVC
import { PlayerViewer } from "./PlayerViewer";
import { PlayerModel } from './PlayerModel';
import { PlayerController } from "./PlayerController";
//Player HUD
import { PlayerHUD } from './PlayerHUD';

//InputHandler
import { InputHandler } from '../../InputHandler';

//Audio MVC
import { AudioController } from '../../../../audios/AudioController';

//Types of assets
import { knightSrc, KNIGHT_ANIMATIONS, KNIGHT_BOUNDING_BOXES, KNIGHT_AUDIO} from "../types/Knight";

export type PlayerType = "wizard" | "knight";

/**
 * creation and instantiated of player class 
 */
export class PlayerFactory {
    static create(
        x: number,
        y: number,  
        type: PlayerType, 
        group: Konva.Group, 
        audio: AudioController, 
        input: InputHandler
    ): PlayerController {
        let model: PlayerModel;
        let viewer: PlayerViewer;
        let scale = 4;

        switch(type) {
            case "knight":
                model = new PlayerModel(x, y, 150, KNIGHT_AUDIO, KNIGHT_BOUNDING_BOXES);
                viewer = new PlayerViewer(group,
                    { image: knightSrc, animations: KNIGHT_ANIMATIONS },
                    model,
                    scale,
                );
                break;
            default:
                throw new Error('unknown player type');
        }

        const hud = new PlayerHUD(group, model);

        return new PlayerController(model, hud, viewer, audio, input);
    }
}