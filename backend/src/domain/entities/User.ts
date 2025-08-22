import { EntityDomain } from "./EntityDomain";

export interface IUser {
    email: string;
    emailVellicated: boolean;
    password: string;
    passwordConfirmed: string;
    role: "admin" | "user";
    avatar: string;
}

export class User extends EntityDomain {
    constructor(
        private dataUser: IUser
    ) {
        super()
    }
    public get $dataUser(): IUser {
        return this.dataUser;
    }
    public set $dataUser(value: IUser) {
        this.dataUser = value;
    }
    public get $email(): string {
        return this.dataUser.email;
    }   
    public set $email(value: string) {
        this.dataUser.email = value;
    }
    public get $emailVellicated(): boolean {
        return this.dataUser.emailVellicated;
    }
    public set $emailVellicated(value: boolean) {
        this.dataUser.emailVellicated = value;
    }
    public get $password(): string {
        return this.dataUser.password;
    }
    public set $password(value: string) {
        this.dataUser.password = value;
    }
    public get $passwordConfirmed(): string {
        return this.dataUser.passwordConfirmed;
    }
    public set $passwordConfirmed(value: string) {
        this.dataUser.passwordConfirmed = value;
    }
    public get $role(): "admin" | "user" {
        return this.dataUser.role;
    }
    public set $role(value: "admin" | "user") {
        this.dataUser.role = value;
    }
    public get $avatar(): string {
        return this.dataUser.avatar;
    }
    public set $avatar(value: string) {
        this.dataUser.avatar = value;
    }
} 