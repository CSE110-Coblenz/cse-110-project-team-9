import { AudioModel } from "./AudioModel";

export class AudioController {
    private model: AudioModel;
    private hasUserInteracted;

    /**
     * Initializes the AudioController
     */
    constructor() {
        this.model = AudioModel.getInstance();
        this.hasUserInteracted = false;

        //Chrome DOM fix
        const userGesture = () => {
            this.hasUserInteracted = true;
            window.removeEventListener("keydown", userGesture);
            window.removeEventListener("mousedown", userGesture);
            window.removeEventListener("touchstart", userGesture);
        };

        window.addEventListener("keydown", userGesture);
        window.addEventListener("mousedown", userGesture);
        window.addEventListener("touchstart", userGesture);
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

        //reset one shot-sfx
        if(!loop) sound.currentTime = 0;

        //DOM fix user interacted
        if (!this.hasUserInteracted) return;

        //pauses audio until brower confirms play back and catches error for tabbed out as well
        sound.play().catch((err: any) => {
            if (err.name !== "AbortError") {
                console.error(`AudioController: error playing "${key}"`, err);
            }
        });
    }

    /**
     * Stop function for inputed audio
     */
    public stop(key: string): void {
        const sound = this.model.sounds[key];
        if (!sound) return;

        if (document.visibilityState === "visible") {
            try {
                sound.pause();
                sound.currentTime = 0;
            } catch (err: any) {
                console.error(`AudioController: error stopping "${key}"`, err);
            }
        }
    }

    /**
     * Stop all audio
     */
    public stopAll(): void {
        for (const key in this.model.sounds) {
            this.stop(key);
        }
    }

    /**
     * abtracted getters and setters
     */
    get bgmVolume(): number { return this.model.bgmVolume; }
    get sfxVolume(): number { return this.model.sfxVolume; }

    set bgmVolume(v: number) { this.model.setBgmVolume(v); }
    set sfxVolume(v: number) { this.model.setBgmVolume(v); }
}