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
     * Play function for BGM
     */

    public playBGM(key: string): void {
        const bgm = this.model.sounds[key];
        if (!bgm) return;
    
        bgm.muted = false;
        bgm.currentTime = 0;
    
        const tryPlay = () => {
            bgm.play().catch(() => {
                document.body.addEventListener("click", () => {
                    bgm.play();
                    bgm.muted = false;
                }, { once: true });
            });
        };
        tryPlay();
    }

    /**
     * Play function for SOUND EFFECT
     * @param key : string
     */

    public playSFX(key: string): void {
        const sfx = this.model.sounds[key];
        if (!sfx) return;

        sfx.muted = false;
        sfx.currentTime = 0;

        const tryPlay = () => {
            sfx.play().catch(() => {
                document.body.addEventListener("click", () => {
                    sfx.play();
                    sfx.muted = false;
                }, { once: true });
            });
        };
        tryPlay();
    }

    /**
     * Stop function for BGM
     */

    public stopBGM(): void {
        for (const key in this.model.sounds) {
            const sound = this.model.sounds[key];
            if (sound.loop) {
                sound.pause();
                sound.currentTime = 0;
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
     */

    public changeBgmVolume(volume: number): void {
        this.model.setBgmVolume(volume);
    }

    public changeSfxVolume(volume: number): void {
        this.model.setSfxVolume(volume);
    }

    /**
     * Getter for volume
     * @returns The current volume level
     */

    public getBgmVolume(): number {
        return this.model.getBgmVolume();
    }

    public getSfxVolume(): number {
        return this.model.getSfxVolume();
    }
}