import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../config/api.config';
import { CreateVendorQuoteRequest, VendorQuote, VendorQuoteDetails, VendorQuoteSummary } from '../models/vendor-quote.models';

@Injectable({ providedIn: 'root' })
export class VendorQuotesService {
  private readonly http = inject(HttpClient);

  create(payload: CreateVendorQuoteRequest) {
    return this.http.post<VendorQuote>(`${API_BASE_URL}/vendor-quotes`, payload);
  }

  summarizeByRequestId(requestId: number) {
    return this.http.get<VendorQuoteSummary>(`${API_BASE_URL}/vendor-quotes/request/${requestId}/summary`);
  }

  findMineByRequestId(requestId: number) {
    return this.http.get<VendorQuoteDetails>(`${API_BASE_URL}/vendor-quotes/request/${requestId}/me`);
  }
}
