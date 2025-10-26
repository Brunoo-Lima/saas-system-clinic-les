import { IFinancial } from "./types/IFinancial";
import { EntityDomain } from "../EntityDomain";

export class Financial extends EntityDomain {
  constructor(private financialProps: IFinancial) {
    super();
  }

  public get date() {
    return this.financialProps.date;
  }

  public get total() {
    return this.financialProps.total;
  }

  public get totalClinic() {
    return this.financialProps.totalClinic;
  }

  public get totalDoctor() {
    return this.financialProps.totalDoctor;
  }

  public get totalInsurance() {
    return this.financialProps.totalInsurance;
  }

  public get scheduling() {
    return this.financialProps.scheduling;
  }

  public get props() {
    return this.financialProps;
  }

  public set total(total: number | undefined) {
    this.financialProps.total = total;
  }
  public set totalClinic(total: number | undefined) {
    this.financialProps.totalClinic = total;
  }
  public set totalDoctor(total: number | undefined) {
    this.financialProps.totalDoctor = total;
  }
  public set totalInsurance(total: number | undefined) {
    this.financialProps.totalInsurance = total;
  }
}
