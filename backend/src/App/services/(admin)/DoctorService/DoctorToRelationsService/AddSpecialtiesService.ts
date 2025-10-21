import { DoctorBuilder } from "../../../../../domain/entities/EntityDoctor/DoctorBuilder";
import { SpecialtyBuilder } from "../../../../../domain/entities/EntitySpecialty/SpecialtyBuilder";
import { EntityExistsToUpdated } from "../../../../../domain/validators/General/EntityExistsToUpdated";
import { RequiredGeneralData } from "../../../../../domain/validators/General/RequiredGeneralData";
import { UUIDValidator } from "../../../../../domain/validators/General/UUIDValidator";
import { ValidatorController } from "../../../../../domain/validators/ValidatorController";
import { ResponseHandler } from "../../../../../helpers/ResponseHandler";
import { DoctorRepository } from "../../../../../infrastructure/database/repositories/DoctorRepository/DoctorRepository";
import { IRepository } from "../../../../../infrastructure/database/repositories/IRepository";
import { SpecialtyRepository } from "../../../../../infrastructure/database/repositories/SpecialtyRepository/SpecialtyRepository";
import { DoctorDTO } from "../../../../../infrastructure/DTOs/DoctorDTO";

export class AddSpecialtiesService {
    private repository: IRepository;
    private specialtyRepository: IRepository;

    constructor(){
        this.repository = new DoctorRepository()
        this.specialtyRepository = new SpecialtyRepository()
    }
    async execute(doctor: DoctorDTO){
        try {
            const specialtiesDomain = doctor.specialties?.map((sp) => {
                const specialty = new SpecialtyBuilder()
                .setName(sp.name)
                .setPrice(sp.price)
                .build()
                return specialty
            }) ?? []

            const validator = new ValidatorController()
            const doctorDomain = new DoctorBuilder()
            .setPercentDistribution(doctor.percentDistribution)
            .setSpecialties(specialtiesDomain)
            .build()
            
            if(!doctorDomain?.specialties?.[0]) return ResponseHandler.error("The specialties is required !")
            validator.setValidator(`U-${doctorDomain.constructor.name}`, [
                new UUIDValidator(),
                new RequiredGeneralData(Object.keys(doctorDomain.props), [], ["percentDistribution"]),
                new EntityExistsToUpdated()
            ])
            validator.setValidator(`F-${doctorDomain.specialties?.[0]?.constructor.name}`, [
                new UUIDValidator(),
                new RequiredGeneralData(Object.keys(doctorDomain.specialties?.[0]?.props ?? ''), [], ["name", "price"]),
                new EntityExistsToUpdated()
            ])
            
            const entitiesIsValid = await Promise.all([
                await validator.process(`U-${doctorDomain.constructor.name}`, doctorDomain, this.repository),
                await validator.process(`F-${doctorDomain.specialties?.[0]?.constructor.name}`, doctorDomain.specialties[0], this.specialtyRepository)
            ])
            const hasErrors = entitiesIsValid.filter((v) => !v.success)
            if(hasErrors.length) return ResponseHandler.error(hasErrors.map(e => e.message))
            //CRIAR OS METODOS ADD NO DOCTOR REPOSITORY
        } catch(e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}