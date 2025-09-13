import { IAddress } from "../../../@types/Address/IAddress";
import { Address } from "../Address";
import { City } from "../City";

export class AddressBuilder {
    private data: Partial<IAddress> = {};
    
      setNameAddress(nameAddress: string = ""): this {
        this.data.nameAddress = nameAddress;
        return this;
      }
    
      setNumber(number: string = ""): this {
        this.data.number = number;
        return this;
      }  
    
      setStreet(street: string = ""): this {
        this.data.street = street;
        return this;
      }
      setCity(city: City): this {
        this.data.city = city;
        return this
      }
      setCep(cep: string = ""): this {
        this.data.cep = cep
        return this
      }
      build(): Address {
        return new Address(
          this.data, // garante que todas as propriedades obrigatórias estão presentes
        );
      }
    

}