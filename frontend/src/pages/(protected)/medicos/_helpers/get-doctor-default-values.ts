import type { Availability, IDoctor } from "@/@types/IDoctor";
import type { DoctorFormSchema } from "@/validations/doctor-form-schema";

export const getDoctorDefaultValues = (doctor?: IDoctor): DoctorFormSchema => ({
  name: doctor?.name ?? "",
  specialty: doctor?.specialty ?? "",
  crm: doctor?.crm ?? "",
  cpf: doctor?.cpf ?? "",
  email: doctor?.email ?? "",
  phoneNumber: doctor?.phoneNumber ?? "",
  dateOfBirth: doctor?.dateOfBirth ?? new Date(),
  availableWeekDay: doctor?.availableWeekDay ?? ([] as Availability),
  gender: doctor?.gender ?? "male",
  status: doctor?.status ?? true,
  justification: doctor?.justification ?? "",
  address: {
    zipCode: doctor?.address?.zipCode ?? "",
    neighborhood: doctor?.address?.neighborhood ?? "",
    street: doctor?.address?.street ?? "",
    number: doctor?.address?.number ?? "",
    state: doctor?.address?.state ?? "",
    city: doctor?.address?.city ?? "",
    country: doctor?.address?.country ?? "",
  },
});
