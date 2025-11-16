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
     * Play function for audio (music or sound effects)
     * @param key : string - The key of the audio to play
     */
    public playMusic(key: string): void {
        const sound = this.model.sounds[key];
        if (!sound) return;

        if (!sound.paused && !sound.ended) {
            sound.muted = false;
            return;
        }
        
        sound.muted = false;
        // sound.currentTime = 0;
        sound.play();
    }

    /**
     * Stop function for BGM
     */
    public stopBGM(): void {
        for (const key in this.model.sounds) {
            const sound = this.model.sounds[key];
            if (sound.loop) {
                sound.pause();
                // sound.currentTime = 0;
            }
        }
    }

    /**
     * Replace BGM function
     */
    public replaceBGM(key: string, path: string): void {
        this.stopBGM();
        this.model.registerSound(key, path, true, true);
        this.playMusic(key);
    }

    /**
     * Change volume function
     * @param volume : number - A number between 0.0 and 1.0
     * @param type : "bgm" | "sfx" - The type of audio to change volume for
     */
    public changeVolume(volume: number, type: "bgm" | "sfx"): void {
        this.model.setVolume(volume, type);
    }

    /**
     * Getter for volume
     * @param type : "bgm" | "sfx" - The type of audio to get volume for
     * @returns The current volume level
     */
    public getVolume(type: "bgm" | "sfx"): number {
        return this.model.getVolume(type);
    }
}