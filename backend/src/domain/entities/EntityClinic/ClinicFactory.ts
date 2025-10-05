import { ClinicDTO } from '../../../infrastructure/DTOs/ClinicDTO';
import { AddressBuilder } from '../EntityAddress/Builders/AddressBuilder';
import { CityBuilder } from '../EntityAddress/Builders/CityBuilder';
import { StateBuilder } from '../EntityAddress/Builders/StateBuilder';
import { Country } from '../EntityAddress/Country';
import { InsuranceBuilder } from '../EntityInsurance/InsuranceBuilder';
import { SpecialtyBuilder } from '../EntitySpecialty/SpecialtyBuilder';
import { UserBuilder } from '../EntityUser/UserBuilder';
import { ClinicBuilder } from './ClinicBuilder';

export class ClinicFactory {
  static createFromDTO(clinicDTO: ClinicDTO) {
    const insurances =
      clinicDTO.insurances?.map((ins) => {
        const insurance = new InsuranceBuilder().setName(ins.name).build();
        insurance.setUuidHash(ins.id ?? '');
        return insurance;
      }) ?? [];

    const specialties = clinicDTO.specialties?.map((spe) => {
      const specialty = new SpecialtyBuilder()
        .setName(spe.name)
        .setPrice(spe.price ?? 0)
        .build();
      specialty.setUuidHash(spe.id ?? '');
      return specialty;
    });

    const user = new UserBuilder()
      .setEmail(clinicDTO.user?.email ?? '')
      .setAvatar(clinicDTO.user?.avatar ?? '')
      .setRole('admin')
      .setPassword(clinicDTO.user?.password ?? '')
      .build();

    // Country
    const country = new Country({
      name: clinicDTO.address?.country.name ?? '',
    });
    country.setUuidHash(clinicDTO.address?.country.id ?? country.getUUIDHash());

    // State
    const state = new StateBuilder()
      .setCountry(country)
      .setName(clinicDTO.address?.state.name)
      .setUf(clinicDTO.address?.state.uf)
      .build();
    state.setUuidHash(clinicDTO.address?.state.id ?? state.getUUIDHash());

    // City
    const city = new CityBuilder()
      .setState(state)
      .setName(clinicDTO.address?.city.name)
      .build();
    city.setUuidHash(clinicDTO.address?.city.id ?? city.getUUIDHash());

    // Address
    const address = new AddressBuilder()
      .setNameAddress(clinicDTO.address?.name)
      .setNumber(clinicDTO.address?.number)
      .setNeighborhood(clinicDTO.address?.neighborhood)
      .setCep(clinicDTO.address?.cep)
      .setCity(city)
      .setStreet(clinicDTO.address?.street)
      .build();

    // Patient
    const clinic = new ClinicBuilder()
      .setPhone(clinicDTO.phone ?? '')
      .setCNPJ(clinicDTO.cnpj ?? '')
      .setName(clinicDTO.name ?? '')
      .setUser(user)
      .setSpecialties(specialties ?? [])
      .setTimeToConfirm(clinicDTO.timeToConfirm ?? '23:59:59') // 24 Horas
      .setAddress(address)
      .setInsurances(insurances ?? [])
      .setAddress(address)
      .build();

    clinic.setUuidHash(clinicDTO.id ?? clinic.getUUIDHash())
    return clinic;
  }
}
