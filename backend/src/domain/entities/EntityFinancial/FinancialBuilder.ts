import { Scheduling } from "../EntityScheduling/Scheduling";
import { Financial } from "./Financial";
import { IFinancial } from "./types/IFinancial";


export class FinancialBuilder {
  private data: Partial<IFinancial> = {};

  setDate(date?: Date | undefined): this {
    this.data.date = date;
    return this;
  }

  setTotal(total?: number| undefined): this {
    this.data.total = total;
    return this;
  }

  setTotalClinic(totalClinic?: number| undefined) {
    this.data.totalClinic = totalClinic
    return this
  }
  setTotalInsurance(totalInsurance?: number| undefined) {
    this.data.totalInsurance = totalInsurance
    return this
  }
  setTotalDoctor(totalDoctor?: number| undefined) {
    this.data.totalDoctor = totalDoctor
    return this
  }
  setScheduling(scheduling: Scheduling){
    this.data.scheduling = scheduling
    return this
  }

  build(): Financial {
    return new Financial({
      ...this.data, // sobrescreve defaults se vier do builder
    });
  }

  // 🔹 Método extra para retornar apenas os filtros (sem instanciar User)
  buildFilters(): Partial<Financial> {
    return { ...this.data };
  }
}
