export interface IInsurance {
  id: string;
  type: string;
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
