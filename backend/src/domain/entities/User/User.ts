import { EntityDomain } from "../EntityDomain";

export interface IUser {
    token?: string;
    email?: string;
    emailVellicated?: boolean;
    password?: string;
    passwordConfirmed?: string;
    role?: "admin" | "user";
    avatar?: string;
}

export class User extends EntityDomain {
    constructor(
        private dataUser: IUser
    ) {
        super()
    }
    public get email() {
        return this.dataUser.email;
    }

    public get emailVellicated() {
        return this.dataUser.emailVellicated;
    }

    public get password() {
        return this.dataUser.password;
    }

    public get passwordConfirmed() {
        return this.dataUser.passwordConfirmed;
    }

    public get role() {
        return this.dataUser.role;
    }

    public get avatar() {
        return this.dataUser.avatar;
    }
    public get token() {
        return this.dataUser.token;
    }

} 