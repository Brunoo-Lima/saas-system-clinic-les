import { IState } from "./types/IState";
import { EntityDomain } from "../EntityDomain";

export class State extends EntityDomain {
    constructor(
        private stateProps: IState
    ) {
        super()
    }

    public get name() {
        return this.stateProps.name
    }


    public get country() {
        return this.stateProps.country
    }


    public get uf() {
        return this.stateProps.uf
    }
}