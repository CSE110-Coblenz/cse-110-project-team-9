export class AudioModel {
    private static instance: AudioModel | null = null;
    public sounds: Record<string, HTMLAudioElement>;
    private volume: number;

    private constructor() {

        // Reset volume when restarting the game
        localStorage.removeItem("volume");

        this.sounds = {
            bgm: new Audio("/homescreen/audio/medieval.mp3"),
        };
        this.sounds.bgm.loop = true;
    
        const savedVolume = localStorage.getItem("volume");
        const parsedVolume = parseFloat(savedVolume ?? "0.5");
        
        // Validate volume
        this.volume = !isFinite(parsedVolume) || parsedVolume < 0 || parsedVolume > 1
            ? 0.5
            : parsedVolume;
    
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
