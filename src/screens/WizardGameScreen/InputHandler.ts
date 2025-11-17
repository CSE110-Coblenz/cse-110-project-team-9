export class InputHandler {
    private keys: Record<string, boolean> = {};
    //TODO: added more allowed keys for various functions
    private readonly allowedKeys = [
        "ArrowUp","ArrowDown","ArrowLeft","ArrowRight",
        "w","a","s","d","f","e","r"
    ];

    constructor() {
        this.bind();
    }

    /**
     * add Listening functionality
     */
    private bind() {
        window.addEventListener("keydown", this.onKeyDown);
        window.addEventListener("keyup", this.onKeyUp);
    }

    /**
     * remove Listening functionaliyt
     */
    public unbind() {
        window.removeEventListener("keydown", this.onKeyDown);
        window.removeEventListener("keyup", this.onKeyUp);
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
        return !!this.keys[key];
    }
}