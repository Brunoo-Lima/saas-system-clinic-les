import { User } from "./User";
import { IUser } from "./User";

export class UserBuilder {
  private data: Partial<IUser> = {};

  setRole(role: "admin" | "doctor" | "patient"): this {
    this.data.role = role;
    return this;
  }

  setEmail(email: string = ""): this {
    this.data.email = email;
    return this;
  }

  setPassword(password: string = ""): this {
    this.data.password = password;
    return this;
  }

  setAvatar(avatar: string = ""): this {
    this.data.avatar = avatar;
    return this;
  }

  setEmailVerified(validated: boolean = false): this {
    this.data.emailVerified = validated;
    return this;
  }

  build(): User {
    return new User({
      emailVerified: false, // default
      status: true,
      avatar: "",
      ...this.data, // sobrescreve defaults se vier do builder
    });
  }

  // 🔹 Método extra para retornar apenas os filtros (sem instanciar User)
  buildFilters(): Partial<IUser> {
    return { ...this.data };
  }
}
