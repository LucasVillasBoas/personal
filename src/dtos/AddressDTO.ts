export interface AddressIn {
  zip_code: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  is_active: boolean;
  user_id_user: number;
  updated_at: Date;
  created_at: Date;
}

export interface AddressOut {
  id_address: number;
  is_active: boolean;
}