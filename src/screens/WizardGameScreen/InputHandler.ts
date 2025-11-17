export class InputHandler {
    private keys: Record<string, boolean>;
    private listenersBound: boolean;
    private allowedKeys: string[];

    constructor(){
        this.keys = {};
        this.listenersBound = false;
        this.allowedKeys = [
            "ArrowUp","ArrowDown","ArrowLeft","ArrowRight",
            "w","a","s","d","f","e","r"
        ];
    }

    /**
     * add Listening functionality
     */
    private bind() {
        if (this.listenersBound) return;
        window.addEventListener("keydown", this.onKeyDown);
        window.addEventListener("keyup", this.onKeyUp);
        this.listenersBound = true;
    }

    /**
     * remove Listening functionaliyt
     */
    public unbind() {
        if (!this.listenersBound) return;
        window.removeEventListener("keydown", this.onKeyDown);
        window.removeEventListener("keyup", this.onKeyUp);
        this.listenersBound = false;
    }

    /**
     * takex x input key to be true (pressed)
     * @param e keyboard event
     */
    private onKeyDown = (e: KeyboardEvent) => {
        if (this.allowedKeys.includes(e.key)) {
            this.keys[e.key] = true;
        }
    };

    /**
     * takes x input key to be false (not pressed)
     * @param e keyboard event
     */
    private onKeyUp = (e: KeyboardEvent) => {
        if (this.allowedKeys.includes(e.key)) {
            this.keys[e.key] = false;
        }
    };

    /**
     * 
     * @param key keyboard key
     * @returns is the key pressed
     */
    public isDown(key: string): boolean {
        //bang operation !! always returns true for that key
        return !!this.keys[key];
    }
}