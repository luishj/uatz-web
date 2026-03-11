import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../config/api.config';
import { Client } from '../models/client.models';

@Injectable({ providedIn: 'root' })
export class ClientsService {
  private readonly http = inject(HttpClient);

  findAllForAdmin() {
    return this.http.get<Client[]>(`${API_BASE_URL}/clients/all`);
  }
}
