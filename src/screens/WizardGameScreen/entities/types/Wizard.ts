import { computeAllAnimationBoundingBoxes } from "./CreateBoundingBox";

//TODO: asesprite image atlas for this for now it is just a copy of Knight
//image atlas export
export const wizardSrc = "/wizardminigame/sprites/Wizard.png";

//animation types
export type WizardAnimation = "idle" | "walk" | "attackslash" | "attackdown" | "attackbow" | "damage" | "death";

//[x, y, width, height] per frame
export const WIZARD_ANIMATIONS: Record<WizardAnimation, number[]> = {
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

//TODO: grab correct foramt .100 seconds per frame for any given animation
//TODO: convert to mp4 instead mp3 does not do milliseconds
export const KNIGHT_AUDIO = {
    walk: "/wizardminigame/audio/8-bit-grass-footsteps-2-408574.mp3",
    bow: "/wizardminigame/audio/bow_release-85040.mp3",
    attack: "/wizardminigame/audio/sword-slash-and-swing-185432.mp3",
    damage: "/wizardminigame/audio/x",
    death: "/wizardminigame/audio/x",
};

//bounding box for collision frames
export const WIZARD_BOUNDING_BOXES: Record<WizardAnimation, { x: number; y: number; width: number; height: number }[] > = {} as any;

//pre-computed bounding boxes
const wizardImg = new Image();
wizardImg.src = wizardSrc;
wizardImg.onload = () => {
    const boxes = computeAllAnimationBoundingBoxes(wizardImg, WIZARD_ANIMATIONS);
    Object.assign(WIZARD_BOUNDING_BOXES, boxes);
};
