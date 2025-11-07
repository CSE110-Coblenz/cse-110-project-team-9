export class AudioModel {
    private static instance: AudioModel | null = null;
    public sounds: Record<string, HTMLAudioElement>;
    private bgmVolume: number;
    private sfxVolume: number;

    private constructor() {

        // Reset volume when restarting the game
        // localStorage.removeItem("bgmvolume");
        // localStorage.removeItem("sfxvolume");
    
        const savedBgmVolume = parseFloat(localStorage.getItem("bgm_volume") ?? "0.5");
        this.bgmVolume = this.validateVolume(savedBgmVolume);

        const savedSfxVolume = parseFloat(localStorage.getItem("sfx_volume") ?? "0.5");
        this.sfxVolume = this.validateVolume(savedSfxVolume);

        // Intial volume (HomeScreen)
        this.sounds = {
            home_bgm: new Audio("/homescreen/audio/medieval.mp3"),
            click_sfx: new Audio("/homescreen/audio/click.mp3"),
        };

        this.sounds.home_bgm.loop = true;

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
     * Register a new sound
     * @param key
     * @param path
     * @param loop Whether the sound should loop
     * @param overwrite Whether to overwrite an existing sound with the same key
     */

    public registerSound(key: string, path: string, loop: boolean = false, overwrite = false): void {
        
        if (!this.sounds[key] || overwrite) {
            
            const audio = new Audio(path);
            
            // Set if the sound should loop or not
            audio.loop = loop;

            // If the key includes "bgm", set volume to bgmVolume, else sfxVolume
            audio.volume = key.includes("bgm") ? this.bgmVolume : this.sfxVolume;

            this.sounds[key] = audio;
        }
    }

    /**
     * Getter and Setter for volume
     * @param volume A number between 0.0 and 1.0
     */

    public setBgmVolume(volume: number): void {
        this.bgmVolume = this.validateVolume(volume);
        localStorage.setItem("bgm_volume", this.bgmVolume.toString());
        this.applyVolume();
    }

    public setSfxVolume(volume: number): void {
        this.sfxVolume = this.validateVolume(volume);
        localStorage.setItem("sfx_volume", this.sfxVolume.toString());
        this.applyVolume();
    }

    public getBgmVolume(): number {
        return this.bgmVolume;
    }

    public getSfxVolume(): number {
        return this.sfxVolume;
    }

    /**
     * Apply the current volume to all sounds
     */

    private applyVolume(): void {
        for (const key in this.sounds) {
            if (key.includes("bgm")) {
                this.sounds[key].volume = this.bgmVolume;
            } else {
                this.sounds[key].volume = this.sfxVolume;
            }
        }
    }

    /**
     * Validate volume
     */

    private validateVolume(volume: number): number {
        return !isFinite(volume) || volume < 0 || volume > 1 ? 0.5 : volume;
    }
}