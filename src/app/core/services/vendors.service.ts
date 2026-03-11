import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../config/api.config';
import { CreateVendorRequest, CurrentVendorQuoteContext, Vendor } from '../models/vendor.models';

@Injectable({ providedIn: 'root' })
export class VendorsService {
  private readonly http = inject(HttpClient);

  findAll() {
    return this.http.get<Vendor[]>(`${API_BASE_URL}/vendors`);
  }

  findCurrentVendor() {
    return this.http.get<CurrentVendorQuoteContext>(`${API_BASE_URL}/vendors/me`);
  }

  findAllForAdmin() {
    return this.http.get<Vendor[]>(`${API_BASE_URL}/vendors/all`);
  }

  create(payload: CreateVendorRequest) {
    return this.http.post<Vendor>(`${API_BASE_URL}/vendors`, payload);
  }

  update(id: number, payload: CreateVendorRequest) {
    return this.http.put<Vendor>(`${API_BASE_URL}/vendors/${id}`, payload);
  }
}
