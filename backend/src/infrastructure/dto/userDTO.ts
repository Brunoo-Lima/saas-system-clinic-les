export interface UserDTO {
  id: string,
  email: string;
  emailVerified?: boolean;
  password?: string;
  role: "admin" | "doctor" | "patient";
  avatar?: string;
}
