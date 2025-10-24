import { DoctorDTO } from "../../../infrastructure/DTOs/DoctorDTO";
import { AddressBuilder } from "../EntityAddress/Builders/AddressBuilder";
import { CityBuilder } from "../EntityAddress/Builders/CityBuilder";
import { StateBuilder } from "../EntityAddress/Builders/StateBuilder";
import { Country } from "../EntityAddress/Country";
import { Period } from "../EntityPeriod/Period";
import { SpecialtyBuilder } from "../EntitySpecialty/SpecialtyBuilder";
import { UserBuilder } from "../EntityUser/UserBuilder";
import { DoctorBuilder } from "./DoctorBuilder";

export class DoctorFactory {
    static createFromDTO(doctorDTO: DoctorDTO) {

        // User
        const user = new UserBuilder()
            .setAvatar(doctorDTO?.user?.avatar)
            .setEmail(doctorDTO?.user?.email)
            .setPassword(doctorDTO?.user?.password)
            .setRole("doctor")
            .setUsername(doctorDTO?.user?.username)
            .build();
        user.setUuidHash(doctorDTO?.user?.id ?? user.getUUIDHash());

        // Country
        const country = new Country({
            name: doctorDTO?.address?.country.name ?? ""
        });
        country.setUuidHash(
            doctorDTO?.address?.country.id ?? country.getUUIDHash()
        );

        // State
        const state = new StateBuilder()
            .setCountry(country)
            .setName(doctorDTO?.address?.state.name)
            .setUf(doctorDTO?.address?.state.uf)
            .build();
        state.setUuidHash(doctorDTO?.address?.state.id ?? state.getUUIDHash());

        // City
        const city = new CityBuilder()
            .setState(state)
            .setName(doctorDTO?.address?.city.name)
            .build();
        city.setUuidHash(doctorDTO?.address?.city.id ?? city.getUUIDHash());

        // Address
        const address = new AddressBuilder()
            .setNameAddress(doctorDTO?.address?.name)
            .setNumber(doctorDTO?.address?.number)
            .setNeighborhood(doctorDTO?.address?.neighborhood)
            .setCep(doctorDTO?.address?.cep)
            .setCity(city)
            .setStreet(doctorDTO?.address?.street)
            .build();

        const periods = doctorDTO?.periodToWork?.map((per) => {
            const specialty = new SpecialtyBuilder().build()
            specialty.setUuidHash(per.specialty_id ?? specialty.getUUIDHash())

            const period = new Period({
                dayWeek: per.dayWeek ?? 0,
                timeFrom: per.timeFrom ?? "",
                timeTo: per.timeTo ?? "",
                specialty: specialty
            })
            period.setUuidHash(per.id ?? period.getUUIDHash())
            return period
        }) ?? undefined


        const specialties = doctorDTO?.specialties?.map((spe) => {
            const specialty = new SpecialtyBuilder()
                .setName(spe.name).build()
            specialty.setUuidHash(spe.id ?? specialty.getUUIDHash())
            return specialty
        }) ?? undefined

        // Doctor
        const doctor = new DoctorBuilder()
            .setPhone(doctorDTO?.phone ?? undefined)
            .setCpf(doctorDTO?.cpf ?? undefined)
            .setDateOfBirth(
                doctorDTO?.dateOfBirth ? new Date(doctorDTO?.dateOfBirth) : undefined
            )
            .setPeriod(periods)
            .setName(doctorDTO?.name  ?? undefined)
            .setUser(user)
            .setSex(doctorDTO?.sex  ?? undefined)
            .setCrm(doctorDTO?.crm  ?? undefined)
            .setSpecialties(specialties ?? undefined)
            .setPercentDistribution(doctorDTO?.percentDistribution ?? undefined)
            .setAddress(address)
            .build();

        return doctor;
    }
}
