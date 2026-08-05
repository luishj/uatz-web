import { OrcamentoDTO } from '../orcamento/orcamento.dto';

export interface ClienteDTO {
  id: number;
  phone: string;
  city: string | null;
  state: string | null;
}

/**
 * Cliente com os pedidos consolidados, montado na propria tela.
 */
export interface ClienteComOrcamentosDTO extends ClienteDTO {
  quantidadeOrcamentos: number;
  orcamentos: OrcamentoDTO[];
  ultimoOrcamento: OrcamentoDTO | null;
  situacaoPredominante: string;
}
