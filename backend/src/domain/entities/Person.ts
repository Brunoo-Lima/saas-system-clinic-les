// Update the import path below to the correct location of IPerson, for example:
import { IPerson } from "./IPerson";
import { EntityDomain } from "./EntityDomain";

export class Person extends EntityDomain {
    constructor(
        private personProps: IPerson
    ) {
        super()
    }

    public get name() {
        return this.personProps.name
    }


    public get cpf() {
        return this.personProps.cpf
    }


    public get dateOfBirth() {
        return this.personProps.dateOfBirth
    }

}