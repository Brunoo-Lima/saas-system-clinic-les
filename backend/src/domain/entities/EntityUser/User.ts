import { EntityDomain } from "../EntityDomain";

export interface IUser {
  email?: string;
  profileCompleted?: boolean,
  emailVerified?: boolean;
  username?: string,
  password?: string;
  role?: "admin" | "doctor" | "patient";
  avatar?: string;
  status?: boolean
}

export class User extends EntityDomain {
  constructor(private dataUser: IUser) {
    super();
  }
  public get email() {
    return this.dataUser.email;
  }

  public get emailVerified() {
    return this.dataUser.emailVerified;
  }

  public get password() {
    return this.dataUser.password;
  }

  public get profileCompleted() {
    return this.dataUser.profileCompleted
  }
  
  public get username() {
    return this.dataUser.username
  }
  
  public get role() {
    return this.dataUser.role;
  }

  public get avatar() {
    return this.dataUser.avatar;
  }
  public get status(){
    return this.dataUser.status;
  }
}
