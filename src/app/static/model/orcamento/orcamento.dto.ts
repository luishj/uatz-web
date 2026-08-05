import { SituacaoOrcamentoEnum } from '../../enum/situacao-orcamento.enum';
import { SituacaoOrcamentoFornecedorEnum } from '../../enum/situacao-orcamento-fornecedor.enum';

export interface OrcamentoItemDTO {
  id: number;
  productId: number | null;
  productName: string;
  quantity: number;
  unit: string | null;
}

export interface OrcamentoDTO {
  id: number;
  clientId: number;
  clientPhone: string;
  city: string | null;
  status: SituacaoOrcamentoEnum;
  sourceChannel: string | null;
  sourceMessage: string | null;
  createdAt: string;
  items: OrcamentoItemDTO[];
}

export interface RevisaoOrcamentoItemDTO {
  productId: number | null;
  productName: string;
  quantity: number;
  unit: string | null;
}

export interface RevisaoOrcamentoDTO {
  city: string | null;
  items: RevisaoOrcamentoItemDTO[];
}

export interface SimulacaoWhatsAppDTO {
  phone: string;
  city: string | null;
  state: string | null;
  message: string;
}

export interface OrcamentoFornecedorDTO {
  id: number;
  vendorId: number;
  vendorName: string;
  vendorEmail: string | null;
  status: SituacaoOrcamentoFornecedorEnum;
  sentAt: string;
  viewedAt: string | null;
  respondedAt: string | null;
  declinedAt: string | null;
}
