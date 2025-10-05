import { EntityExits } from '../../../../domain/validators/General/EntityExits';
import { ValidatorController } from '../../../../domain/validators/ValidatorController';
import { ResponseHandler } from '../../../../helpers/ResponseHandler';
import db from '../../../../infrastructure/database/connection';
import { AddressRepository } from '../../../../infrastructure/database/repositories/AddressRepository/AddressRepository';
import { ClinicRepository } from '../../../../infrastructure/database/repositories/ClinicRepository/ClinicRepository';
import { findOrCreate } from '../../../../infrastructure/database/repositories/findOrCreate';
import { IRepository } from '../../../../infrastructure/database/repositories/IRepository';
import { City } from '../../../../domain/entities/EntityAddress/City';
import { State } from '../../../../domain/entities/EntityAddress/State';
import { Country } from '../../../../domain/entities/EntityAddress/Country';
import { Address } from '../../../../domain/entities/EntityAddress/Address';
import { CountryRepository } from '../../../../infrastructure/database/repositories/CountryRepository/CountryRepository';
import { StateRepository } from '../../../../infrastructure/database/repositories/StateRepository/StateRepository';
import { CityRepository } from '../../../../infrastructure/database/repositories/CityRepository/CityRepository';
import { RequiredGeneralData } from '../../../../domain/validators/General/RequiredGeneralData';
import { InsuranceRepository } from '../../../../infrastructure/database/repositories/InsurancesRepository/InsurancesRepository';
import { ValidInsuranceData } from '../../../../domain/validators/InsuranceValidator/ValidInsuranceData';
import { PropsValidator } from '../../../../domain/validators/AddressValidator/PropsValidator';
import { SpecialtyRepository } from '../../../../infrastructure/database/repositories/SpecialtyRepository/SpecialtyRepository';
import { ClinicDTO } from '../../../../infrastructure/DTOs/ClinicDTO';
import { ClinicFactory } from '../../../../domain/entities/EntityClinic/ClinicFactory';

export class CreateClinicService {
  private repository: IRepository;
  private addressRepository: IRepository
  private countryRepository: IRepository;
  private stateRepository: IRepository;
  private cityRepository: IRepository;
  private specialtiesRepository: IRepository;

  constructor() {
    this.repository = new ClinicRepository();
    this.addressRepository = new AddressRepository();
    this.countryRepository = new CountryRepository()
    this.stateRepository = new StateRepository()
    this.cityRepository = new CityRepository()
    this.specialtiesRepository = new SpecialtyRepository();
  }

  async execute(clinic: ClinicDTO, userId:string) {
    try {
      const clinicDomain = ClinicFactory.createFromDTO(clinic)
      clinicDomain.user?.setUuidHash(userId)

      const validators = new ValidatorController()
      const className = `C-${clinicDomain.constructor.name}`
      if (typeof clinicDomain.address === "undefined" || !clinicDomain.address) { return ResponseHandler.error("Address is required.") }


      validators.setValidator(className, [
        new EntityExits(),
        new RequiredGeneralData(Object.keys(clinicDomain.props))
      ])

      validators.setValidator(`C-${clinicDomain.address?.constructor.name}`, [
        new PropsValidator(),
        new EntityExits()
      ])

      const entitiesValidated = await Promise.all([
        await validators.process(className, clinicDomain, this.repository),
        await validators.process(`C-${clinicDomain.address.constructor.name}`, clinicDomain.address, this.addressRepository)
      ])
      
      const errors = entitiesValidated.filter((err) => !err.success)
      if (errors.length) return ResponseHandler.error(errors.map((er) => er.message[0]))

      if (clinicDomain.insurances && clinicDomain.insurances?.length !== 0) {
        validators.setValidator("insurances", [new ValidInsuranceData()])
        const insurancesIsValid = await validators.process("insurances", clinicDomain.insurances ?? [], new InsuranceRepository())
        if (!insurancesIsValid.success) return insurancesIsValid
      }

      if (clinicDomain.specialties && clinicDomain.specialties?.length !== 0) {
        validators.setValidator("F-Specialties", [
          new RequiredGeneralData(Object.keys(clinicDomain.specialties[0]?.props!))
        ])

        const specialtiesValid = await validators.process("F-Specialties", clinicDomain.specialties ?? [], this.specialtiesRepository)
        if (!specialtiesValid.success) return specialtiesValid
      }

      const entitiesInserted = await db.transaction(async (tx) => {
        const addressDomain = clinicDomain.address as Address;
        const cityDomain = clinicDomain.address?.city as City;
        const stateDomain = clinicDomain.address?.city?.state as State;
        const countryDomain = clinicDomain.address?.city?.state?.country as Country;

        await findOrCreate(this.countryRepository, countryDomain, tx);
        await findOrCreate(this.stateRepository, stateDomain, tx);
        await findOrCreate(this.cityRepository, cityDomain, tx);
        if(clinicDomain.specialties) {
          await Promise.all(
            clinicDomain.specialties?.map(async (sp) => await findOrCreate(this.specialtiesRepository, sp, tx))
          )
        }
        
        const addressInserted = await findOrCreate(this.addressRepository, addressDomain, tx);
        const clinicInserted = await this.repository.create(clinicDomain, tx)

        return {
          address: addressInserted[0],
          clinic: clinicInserted
        }
      })
      if (!entitiesInserted.address || !entitiesInserted.clinic) return ResponseHandler.error("Failed to inserted the clinic and/or the addresses in database !")

      return ResponseHandler.success(entitiesInserted, "Success entities inserted !")
    } catch (error) {
      return ResponseHandler.error([
        `Failed to create clinic because: ${(error as Error).message}`,
      ]);
    }
  }
}
