type KeyCallback = () => void;

export class InputHandler {
    private keys: Record<string, boolean>;
    private listenersBound: boolean;
    private allowedKeys: string[];
    private globalKeyCallbacks: Map<string, KeyCallback>;

    constructor(){
        this.keys = {};
        this.listenersBound = false;
        this.allowedKeys = [
            "ArrowUp","ArrowDown","ArrowLeft","ArrowRight",
            "w","a","s","d","f","e","r",
            "b","Escape","1"
        ];
        this.globalKeyCallbacks = new Map();
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
        this.listenersBound = false;
        this.globalKeyCallbacks.clear();
    }

    public registerGlobalKey(key: string, callback: KeyCallback): void {
        this.globalKeyCallbacks.set(key, callback);
    }

    public unregisterGlobalKey(key: string): void {
        this.globalKeyCallbacks.delete(key);
    }

    private onKeyDown = (e: KeyboardEvent) => {
        const key = e.key.toLowerCase(); 
        if (this.allowedKeys.includes(key) || this.allowedKeys.includes(e.key)) {
            this.keys[e.key] = true;
        }

        // Handle global key callbacks (check both original and lowercase)
        const callback = this.globalKeyCallbacks.get(e.key) || this.globalKeyCallbacks.get(key);
        if (callback) {
            callback();
        }
    };  

    private onKeyUp = (e: KeyboardEvent) => {
        const key = e.key.toLowerCase(); 
        if (this.allowedKeys.includes(key)) {
            this.keys[e.key] = false;
        }
    };

    public isDown(key: string): boolean {
        return !!this.keys[key];
    }
}