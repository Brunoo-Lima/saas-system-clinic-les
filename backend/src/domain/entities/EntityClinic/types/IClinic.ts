import { Address } from "../../EntityAddress/Address";
import { Insurance } from "../../EntityInsurance/Insurance";
import { Specialty } from "../../EntitySpecialty/Specialty";
import { User } from "../../EntityUser/User";

export interface IClinic {
  name?: string | undefined;
  insurances?: Array<Insurance> | undefined;
  timeToConfirmScheduling?: string | undefined; // Tempo para disparar a confirmacao de agendamento
  specialties?: Array<Specialty> | undefined;
  phone?: string | undefined;
  user?: User | undefined;
  cnpj?: string | undefined;
  address?: Address | undefined; 
}
