import { EndpointsConstant } from 'src/app/static/constants/endpoints.constant';

/**
 * Endpoints que nao devem exibir o loader nem o toast de erro — a propria tela
 * trata o retorno.
 */
export const endPointsWithoutFeedBack: string[] = [
  EndpointsConstant.AUTENTICACAO.LOGIN,
  EndpointsConstant.STATUS.OBTER,
  'assignment/me',
  '/me'
];
