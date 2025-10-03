// import { toast } from 'sonner';
// import api from './api';

// interface ICreateInsuranceProps {
//   name: string;
//   modalities: {
//     id: string;
//     name: string;
//   }[];
//   specialties: {
//     id: string;
//     price: number;
//     amountTransferred: number;
//   }[];
// }

// export const createInsurance = async ({
//   name,
//   modalities,
//   specialties,
// }: ICreateInsuranceProps) => {
//   try {
//     const { data, status } = await api.post('/insurance', {
//       name,
//       modalities,
//       specialties,
//     });

//     if (status !== 200 || data.success === false) {
//       throw new Error(data.message);
//     }

//     return { data, status };
//   } catch (error) {
//     toast.error('Erro ao criar convênio.');
//   }
// };
