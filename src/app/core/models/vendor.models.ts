export interface Vendor {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  city: string | null;
  state: string | null;
  active: boolean | null;
}

export interface CurrentVendorQuoteContext {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  city: string | null;
  state: string | null;
  active: boolean | null;
}

export interface CreateVendorRequest {
  name: string;
  phone: string;
  email: string | null;
  password: string | null;
  city: string | null;
  state: string | null;
  active: boolean;
}
