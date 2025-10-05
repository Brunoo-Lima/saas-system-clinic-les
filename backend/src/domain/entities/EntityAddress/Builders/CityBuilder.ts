import { ICity } from "../types/ICity";
import { City } from "../City";
import { State } from "../State";

export class CityBuilder {
    private data: Partial<ICity> = {};

    setName(name: string | undefined): this {
        this.data.name = name
        return this;
    }

    setState(state: State | undefined): this {
        this.data.state = state;
        return this;
    }

    build(): City {
        return new City(
            this.data, // garante que todas as propriedades obrigatórias estão presentes
        );
    }


}