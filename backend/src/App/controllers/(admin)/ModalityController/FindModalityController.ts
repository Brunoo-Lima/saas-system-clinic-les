import { NextFunction, Request, Response } from "express";
import { FindModalityService } from "../../../services/(admin)/ModalityService/FindModalityService";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import { ModalityDTO } from "../../../../infrastructure/DTO/ModalityDTO";

export class FindModalityController {
    async handle(req: Request, res: Response, next: NextFunction) {
        try {
            const modalities = req.body as Array<ModalityDTO>
            if (!modalities) { return res.status(400).json(ResponseHandler.error("You should be the payload !")) }
            const modalityService = new FindModalityService()
            const modalitiesFounded = await modalityService.execute(modalities)
            return res.status(200).json(modalitiesFounded);

        } catch (e) {
            return res.status(500).json(ResponseHandler.error((e as Error).message))
        }
    }
}