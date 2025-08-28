import { User } from "../../../domain/entities/User/User";

export interface IUserRepository {
  createUser(user: User): Promise<any>;
  getUserByEmail(email: string): Promise<any>;
  findUser(user: User): Promise<any>;
  updateUser(id: string, user: User): Promise<any>;
  deleteUser(id: string): Promise<void>;
  getAllUsers(): Promise<any[]>;
}
