import { Request, Response, NextFunction } from "express";
import { ResponseHandler } from "../../helpers/ResponseHandler";

export const privateRoute = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if(!("user" in req)) return res.status(400).json(
            ResponseHandler.error("The user not found during the requested")
        )
        const user = req.user as any

        if(user.role as string !== "admin") return res.status(401).json(
            ResponseHandler.error("Access denied!")
        )

        next()
    } catch(e) {
        return res.status(500).json(ResponseHandler.error("Sorry, but an error was found in private route"))
    }
}