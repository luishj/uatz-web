import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EndpointsConstant } from 'src/app/static/constants/endpoints.constant';
import { ModuloConstant } from 'src/app/static/constants/modulo.constant';
import { ClienteDTO } from 'src/app/static/model/cliente/cliente.dto';
import { Service } from '../service';

@Injectable({
  providedIn: 'root'
})
export class ClienteService extends Service {

  constructor(public http: HttpClient) {
    super(http, ModuloConstant.SERVER, ModuloConstant.SERVER.URL);
  }

  listar(): Observable<ClienteDTO[]> {
    return this.get<ClienteDTO[]>(EndpointsConstant.CLIENTE.LISTAR);
  }
}
