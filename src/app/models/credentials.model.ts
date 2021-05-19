import { User } from "./user.model";

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface Session {
  token: string;
  user: User;
  message?: string;
}
