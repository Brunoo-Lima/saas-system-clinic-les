import { Router } from 'express';
import { authMiddleware } from '../../App/middlewares/authMiddleware';
import { privateRoute } from '../../App/middlewares/privateRoute';
import { FindModalityController } from '../../App/controllers/(admin)/ModalityController/FindModalityController';
import { FindAllModalityController } from '../../App/controllers/(admin)/ModalityController/FindAllModalityController';

const ModalityRoutes: Router = Router();

ModalityRoutes.post('/modality/find', authMiddleware, privateRoute, (req, res, next) => {
  const createClinicController = new FindModalityController();
  return createClinicController.handle(req, res, next);
});

ModalityRoutes.get('/modality/findall', authMiddleware, privateRoute, new FindAllModalityController().handle)
export { ModalityRoutes };
