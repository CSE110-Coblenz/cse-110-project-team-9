export class SettingsScreenModel {
    
    // Stores the current game volume value (range: 0.0 ~ 1.0)
    private volume: number = 0.5;
  
    // A list of callback functions to notify when the volume changes
    private listeners: ((value: number) => void)[] = [];
  
    // Updates the volume value and notifies all listeners
    setVolume(value: number): void {
      
    // Volume is between 0 and 1 to prevent invalid values
      this.volume = Math.max(0, Math.min(1, value));
  
      // Notify all registered listeners about the new volume
      this.listeners.forEach((cb) => cb(this.volume));
    }
  
    // Returns the current volume value
    getVolume(): number {
      return this.volume;
    }
  
    // Registers a new callback function that will be called whenever the volume changes
    onVolumeChange(callback: (value: number) => void): void {
      // Add the callback to the list of listeners
      this.listeners.push(callback);
    }
  }
  
  