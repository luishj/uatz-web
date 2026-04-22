export type BudgetRequestStatus = 'OPEN' | 'SENT_TO_VENDORS' | 'WAITING_QUOTES' | 'CLOSED';

export interface BudgetItem {
  id: number;
  productId: number | null;
  productName: string;
  quantity: number;
  unit: string | null;
}

export interface BudgetRequest {
  id: number;
  clientId: number;
  clientPhone: string;
  city: string | null;
  status: BudgetRequestStatus;
  sourceChannel: string | null;
  sourceMessage: string | null;
  createdAt: string;
  items: BudgetItem[];
}

export interface BudgetRequestReviewPayload {
  city: string | null;
  items: Array<{
    productId: number | null;
    productName: string;
    quantity: number;
    unit: string | null;
  }>;
}

export interface WhatsAppSimulationPayload {
  phone: string;
  city: string | null;
  state: string | null;
  message: string;
}

export type BudgetRequestVendorStatus = 'SENT' | 'VIEWED' | 'RESPONDED' | 'DECLINED';

export interface BudgetRequestVendor {
  id: number;
  vendorId: number;
  vendorName: string;
  vendorEmail: string | null;
  status: BudgetRequestVendorStatus;
  sentAt: string;
  viewedAt: string | null;
  respondedAt: string | null;
  declinedAt: string | null;
}
