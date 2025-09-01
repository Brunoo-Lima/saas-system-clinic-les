import { IState } from "../../@types/Address/IState";
import { EntityDomain } from "../EntityDomain";

export class State extends EntityDomain {
    constructor(
        private stateProps: IState
    ) {
        super()
    }
}