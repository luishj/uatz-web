import { idioma } from 'src/environments/language/idioma';

/**
 * Perfis de acesso, iguais aos codigos da tabela `roles` do servidor.
 */
export enum PerfilEnum {
  ADMIN = 'ADMIN',
  OPERATOR = 'OPERATOR',
  VENDOR = 'VENDOR'
}

export const PERFIL_DESCRICAO: Record<PerfilEnum, string> = {
  [PerfilEnum.ADMIN]: idioma.PERFIL.ADMIN,
  [PerfilEnum.OPERATOR]: idioma.PERFIL.OPERATOR,
  [PerfilEnum.VENDOR]: idioma.PERFIL.VENDOR
};
