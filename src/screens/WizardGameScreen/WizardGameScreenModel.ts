import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants";

export class WizardGameScreenModel {
    public width: number;
    public height: number;

    /**
     * constructs the game model window
     */
    constructor() {
        this.width = STAGE_WIDTH;
        this.height = STAGE_HEIGHT;
    }
}

/**
 * Notes:
 * perhaps increase screen size later
 * 
 * for the tower single player game AAHAHAhah
 * 
 * 
 * I am changing the game to be more of a survival shooter type game
 * since it no longer fits 1v1 mechanic since no multiplayer
 * might add multiplayer later but for now single player shooter thing
 * 
 * I want to stop time when entering menus
 * 
 * 
 * stop time when entering a equation but have a timer for answering
 * start equation cartesian plane structure where the player is at the origin
 * 
 * I want to have entities to come from the edge of the screen towards player???
 * have enemies come in maybe a wave mechanic or just around the player
 * have a score system based on how many enemies defeated
 * have different enemy types with different speeds and health (all melee)
 * 
 * have two projectiles for player one quadratic one linear
 * have a health system for the player
 * have a timer for the game session and math writing prompt
 * 
 * 
 * Animation notes
 * have idle, walk, attack for quad and linear
 * 8 directional movement and attack (I will try my best this will kill me)
 */