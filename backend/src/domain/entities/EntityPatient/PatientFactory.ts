import { PatientDTO } from "../../../infrastructure/dto/PatientDTO";
import { AddressBuilder } from "../EntityAddress/Builders/AddressBuilder";
import { CityBuilder } from "../EntityAddress/Builders/CityBuilder";
import { NeighborhoodBuilder } from "../EntityAddress/Builders/NeighborhoodBuilder";
import { StateBuilder } from "../EntityAddress/Builders/StateBuilder";
import { Country } from "../EntityAddress/Country";
import { InsuranceBuilder } from "../EntityInsurance/InsuranceBuilder";
import { UserBuilder } from "../EntityUser/UserBuilder";
import { PatientBuilder } from "./PatientBuilder";

export class PatientFactory {
  static createFromDTO(patientDTO: PatientDTO) {
    // Insurances
    const insurances = patientDTO.insurances.map((ins) => {
      const insurance = new InsuranceBuilder()
        .setType(ins.name)
        .build();
      insurance.setUuidHash(ins.id ?? "");
      return insurance;
    });

    // User
    const user = new UserBuilder().build();
    user.setUuidHash(patientDTO.user_id ?? "");

    // Country
    const country = new Country({ name: patientDTO.address.country.name });
    country.setUuidHash(
      patientDTO.address.country.id ?? country.getUUIDHash()
    );

    // State
    const state = new StateBuilder()
      .setCountry(country)
      .setName(patientDTO.address.state.name)
      .setUf(patientDTO.address.state.uf)
      .build();
    state.setUuidHash(patientDTO.address.state.id ?? state.getUUIDHash());

    // City
    const city = new CityBuilder()
      .setState(state)
      .setName(patientDTO.address.city.name)
      .build();
    city.setUuidHash(patientDTO.address.city.id ?? city.getUUIDHash());

    // Address
    const address = new AddressBuilder()
      .setNameAddress(patientDTO.address.name)
      .setNumber(patientDTO.address.number)
      .setCep(patientDTO.address.cep)
      .setCity(city)
      .setStreet(patientDTO.address.street)
      .build();

    // Patient
    const patient = new PatientBuilder()
      .setContact(patientDTO.contact)
      .setCpf(patientDTO.cpf)
      .setDateOfBirth(
        patientDTO.dateOfBirth ? new Date(patientDTO.dateOfBirth) : undefined
      )
      .setName(patientDTO.name)
      .setUser(user)
      .setInsurances(insurances)
      .setAddress(address)
      .build();

    return patient;
  }
}
