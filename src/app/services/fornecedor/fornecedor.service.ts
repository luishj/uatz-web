import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EndpointsConstant } from 'src/app/static/constants/endpoints.constant';
import { ModuloConstant } from 'src/app/static/constants/modulo.constant';
import { StringHelper } from 'src/app/static/helpers/string.helper';
import { FornecedorDTO, SalvarFornecedorDTO } from 'src/app/static/model/fornecedor/fornecedor.dto';
import { Service } from '../service';

@Injectable({
  providedIn: 'root'
})
export class FornecedorService extends Service {

  constructor(public http: HttpClient) {
    super(http, ModuloConstant.SERVER, ModuloConstant.SERVER.URL);
  }

  listarAtivos(): Observable<FornecedorDTO[]> {
    return this.get<FornecedorDTO[]>(EndpointsConstant.FORNECEDOR.LISTAR_ATIVOS);
  }

  listar(): Observable<FornecedorDTO[]> {
    return this.get<FornecedorDTO[]>(EndpointsConstant.FORNECEDOR.LISTAR);
  }

  adquirirFornecedorAtual(): Observable<FornecedorDTO> {
    return this.get<FornecedorDTO>(EndpointsConstant.FORNECEDOR.ATUAL);
  }

  salvar(fornecedor: SalvarFornecedorDTO): Observable<FornecedorDTO> {
    return this.post<FornecedorDTO>(EndpointsConstant.FORNECEDOR.SALVAR, fornecedor);
  }

  atualizar(codigo: number, fornecedor: SalvarFornecedorDTO): Observable<FornecedorDTO> {
    return this.put<FornecedorDTO>(
      StringHelper.formatString(EndpointsConstant.FORNECEDOR.ATUALIZAR, [codigo]), fornecedor
    );
  }
}
