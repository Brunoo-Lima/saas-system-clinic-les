import { INeighborhood } from "../../@types/Address/INeighborhood";
import { EntityDomain } from "../EntityDomain";
import { City } from "./City";

export class Neighborhood extends EntityDomain {
    constructor(
        private neighborhoodProps: INeighborhood
    ) {
        super()
    }

    public get city() {
        return this.neighborhoodProps.city
    }
    public get name() {
        return this.neighborhoodProps.name
    }
    
}