import { INeighborhood } from "../../../@types/Address/INeighborhood";
import { City } from "../City";
import { Neighborhood } from "../Neighborhood";

export class NeighborhoodBuilder {
    private data: Partial<INeighborhood> = {};
    
      setName(name: string = ""): this {
        this.data.name = name
        return this;
      }
    
      setCity(city: City): this {
        this.data.city = city;
        return this;
      }

      build(): Neighborhood {
        return new Neighborhood(
          this.data, // garante que todas as propriedades obrigatórias estão presentes
        );
      }
    

}