import { computeAllAnimationBoundingBoxes } from "./CreateBoundingBox";

export const orcSrc = "/wizardminigame/sprites/orc/Orc.png";
export const orcAttackSrc = "/wizardminigame/sprites/orc/Orc-Attack_Effect.png";

export type OrcAnimation = "idle" | "walk" | "attacklight" | "attackheavy" | "damage" | "death";
export type OrcAttackAnimation = "attacklight" | "attackheavy";

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

export const ORC_ATTACK_ANIMATIONS: Record<OrcAttackAnimation, number[]> = {
    attacklight: [
        0, 0, 100, 100,
        100, 0, 100, 100,
        200, 0, 100, 100,
        300, 0, 100, 100,
        400, 0, 100, 100,
        500, 0, 100, 100
    ],
    attackheavy: [
        0, 100, 100, 100,
        100, 100, 100, 100,
        200, 100, 100, 100,
        300, 100, 100, 100,
        400, 100, 100, 100,
        500, 100, 100, 100
    ],
};

export type OrcAudioMap = typeof ORC_AUDIO;

export const ORC_AUDIO = {
    walk_SFX: "/wizardminigame/audio/footsteps.mp3",
    attacklight_SFX: "/wizardminigame/audio/slash.mp3",
    attackheavy_SFX: "/wizardminigame/audio/slash.mp3",
};

export const ORC_BOUNDING_BOXES: Record<OrcAnimation, { x: number; y: number; width: number; height: number }[]> = {} as any;
export const ORC_ATTACK_BOUNDING_BOXES: Record<OrcAttackAnimation, { x: number; y: number; width: number; height: number }[]> = {} as any;
const orcImg = new Image();
const orcAttackImg = new Image();
orcImg.src = orcSrc;
orcAttackImg.src = orcAttackSrc;
orcImg.onload = () => {
    //computer all bounding boxes for all attack and body animations
    const orcBoxes = computeAllAnimationBoundingBoxes(orcImg, ORC_ANIMATIONS);
    const orcAttackBoxes = computeAllAnimationBoundingBoxes(orcAttackImg, ORC_ATTACK_ANIMATIONS);
    Object.assign(ORC_ATTACK_BOUNDING_BOXES, orcAttackBoxes);
    Object.assign(ORC_BOUNDING_BOXES, orcBoxes);
};