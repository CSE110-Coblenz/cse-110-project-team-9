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
     * Play function for BGM (Background Music)
     * Only plays BGM sounds. If already playing, does nothing.
     * @param key : string - The key of the BGM to play (must contain "bgm")
     */
    public playBGM(key: string): void {
        const sound = this.model.sounds[key];
        if (!sound) return;
        
        // Only play BGM sounds
        if (!key.includes("bgm")) {
            console.warn(`playBGM called with non-BGM key: ${key}. Use playSFX for sound effects.`);
            return;
        }

        // If already playing, don't restart
        if (!sound.paused && !sound.ended) {
            sound.muted = false;
            return;
        }
        
        sound.muted = false;
        sound.play();
    }

    /**
     * Play function for SFX (Sound Effects)
     * Always plays the sound effect, allowing multiple SFX to play simultaneously.
     * @param key : string - The key of the SFX to play (must contain "sfx")
     */
    public playSFX(key: string): void {
        const sound = this.model.sounds[key];
        if (!sound) return;
        
        // Only play SFX sounds
        if (!key.includes("sfx")) {
            console.warn(`playSFX called with non-SFX key: ${key}. Use playBGM for background music.`);
            return;
        }

        // SFX should always play from the beginning
        sound.muted = false;
        sound.currentTime = 0;
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
        this.playBGM(key);
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