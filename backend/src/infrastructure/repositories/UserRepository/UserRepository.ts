import { User } from "../../../domain/entities/User/User";
import { IUserRepository } from "./IUserRepository";
import db from "../../database/connection";
import { userSchema } from "../../database/schema";
import { ResponseHandler } from "../../../helpers/ResponseHandler";

export class UserRepository implements IUserRepository {
    async createUser(user: User) {
        try {
            const userInserted = await db.insert(userSchema).values({
                email: user.email!,
                emailVellicated: String(user.emailVellicated),
                password: user.password!,
                passwordConfirmed: user.passwordConfirmed!,
                role: user.role!,
                avatar: user.avatar || ''
            }).returning()
            return ResponseHandler.success(userInserted[0], "User created successfully.");
        } catch (error) {
            return ResponseHandler.error(["Failed to create user in repository"]);
        }
    }
    getUserByEmail(email: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
    getUserById(id: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
    updateUser(id: string, user: User): Promise<any> {
        throw new Error("Method not implemented.");
    }
    deleteUser(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getAllUsers(): Promise<any[]> {
        throw new Error("Method not implemented.");
    }

}