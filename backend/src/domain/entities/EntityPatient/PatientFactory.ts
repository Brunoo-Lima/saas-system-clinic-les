import { PatientDTO } from "../../../infrastructure/dto/PatientDTO";
import { AddressBuilder } from "../EntityAddress/Builders/AddressBuilder";
import { CityBuilder } from "../EntityAddress/Builders/CityBuilder";
import { StateBuilder } from "../EntityAddress/Builders/StateBuilder";
import { Country } from "../EntityAddress/Country";
import { CartInsuranceBuilder } from "../EntityCardInsurance/CardInsuranceBuilder";
import { InsuranceBuilder } from "../EntityInsurance/InsuranceBuilder";
import { Modality } from "../EntityModality/Modality";
import { UserBuilder } from "../EntityUser/UserBuilder";
import { PatientBuilder } from "./PatientBuilder";

export class PatientFactory {
  static createFromDTO(patientDTO: PatientDTO) {
    // Insurances
    const cardInsurances = patientDTO.cardInsurances.map((ctIns) => {
      const insurance = new InsuranceBuilder()
        .setName(ctIns.insurance.name as string)
        .build();
      insurance.setUuidHash(ctIns.insurance.id ?? "");

      const modality = new Modality({
        name: ctIns.modality.name,
      })
      modality.setUuidHash(ctIns.modality.id ?? modality.getUUIDHash())

      const cardInsurance = new CartInsuranceBuilder()
        .setCardNumber(ctIns.cardInsuranceNumber)
        .setModality(modality)
        .setInsurance(insurance)
        .setValidate(ctIns.validate)
        .build()

      return cardInsurance;
    });

    // User
    const user = new UserBuilder()
      .setAvatar(patientDTO.user.avatar)
      .setEmail(patientDTO.user.email)
      .setPassword(patientDTO.user.password)
      .setRole("patient")
      .setUsername(patientDTO.user.username)
      .build();
    user.setUuidHash(patientDTO.user.id ?? user.getUUIDHash());

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
      .setNeighborhood(patientDTO.address.neighborhood)
      .setCep(patientDTO.address.cep)
      .setCity(city)
      .setStreet(patientDTO.address.street)
      .build();

    // Patient
    const patient = new PatientBuilder()
      .setPhone(patientDTO.phone)
      .setCpf(patientDTO.cpf)
      .setDateOfBirth(
        patientDTO.dateOfBirth ? new Date(patientDTO.dateOfBirth) : undefined
      )
      .setName(patientDTO.name)
      .setUser(user)
      .setCartInsurances(cardInsurances)
      .setAddress(address)
      .build();

    return patient;
  }
}
