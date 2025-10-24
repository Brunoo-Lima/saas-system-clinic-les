import { DoctorBuilder } from "../../../../../domain/entities/EntityDoctor/DoctorBuilder";
import { SpecialtyBuilder } from "../../../../../domain/entities/EntitySpecialty/SpecialtyBuilder";
import { EntityExistsToInserted } from "../../../../../domain/validators/General/EntityExistsToInserted";
import { RequiredGeneralData } from "../../../../../domain/validators/General/RequiredGeneralData";
import { UUIDValidator } from "../../../../../domain/validators/General/UUIDValidator";
import { ValidatorController } from "../../../../../domain/validators/ValidatorController";
import { ResponseHandler } from "../../../../../helpers/ResponseHandler";
import { DoctorRepository } from "../../../../../infrastructure/database/repositories/DoctorRepository/DoctorRepository";
import { IRepository } from "../../../../../infrastructure/database/repositories/IRepository";
import { SpecialtyRepository } from "../../../../../infrastructure/database/repositories/SpecialtyRepository/SpecialtyRepository";
import { DoctorDTO } from "../../../../../infrastructure/DTOs/DoctorDTO";

export class AddSpecialtiesToDoctorService {
    private repository: IRepository & DoctorRepository;
    private specialtyRepository: IRepository;

    constructor(){
        this.repository = new DoctorRepository()
        this.specialtyRepository = new SpecialtyRepository()
    }
    async execute(doctor: DoctorDTO){
        try {
            const specialtiesDomain = doctor.specialties?.map((sp) => {
                const specialty = new SpecialtyBuilder().setName(sp.name).build()
                specialty.setUuidHash(sp.id ?? "")

                return specialty
            }) ?? []

            const validator = new ValidatorController()
            const doctorDomain = new DoctorBuilder()
            .setPercentDistribution(doctor.percentDistribution)
            .setSpecialties(specialtiesDomain)
            .build()
            doctorDomain.setUuidHash(doctor.id ?? "")

            if(!doctorDomain?.specialties?.[0]) return ResponseHandler.error("The specialties is required !")
            validator.setValidator(`U-${doctorDomain.constructor.name}`, [
                new UUIDValidator(),
                new RequiredGeneralData(Object.keys(doctorDomain.props), [], ["percentDistribution"]),
                new EntityExistsToInserted()
            ])
            
            validator.setValidator(`F-${doctorDomain.specialties?.[0]?.constructor.name}`, [
                new UUIDValidator(),
                new EntityExistsToInserted()
            ])
            
            const entitiesIsValid = await Promise.all([
                await validator.process(`U-${doctorDomain.constructor.name}`, doctorDomain, this.repository),
                await validator.process(`F-${doctorDomain.specialties?.[0]?.constructor.name}`, doctorDomain.specialties[0], this.specialtyRepository)
            ])
            const hasErrors = entitiesIsValid.filter((v) => !v.success)
            if(hasErrors.length) return ResponseHandler.error(hasErrors.map(e => e.message).flat())
            const specialtyAdded = await this.repository.addSpecialty(doctorDomain)
            if(!Array.isArray(specialtyAdded)) return specialtyAdded

            return ResponseHandler.success(specialtyAdded, "Specialties linked to doctor")
        } catch(e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}