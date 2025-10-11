import { Doctor } from "../EntityDoctor/Doctor";
import { SchedulingBlockedDays } from "../EntitySchedulingBlockedDays/SchedulingBlockedDays";
import { DoctorScheduling } from "./DoctorScheduling";
import { IDoctorScheduling } from "./types/IDocotorScheduling";

export class DoctorSchedulingBuilder {
    private data: Partial<IDoctorScheduling> = {};


    setDateFrom(date?: Date | undefined): this {
        this.data.dayFrom = date;
        return this;
    }

    setDateTo(date?: Date | undefined): this {
        this.data.dayTo = date;
        return this;
    }

    setIsActivated(isActivate?: boolean | undefined): this {
        this.data.is_activate = isActivate;
        return this;
    }


    setDoctor(doctor?: Doctor | undefined): this {
        this.data.doctor = doctor;
        return this;
    }

    setDaysBlocked(datesBlocked?: Array<SchedulingBlockedDays> | undefined): this {
        this.data.datesBlocked = datesBlocked
        return this
    }

    build(): DoctorScheduling {
        return new DoctorScheduling({
            ...this.data, // sobrescreve defaults se vier do builder
        });
    }

    // 🔹 Método extra para retornar apenas os filtros (sem instanciar User)
    buildFilters(): Partial<DoctorScheduling> {
        return { ...this.data };
    }
}
