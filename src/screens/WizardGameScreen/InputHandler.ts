export class InputHandler {
    private keys: Record<string, boolean>;
    private listenersBound: boolean;
    private allowed: Set<string>;

    constructor(){
        this.keys = {};
        this.listenersBound = false;
        const allowedKeys = [
            "ArrowUp","ArrowDown","ArrowLeft","ArrowRight",
            "w","a","s","d","f","e","r",
        ];

        this.allowed = new Set(allowedKeys.map(k => k.toLowerCase()));
    }

    public bind() {
        if (this.listenersBound) return;
        window.addEventListener("keydown", this.onKeyDown);
        window.addEventListener("keyup", this.onKeyUp);
        this.listenersBound = true;
    }

    public unbind() {
        if (!this.listenersBound) return;
        window.removeEventListener("keydown", this.onKeyDown);
        window.removeEventListener("keyup", this.onKeyUp);
        // Clear all keys to prevent input from continuing after unbinding
        this.keys = {};
        this.listenersBound = false;
    }

    private onKeyDown = (e: KeyboardEvent) => {
        const key = e.key.toLowerCase(); 
        if (this.allowed.has(key)) {
            this.keys[key] = true;
        }
    };  

    private onKeyUp = (e: KeyboardEvent) => {
        const key = e.key.toLowerCase(); 
        if (this.allowed.has(key)) {
            this.keys[key] = false;
        }
    };

    public isDown(key: string): boolean {
        //first pressed keys set to false
        return Boolean(this.keys[key.toLowerCase()]);
    }
}