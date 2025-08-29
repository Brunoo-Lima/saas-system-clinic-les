import type { Availability, IDoctor } from "@/@types/IDoctor";
import type { DoctorFormSchema } from "@/validations/doctor-form-schema";

export const getDoctorDefaultValues = (doctor?: IDoctor): DoctorFormSchema => ({
  name: doctor?.name ?? "",
  specialty: doctor?.specialty ?? "",
  crm: doctor?.crm ?? "",
  priceService: doctor?.servicePriceInCents
    ? doctor.servicePriceInCents / 100
    : 0,
  typeDocument: doctor?.typeDocument ?? "CPF",
  document: doctor?.document ?? "",
  email: doctor?.email ?? "",
  phoneNumber: doctor?.phoneNumber ?? "",
  dateOfBirth: doctor?.dateOfBirth ?? "",
  availableWeekDay: doctor?.availableWeekDay ?? ([] as Availability),
  gender: doctor?.gender ?? "male",
  status: doctor?.status ?? true,
  justification: doctor?.justification ?? "",
  address: {
    zipCode: doctor?.address?.zipCode ?? "",
    state: doctor?.address?.state ?? "",
    city: doctor?.address?.city ?? "",
    neighborhood: doctor?.address?.neighborhood ?? "",
    street: doctor?.address?.street ?? "",
    number: doctor?.address?.number ?? "",
  },
});
