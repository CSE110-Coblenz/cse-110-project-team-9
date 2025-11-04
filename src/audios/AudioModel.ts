export class AudioModel {
    private static instance: AudioModel | null = null;
    public sounds: Record<string, HTMLAudioElement>;
    private volume: number;

    private constructor() {
        this.sounds = {
            bgm: new Audio("/audio/medieval.mp3"),
            click: new Audio("/audio/click.mp3"),
        };
        this.sounds.bgm.loop = true;

        const savedVolume = localStorage.getItem("volume");
        this.volume = savedVolume ? parseFloat(savedVolume) : 0.5;

        this.applyVolume();
    }

    /**
     * @returns The singleton instance of AudioModel
     */

    public static getInstance(): AudioModel {
        if (!AudioModel.instance) {
            AudioModel.instance = new AudioModel();
        }
        return AudioModel.instance;
    }

    /**
     * Getter and Setter for volume
     * @param volume A number between 0.0 and 1.0
     */

    public setVolume(volume: number): void {
        this.volume = volume;
        localStorage.setItem("volume", volume.toString());
        this.applyVolume();
    }

    public getVolume(): number {
        return this.volume;
    }

    /**
     * Apply the current volume to all sounds
     */

    private applyVolume(): void {
        for (const key in this.sounds) {
            this.sounds[key].volume = this.volume;
        }
    }
}
