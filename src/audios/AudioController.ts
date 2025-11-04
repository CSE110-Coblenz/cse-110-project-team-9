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
     * Play & Stop function for SOUND EFFECT
     * @param name : string - filename of the .mp3/.mp4
     */

    public play(name: string): void {
        const sound = this.model.sounds[name];
        if (sound) sound.play();
    }

    public stop(name: string): void {
        const sound = this.model.sounds[name];
        if (sound) {
            sound.pause();
            sound.currentTime = 0;
        }
    }

    /**
     * Play function for BGM
     */

    public playBGM(): void {
        const bgm = this.model.sounds["bgm"];
        if (!bgm) return;
    
        if (bgm.readyState < 2) {
            bgm.load();
        }
    
        const tryPlay = () => {
            const promise = bgm.play();
            promise;
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