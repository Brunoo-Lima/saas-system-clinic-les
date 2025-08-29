// Update the import path below to the correct location of IPerson, for example:
import { IPerson } from "../@types/Person/IPerson";
import { EntityDomain } from "./EntityDomain";

export class Person extends EntityDomain {
    constructor(
        private personProps: IPerson
    ) {
        super()
    }
}