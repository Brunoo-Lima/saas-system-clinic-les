import { SchedulingFactory } from "../../../../domain/entities/EntityScheduling/SchedulingFactory";
import { DateSchedulingValidator } from "../../../../domain/validators/ConsultationScheduling/DatesSchedulingValidator";
import { ExistsScheduling } from "../../../../domain/validators/ConsultationScheduling/ExistsScheduling";
import { EntityExistsToInserted } from "../../../../domain/validators/General/EntityExistsToInserted";
import { RequiredGeneralData } from "../../../../domain/validators/General/RequiredGeneralData";
import { UUIDValidator } from "../../../../domain/validators/General/UUIDValidator";
import { ValidatorController } from "../../../../domain/validators/ValidatorController";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import { ConsultationSchedulingRepository } from "../../../../infrastructure/database/repositories/ConsultationSchedulingRepository/ConsultationSchedulingRepository";
import { DoctorRepository } from "../../../../infrastructure/database/repositories/DoctorRepository/DoctorRepository";
import { InsuranceRepository } from "../../../../infrastructure/database/repositories/InsurancesRepository/InsurancesRepository";
import { IRepository } from "../../../../infrastructure/database/repositories/IRepository";
import { PatientRepository } from "../../../../infrastructure/database/repositories/PatientRepository/PatientRepository";
import { SpecialtyRepository } from "../../../../infrastructure/database/repositories/SpecialtyRepository/SpecialtyRepository";
import { ConsultationSchedulingDTO } from "../../../../infrastructure/DTOs/ConsultationSchedulingDTO";
import { queueNewScheduling } from "../../../../infrastructure/queue/queue_email_client";

export class CreateSchedulingService {
    private repository: IRepository;
    private insuranceRepository: IRepository;
    private specialtyRepository: IRepository;
    private doctorRepository: IRepository;
    private patientRepository: IRepository;

    constructor() {
        this.repository = new ConsultationSchedulingRepository()
        this.insuranceRepository = new InsuranceRepository()
        this.specialtyRepository = new SpecialtyRepository()
        this.doctorRepository = new DoctorRepository()
        this.patientRepository = new PatientRepository()
    }
    async execute(schedulingDTO: ConsultationSchedulingDTO) {
        try {
            const consultationSchedulingDomain = SchedulingFactory.createFromDTO(schedulingDTO)
            const { doctor, specialty, insurance, patient } = consultationSchedulingDomain
            if (!doctor || !specialty || !insurance || !patient) return ResponseHandler.error("You can all required data of the: Doctor, Patient, Insurance and Specialty")

            const validator = new ValidatorController()
            validator.setValidator(`C-${consultationSchedulingDomain.constructor.name}`, [
                new UUIDValidator(),
                new DateSchedulingValidator(),
                new ExistsScheduling(),
                new RequiredGeneralData(Object.keys(consultationSchedulingDomain.props), ["dateOfConfirmation", "dateOfRealizable", "timeOfConsultation"])
            ])

            validator.setValidator(`F-${doctor.constructor.name}`, [
                new UUIDValidator(),
                new EntityExistsToInserted(),
            ])

            validator.setValidator(`F-${specialty.constructor.name}`, [
                new UUIDValidator(),
                new EntityExistsToInserted(),
            ])

            validator.setValidator(`F-${patient.constructor.name}`, [
                new UUIDValidator(),
                new EntityExistsToInserted(),
            ])
            const entitiesIsValid = await Promise.all([
                await validator.process(`C-${consultationSchedulingDomain.constructor.name}`, consultationSchedulingDomain, this.repository),
                await validator.process(`F-${doctor.constructor.name}`, doctor, this.doctorRepository),
                await validator.process(`F-${specialty.constructor.name}`, specialty, this.specialtyRepository),
                await validator.process(`F-${patient.constructor.name}`, patient, this.patientRepository)
            ])
            if (consultationSchedulingDomain.insurance?.getUUIDHash()) {
                validator.setValidator(`F-${insurance.constructor.name}`, [
                    new UUIDValidator(),
                    new EntityExistsToInserted(),
                ])

                const insuranceIsValid = await validator.process(`F-${insurance.constructor.name}`, insurance, this.insuranceRepository)
                if(!insuranceIsValid.success) return insuranceIsValid
            }
            const hasErrors = entitiesIsValid.filter((er) => !er.success)
            if (hasErrors.length) return ResponseHandler.error(hasErrors.map((err) => err.message).flat())

            const schedulingInserted = await this.repository.create(consultationSchedulingDomain);
            await queueNewScheduling.add("new_scheduling_email", {...schedulingInserted[0], template: "new_scheduling"})      

            return ResponseHandler.success(schedulingInserted, "Success ! Scheduling confirmed.")
        } catch (e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}