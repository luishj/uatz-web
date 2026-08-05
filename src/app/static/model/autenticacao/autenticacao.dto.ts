import { PerfilEnum } from '../../enum/perfil.enum';

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AutenticacaoDTO {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  userId: number;
  name: string;
  email: string;
  role: PerfilEnum;
}
