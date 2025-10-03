import { DoctorDTO } from "../../../infrastructure/DTO/DoctorDTO";
import { AddressBuilder } from "../EntityAddress/Builders/AddressBuilder";
import { CityBuilder } from "../EntityAddress/Builders/CityBuilder";
import { StateBuilder } from "../EntityAddress/Builders/StateBuilder";
import { Country } from "../EntityAddress/Country";
import { ClinicFactory } from "../EntityClinic/ClinicFactory";
import { Period } from "../EntityPeriod/Period";
import { SpecialtyBuilder } from "../EntitySpecialty/SpecialtyBuilder";
import { UserBuilder } from "../EntityUser/UserBuilder";
import { DoctorBuilder } from "./DoctorBuilder";

export class DoctorFactory {
    static createFromDTO(doctorDTO: DoctorDTO) {


        // User
        const user = new UserBuilder()
            .setAvatar(doctorDTO.user?.avatar)
            .setEmail(doctorDTO.user?.email)
            .setPassword(doctorDTO.user?.password)
            .setRole("doctor")
            .setUsername(doctorDTO.user?.username)
            .build();
        user.setUuidHash(doctorDTO.user?.id ?? user.getUUIDHash());

        // Country
        const country = new Country({
            name: doctorDTO.address?.country.name ?? ""
        });
        country.setUuidHash(
            doctorDTO.address?.country.id ?? country.getUUIDHash()
        );

        // State
        const state = new StateBuilder()
            .setCountry(country)
            .setName(doctorDTO.address?.state.name)
            .setUf(doctorDTO.address?.state.uf)
            .build();
        state.setUuidHash(doctorDTO.address?.state.id ?? state.getUUIDHash());

        // City
        const city = new CityBuilder()
            .setState(state)
            .setName(doctorDTO.address?.city.name)
            .build();
        city.setUuidHash(doctorDTO.address?.city.id ?? city.getUUIDHash());

        // Address
        const address = new AddressBuilder()
            .setNameAddress(doctorDTO.address?.name)
            .setNumber(doctorDTO.address?.number)
            .setNeighborhood(doctorDTO.address?.neighborhood)
            .setCep(doctorDTO.address?.cep)
            .setCity(city)
            .setStreet(doctorDTO.address?.street)
            .build();

        const periods = doctorDTO.periodToWork?.map((per) => {
            const period = new Period({
                dayWeek: per.dayWeek ?? 0,
                periodType: per.periodType ?? "default",
                timeFrom: per.timeFrom ?? "",
                timeTo: per.timeTo ?? ""
            })
            period.setUuidHash(per.id ?? period.getUUIDHash())
            return period
        }) ?? []


        const clinic = ClinicFactory.createFromDTO(doctorDTO.clinic ?? {})
        const specialties = doctorDTO.specialties?.map((spe) => {
            const specialty = new SpecialtyBuilder()
                .setName(spe.name).build()
            specialty.setUuidHash(spe.id ?? specialty.getUUIDHash())
            return specialty
        }) ?? []

        // Doctor
        const doctor = new DoctorBuilder()
            .setPhone(doctorDTO.phone)
            .setCpf(doctorDTO.cpf)
            .setDateOfBirth(
                doctorDTO.dateOfBirth ? new Date(doctorDTO.dateOfBirth) : undefined
            )
            .setPeriod(periods)
            .setName(doctorDTO.name)
            .setUser(user)
            .setClinic(clinic)
            .setSex(doctorDTO.sex)
            .setCrm(doctorDTO.crm ?? "")
            .setSpecialties(specialties)
            .setPercentDistribution(doctorDTO.percentDistribution)
            .setAddress(address)
            .build();

        return doctor;
    }
}
