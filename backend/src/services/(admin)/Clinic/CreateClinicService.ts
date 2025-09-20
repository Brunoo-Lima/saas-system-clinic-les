import { Clinic } from '../../../domain/entities/EntityClinic/Clinic';
import { ResponseHandler } from '../../../helpers/ResponseHandler';
import { ClinicRepository } from '../../../infrastructure/database/repositories/ClinicRepository/ClinicRepository';
import { IClinicRepository } from '../../../infrastructure/database/repositories/ClinicRepository/IClinicRepository';

export class CreateClinicService {
  private repository: IClinicRepository;

  constructor() {
    this.repository = new ClinicRepository();
  }

  async execute(clinic: Clinic, userId: string) {
    const clinicAlreadyExists = await this.repository.findByCnpj(
      clinic.cnpj as string,
    );

    if (clinicAlreadyExists) {
      return ResponseHandler.error(['Clinic already exists']);
    }

    try {
      const clinicCreated = await this.repository.create(clinic, userId);

      return clinicCreated;
    } catch (error) {
      return ResponseHandler.error([
        `Failed to create clinic because: ${(error as Error).message}`,
      ]);
    }
  }
}
