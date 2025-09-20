import { ResponseHandler } from '../../../helpers/ResponseHandler';
import { IClinicRepository } from '../../../infrastructure/database/repositories/ClinicRepository/IClinicRepository';

import { Clinic } from '../../entities/EntityClinic/Clinic';

export class ClinicValidator {
  async clinicAlreadyExists(clinic: Clinic, repository: IClinicRepository) {
    if (!clinic.cnpj) return ResponseHandler.error('CNPJ is required');

    try {
      const clinicFounded = await repository.findByCnpj(clinic.cnpj);

      if (clinicFounded) return ResponseHandler.error('Clinic already exists');
      return ResponseHandler.success("Clinic don't exists");
    } catch (e) {
      return ResponseHandler.error((e as Error).message);
    }
  }
}
