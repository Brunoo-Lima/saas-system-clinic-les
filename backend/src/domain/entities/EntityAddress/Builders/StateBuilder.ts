
import { IState } from "../../../@types/Address/IState";
import { Country } from "../Country";
import { Neighborhood } from "../Neighborhood";
import { State } from "../State";

export class StateBuilder {
    private data: Partial<IState> = {};

    setName(name: string = ""): this {
        this.data.name = name
        return this;
    }

    setUf(uf: string = ""): this {
        this.data.uf = uf;
        return this;
    }

    setCountry(country: Country): this {
        this.data.country = country;
        return this;
    }

    build(): State {
        return new State(
            this.data, // garante que todas as propriedades obrigatórias estão presentes
        );
    }


}