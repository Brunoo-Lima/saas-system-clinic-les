import { NextFunction, Request, Response } from "express";
import { ResponseHandler } from "../../../../../helpers/ResponseHandler";
import { DoctorDTO } from "../../../../../infrastructure/DTOs/DoctorDTO";

export class AddPeriodsToDoctorController {
    async handle(req: Request, res: Response, next: NextFunction){
        try {
            const doctorDTO = req.body as DoctorDTO
            
        } catch(e){
            return res.status(500).json(ResponseHandler.error((e as Error).message))
        }
    }
}