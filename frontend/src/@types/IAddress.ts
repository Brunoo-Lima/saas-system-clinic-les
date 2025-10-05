export interface IAddress {
  name: string;
  street: string;
  number: string;
  neighborhood: string;
  cep: string;
  city: {
    name: string;
  };
  state: {
    name: string;
    uf: string;
  };
  country: {
    name: string;
  };
}
