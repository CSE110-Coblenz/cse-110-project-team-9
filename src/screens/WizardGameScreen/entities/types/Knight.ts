export type KnightAnimation = "idle" | "walk" | "attackslash" | "attackdown" | "attackbow" | "hurt" | "die";
// Each key matches a Knight Animation type
//[x, y, width, height] per frame
export const KNIGHT_ANIMATIONS: Record<KnightAnimation, number[]> = {
    idle: [
        0, 0, 100, 100,
        100, 0, 100, 100,
        200, 0, 100, 100,
        300, 0, 100, 100,
        400, 0, 100, 100,
        500, 0, 100, 100,
    ],
    walk: [
        0, 100, 100, 100,
        100, 100, 100, 100,
        200, 100, 100, 100,
        300, 100, 100, 100,
        400, 100, 100, 100,
        500, 100, 100, 100,
        600, 100, 100, 100,
        700, 100, 100, 100,
    ],
    attackslash: [
        0, 200, 100, 100,
        100, 200, 100, 100,
        200, 200, 100, 100,
        300, 200, 100, 100,
        400, 200, 100, 100,
        500, 200, 100, 100,
    ],
    attackdown: [
        0, 300, 100, 100,
        100, 300, 100, 100,
        200, 300, 100, 100,
        300, 300, 100, 100,
        400, 300, 100, 100,
        500, 300, 100, 100,
    ],
    attackbow: [
        0, 400, 100, 100,
        100, 400, 100, 100,
        200, 400, 100, 100,
        300, 400, 100, 100,
        400, 400, 100, 100,
        500, 400, 100, 100,
        600, 400, 100, 100,
        700, 400, 100, 100,
    ],
    hurt: [
        0, 500, 100, 100,
        100, 500, 100, 100,
        200, 500, 100, 100,
        300, 500, 100, 100,
        400, 500, 100, 100,
    ],
    die: [
        0, 600, 100, 100,
        100, 600, 100, 100,
        200, 600, 100, 100,
        300, 600, 100, 100,
        400, 600, 100, 100,
    ],
};

/**
 * image atlas export
 */
export const Knight = "public/WizardMiniGame/Sprites/Knight.png";

//TODO: move creating dynamic bounding boxes here
