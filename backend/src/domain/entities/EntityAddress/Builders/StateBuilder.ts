
import { IState } from "../types/IState";
import { Country } from "../Country";
import { State } from "../State";

export class StateBuilder {
    private data: Partial<IState> = {};

    setName(name: string | undefined): this {
        this.data.name = name
        return this;
    }

    setUf(uf: string | undefined): this {
        this.data.uf = uf;
        return this;
    }

    setCountry(country: Country | undefined): this {
        this.data.country = country;
        return this;
    }

    build(): State {
        return new State(
            this.data, // garante que todas as propriedades obrigatórias estão presentes
        );
    }


}