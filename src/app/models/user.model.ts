export interface User {
  _id?: string;
  id: number;
  name: string;
  email: string;
  password?: string;
  created_at?: Date;
  updated_at?: Date;
}
