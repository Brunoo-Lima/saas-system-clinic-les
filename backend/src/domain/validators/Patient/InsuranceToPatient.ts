import { ResponseHandler } from "../../../helpers/ResponseHandler";
import { InsuranceRepository } from "../../../infrastructure/database/repositories/InsurancesRepository/InsurancesRepository";
import { IRepository } from "../../../infrastructure/database/repositories/IRepository";
import { Patient } from "../../entities/EntityPatient/Patient";
import { EntityExits } from "../General/EntityExits";
import { IProcessValidator } from "../IProcessValidator";

export class InsuranceToPatient implements IProcessValidator {
    async valid(patient: Patient, repository: IRepository) {
        try {
            const insurances = patient.insurances ?? []
            const insuranceRepository = new InsuranceRepository()
            const patientValidator = new EntityExits()
            const insurancesExists = await insuranceRepository.findAllEntity(insurances)
            const patientExists = await patientValidator.valid(patient, repository)
            
            if (patientExists.data === null) { return patientExists }
            if ("success" in insurancesExists) { return insurancesExists }
            if (Array.isArray(insurancesExists) && insurancesExists.length === 0) { return ResponseHandler.error("Insurances not exits !") }

            const ids: string[] = []
            const types: string[] = []

            insurancesExists.map((ins: { id: any, type: any }) => {
                ids.push(ins.id)
                types.push(ins.type)
            })

            const hasInsurances = insurances.map((ins) => 
                (ins.type && !ids.includes(ins.getUUIDHash()) && !types.includes(ins.type)) 
                ? ResponseHandler.error(`Insurance ${ins.type} not found.`) 
                : ResponseHandler.success(ins, "Insurance found"))
            .filter(res => !res.success)
            if(hasInsurances.length) return ResponseHandler.error(hasInsurances.map((res) => res.message))
            if (insurances.length === 0) return ResponseHandler.success("No insurances to validate");
            if(patientExists.data.length !== 0){
                const patientInsurancesDomain = patient.insurances?.map((pts) => pts.getUUIDHash()) ?? []
                for(const pts of patientExists.data){
                    const id = pts.patient_to_insurance.insurance_id
                    if(patientInsurancesDomain.includes(pts.patient_to_insurance.insurance_id)){ return ResponseHandler.error(`Insurance with id: ${id} already connected.`) }
                }
            }
            return ResponseHandler.success("Insurance found")
        } catch (e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}