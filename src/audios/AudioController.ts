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
     * Play function for SOUND EFFECT
     * @param name : string - filename of the .mp3/.mp4
     */

    public playSFX(name: string): void {
        const sfx = this.model.sounds[name];
        if (!sfx) return;

        sfx.muted = false;
        if (sfx.readyState < 2) sfx.load();

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
     * Play function for BGM
     */

    public playBGM(): void {
        const bgm = this.model.sounds["bgm"];
        if (!bgm) return;
    
        bgm.muted = false;
        if (bgm.readyState < 2) bgm.load();
    
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
     * Change volume function
     * @param volume : number - A number between 0.0 and 1.0
     */

    public changeVolume(volume: number): void {
        this.model.setVolume(volume);
    }

    /**
     * Getter for volume
     * @returns The current volume level
     */

    public getVolume(): number {
        return this.model.getVolume();
    }
}