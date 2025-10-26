import { FinancialBuilder } from "../../../../domain/entities/EntityFinancial/FinancialBuilder";
import { SchedulingBuilder } from "../../../../domain/entities/EntityScheduling/SchedulingBuilder";
import { SchedulingFactory } from "../../../../domain/entities/EntityScheduling/SchedulingFactory";
import { CalculateTransfers } from "../../../../domain/validators/FinancialValidator/CalculateTransfers";
import { EntityExits } from "../../../../domain/validators/General/EntityExits";
import { RequiredGeneralData } from "../../../../domain/validators/General/RequiredGeneralData";
import { ValidatorController } from "../../../../domain/validators/ValidatorController";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import { ConsultationSchedulingRepository } from "../../../../infrastructure/database/repositories/ConsultationSchedulingRepository/ConsultationSchedulingRepository";
import { FinancialRepository } from "../../../../infrastructure/database/repositories/FinancialRepository/FinancialRepository";
import { IRepository } from "../../../../infrastructure/database/repositories/IRepository";
import { FinancialDTO } from "../../../../infrastructure/DTOs/FinancialDTO";

export class CreateFinancialService {
    private repository: IRepository;
    private schedulingRepository: IRepository;

    constructor(){
        this.repository = new FinancialRepository()
        this.schedulingRepository = new ConsultationSchedulingRepository()
    }
    async execute(financialDTO: FinancialDTO){
        try {
            const scheduling = SchedulingFactory.createFromDTO(financialDTO.scheduling)
            scheduling.setUuidHash(financialDTO.scheduling.id ?? "")

            const financialDomain = new FinancialBuilder()
            .setDate(financialDTO.date ? new Date(financialDTO.date) : undefined)
            .setTotal(financialDTO.total ?? 0)
            .setTotalClinic(financialDTO.totalClinic ?? 0)
            .setTotalDoctor(financialDTO.totalDoctor ?? 0)
            .setTotalInsurance(financialDTO.totalInsurance ?? 0)
            .setScheduling(scheduling)
            .build()

            const validator = new ValidatorController()
            validator.setValidator(`C-${financialDomain.constructor.name}`, [ 
                new EntityExits(), 
                new CalculateTransfers(this.schedulingRepository),
                new RequiredGeneralData(Object.keys(financialDomain.props), [], ["date"])
            ])

            const financialIsValid = await validator.process(`C-${financialDomain.constructor.name}`, financialDomain, this.repository)
            if(!financialIsValid.success) return financialIsValid
            
            const financialInserted = await this.repository.create(financialDomain)
            return ResponseHandler.success(financialInserted, "Success ! Financial inserted.")
        } catch(e){
            return ResponseHandler.error((e as Error).message)
        }
    }
}