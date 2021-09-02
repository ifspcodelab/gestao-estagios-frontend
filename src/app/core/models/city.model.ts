import { State } from "./state.model";

export class City {
    id: string;
    name: string;
    state: State;

    constructor(id: string, name: string, state: State) {
        this.id = id;
        this.name = name;
        this.state = state;
    }
}