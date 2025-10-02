import { AddressDTO } from './AddressDTO';
import { InsuranceDTO } from './InsuranceDTO';
import { SpecialtiesDTO } from './SpecialtiesDTO';
import { UserDTO } from './UserDTO';

export interface ClinicDTO {
  id?: string;
  name?: string;
  insurances?: Array<InsuranceDTO>;
  timeToConfirm?: string; // Tempo para disparar a confirmacao de agendamento
  specialties?: SpecialtiesDTO;
  phone?: string;
  user?: UserDTO;
  cnpj?: string;
  address?: AddressDTO;
}
