export interface UserDTO {
  email?: string;
  emailVerified?: boolean;
  password?: string;
  role: "admin" | "doctor" | "patient";
  avatar?: string;
}
