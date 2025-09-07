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
      .setZipCode(patientDTO.address.city.zipcode)
      .build();
    city.setUuidHash(patientDTO.address.city.id ?? city.getUUIDHash());

    // Neighborhood
    const neighborhood = new NeighborhoodBuilder()
      .setCity(city)
      .setName(patientDTO.address.neighborhood.name)
      .build();
    neighborhood.setUuidHash(
      patientDTO.address.neighborhood.id ?? neighborhood.getUUIDHash()
    );

    // Address
    const address = new AddressBuilder()
      .setNameAddress(patientDTO.address.name)
      .setNumber(patientDTO.address.number)
      .setStreet(patientDTO.address.street)
      .setNeighborhood(neighborhood)
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
