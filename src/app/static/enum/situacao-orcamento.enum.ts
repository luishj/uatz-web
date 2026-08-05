import { idioma } from 'src/environments/language/idioma';

/**
 * Situacoes do pedido de orcamento (tabela `statuses`, tipo BUDGET_REQUEST).
 */
export enum SituacaoOrcamentoEnum {
  OPEN = 'OPEN',
  SENT_TO_VENDORS = 'SENT_TO_VENDORS',
  WAITING_QUOTES = 'WAITING_QUOTES',
  CLOSED = 'CLOSED'
}

export const SITUACAO_ORCAMENTO_DESCRICAO: Record<SituacaoOrcamentoEnum, string> = {
  [SituacaoOrcamentoEnum.OPEN]: idioma.SITUACAO_ORCAMENTO.OPEN,
  [SituacaoOrcamentoEnum.SENT_TO_VENDORS]: idioma.SITUACAO_ORCAMENTO.SENT_TO_VENDORS,
  [SituacaoOrcamentoEnum.WAITING_QUOTES]: idioma.SITUACAO_ORCAMENTO.WAITING_QUOTES,
  [SituacaoOrcamentoEnum.CLOSED]: idioma.SITUACAO_ORCAMENTO.CLOSED
};

/**
 * Cor da `nz-tag` de cada situacao.
 */
export const SITUACAO_ORCAMENTO_COR: Record<SituacaoOrcamentoEnum, string> = {
  [SituacaoOrcamentoEnum.OPEN]: 'blue',
  [SituacaoOrcamentoEnum.SENT_TO_VENDORS]: 'cyan',
  [SituacaoOrcamentoEnum.WAITING_QUOTES]: 'gold',
  [SituacaoOrcamentoEnum.CLOSED]: 'green'
};
