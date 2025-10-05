import { Request, Response, NextFunction } from 'express';
import { ResponseHandler } from '../../../../helpers/ResponseHandler';
import { CreateClinicService } from '../../../services/(admin)/ClinicService/CreateClinicService';
import { ClinicFactory } from '../../../../domain/entities/EntityClinic/ClinicFactory';
import { ClinicDTO } from '../../../../infrastructure/DTOs/ClinicDTO';

interface AuthRequest extends Request {
  user?: any;
}

export class CreateClinicController {
  async handle(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const clinicDTO = req.body as ClinicDTO;
      const userId = req.user.id;

      if (!clinicDTO) return res.status(400).json(ResponseHandler.error("You should be sent the data of clinic !"))

      const clinicService = new CreateClinicService()
      const clinicInserted = await clinicService.execute(clinicDTO, userId)
      return res.status(200).json(clinicInserted);

    } catch (e) {
      return res.status(500).json(ResponseHandler.error((e as Error).message));
    }
  }
}
