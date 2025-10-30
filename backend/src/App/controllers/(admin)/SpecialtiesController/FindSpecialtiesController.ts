import { NextFunction, Request, Response } from "express";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import { FindSpecialtyService } from "../../../services/(admin)/ClinicService/SpecialtyService/FindSpecialtyService";

export class FindSpecialtyController {

    async handle(req: Request, res: Response, next: NextFunction) {
        try {
            const specialties = req.body
            if (!specialties) return res.status(400).json(ResponseHandler.error("Data not sent"))
            const specialtyService = new FindSpecialtyService()
            const specialtiesFounded = await specialtyService.execute(specialties)

            return res.status(200).json(specialtiesFounded);
        } catch (e) {
            return res.status(500).json(
                ResponseHandler.error("Internal server error")
            )
        }
    }
}