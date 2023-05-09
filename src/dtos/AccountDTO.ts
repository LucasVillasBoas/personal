import { DateTime } from "luxon";

export interface AccountIn {
  user_id_user: number;
  account_branch: string;
  account_number: string;
  balance: number;
  type: string;
  password_transaction: string;
  is_active: boolean;
  updated_at: Date;
  created_at: Date;
}

export interface AccountOut {
  account_number: string;
  id_account: number;
}