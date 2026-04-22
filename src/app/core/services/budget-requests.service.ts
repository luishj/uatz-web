import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../config/api.config';
import {
  BudgetRequest,
  BudgetRequestReviewPayload,
  BudgetRequestVendor,
  WhatsAppSimulationPayload
} from '../models/budget-request.models';

@Injectable({ providedIn: 'root' })
export class BudgetRequestsService {
  private readonly http = inject(HttpClient);

  findAll() {
    return this.http.get<BudgetRequest[]>(`${API_BASE_URL}/budget-requests`);
  }

  findById(id: number) {
    return this.http.get<BudgetRequest>(`${API_BASE_URL}/budget-requests/${id}`);
  }

  review(id: number, payload: BudgetRequestReviewPayload) {
    return this.http.put<BudgetRequest>(`${API_BASE_URL}/budget-requests/${id}`, payload);
  }

  dispatch(id: number) {
    return this.http.post<BudgetRequestVendor[]>(`${API_BASE_URL}/budget-requests/${id}/dispatch`, {});
  }

  findAssignedVendors(id: number) {
    return this.http.get<BudgetRequestVendor[]>(`${API_BASE_URL}/budget-requests/${id}/vendors`);
  }

  findMyAssignment(id: number) {
    return this.http.get<BudgetRequestVendor>(`${API_BASE_URL}/budget-requests/${id}/assignment/me`);
  }

  decline(id: number) {
    return this.http.post<void>(`${API_BASE_URL}/budget-requests/${id}/decline`, {});
  }

  simulateWhatsApp(payload: WhatsAppSimulationPayload) {
    return this.http.post<BudgetRequest>(`${API_BASE_URL}/whatsapp/simulations`, payload);
  }
}
