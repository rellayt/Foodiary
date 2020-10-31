export interface User {
  _id?: string;
  userId: number;
  login: string;
  password?: string;
  email: string;
  token?: string;
  recentActivity?: Date;
  creationDate?: Date;
}
