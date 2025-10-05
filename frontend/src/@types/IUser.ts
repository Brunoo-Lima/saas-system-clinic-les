export interface IUser {
  id?: string;
  email?: string;
  emailVerified?: boolean;
  username?: string;
  password?: string;
  passwordConfirmed?: string;
  role?: 'admin' | 'doctor' | 'patient';
  avatar?: string;
  profileCompleted: boolean;
  token?: string;
}
