import { Router } from 'express';
import { authMiddleware } from '../../App/middlewares/authMiddleware';
import { privateRoute } from '../../App/middlewares/privateRoute';
import { CreateFinancialController } from '../../App/controllers/(admin)/FinancialController/CreateFinancialController';
import { FindAllFinancialController } from '../../App/controllers/(admin)/FinancialController/FindAllFinancialController';

const financialRoute: Router = Router();

financialRoute.post("/financial", authMiddleware, privateRoute, new CreateFinancialController().handle)
financialRoute.get("/financial/findall", authMiddleware, new FindAllFinancialController().handle)

export { financialRoute };
