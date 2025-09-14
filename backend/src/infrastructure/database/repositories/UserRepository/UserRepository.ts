import { User } from "../../../../domain/entities/EntityUser/User";
import { IUserRepository } from "./IUserRepository";
import db from "../../connection";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import { randomUUID } from "crypto";
import { eq, or } from "drizzle-orm";
import { userTable } from "../../Schema/UserSchema";

export class UserRepository implements IUserRepository {
  async createUser(user: User) {
    try {
      const userInserted = await db
        .insert(userTable)
        .values({
          id: user.getUUIDHash().toString() || randomUUID(),
          email: user.email!,
          emailVerified: user.emailVerified,
          password: user.password!,
          role: user.role!,
          avatar: user.avatar || "",
          createdAt: new Date(),
          updatedAt: new Date(),
        }).returning({
          id: userTable.id,
          email: userTable.email,
        });
      return ResponseHandler.success(
        userInserted[0],
        "User created successfully."
      );
    } catch (error) {

      return ResponseHandler.error(["Failed to create user in repository"]);
    }
  }
  async getUserByEmail(email: string): Promise<any> {
    try {
      const user = await db
        .select()
        .from(userTable)
        .where(eq(userTable.email, email))
        .limit(1);
      return user[0] || null;
    } catch (error) {
      return ResponseHandler.error(["Failed to find user in repository"]);
    }
  }
  async findUser(user: User): Promise<any> {
    try {
      const userFounded = await db
        .select()
        .from(userTable)
        .where(
          or(
            eq(userTable.id, user.getUUIDHash()),
            eq(userTable.email, user.email!)
          )
        )
      return userFounded || null;

    } catch (error) {
      return ResponseHandler.error(["Failed to find user in repository"]);
    }
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
