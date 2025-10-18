import { Address } from "../EntityAddress/Address";
import { Period } from "../EntityPeriod/Period";
import { Specialty } from "../EntitySpecialty/Specialty";
import { User } from "../EntityUser/User";
import { Doctor } from "./Doctor";
import { IDoctor } from "./types/IDoctor";

export class DoctorBuilder {
    private data: Partial<IDoctor> = {};

    setPhone(phone: string | undefined): this {
        this.data.phone = phone
        return this;
    }

    setUser(user: User | undefined): this {
        this.data.user = user;
        return this;
    }

    setCpf(cpf: string | undefined): this {
        this.data.cpf = cpf;
        return this;
    }

    setDateOfBirth(dateOfBirth?: Date  | undefined): this {
        this.data.dateOfBirth = dateOfBirth;
        return this;
    }

    setName(name: string | undefined): this {
        this.data.name = name;
        return this;
    }

    setSpecialties(specialties: Specialty[] | undefined): this {
        this.data.specialties = specialties;
        return this;
    }

    setAddress(address: Address | undefined): this {
        this.data.address = address;
        return this;
    }

    setSex(sex: string | undefined): this {
        this.data.sex = sex
        return this
    }

    setPercentDistribution(percentDistribution: number | undefined) {
        this.data.percentDistribution = percentDistribution
        return this
    }
    setCrm(crm: string  | undefined) {
        this.data.crm = crm
        return this
    }
    setPeriod(periodsToWork: Period[]  | undefined) {
        this.data.periodsToWork = periodsToWork
        return this
    }
    build(): Doctor {
        return new Doctor(
            this.data, // garante que todas as propriedades obrigatórias estão presentes
        );
    }


}