import { ResponseHandler } from "../../../helpers/ResponseHandler";
import { AddressRepository } from "../../../infrastructure/database/repositories/AddressRepository/AddressRepository";
import { ClinicRepository } from "../../../infrastructure/database/repositories/ClinicRepository/ClinicRepository";
import { IRepository } from "../../../infrastructure/database/repositories/IRepository";
import { SpecialtyRepository } from "../../../infrastructure/database/repositories/SpecialtyRepository/SpecialtyRepository";
import { UserRepository } from "../../../infrastructure/database/repositories/UserRepository/UserRepository";
import { Doctor } from "../../entities/EntityDoctor/Doctor";
import { PropsValidator } from "../AddressValidator/PropsValidator";
import { EntityExistsToInserted } from "../General/EntityExistsToInserted";
import { EntityExits } from "../General/EntityExits";
import { RequiredGeneralData } from "../General/RequiredGeneralData";
import { UUIDValidator } from "../General/UUIDValidator";
import { IProcessValidator } from "../IProcessValidator";
import { ValidatorController } from "../ValidatorController";

export class AllValidatorToCreateDoctor implements IProcessValidator {
    private clinicRepository: IRepository = new ClinicRepository()
    private specialtyRepository: IRepository = new SpecialtyRepository()
    private userRepository: IRepository = new UserRepository()
    private addressRepository: IRepository = new AddressRepository()

    constructor(private validator: ValidatorController){}
    async valid(doctor: Doctor){
       try {
            if (typeof doctor.address === "undefined" || !doctor.address) { return ResponseHandler.error("Address is required.") }

            this.validator.setValidator(`C-${doctor.address.constructor.name}`, [
                new PropsValidator(),
                new EntityExits()
            ])
            
            this.validator.setValidator(`F-Specialties`, [
                new UUIDValidator(),
                new EntityExistsToInserted(),
                new RequiredGeneralData(Object.keys(doctor.specialties?.[0] ?? {})),
            ])
            this.validator.setValidator(`F-User`, [
                new UUIDValidator(),
                new EntityExits(),
                new RequiredGeneralData(Object.keys(doctor.user ?? {})),
            ])

            const entitiesValidated = await Promise.all([
                await this.validator.process(`F-Specialties`, doctor.specialties!, this.specialtyRepository),
                await this.validator.process(`F-User`, doctor.user!, this.userRepository),
                await this.validator.process(`C-${doctor.address.constructor.name}`, doctor.address!, this.addressRepository),
            ])
            for(const entityIsValid of entitiesValidated){
                if(!entityIsValid.success) return ResponseHandler.error(entityIsValid.message)
            }
            return ResponseHandler.success(doctor, "All entities is valid !")
       } catch(e) {
        return ResponseHandler.error((e as Error).message)
       }
    }
}