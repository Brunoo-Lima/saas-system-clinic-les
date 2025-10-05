export interface IInsurance {
  id: number;
  name: string;
  modalities: {
    id: string;
    name: string;
  }[];
  specialties: {
    id: string;
    price: number;
    amountTransferred: number;
  }[];
}
