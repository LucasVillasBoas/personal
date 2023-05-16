import { DateTime } from "luxon";

export interface UserIn {
  id_user: number;
  cpf: string;
  name: string;
  email: string;
  phone: string;
  date_birth: Date;
  password_login: string;
  is_active: boolean;
  updated_at: Date;
  created_at: Date;
}

export interface UserOut {
  id_user: number;
  password_login: string;
  is_active: boolean;
}