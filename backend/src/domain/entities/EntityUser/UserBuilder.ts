import { User } from "./User";
import { IUser } from "./User";

export class UserBuilder {
  private data: Partial<IUser> = {};

  setRole(role: "admin" | "doctor" | "patient"): this {
    this.data.role = role;
    return this;
  }

  setUsername(username?: string | undefined): this{
    this.data.username = username
    return this
  }

  setEmail(email?: string | undefined): this {
    this.data.email = email;
    return this;
  }

  setPassword(password?: string | undefined): this {
    this.data.password = password;
    return this;
  }

  setAvatar(avatar?: string | undefined): this {
    this.data.avatar = avatar;
    return this;
  }

  setEmailVerified(validated?: boolean | undefined): this {
    this.data.emailVerified = validated;
    return this;
  }

  setProfileCompleted(complete?: boolean | undefined): this {
    this.data.profileCompleted = complete
    return this;
  }
  setStatus(status?: boolean | undefined): this {
    this.data.status = status
    return this
  }
  
  build(): User {
    return new User({
      ...this.data, // sobrescreve defaults se vier do builder
    });
  }

  // 🔹 Método extra para retornar apenas os filtros (sem instanciar User)
  buildFilters(): Partial<IUser> {
    return { ...this.data };
  }
}
