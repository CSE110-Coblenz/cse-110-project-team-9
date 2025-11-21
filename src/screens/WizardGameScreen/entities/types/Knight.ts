import { computeAllAnimationBoundingBoxes } from "./CreateBoundingBox";

//image atlas export
export const knightSrc = "/wizardminigame/sprites/soldier/Soldier.png";
export const knightAttackSrc = "/wizardminigame/sprites/soldier/Soldier-Attack_Effect.png";

//animation types
export type KnightAnimation = "idle" | "walk" | "attackslash" | "attackdown" | "attackbow" | "damage" | "death";
export type KnightAttackAnimation = "attackslash" | "attackdown" | "attackbow";

//[x, y, width, height] per frame
export const KNIGHT_ANIMATIONS: Record<KnightAnimation, number[]> = {
    idle: [
        0, 0, 100, 100,
        100, 0, 100, 100,
        200, 0, 100, 100,
        300, 0, 100, 100,
        400, 0, 100, 100,
        500, 0, 100, 100
    ],
    walk: [
        0, 100, 100, 100,
        100, 100, 100, 100,
        200, 100, 100, 100,
        300, 100, 100, 100,
        400, 100, 100, 100,
        500, 100, 100, 100,
        600, 100, 100, 100,
        700, 100, 100, 100
    ],
    attackslash: [
        0, 200, 100, 100,
        100, 200, 100, 100,
        200, 200, 100, 100,
        300, 200, 100, 100,
        400, 200, 100, 100,
        500, 200, 100, 100
    ],
    attackdown: [
        0, 300, 100, 100,
        100, 300, 100, 100,
        200, 300, 100, 100,
        300, 300, 100, 100,
        400, 300, 100, 100,
        500, 300, 100, 100
    ],
    attackbow: [
        0, 400, 100, 100,
        100, 400, 100, 100,
        200, 400, 100, 100,
        300, 400, 100, 100,
        400, 400, 100, 100,
        500, 400, 100, 100,
        600, 400, 100, 100,
        700, 400, 100, 100
    ],
    damage: [
        0, 500, 100, 100,
        100, 500, 100, 100,
        200, 500, 100, 100,
        300, 500, 100, 100
    ],
    death: [
        0, 600, 100, 100,
        100, 600, 100, 100,
        200, 600, 100, 100,
        300, 600, 100, 100
    ]
};

export const KNIGHT_ATTACK_ANIMATIONS: Record<KnightAttackAnimation, number[]> = {
    attackslash: [
        0, 0, 100, 100,
        100, 0, 100, 100,
        200, 0, 100, 100,
        300, 0, 100, 100,
        400, 0, 100, 100,
        500, 0, 100, 100
    ],
    attackdown: [
        0, 100, 100, 100,
        100, 100, 100, 100,
        200, 100, 100, 100,
        300, 100, 100, 100,
        400, 100, 100, 100,
        500, 100, 100, 100
    ],
    attackbow: [
        0, 200, 100, 100,
        100, 200, 100, 100,
        200, 200, 100, 100,
        300, 200, 100, 100,
        400, 200, 100, 100,
        500, 200, 100, 100,
        600, 200, 100, 100,
        700, 200, 100, 100
    ]
};

export type KnightAudioMap = typeof KNIGHT_AUDIO;

export const KNIGHT_AUDIO = {
    walk_SFX: "/wizardminigame/audio/footsteps.mp3",
    attackbow_SFX: "/wizardminigame/audio/bowrelease.mp3",
    attackslash_SFX: "/wizardminigame/audio/slash.mp3",
    attackdown_SFX: "/wizardminigame/audio/slash.mp3",
    damage_SFX: "/wizardminigame/audio/x",
    death_SFX: "/wizardminigame/audio/x",
};

//bounding box for collision frames
export const KNIGHT_BOUNDING_BOXES: Record<KnightAnimation, { x: number; y: number; width: number; height: number }[] > = {} as any;
export const KNIGHT_ATTACK_BOUNDING_BOXES: Record<KnightAttackAnimation, { x: number; y: number; width: number; height: number }[] > = {} as any;

//pre-computed bounding boxes
const knightImg = new Image();
const knightAttackImg = new Image();
knightImg.src = knightSrc;
knightAttackImg.src = knightAttackSrc;
knightImg.onload = () => {
    const knightBoxes = computeAllAnimationBoundingBoxes(knightImg, KNIGHT_ANIMATIONS);
    const knightAttackBoxes = computeAllAnimationBoundingBoxes(knightAttackImg, KNIGHT_ATTACK_ANIMATIONS);

    Object.assign(KNIGHT_ATTACK_BOUNDING_BOXES, knightAttackBoxes);
    Object.assign(KNIGHT_BOUNDING_BOXES, knightBoxes);
};  