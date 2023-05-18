import { Decimal } from "@prisma/client/runtime";
import { DateTime } from "luxon";

export interface TransferIn {
  id_transfer: number;
  id_account_origin: number;
  id_account_destiny: number
  date: Date | string;
  amount: number | Decimal;
  status: string;
  description: string;
  updated_at: Date | null;
  created_at: Date;
}