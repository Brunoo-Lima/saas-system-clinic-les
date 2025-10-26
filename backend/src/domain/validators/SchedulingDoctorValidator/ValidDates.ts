import { ResponseHandler } from "../../../helpers/ResponseHandler";
import { DoctorScheduling } from "../../entities/EntityDoctorScheduling/DoctorScheduling";
import { IProcessValidator } from "../IProcessValidator";

export class ValidDatesToSchedulingDoctor implements IProcessValidator {
    valid(schedulingDoctor: DoctorScheduling){
        try {
            const regex = /^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/
            const dateFrom = schedulingDoctor.dayFrom;
            const dateTo = schedulingDoctor.dayTo;
            const dateNow = new Date()
            dateNow.setHours(dateNow.getHours() - schedulingDoctor.getTimezone())

            if (!dateFrom || !dateTo)  throw new Error("dateFrom is null or undefined");

            const yearFrom = dateFrom.getFullYear();
            const monthFrom = String(dateFrom.getMonth() + 1).padStart(2, '0'); // Add 1 because months are 0-indexed
            const dayFrom = String(dateFrom.getDate()).padStart(2, '0');
            
            const yearTo = dateTo.getFullYear();
            const monthTo = String(dateTo.getMonth() + 1).padStart(2, '0'); // Add 1 because months are 0-indexed
            const dayTo = String(dateTo.getDate()).padStart(2, '0');

            const dateFromFormatted = `${yearFrom}-${monthFrom}-${dayFrom}`;
            const dateToFormatted = `${yearTo}-${monthTo}-${dayTo}`;
            if(!regex.test(dateFromFormatted) || !regex.test(dateToFormatted)) return ResponseHandler.error(("The date From or To is invalid."))
            
            if(dateFrom < dateNow) return ResponseHandler.error("The Date from is before now !")
            if(dateTo < dateNow || dateTo < dateFrom) return ResponseHandler.error("The date to is before now or before the date from")

            return ResponseHandler.success(schedulingDoctor, "The dates is valid !")
        } catch(e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
    
}