export class Player{
    public readonly id: string;
    public position:number;
    public score: number;

    constructor(id: string){
        this.id = id;
        this.position = 0;
        this.score = 0;
    }   
}