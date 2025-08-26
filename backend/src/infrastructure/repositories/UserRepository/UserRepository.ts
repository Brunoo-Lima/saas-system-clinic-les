import { User } from "../../../domain/entities/User/User";
import { IUserRepository } from "./IUserRepository";
import db from "../../database/connection";
import { userSchema } from "../../database/schema";
import { ResponseHandler } from "../../../helpers/ResponseHandler";
import { randomUUID } from "crypto";

export class UserRepository implements IUserRepository {
  async createUser(user: User) {
    try {
      const userInserted = await db
        .insert(userSchema)
        .values({
          id: randomUUID(),
          email: user.email!,
          emailVerified: user.emailVerified,
          password: user.password!,
          role: user.role!,
          avatar: user.avatar || "",
          createdAt: new Date(),
        })
        .returning();
      return ResponseHandler.success(
        userInserted[0],
        "User created successfully."
      );
    } catch (error) {
      console.error("DB error:", error);
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
