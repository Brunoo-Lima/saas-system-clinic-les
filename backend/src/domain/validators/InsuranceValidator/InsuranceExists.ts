import { IResponseHandler, ResponseHandler } from "../../../helpers/ResponseHandler";
import { IRepository } from "../../../infrastructure/database/repositories/IRepository";
import { Insurance } from "../../entities/EntityInsurance/Insurance";
import { IProcessValidator } from "../IProcessValidator";

export class InsuranceExists implements IProcessValidator {
    async valid(insurance: Insurance, repository: IRepository) {
        try {
            const insuranceFounded = await repository.findEntity(insurance)
            console.log(insuranceFounded)

            if (insuranceFounded.length) return ResponseHandler.error("Insurance already exists")
            return ResponseHandler.success("Insurance don't exists")
        } catch (e) {
            console.log(e)
            return ResponseHandler.error((e as Error).message)
        }
    }
}