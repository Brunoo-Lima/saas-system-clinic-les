import { ResponseHandler } from "../../../helpers/ResponseHandler";
import { IRepository } from "../../../infrastructure/database/repositories/IRepository";
import { Insurance } from "../../entities/EntityInsurance/Insurance";
import { IProcessValidator } from "../IProcessValidator";

export class ValidInsuranceData implements IProcessValidator {
    async valid(insurances: Insurance | Array<Insurance>, repository: IRepository) {
        try {

            let insurancesFiltered: any[] = []
            if (Array.isArray(insurances)) {
                insurancesFiltered = insurances.filter(
                    (ins) => ins?.getUUIDHash() !== "" || ins?.name !== ""
                )
            }
            if (insurancesFiltered.length === 0) return ResponseHandler.error("You should be the name of insurance or id !")
            if (insurancesFiltered.length) {
                for (const insurance of insurancesFiltered) {
                    const insuranceExists = await repository.findEntity(insurance)
                    if (!insuranceExists.length) return ResponseHandler.error(`An insurance not exists with id: ${insurance?.getUUIDHash()} or name: ${insurance.name}`)
                }
                return ResponseHandler.success(`The insurances exists in database !`)
            }
            const insuranceExists = await repository.findEntity(insurances)
            if (insuranceExists.length) return ResponseHandler.error("Insurance already exists")
            return ResponseHandler.success("Insurance don't exists")

        } catch (e) {
            console.log(e)
            return ResponseHandler.error((e as Error).message)
        }
    }
}