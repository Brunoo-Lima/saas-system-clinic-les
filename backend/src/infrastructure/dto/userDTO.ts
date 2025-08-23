export interface UserDTO {
    email?: string;
    emailVellicated?: boolean;
    password?: string;
    passwordConfirmed?: string;
    role?: "admin" | "user";
    avatar?: string;
}