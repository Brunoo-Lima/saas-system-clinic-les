import { IAddress } from "../types/IAddress";
import { Address } from "../Address";
import { City } from "../City";

export class AddressBuilder {
  private data: Partial<IAddress> = {};

  setNameAddress(nameAddress: string | undefined): this {
    this.data.nameAddress = nameAddress;
    return this;
  }

  setNumber(number: string | undefined): this {
    this.data.number = number;
    return this;
  }

  setStreet(street: string | undefined): this {
    this.data.street = street;
    return this;
  }
  setCity(city: City): this {
    this.data.city = city;
    return this
  }
  setCep(cep: string | undefined): this {
    this.data.cep = cep
    return this
  }
  setNeighborhood(neighborhood: string | undefined): this {
    this.data.neighborhood = neighborhood
    return this
  }
  build(): Address {
    return new Address(
      this.data, // garante que todas as propriedades obrigatórias estão presentes
    );
  }


}