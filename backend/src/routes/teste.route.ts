import { Request, Response, Router } from "express";
import { asyncHandler } from "../helpers/async-handler";

const testeRoute: Router = Router();

/**
 * @openapi
 * /teste:
 *   get:
 *     summary: Lista todos os usuários
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso
 */
testeRoute.get(
  "/teste",
  asyncHandler(async (req: Request, res: Response) => {
    return res.json([
      { id: 1, name: "Bruno" },
      { id: 2, name: "Ana" },
    ]);
  })
);

console.log(testeRoute);

export { testeRoute };
