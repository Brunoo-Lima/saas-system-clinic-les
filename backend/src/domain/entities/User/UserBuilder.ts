import { User } from "./User";
import { IUser } from "./User";

export class UserBuilder {
  private data: Partial<IUser> = {};

  setRole(role: "admin" | "user"): this {
    this.data.role = role;
    return this;
  }

  setEmail(email: string = ""): this {
    this.data.email = email;
    return this;
  }

  setPassword(password: string  = ""): this {
    this.data.password = password;
    this.data.passwordConfirmed = password; // já seta confirmado junto
    return this;
  }

  setAvatar(avatar: string  = ""): this {
    this.data.avatar = avatar;
    return this;
  }

  setEmailVellicated(validated: boolean = false): this {
    this.data.emailVellicated = validated;
    return this;
  }

  build(): User {
    return new User({
      emailVellicated: false, // default
      avatar: "",
      ...this.data,           // sobrescreve defaults se vier do builder
    });
  }

  // 🔹 Método extra para retornar apenas os filtros (sem instanciar User)
  buildFilters(): Partial<IUser> {
    return { ...this.data };
  }
}
