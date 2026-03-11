export interface Client {
  id: number;
  phone: string;
  city: string | null;
  state: string | null;
}

export interface CreateClientRequest {
  phone: string;
  city: string | null;
  state: string | null;
}
