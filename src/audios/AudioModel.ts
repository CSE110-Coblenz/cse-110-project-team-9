export class AudioModel {
    private static instance: AudioModel | null = null;
    public sounds: Record<string, HTMLAudioElement>;
    private volume: number;

    private constructor() {

        // Reset volume when restarting the game
        localStorage.removeItem("volume");

        this.sounds = {
            home_bgm: new Audio("/homescreen/audio/medieval.mp3"),
            click_sfx: new Audio("/homescreen/audio/click.mp3"),
        };

        this.sounds.bgm.loop = true;
    
        const savedBgmVolume = localStorage.getItem("bgmvolume");
        const parsedBgmVolume = parseFloat(savedBgmVolume ?? "0.5");

        const savedSfxVolume = localStorage.getItem("sfxvolume");
        const parsedSfxVolume = parseFloat(savedSfxVolume ?? "0.5");
        
        // Validate volume (BGM)
        this.volume = !isFinite(parsedBgmVolume) || parsedBgmVolume < 0 || parsedBgmVolume > 1
            ? 0.5
            : parsedBgmVolume;
        
        // Validate volume (SFX)
        this.volume = !isFinite(parsedSfxVolume) || parsedSfxVolume < 0 || parsedSfxVolume > 1
            ? 0.5
            : parsedSfxVolume;

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
