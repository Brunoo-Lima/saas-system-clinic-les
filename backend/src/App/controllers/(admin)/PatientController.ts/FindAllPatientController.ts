import { NextFunction, Request, Response } from "express";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import { FindAllPatientService } from "../../../services/(admin)/PatientService/FindAllPatientService";

export class FindAllPatientController {
    async handle(req: Request, res: Response, next: NextFunction){
        try {
            const {id, cpf, limit, offset} = req.query
            const service = new FindAllPatientService()
            const patientsFounded = await service.execute({
                cpf: cpf?.toString(),
                id: id?.toString(),
                limit: limit?.toString(),
                offset: offset?.toString()
            })
            
            return res.status(200).json(patientsFounded)
        } catch(e) {
            return res.status(500).json( ResponseHandler.error((e as Error).message))
        }
    }
}