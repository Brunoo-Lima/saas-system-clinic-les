export interface UserDTO {
  id: string,
  email: string;
  username: string;
  emailVerified?: boolean;
  password?: string;
  role: "admin" | "doctor" | "patient";
  avatar?: string;
}
