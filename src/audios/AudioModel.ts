export class AudioModel {
    private static instance: AudioModel | null = null;
    public sounds: Record<string, HTMLAudioElement>;
    private _bgmVolume: number;
    private _sfxVolume: number;

    private constructor() {
        this._bgmVolume = 0.5;
        this._sfxVolume = 0.5;

        this.sounds = {};
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
    public setBgmVolume(volume: number): void {
        this._bgmVolume = volume;
        this.applyVolume();
    }

    public setSfxVolume(volume: number): void {
        this._sfxVolume = volume;
        this.applyVolume();
    }

    get bgmVolume() { return this._bgmVolume; }
    get sfxVolume() { return this._sfxVolume; }

    /**
     * Apply the current volume to all sounds
     */
    private applyVolume(): void {
        for (const key in this.sounds) {
            const audio = this.sounds[key];
            audio.volume = key.includes("bgm") ? this._bgmVolume : this._sfxVolume;
        }
    }
}