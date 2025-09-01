import { ResponseHandler } from "../../../helpers/ResponseHandler";
import { IProcessValidator } from "../IProcessValidator";

export class ValidatorEmail implements IProcessValidator {
    valid(entity: any) {
        const email = entity.email;
        if (!email) { return ResponseHandler.error("Email is required.") }


        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) { return ResponseHandler.error("Invalid email format.") }

        return ResponseHandler.success(entity, "Valid email.");
    }
}