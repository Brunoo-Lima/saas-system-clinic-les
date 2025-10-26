import { ResponseHandler } from "../../../helpers/ResponseHandler";
import { FinancialQueriesDAO } from "../../../infrastructure/database/DAO/Queries/FinancialQueriesDAO";
import { ConsultationSchedulingRepository } from "../../../infrastructure/database/repositories/ConsultationSchedulingRepository/ConsultationSchedulingRepository";
import { IRepository } from "../../../infrastructure/database/repositories/IRepository";
import { Financial } from "../../entities/EntityFinancial/Financial";
import { Scheduling } from "../../entities/EntityScheduling/Scheduling";
import { IProcessValidator } from "../IProcessValidator";

export class CalculateTransfers implements IProcessValidator {
    private financialQueriesDAO = new FinancialQueriesDAO()
    constructor(private schedulingRepository: IRepository & ConsultationSchedulingRepository) { }

    async valid(financial: Financial) {
        try {
            if (financial.scheduling?.getUUIDHash()) {
                const schedulingCopy = Object.create(financial.scheduling) as Scheduling
                schedulingCopy.status = "CONCLUDE" // Pegamos somente os valores concluídos

                const schedulingData = await this.schedulingRepository.findAllEntity(schedulingCopy)
                if ((Array.isArray(schedulingData) && !schedulingData.length)) return ResponseHandler.error("You sended the scheduling id, but not exits.")

                const schedulingFounded = schedulingData[0]
                const doctorId = schedulingFounded.doctor.id
                const insuranceId = schedulingFounded.insurance.id
                const specialtyId = schedulingFounded.specialties.id
                const consultationPrice = schedulingFounded.priceOfConsultation ?? 0

                const percentDoctor = await this.financialQueriesDAO.getTotalDoctorSpecialty(doctorId) as any
                const totalInsurance = await this.financialQueriesDAO.getTotalInsurancePerSpecialty(insuranceId, "859cd1df-5d64-44f2-98fa-35760fe7dcef") as any
                const totalClinicPerSpecialty = await this.financialQueriesDAO.getTotalClinicPerSpecialty(specialtyId) as any

                if (percentDoctor.data && (Array.isArray(percentDoctor.data) && !percentDoctor.data[0])) return ResponseHandler.error("The doctor percent not found !")
                if (totalClinicPerSpecialty.data && (Array.isArray(totalClinicPerSpecialty.data) && !totalClinicPerSpecialty.data[0])) return ResponseHandler.error("The clinic price per specialty not found !")

                const totalBrute = Number(consultationPrice) + Number(totalClinicPerSpecialty.data[0].total || 0);
                financial.total = totalBrute;
    
                // Valor transferido pelo convênio (se existir)
                financial.totalInsurance = totalInsurance.data?.[0]?.total_transferred || 0;

                // Total líquido após desconto do convênio
                const totalAfterInsurance = totalBrute - (financial.totalInsurance || 0);

                // Percentual do médico (por exemplo: 0.4 = 40%)
                const percent = percentDoctor.data?.[0]?.percent || 0;

                // Total que o médico deve receber
                financial.totalDoctor = totalAfterInsurance * percent;

                // Total da clínica é o que sobra após pagar o médico
                financial.totalClinic = totalAfterInsurance - financial.totalDoctor;
            }

            return ResponseHandler.success(financial, "Success ! Financial total calculated.")
        } catch (e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}