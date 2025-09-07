import { IAddress } from "../../../@types/Address/IAddress";
import { Address } from "../Address";
import { Neighborhood } from "../Neighborhood";

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
    
      setNeighborhood(neighborhood: Neighborhood): this {
        this.data.neighborhood = neighborhood;
        return this;
      }
    
      setStreet(street: string = ""): this {
        this.data.street = street;
        return this;
      }

      build(): Address {
        return new Address(
          this.data, // garante que todas as propriedades obrigatórias estão presentes
        );
      }
    

}