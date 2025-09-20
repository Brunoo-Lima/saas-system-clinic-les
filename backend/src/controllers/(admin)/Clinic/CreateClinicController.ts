import { Request, Response, NextFunction } from 'express';
import { ResponseHandler } from '../../../helpers/ResponseHandler';
import { CreateClinicService } from '../../../services/(admin)/Clinic/CreateClinicService';
import { Clinic } from '../../../domain/entities/EntityClinic/Clinic';

export class CreateClinicController {
  async handle(req: Request, res: Response, next: NextFunction) {
    try {
      const { cnpj, name, timeToConfirmScheduling, phone } = req.body;

      const userId = (req as any).user.id;

      // if (!clinic) {
      //   return res
      //     .status(400)
      //     .json(ResponseHandler.error(['You must send the body request!']));
      // }

      const clinicService = new CreateClinicService();

      const clinicCreated = await clinicService.execute(
        {
          cnpj,
          name,
          timeToConfirmScheduling,
          phone,
        } as Clinic,
        userId,
      );

      if (!clinicCreated.success) {
        return res.status(400).json(clinicCreated);
      }

      return res.status(200).json(clinicCreated);
    } catch (e) {
      return res.status(500).json(ResponseHandler.error((e as Error).message));
    }
  }
}
