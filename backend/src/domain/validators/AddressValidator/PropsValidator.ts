import { ResponseHandler } from "../../../helpers/ResponseHandler";
import { Address } from "../../entities/EntityAddress/Address";
import { RequiredGeneralData } from "../General/RequiredGeneralData";
import { IProcessValidator } from "../IProcessValidator";

export class PropsValidator implements IProcessValidator {
    async valid(address: Address) {
        try {
            let messages = []
            const requiredData = new RequiredGeneralData()
            const { neighborhood } = address
            const city = neighborhood?.city
            const state = city?.state
            const country = state?.country
            const entities = [neighborhood, city, state, country] as const;
            
            for(const [k, v] of Object.entries(address.props)){
                if(!v) { return ResponseHandler.error(`The address cannot be values undefined in ${k}`)}
            }
            for (const ent of entities) {
                if(!ent) return ResponseHandler.error("The address shouldn't have undefined values.");
               
                const validated = await requiredData.valid(ent, Object.keys(ent))
                if (!validated.success) { messages.push(...validated.message) }
            }
            if (messages.length) { return ResponseHandler.error(messages) }
            return ResponseHandler.success(address, "Address is valid.")
        } catch (e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}