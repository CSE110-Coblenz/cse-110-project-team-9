export class InputHandler {
    private keys: Record<string, boolean>;
    private listenersBound: boolean;
    private allowedKeys: string[];

    constructor(){
        this.keys = {};
        this.listenersBound = false;
        this.allowedKeys = [
            "ArrowUp","ArrowDown","ArrowLeft","ArrowRight",
            "w","a","s","d","f","e","r",
        ];
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
    }

    private onKeyDown = (e: KeyboardEvent) => {
        const key = e.key.toLowerCase(); 
        if (this.allowedKeys.includes(key)) {
            this.keys[e.key] = true;
        }

    };  

    private onKeyUp = (e: KeyboardEvent) => {
        const key = e.key.toLowerCase(); 
        if (this.allowedKeys.includes(key)) {
            this.keys[e.key] = false;
        }
    };

    public isDown(key: string): boolean {
        //bang operation !! always returns true for that key
        return !!this.keys[key];
    }
}