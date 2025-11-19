import Konva from 'konva';
import { PlayerViewer } from "./PlayerViewer";
import { PlayerModel } from './PlayerModel';
import { PlayerController } from "./PlayerController";
import { PlayerHUD } from './PlayerHUD';
import { InputHandler } from '../../InputHandler';
import { AudioController } from '../../../../audios/AudioController';

//Types of assets
import { knightSrc, knightAttackSrc, KNIGHT_ANIMATIONS, KNIGHT_ATTACK_ANIMATIONS, KNIGHT_BOUNDING_BOXES, KNIGHT_ATTACK_BOUNDING_BOXES, KNIGHT_AUDIO} from "../types/Knight";

export type PlayerType = "knight";  //addable classes here

//TODO: move to config
const DEFAULT_PLAYER_SPEED = 150;

export class PlayerFactory {
    static create(
        x: number,
        y: number,  
        scale: number,
        type: PlayerType, 
        group: Konva.Group, 
        audio: AudioController, 
        input: InputHandler
    ): PlayerController {
        let model: PlayerModel;
        let viewer: PlayerViewer;

        switch(type) {
            case "knight":
                model = new PlayerModel(
                    x, 
                    y, 
                    DEFAULT_PLAYER_SPEED, 
                    KNIGHT_AUDIO, 
                    KNIGHT_BOUNDING_BOXES, 
                    KNIGHT_ATTACK_BOUNDING_BOXES
                );
                viewer = new PlayerViewer(
                    group,
                    { image: knightSrc, animations: KNIGHT_ANIMATIONS },
                    { image: knightAttackSrc, animations: KNIGHT_ATTACK_ANIMATIONS },
                    model,
                    scale
                );
                break;
            default:
                throw new Error(`Unknown player type: ${type}`);
        }

        const hud = new PlayerHUD(group, model);
        return new PlayerController(model, hud, viewer, audio, input);
    }
}