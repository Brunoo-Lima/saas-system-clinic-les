import { IClinic } from '../../@types/Clinic/IClinic';
import { Address } from '../EntityAddress/Address';
import { EntityDomain } from '../EntityDomain';
import { User } from '../EntityUser/User';

export class Clinic extends EntityDomain {
  constructor(private clinicProps: IClinic) {
    super();
    if (!clinicProps.name) throw new Error('Clinic name is required');
    if (!clinicProps.cnpj) throw new Error('Clinic CNPJ is required');
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
}
