import { DateTime } from "luxon";

export interface UserIn {
  cpf: string;
  name: string;
  email: string;
  phone: string;
  date_birth: Date;
  password_login: string;
  is_active: boolean;
  update_at: Date;
  created_at: Date;
}

export interface UserOut {
  id_user: number;
}