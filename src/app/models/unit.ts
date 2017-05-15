export class Unit {
    constructor();
    constructor(name?: string, step?: number) {
        this.name = name;
        this.step = step;
    }
    id: number;
    name: string;
    step: number;
}