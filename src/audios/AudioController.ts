import { AudioModel } from "./AudioModel";

export class AudioController {
    private model: AudioModel;

    /**
     * Initializes the AudioController
     */
    constructor() {
        this.model = AudioModel.getInstance();
    }

    /**
     * Register a new sound
     * @param key
     * @param path
     * @param loop Whether the sound should loop
     * @param overwrite Whether to overwrite an existing sound with the same key
     */
    public registerSound(key: string, path: string, overwrite = false): void {
        if (!this.model.sounds[key] || overwrite) {
            const audio = new Audio(path);

            // If the key includes "bgm", set volume to bgmVolume, else sfxVolume
            audio.volume = key.includes("bgm") ? this.model.bgmVolume: this.model.sfxVolume;
            this.model.sounds[key] = audio;
        }
    }

    /**
     * Play function for SOUND EFFECT
     * @param key : string
     */
    public play(key: string, loop: boolean = false): void {
        const sound = this.model.sounds[key];
        if (!sound) return;

        sound.loop = loop;
        if(!loop) sound.currentTime = 0;
        sound.play()
    }

    /**
     * Stop function for BGM
     */
    public stop(key: string): void {
        const sound = this.model.sounds[key];
        if (!sound) return;

        //sound.muted = true;
        sound.currentTime = 0;
        sound.pause()
    }

    /**
     * Stop function for BGM
     */
    public stopAll(): void {
        for (const key in this.model.sounds) {
            this.stop(key);
        }
    }

    /**
     * abtracted getters and setters
     */
    public get bgmVolume(): number {
        return this.model.bgmVolume;
    }

    public get sfxVolume(): number {
        return this.model.sfxVolume;
    }

    public setBgmVolume(v: number) {
        this.model.setBgmVolume(v);
    }

    public setSfxVolume(v: number) {
        this.model.setSfxVolume(v);
    }
}