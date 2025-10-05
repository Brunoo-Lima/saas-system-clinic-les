export interface UserDTO {
  id: string | undefined,
  email: string | undefined;
  status: boolean | undefined;
  profileCompleted: boolean | undefined;
  username: string | undefined;
  emailVerified?: boolean | undefined;
  password?: string | undefined;
  role: "admin" | "doctor" | "patient";
  avatar?: string | undefined;
}
