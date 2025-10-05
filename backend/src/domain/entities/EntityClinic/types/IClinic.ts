import { Address } from "../../EntityAddress/Address";
import { Insurance } from "../../EntityInsurance/Insurance";
import { Specialty } from "../../EntitySpecialty/Specialty";
import { User } from "../../EntityUser/User";

export interface IClinic {
  name?: string;
  insurances?: Array<Insurance>;
  timeToConfirmScheduling?: string; // Tempo para disparar a confirmacao de agendamento
  specialties?: Array<Specialty>;
  phone?: string;
  user?: User;
  cnpj?: string;
  address?: Address;
}
