export class WizardProjectileModel {
    public x: number;
    public y: number;
    public width: number;
    public height: number;
    public speed: number;

    constructor(x = 0, y = 0, width = 8, height = 8, speed = 300) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
    }
}
