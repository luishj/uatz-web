export interface VendorQuote {
  id: number;
  requestId: number;
  vendorId: number;
  vendorName: string;
  totalPrice: number;
  message: string | null;
  createdAt: string;
}

export interface VendorQuoteItem {
  id: number;
  budgetItemId: number;
  productName: string;
  quantity: number;
  unit: string | null;
  unitPrice: number;
  lineTotal: number;
}

export interface VendorQuoteDetails {
  id: number;
  requestId: number;
  requestCreatedAt: string;
  vendorId: number;
  vendorName: string;
  totalPrice: number;
  message: string | null;
  createdAt: string;
  items: VendorQuoteItem[];
}

export interface VendorQuoteSummary {
  requestId: number;
  totalQuotes: number;
  lowestPrice: number | null;
  highestPrice: number | null;
  averagePrice: number | null;
  bestQuote: VendorQuote | null;
  quotes: VendorQuote[];
}

export interface CreateVendorQuoteRequest {
  requestId: number;
  vendorId: number;
  message: string;
  items: Array<{
    budgetItemId: number;
    unitPrice: number;
  }>;
}
