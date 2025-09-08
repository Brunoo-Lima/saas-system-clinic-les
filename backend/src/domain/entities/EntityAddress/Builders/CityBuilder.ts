import { ICity } from "../../../@types/Address/ICity";
import { City } from "../City";
import { State } from "../State";

export class CityBuilder {
    private data: Partial<ICity> = {};

    setName(name: string = ""): this {
        this.data.name = name
        return this;
    }

    setZipCode(cep: string = ""): this {
        this.data.cep = cep;
        return this;
    }

    setState(state: State): this {
        this.data.state = state;
        return this;
    }

    build(): City {
        return new City(
            this.data, // garante que todas as propriedades obrigatórias estão presentes
        );
    }


}