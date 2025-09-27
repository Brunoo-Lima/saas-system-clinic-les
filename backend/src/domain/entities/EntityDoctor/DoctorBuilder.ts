import { IDoctor } from "../../@types/Doctor/IDoctor";
import { Address } from "../EntityAddress/Address";
import { CardInsurance } from "../EntityCardInsurance/CardInsurance";
import { Clinic } from "../EntityClinic/Clinic";
import { Period } from "../EntityPeriod/Period";
import { Specialty } from "../EntitySpecialty/Specialty";
import { User } from "../EntityUser/User";
import { Doctor } from "./Doctor";

export class DoctorBuilder {
    private data: Partial<IDoctor> = {};

    setPhone(phone: string = ""): this {
        this.data.phone = phone
        return this;
    }

    setUser(user: User): this {
        this.data.user = user;
        return this;
    }

    setCpf(cpf: string = ""): this {
        this.data.cpf = cpf;
        return this;
    }

    setDateOfBirth(dateOfBirth?: Date): this {
        this.data.dateOfBirth = dateOfBirth;
        return this;
    }

    setName(name: string = ""): this {
        this.data.name = name;
        return this;
    }

    setSpecialties(specialties: Specialty[] = []): this {
        this.data.specialties = specialties;
        return this;
    }

    setAddress(address: Address): this {
        this.data.address = address;
        return this;
    }

    setSex(sex: string = ""): this {
        this.data.sex = sex
        return this
    }
    setClinic(clinic: Clinic) {
        this.data.clinic = clinic
        return this
    }

    setPercentDistribution(percentDistribution: number = 0) {
        this.data.percentDistribution = percentDistribution
        return this
    }
    setCrm(crm: string) {
        this.data.crm = crm
        return this
    }
    setPeriod(periodsToWork: Period[]) {
        this.data.periodsToWork = periodsToWork
        return this
    }

    build(): Doctor {
        return new Doctor(
            this.data, // garante que todas as propriedades obrigatórias estão presentes
        );
    }


}