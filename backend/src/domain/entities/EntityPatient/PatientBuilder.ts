import { IPatient } from "../../@types/Patient/IPatient";
import { Address } from "../EntityAddress/Address";
import { Insurance } from "../EntityInsurance/Insurance";
import { User } from "../EntityUser/User";
import { Patient } from "./Patient";

export class PatientBuilder {
    private data: Partial<IPatient> = {};
    
      setContact(contact: string = ""): this {
        this.data.contact = contact
        return this;
      }
    
      setUser(user: User): this {
        this.data.user = user;
        return this;
      }
    
      setCpf(cpf: string = ""): this {
        this.data.cpf = cpf;
        return this;
      }
    
      setDateOfBirth(dateOfBirth?: Date): this {
        this.data.dateOfBirth = dateOfBirth;
        return this;
      }
    
      setName(name: string = ""): this {
        this.data.name = name;
        return this;
      }

      setInsurances(insurances: Insurance[] = []): this {
        this.data.insurances = insurances;
        return this;
      }
      
      setAddress(address: Address): this {
        this.data.address = address;
        return this;
      }
      
      build(): Patient {
        return new Patient(
          this.data, // garante que todas as propriedades obrigatórias estão presentes
        );
      }
    

}