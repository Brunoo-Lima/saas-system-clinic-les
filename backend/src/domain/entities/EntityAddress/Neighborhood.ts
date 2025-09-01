import { INeighborhood } from "../../@types/Address/INeighborhood";
import { EntityDomain } from "../EntityDomain";

export class Neighborhood extends EntityDomain {
    constructor(
        private neighborhoodProps: INeighborhood
    ) {
        super()
    }
}