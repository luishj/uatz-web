export interface CotacaoDTO {
  id: number;
  requestId: number;
  vendorId: number;
  vendorName: string;
  totalPrice: number;
  message: string | null;
  createdAt: string;
}

export interface CotacaoItemDTO {
  id: number;
  budgetItemId: number;
  productName: string;
  quantity: number;
  unit: string | null;
  unitPrice: number;
  lineTotal: number;
}

export interface CotacaoDetalheDTO {
  id: number;
  requestId: number;
  requestCreatedAt: string;
  vendorId: number;
  vendorName: string;
  totalPrice: number;
  message: string | null;
  createdAt: string;
  items: CotacaoItemDTO[];
}

export interface CotacaoResumoDTO {
  requestId: number;
  totalQuotes: number;
  lowestPrice: number | null;
  highestPrice: number | null;
  averagePrice: number | null;
  bestQuote: CotacaoDTO | null;
  quotes: CotacaoDTO[];
}

export interface NovaCotacaoItemDTO {
  budgetItemId: number;
  unitPrice: number;
}

export interface NovaCotacaoDTO {
  requestId: number;
  vendorId: number;
  message: string;
  items: NovaCotacaoItemDTO[];
}
