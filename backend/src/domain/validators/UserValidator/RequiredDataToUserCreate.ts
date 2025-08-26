import { ResponseHandler } from "../../../helpers/ResponseHandler";
import { User } from "../../entities/User/User";
import { IProcessValidator } from "../IProcessValidator";

export class RequiredDataToUserCreate implements IProcessValidator {
  valid(user: User) {
    const objectResponse = {
      success: true,
      message: "All required data is present.",
    };
    const keysRequired = ["email", "password", "role"];

    for (const k of keysRequired) {
      const key = k as keyof User;

      if (!(key in user) || user[key] === undefined || user[key] === null) {
        return ResponseHandler.error(`Missing required field: ${key}.`);
      }
    }

    // if(user.password !== user.passwordConfirmed){
    //     return ResponseHandler.error("Password and password confirmation do not match.")

    // }

    return ResponseHandler.success(
      objectResponse,
      "All required data is present."
    );
  }
}
