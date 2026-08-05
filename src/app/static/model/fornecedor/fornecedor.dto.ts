export interface FornecedorDTO {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  city: string | null;
  state: string | null;
  active: boolean | null;
}

export interface SalvarFornecedorDTO {
  name: string;
  phone: string;
  email: string | null;
  password: string | null;
  city: string | null;
  state: string | null;
  active: boolean;
}
