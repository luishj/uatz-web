import { idioma } from 'src/environments/language/idioma';

/**
 * Situacao do fornecedor dentro do pedido (tabela `statuses`, tipo
 * BUDGET_REQUEST_VENDOR).
 */
export enum SituacaoOrcamentoFornecedorEnum {
  SENT = 'SENT',
  VIEWED = 'VIEWED',
  RESPONDED = 'RESPONDED',
  DECLINED = 'DECLINED'
}

export const SITUACAO_ORCAMENTO_FORNECEDOR_DESCRICAO: Record<SituacaoOrcamentoFornecedorEnum, string> = {
  [SituacaoOrcamentoFornecedorEnum.SENT]: idioma.SITUACAO_ORCAMENTO_FORNECEDOR.SENT,
  [SituacaoOrcamentoFornecedorEnum.VIEWED]: idioma.SITUACAO_ORCAMENTO_FORNECEDOR.VIEWED,
  [SituacaoOrcamentoFornecedorEnum.RESPONDED]: idioma.SITUACAO_ORCAMENTO_FORNECEDOR.RESPONDED,
  [SituacaoOrcamentoFornecedorEnum.DECLINED]: idioma.SITUACAO_ORCAMENTO_FORNECEDOR.DECLINED
};

export const SITUACAO_ORCAMENTO_FORNECEDOR_COR: Record<SituacaoOrcamentoFornecedorEnum, string> = {
  [SituacaoOrcamentoFornecedorEnum.SENT]: 'blue',
  [SituacaoOrcamentoFornecedorEnum.VIEWED]: 'cyan',
  [SituacaoOrcamentoFornecedorEnum.RESPONDED]: 'green',
  [SituacaoOrcamentoFornecedorEnum.DECLINED]: 'red'
};
