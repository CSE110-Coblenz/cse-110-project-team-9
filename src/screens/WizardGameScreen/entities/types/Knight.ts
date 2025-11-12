import { computeAllAnimationBoundingBoxes } from "./CreateBoundingBox";

//image atlas export
export const knightSrc = "/wizardminigame/sprites/Knight.png";

//animation types
export type KnightAnimation = "idle" | "walk" | "attackslash" | "attackdown" | "attackbow" | "damage" | "death";

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
    damage: [
        0, 500, 100, 100,
        100, 500, 100, 100,
        200, 500, 100, 100,
        300, 500, 100, 100,
    ],
    death: [
        0, 600, 100, 100,
        100, 600, 100, 100,
        200, 600, 100, 100,
        300, 600, 100, 100,
    ]
};

export type KnightAudioMap = typeof KNIGHT_AUDIO;

//TODO: grab correct foramt .100 seconds per frame for any given animation
//TODO: convert to mp4 instead mp3 does not do milliseconds
export const KNIGHT_AUDIO = {
    walk: "/wizardminigame/audio/8-bit-grass-footsteps-2-408574.mp3",
    attackbow: "/wizardminigame/audio/bow_release-85040.mp3",
    attackslash: "/wizardminigame/audio/sword-slash-and-swing-185432.mp3",
    attackdown: "/wizardminigame/audio/sword-slash-and-swing-185432.mp3",
    damage: "/wizardminigame/audio/x",
    death: "/wizardminigame/audio/x",
};

//bounding box for collision frames
export const KNIGHT_BOUNDING_BOXES: Record<KnightAnimation, { x: number; y: number; width: number; height: number }[] > = {} as any;

//pre-computed bounding boxes
const knightImg = new Image();
knightImg.src = knightSrc;
knightImg.onload = () => {
    const boxes = computeAllAnimationBoundingBoxes(knightImg, KNIGHT_ANIMATIONS);
    Object.assign(KNIGHT_BOUNDING_BOXES, boxes);
};