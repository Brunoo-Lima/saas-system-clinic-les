import { Request, Response, NextFunction } from "express";
import { ResponseHandler } from "../helpers/ResponseHandler";
import { UserBuilder } from "../domain/entities/EntityUser/UserBuilder";
import { validJWToken } from "../helpers/validJWToken";
import { UserRepository } from "../infrastructure/repositories/UserRepository/UserRepository";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Pegar o token do header
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json(ResponseHandler.error("Token not found in header"));
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json(ResponseHandler.error("Token invalid"));
    }

    // 2. Validar token
    const decoded = validJWToken(token)
    if (!decoded.success) { return res.status(401).json(decoded) }

    // 3. Buscar usuário no banco
    const userDomain = new UserBuilder()
      .setEmail(decoded.data.email!)
      .setPassword(decoded.data.password)
      .setRole(decoded.data.role)
      .build()

    const userRepository = new UserRepository()
    const user = await userRepository.findUser(userDomain) as ResponseHandler | any;

    if ("success" in user && !user.success) {
      return res.status(401).json(ResponseHandler.error(user.message));
    }

    // Se ele for admin, tem acesso liberado pra tudo
    if ((user[0].role !== userDomain.role) && (userDomain.role !== "admin")) {
      return res.status(401).json(ResponseHandler.error("Access denied !"))
    }
    (req as any).user = user;
    next(); // seguir para a rota
  } catch (error) {
    return res.status(500).json(ResponseHandler.error("Token internal error"));
  }
};
