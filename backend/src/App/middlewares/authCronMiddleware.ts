import { NextFunction, Request, Response } from "express";
import { ResponseHandler } from "../../helpers/ResponseHandler";
import { UserRepository } from "../../infrastructure/database/repositories/UserRepository/UserRepository";
import { UserBuilder } from "../../domain/entities/EntityUser/UserBuilder";

export const autCronMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { authorization } = req.headers
        if (!authorization) return res.status(401).json(ResponseHandler.error("Authorization is required"))

            
        const [authType, credentials ] = authorization.split(" ")
        if (authType !== 'Basic' || !credentials) return res.status(400).send('Invalid Authorization header format.');
    
        const bufferAuthorization = Buffer.from(credentials?.trim(), "base64")
        const stringDecoded = bufferAuthorization.toString("utf-8")
        if (!stringDecoded) return res.status(401).json(ResponseHandler.error("Credentials invalid."))
            
        const [email, password] = stringDecoded.split(":")

        if (!email || !password) return res.status(401).json(ResponseHandler.error("Credentials invalid !"))
        const userDomain = new UserBuilder()
            .setEmail(email.trim())
            .setPassword(password.trim())
            .build()

        const userRepository = new UserRepository()
        const user = await userRepository.findEntity(userDomain) as ResponseHandler | any;
        
        if (!user) return res.status(401).json(ResponseHandler.error("User not exists or your credentials is invalid"))
        if ("success" in user && !user.success) return res.status(401).json(ResponseHandler.error(user.message));
        if (!userDomain.password || user.password !== userDomain.password) { return res.status(401).json(ResponseHandler.error("Incorrect email or password")) }
        if (user.role !== "admin") return res.status(401).json(ResponseHandler.error("Unauthorized"))
        
        req.body.user = user

        next()
    } catch (e) {
        return res.status(400).json(ResponseHandler.error((e as Error).message))
    }
}