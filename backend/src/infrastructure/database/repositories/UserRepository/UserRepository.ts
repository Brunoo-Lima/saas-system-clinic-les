import { User } from "../../../../domain/entities/EntityUser/User";
import { IUserRepository } from "./IUserRepository";
import db from "../../connection";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import { randomUUID } from "crypto";
import { and, eq, or } from "drizzle-orm";
import { userTable } from "../../Schema/UserSchema";
import { IRepository } from "../IRepository";
import { EntityDomain } from "../../../../domain/entities/EntityDomain";

export class UserRepository implements IRepository {

  async create(user: User, tx?: any) {

    const dbUse = tx ? tx : db
    const userInserted = await dbUse
      .insert(userTable)
      .values({
        id: user.getUUIDHash().toString() || randomUUID(),
        email: user.email!,
        profileCompleted: user.profileCompleted,
        username: user.username,
        emailVerified: user.emailVerified,
        password: user.password!,
        role: user.role!,
        avatar: user.avatar || ""
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

    const userFounded = await db
      .select()
      .from(userTable)
      .where(
        or(
          eq(userTable.id, user.getUUIDHash() ?? ""),
          and(
            eq(userTable.email, user.email!),
            eq(userTable.password, user.password ?? "")
          )
        )
      )
    return userFounded[0] || null;
  }
  async updateEntity(user: User) {
    const userUpdated = await db.update(userTable)
      .set({
        avatar: user.avatar,
        email: user.email,
        password: user.password,
        profileCompleted: user.profileCompleted,
        status: user.status,
        emailVerified: user.emailVerified,
        updatedAt: user.getUpdatedAt()
      }).where(
        eq(userTable.id, user.getUUIDHash())
      ).returning()
    return userUpdated
  }
  deleteEntity(entity: EntityDomain | Array<EntityDomain>, id?: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  findAllEntity(entity?: EntityDomain | Array<EntityDomain>): Promise<any[]> {
    throw new Error("Method not implemented.");
  }
}
