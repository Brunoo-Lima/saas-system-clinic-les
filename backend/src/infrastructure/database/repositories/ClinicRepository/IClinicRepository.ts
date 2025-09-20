import { Clinic } from '../../../../domain/entities/EntityClinic/Clinic';

export interface IClinicRepository {
  create(clinic: Clinic): Promise<any>;
  findAll(): Promise<Clinic[]>;
  findById(id: string): Promise<any>;
  findByCnpj(cnpj: string): Promise<any>;
  update(id: string, data: Partial<Clinic>): Promise<any>;
  delete(id: string): Promise<any>;
}
