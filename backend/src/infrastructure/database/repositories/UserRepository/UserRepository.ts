import { User } from "../../../../domain/entities/EntityUser/User";
import { IUserRepository } from "./IUserRepository";
import db from "../../connection";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import { randomUUID } from "crypto";
import { eq, or } from "drizzle-orm";
import { userTable } from "../../Schema/UserSchema";
import { IRepository } from "../IRepository";
import { EntityDomain } from "../../../../domain/entities/EntityDomain";

export class UserRepository implements IRepository {

  async create(user: User, tx?: any) {
    try {
      const dbUse = tx ? tx : db
      const userInserted = await dbUse
        .insert(userTable)
        .values({
          id: user.getUUIDHash().toString() || randomUUID(),
          email: user.email!,
          username: user.username,
          emailVerified: user.emailVerified,
          password: user.password!,
          role: user.role!,
          avatar: user.avatar || "",
          createdAt: new Date(),
          updatedAt: new Date(),
        }).returning({
          id: userTable.id,
          email: userTable.email,
          password: userTable.password,
          username: userTable.username
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
  async findEntity(user: User): Promise<any> {
    try {
      const userFounded = await db
        .select()
        .from(userTable)
        .where(
          or(
            eq(userTable.id, user.getUUIDHash() ?? ""),
            eq(userTable.email, user.email!)
          )
        )
      return userFounded[0] || null;

    } catch (error) {
      return ResponseHandler.error(["Failed to find user in repository"]);
    }
  }
  updateEntity(entity: EntityDomain): Promise<any> {
    throw new Error("Method not implemented.");
  }
  deleteEntity(entity: EntityDomain | Array<EntityDomain>, id?: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  findAllEntity(entity?: EntityDomain | Array<EntityDomain>): Promise<any[]> {
    throw new Error("Method not implemented.");
  }
}
