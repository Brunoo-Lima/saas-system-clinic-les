import { Address } from '../EntityAddress/Address';
import { EntityDomain } from '../EntityDomain';
import { User } from '../EntityUser/User';
import { IClinic } from './types/IClinic';

export class Clinic extends EntityDomain {
  constructor(private clinicProps: IClinic) {
    super();
  }

  public get name() {
    return this.clinicProps.name;
  }

  public get timeToConfirmScheduling() {
    return this.clinicProps.timeToConfirmScheduling;
  }

  public get phone() {
    return this.clinicProps.phone;
  }

  public get cnpj() {
    return this.clinicProps.cnpj;
  }

  public get user(): User | null | undefined {
    return this.clinicProps.user;
  }

  public get address(): Address | null | undefined {
    return this.clinicProps.address;
  }
  
  public get insurances() {
    return this.clinicProps.insurances
  }
  
  
  public get specialties() {
    return this.clinicProps.specialties
  }
  
  public get props() {
    return this.clinicProps
  }
  
}
