/**
 * Caminhos dos endpoints da API, relativos a `ModuloConstant.SERVER.API`.
 * Use `{0}` para os parametros e resolva com `StringHelper.formatString`.
 */
export class EndpointsConstant {

  static readonly AUTENTICACAO = {
    LOGIN: 'auth/login',
    BOOTSTRAP: 'auth/bootstrap'
  };

  static readonly ORCAMENTO = {
    LISTAR: 'budget-requests',
    OBTER: 'budget-requests/{0}',
    REVISAR: 'budget-requests/{0}',
    DISTRIBUIR: 'budget-requests/{0}/dispatch',
    LISTAR_FORNECEDORES: 'budget-requests/{0}/vendors',
    MINHA_ATRIBUICAO: 'budget-requests/{0}/assignment/me',
    RECUSAR: 'budget-requests/{0}/decline',
    SIMULAR_WHATSAPP: 'whatsapp/simulations'
  };

  static readonly COTACAO = {
    SALVAR: 'vendor-quotes',
    RESUMO_POR_ORCAMENTO: 'vendor-quotes/request/{0}/summary',
    MINHA_POR_ORCAMENTO: 'vendor-quotes/request/{0}/me'
  };

  static readonly FORNECEDOR = {
    LISTAR_ATIVOS: 'vendors',
    LISTAR: 'vendors/all',
    ATUAL: 'vendors/me',
    OBTER: 'vendors/{0}',
    SALVAR: 'vendors',
    ATUALIZAR: 'vendors/{0}'
  };

  static readonly CLIENTE = {
    LISTAR: 'clients/all',
    OBTER: 'clients/{0}'
  };

  static readonly STATUS = {
    OBTER: 'status'
  };
}
