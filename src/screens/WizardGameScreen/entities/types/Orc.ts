import { computeAllAnimationBoundingBoxes } from "./CreateBoundingBox";

//image atlas export
export const orcSrc = "/wizardminigame/sprites/orc/Orc.png";

//animation types
export type OrcAnimation = "idle" | "walk" | "attacklight" | "attackheavy" | "damage" | "death";

//[x, y, width, height] per frame
export const ORC_ANIMATIONS: Record<OrcAnimation, number[]> = {
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
    attacklight: [
        0, 200, 100, 100,
        100, 200, 100, 100,
        200, 200, 100, 100,
        300, 200, 100, 100,
        400, 200, 100, 100,
        500, 200, 100, 100,
    ],
    attackheavy: [
        0, 300, 100, 100,
        100, 300, 100, 100,
        200, 300, 100, 100,
        300, 300, 100, 100,
        400, 300, 100, 100,
        500, 300, 100, 100,
    ],
    damage: [
        0, 400, 100, 100,
        100, 400, 100, 100,
        200, 400, 100, 100,
        300, 400, 100, 100,
    ],
    death: [
        0, 500, 100, 100,
        100, 500, 100, 100,
        200, 500, 100, 100,
        300, 500, 100, 100,
    ]
};

export type OrcAudioMap = typeof ORC_AUDIO;

//TODO: grab correct foramt .100 seconds per frame for any given animation mp4
export const ORC_AUDIO = {
    walk: "/wizardminigame/audio/footsteps.mp3",
    attacklight: "/wizardminigame/audio/slash.mp3",
    attackheavy: "/wizardminigame/audio/slash.mp3",
    damage: "/wizardminigame/audio/x",
    death: "/wizardminigame/audio/x",
};

//bounding box for collision frames
export const ORC_BOUNDING_BOXES: Record<OrcAnimation, { x: number; y: number; width: number; height: number }[] > = {} as any;

//pre-computed bounding boxes
const orcImg = new Image();
orcImg.src = orcSrc;
orcImg.onload = () => {
    const boxes = computeAllAnimationBoundingBoxes(orcImg, ORC_ANIMATIONS);
    Object.assign(ORC_BOUNDING_BOXES, boxes);
};