import { NextFunction, Request, Response } from "express";
import { ResponseHandler } from "../../../../../helpers/ResponseHandler";
import { DoctorDTO } from "../../../../../infrastructure/DTOs/DoctorDTO";
import { AddPeriodsToDoctorService } from "../../../../services/(admin)/DoctorService/DoctorToRelationsService/AddPeriodsToDoctorService";

export class AddPeriodsToDoctorController {
    async handle(req: Request, res: Response, next: NextFunction){
        try {
            const doctorDTO = req.body as DoctorDTO
            const service = new AddPeriodsToDoctorService()
            const periodsInserted = await service.execute(doctorDTO)

            return res.status(200).json(periodsInserted)
        } catch(e){
            return res.status(500).json(ResponseHandler.error((e as Error).message))
        }
    }
}