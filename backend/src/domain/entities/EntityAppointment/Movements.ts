import { IMovements } from "../../@types/Movements/IMovements";
import { EntityDomain } from "../EntityDomain";

export class Appointment extends EntityDomain {
    constructor(
        private appointmentProps: IMovements
    ){
        super()
    }
}