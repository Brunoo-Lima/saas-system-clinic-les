import { IResponseHandler, ResponseHandler } from "../../../helpers/ResponseHandler";
import { Scheduling } from "../../entities/EntityScheduling/Scheduling";
import { Person } from "../../entities/Person";
import { IProcessValidator } from "../IProcessValidator";

export class FormatDateValidator implements IProcessValidator {
    async valid(entity: Person | Scheduling) {
        try {

            const regex = /^(\d{4}\-\d{2}\-\d{2})$/gm
            if(entity instanceof Person){
                const dateBirth = entity.dateOfBirth?.toISOString().split("T")[0]
                if(dateBirth && regex.test(dateBirth)){ return ResponseHandler.success(entity, "Date is valid")}
            }
            if(entity instanceof Scheduling){
                const dateStart = entity.date?.toISOString().split("T")[0]
                if(dateStart && regex.test(dateStart)) { return ResponseHandler.success(entity, "Date of scheduling is valid !")}
            }
            return ResponseHandler.error("The date sended is not valid or invalid date, you should be sent the format date: yyyy-mm-dd.");
        } catch(e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}