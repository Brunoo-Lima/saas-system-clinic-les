import { User } from "../../../domain/entities/User";
import { IUserRepository } from "./IUserRepository";
import db from "../../database/connection";

export class UserRepository implements IUserRepository{
    async createUser(user: User): Promise<any> {
        throw new Error("Method not implemented.");
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