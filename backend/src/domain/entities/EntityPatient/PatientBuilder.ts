import { IPatient } from "../../@types/Patient/IPatient";
import { Address } from "../EntityAddress/Address";
import { CartInsurance } from "../EntityCartInsurance/CartInsurance";
import { User } from "../EntityUser/User";
import { Patient } from "./Patient";

export class PatientBuilder {
    private data: Partial<IPatient> = {};
    
      setPhone(phone: string = ""): this {
        this.data.phone = phone
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

      setCartInsurances(cartInsurances: CartInsurance[] = []): this {
        this.data.cartInsurances = cartInsurances;
        return this;
      }
      
      setAddress(address: Address): this {
        this.data.address = address;
        return this;
      }
      
      setSex(sex: string = ""): this {
        this.data.sex = sex
        return this
      }
      build(): Patient {
        return new Patient(
          this.data, // garante que todas as propriedades obrigatórias estão presentes
        );
      }
    

}