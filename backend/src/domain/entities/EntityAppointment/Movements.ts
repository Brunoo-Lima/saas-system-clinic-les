import { IMovements } from "./types/IMovements";
import { EntityDomain } from "../EntityDomain";

export class Appointment extends EntityDomain {
    constructor(
        private appointmentProps: IMovements
    ) {
        super()
    }
}